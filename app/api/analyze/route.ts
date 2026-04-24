import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { trace, metrics } from "@opentelemetry/api";

function getClient() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

const MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are a contract risk analyst. Your job is to read contracts and identify clauses that could harm the party signing.

Focus on:
- Unlimited liability or indemnification
- IP assignment (taking ownership of your work/ideas)
- Non-compete and non-solicitation clauses
- Auto-renewal and cancellation terms
- Unilateral modification rights (they can change terms anytime)
- Payment terms and late fees
- Termination without cause
- Jurisdiction and governing law issues

Be direct, plain-language, and practical. The reader is not a lawyer.`;

interface RiskItem {
  severity: "high" | "medium" | "low";
  clause: string;
  explanation: string;
  recommendation: string;
}

interface AnalysisResult {
  summary: string;
  overall_risk: "high" | "medium" | "low";
  risks: RiskItem[];
  safe_clauses: string[];
}

const meter = metrics.getMeter("contract-scanner");
const analyzeCounter = meter.createCounter("analyze_requests_total", {
  description: "Total number of contract analysis requests",
});
const errorCounter = meter.createCounter("analyze_errors_total", {
  description: "Total number of failed analysis requests",
});
const latencyHistogram = meter.createHistogram("analyze_latency_ms", {
  description: "Contract analysis latency in milliseconds",
});
const riskCounter = meter.createCounter("analyze_risk_level_total", {
  description: "Count of analyses by overall risk level",
});

export async function POST(req: NextRequest) {
  const tracer = trace.getTracer("contract-scanner");
  const startTime = Date.now();

  return tracer.startActiveSpan("analyze_contract", async (span) => {
    try {
      const { text } = await req.json();

      if (!text || typeof text !== "string") {
        errorCounter.add(1, { reason: "missing_text" });
        span.end();
        return NextResponse.json({ error: "Contract text is required" }, { status: 400 });
      }

      if (text.trim().length < 100) {
        errorCounter.add(1, { reason: "text_too_short" });
        span.end();
        return NextResponse.json({ error: "Contract text is too short to analyze" }, { status: 400 });
      }

      if (text.length > 100_000) {
        errorCounter.add(1, { reason: "text_too_long" });
        span.end();
        return NextResponse.json({ error: "Contract is too long (max 100,000 characters)" }, { status: 400 });
      }

      span.setAttribute("contract.length", text.length);
      span.setAttribute("model", MODEL);

      const response = await getClient().chat.completions.create({
        model: MODEL,
        max_tokens: 4096,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Analyze this contract and return a JSON object with exactly this structure:

{
  "summary": "2-3 sentence plain-language summary of what this contract is and who it's between",
  "overall_risk": "high" or "medium" or "low",
  "risks": [
    {
      "severity": "high" or "medium" or "low",
      "clause": "short name for this clause type",
      "explanation": "plain-language explanation of the risk",
      "recommendation": "what the signer should do or watch out for"
    }
  ],
  "safe_clauses": ["list of notable clauses that appear fair and standard"]
}

Return ONLY valid JSON. No markdown code blocks, no explanation outside the JSON object.

CONTRACT:
${text}`,
          },
        ],
      });

      const raw = (response.choices[0].message.content ?? "")
        .replace(/^```(?:json)?\n?/i, "")
        .replace(/\n?```$/, "")
        .trim();

      const result: AnalysisResult = JSON.parse(raw);
      const latency = Date.now() - startTime;

      analyzeCounter.add(1, { model: MODEL, risk: result.overall_risk });
      riskCounter.add(1, { level: result.overall_risk });
      latencyHistogram.record(latency, { model: MODEL });

      span.setAttribute("result.overall_risk", result.overall_risk);
      span.setAttribute("result.risk_count", result.risks.length);
      span.setAttribute("latency_ms", latency);
      span.end();

      return NextResponse.json(result);
    } catch (err) {
      const latency = Date.now() - startTime;
      errorCounter.add(1, { reason: "server_error" });
      latencyHistogram.record(latency, { model: MODEL, error: "true" });
      span.recordException(err as Error);
      span.end();
      console.error("Analysis error:", err);
      return NextResponse.json(
        { error: "Failed to analyze contract. Please try again." },
        { status: 500 }
      );
    }
  });
}
