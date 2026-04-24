import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { trace, SpanStatusCode } from "@opentelemetry/api";

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

export async function POST(req: NextRequest) {
  const tracer = trace.getTracer("contract-scanner");
  const startTime = Date.now();

  return tracer.startActiveSpan("analyze_contract", async (span) => {
    try {
      const { text } = await req.json();

      if (!text || typeof text !== "string") {
        span.setStatus({ code: SpanStatusCode.ERROR, message: "missing_text" });
        span.setAttribute("error.reason", "missing_text");
        span.end();
        return NextResponse.json({ error: "Contract text is required" }, { status: 400 });
      }

      if (text.trim().length < 100) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: "text_too_short" });
        span.setAttribute("error.reason", "text_too_short");
        span.end();
        return NextResponse.json({ error: "Contract text is too short to analyze" }, { status: 400 });
      }

      if (text.length > 100_000) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: "text_too_long" });
        span.setAttribute("error.reason", "text_too_long");
        span.end();
        return NextResponse.json({ error: "Contract is too long (max 100,000 characters)" }, { status: 400 });
      }

      span.setAttribute("contract.char_count", text.length);
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
      const latencyMs = Date.now() - startTime;

      span.setAttribute("result.overall_risk", result.overall_risk);
      span.setAttribute("result.risk_count", result.risks.length);
      span.setAttribute("result.high_risks", result.risks.filter(r => r.severity === "high").length);
      span.setAttribute("result.medium_risks", result.risks.filter(r => r.severity === "medium").length);
      span.setAttribute("result.low_risks", result.risks.filter(r => r.severity === "low").length);
      span.setAttribute("latency_ms", latencyMs);
      span.setAttribute("success", true);
      span.setStatus({ code: SpanStatusCode.OK });
      span.end();

      return NextResponse.json(result);
    } catch (err) {
      span.recordException(err as Error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: (err as Error).message });
      span.setAttribute("success", false);
      span.end();
      console.error("Analysis error:", err);
      return NextResponse.json(
        { error: "Failed to analyze contract. Please try again." },
        { status: 500 }
      );
    }
  });
}
