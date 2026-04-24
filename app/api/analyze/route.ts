import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ✏️ Change this to any Groq model you want:
// - "llama-3.3-70b-versatile"   → best quality (recommended)
// - "llama3-8b-8192"            → faster, lighter
// - "mixtral-8x7b-32768"        → good for long contracts
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
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Contract text is required" }, { status: 400 });
    }

    if (text.trim().length < 100) {
      return NextResponse.json({ error: "Contract text is too short to analyze" }, { status: 400 });
    }

    if (text.length > 100_000) {
      return NextResponse.json({ error: "Contract is too long (max 100,000 characters)" }, { status: 400 });
    }

    const response = await client.chat.completions.create({
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
    return NextResponse.json(result);
  } catch (err) {
    console.error("Analysis error:", err);
    return NextResponse.json(
      { error: "Failed to analyze contract. Please try again." },
      { status: 500 }
    );
  }
}
