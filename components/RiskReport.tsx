"use client";

export interface RiskItem {
  severity: "high" | "medium" | "low";
  clause: string;
  explanation: string;
  recommendation: string;
}

export interface AnalysisResult {
  summary: string;
  overall_risk: "high" | "medium" | "low";
  risks: RiskItem[];
  safe_clauses: string[];
}

interface Props {
  result: AnalysisResult;
  onReset: () => void;
}

const severityConfig = {
  high: {
    label: "High Risk",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-400",
    badge: "bg-red-500/20 text-red-300",
    dot: "bg-red-500",
  },
  medium: {
    label: "Medium Risk",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    badge: "bg-amber-500/20 text-amber-300",
    dot: "bg-amber-500",
  },
  low: {
    label: "Low Risk",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    badge: "bg-blue-500/20 text-blue-300",
    dot: "bg-blue-500",
  },
};

const overallConfig = {
  high: {
    label: "High Risk",
    emoji: "🔴",
    bg: "from-red-950/60 to-red-900/20",
    border: "border-red-500/30",
    text: "text-red-400",
    sub: "This contract contains serious clauses that could put you at significant risk.",
  },
  medium: {
    label: "Medium Risk",
    emoji: "🟡",
    bg: "from-amber-950/60 to-amber-900/20",
    border: "border-amber-500/30",
    text: "text-amber-400",
    sub: "Some clauses warrant attention before signing.",
  },
  low: {
    label: "Low Risk",
    emoji: "🟢",
    bg: "from-green-950/60 to-green-900/20",
    border: "border-green-500/30",
    text: "text-green-400",
    sub: "This contract appears mostly standard. Review the flagged items below.",
  },
};

export default function RiskReport({ result, onReset }: Props) {
  const cfg = overallConfig[result.overall_risk];
  const counts = {
    high: result.risks.filter((r) => r.severity === "high").length,
    medium: result.risks.filter((r) => r.severity === "medium").length,
    low: result.risks.filter((r) => r.severity === "low").length,
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onReset}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm transition-colors"
      >
        ← Analyze another contract
      </button>

      {/* Overall verdict */}
      <div className={`rounded-2xl p-6 bg-gradient-to-br ${cfg.bg} border ${cfg.border}`}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{cfg.emoji}</span>
              <span className={`text-2xl font-bold ${cfg.text}`}>{cfg.label}</span>
            </div>
            <p className="text-gray-400 text-sm mb-4 max-w-lg">{cfg.sub}</p>
            <p className="text-gray-300 text-sm leading-relaxed max-w-lg">{result.summary}</p>
          </div>

          {/* Risk counts */}
          <div className="flex gap-3 shrink-0">
            {counts.high > 0 && (
              <div className="text-center bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <div className="text-red-400 font-bold text-xl">{counts.high}</div>
                <div className="text-gray-500 text-xs mt-0.5">High</div>
              </div>
            )}
            {counts.medium > 0 && (
              <div className="text-center bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
                <div className="text-amber-400 font-bold text-xl">{counts.medium}</div>
                <div className="text-gray-500 text-xs mt-0.5">Medium</div>
              </div>
            )}
            {counts.low > 0 && (
              <div className="text-center bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3">
                <div className="text-blue-400 font-bold text-xl">{counts.low}</div>
                <div className="text-gray-500 text-xs mt-0.5">Low</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Risk items */}
      {result.risks.length > 0 && (
        <div>
          <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
            Flagged Clauses
            <span className="bg-white/10 text-gray-400 text-xs px-2 py-0.5 rounded-full">
              {result.risks.length}
            </span>
          </h2>
          <div className="space-y-3">
            {result.risks.map((risk, i) => {
              const s = severityConfig[risk.severity];
              return (
                <div key={i} className={`rounded-xl border ${s.border} overflow-hidden`}>
                  <div className={`px-5 py-3 flex items-center gap-3 ${s.bg}`}>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                    <span className={`text-xs font-bold tracking-wider uppercase ${s.text}`}>
                      {s.label}
                    </span>
                    <span className="text-white font-semibold text-sm">{risk.clause}</span>
                  </div>
                  <div className="px-5 py-4 bg-white/[0.02] space-y-3">
                    <p className="text-gray-400 text-sm leading-relaxed">{risk.explanation}</p>
                    <div className="flex gap-2 bg-white/[0.03] rounded-lg p-3">
                      <span className="text-blue-400 shrink-0 text-sm font-medium">What to do:</span>
                      <p className="text-gray-300 text-sm leading-relaxed">{risk.recommendation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Safe clauses */}
      {result.safe_clauses.length > 0 && (
        <div>
          <h2 className="text-white font-semibold mb-3">Looks Standard</h2>
          <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-5">
            <ul className="space-y-2">
              {result.safe_clauses.map((clause, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-400">
                  <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                  {clause}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
        <p className="text-gray-600 text-xs leading-relaxed">
          <strong className="text-gray-500">⚠️ Not legal advice.</strong>{" "}
          ContractScan is for informational purposes only. For important or high-value
          contracts, consult a licensed attorney before signing.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition-colors"
        >
          Analyze another contract →
        </button>
        <button
          onClick={() => window.print()}
          className="border border-white/10 hover:border-white/20 text-gray-400 hover:text-gray-300 font-medium py-3 px-5 rounded-xl transition-colors text-sm"
        >
          🖨️ Print
        </button>
      </div>
    </div>
  );
}
