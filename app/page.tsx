"use client";

import { useState } from "react";
import ContractUpload from "@/components/ContractUpload";
import RiskReport from "@/components/RiskReport";
import type { AnalysisResult } from "@/components/RiskReport";

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze(text: string) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }
      setResult(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16">
        <RiskReport result={result} onReset={() => setResult(null)} />
      </main>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚖️</span>
            <span className="font-bold text-white text-lg">ContractScan</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a
              href="#analyze"
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Try free
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 tracking-wide uppercase">
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
          AI-Powered · Free · Instant
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight mb-6">
          Know what you&apos;re<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
            actually signing
          </span>
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          Paste any contract and get an instant AI breakdown of risky clauses —
          non-competes, IP grabs, hidden auto-renewals, and more. In plain English.
        </p>
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-16">
          <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> No signup required</span>
          <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Never stored</span>
          <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Results in &lt;15 seconds</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-20">
          {[
            { value: "10K+", label: "Contracts scanned" },
            { value: "47K+", label: "Risky clauses caught" },
            { value: "Free", label: "No credit card" },
          ].map((s) => (
            <div key={s.label} className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-gray-500 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Analyzer */}
      <section id="analyze" className="max-w-3xl mx-auto px-4 pb-24">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8">
          <h2 className="text-white font-semibold text-lg mb-1">Analyze your contract</h2>
          <p className="text-gray-500 text-sm mb-6">Paste text or upload a PDF / TXT file</p>
          <ContractUpload onAnalyze={handleAnalyze} loading={loading} error={error} />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-5xl mx-auto px-6 py-24 border-t border-white/5">
        <h2 className="text-3xl font-bold text-white text-center mb-4">How it works</h2>
        <p className="text-gray-500 text-center mb-16">Three steps. Under a minute.</p>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              icon: "📋",
              title: "Paste or upload",
              desc: "Drop in your contract text, PDF, or plain text file. No account needed.",
            },
            {
              step: "02",
              icon: "🤖",
              title: "AI analyzes it",
              desc: "Our AI scans every clause for red flags — liability, IP grabs, non-competes, hidden fees, and more.",
            },
            {
              step: "03",
              icon: "🛡️",
              title: "Get your report",
              desc: "Receive a plain-English breakdown of every risky clause with recommendations on what to do.",
            },
          ].map((item) => (
            <div key={item.step} className="relative">
              <div className="text-4xl mb-4">{item.icon}</div>
              <div className="text-blue-400 text-xs font-bold tracking-widest mb-2">{item.step}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What we catch */}
      <section className="max-w-5xl mx-auto px-6 py-24 border-t border-white/5">
        <h2 className="text-3xl font-bold text-white text-center mb-4">What we flag</h2>
        <p className="text-gray-500 text-center mb-16 max-w-xl mx-auto">
          The clauses that cost people the most — and are most often buried in fine print.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "⚠️", title: "Unlimited liability", desc: "Clauses that expose you to costs far beyond the contract value." },
            { icon: "💡", title: "IP assignment", desc: "Hidden clauses that hand over your ideas, code, or creative work." },
            { icon: "🚫", title: "Non-competes", desc: "Restrictions that lock you out of your own industry or client base." },
            { icon: "🔄", title: "Auto-renewal", desc: "Subscriptions or agreements that silently renew and are hard to cancel." },
            { icon: "✍️", title: "Unilateral changes", desc: "Clauses letting the other party change terms without your consent." },
            { icon: "💸", title: "Payment traps", desc: "Late fees, clawbacks, and vague payment conditions." },
            { icon: "🔚", title: "Termination risks", desc: "Clauses allowing termination without cause or fair notice." },
            { icon: "⚖️", title: "Jurisdiction", desc: "Forcing disputes into courts or states that favor the other party." },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white/[0.02] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors"
            >
              <div className="text-2xl mb-3">{item.icon}</div>
              <div className="text-white font-medium text-sm mb-1">{item.title}</div>
              <div className="text-gray-500 text-xs leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Who it's for */}
      <section className="max-w-5xl mx-auto px-6 py-24 border-t border-white/5">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Built for everyone</h2>
        <p className="text-gray-500 text-center mb-16">
          Legal review costs $300–$500/hr. ContractScan is free.
        </p>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: "💻",
              title: "Freelancers",
              desc: "Review client contracts, NDAs, and service agreements before you sign.",
            },
            {
              icon: "🏢",
              title: "Small businesses",
              desc: "Vendor contracts, SaaS agreements, partnership deals — know your exposure.",
            },
            {
              icon: "👩‍💼",
              title: "Job seekers",
              desc: "Employment offers, non-competes, and IP clauses in offer letters.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors"
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-24 border-t border-white/5">
        <h2 className="text-3xl font-bold text-white text-center mb-16">FAQ</h2>
        <div className="space-y-6">
          {[
            {
              q: "Is my contract stored anywhere?",
              a: "No. Your contract text is sent to the AI for analysis and immediately discarded. We store nothing.",
            },
            {
              q: "Is this legal advice?",
              a: "No. ContractScan is an AI-powered tool for informational purposes. For important contracts, always consult a licensed attorney.",
            },
            {
              q: "What types of contracts can I analyze?",
              a: "Any plain-text contract — employment offers, freelance agreements, NDAs, SaaS terms, lease agreements, partnership deals, and more.",
            },
            {
              q: "How accurate is it?",
              a: "The AI is strong at identifying common risky patterns and explaining them clearly. It may miss highly specialized legal nuance, which is why we recommend attorney review for high-stakes contracts.",
            },
            {
              q: "Is it really free?",
              a: "Yes, completely free to use. No credit card, no account, no limits.",
            },
          ].map((item) => (
            <div key={item.q} className="border-b border-white/5 pb-6">
              <h3 className="text-white font-medium mb-2">{item.q}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-white/10 rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to scan your contract?</h2>
          <p className="text-gray-400 mb-8">Free, instant, no account needed.</p>
          <a
            href="#analyze"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Analyze now →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-gray-600 text-sm">
          <div className="flex items-center gap-2">
            <span>⚖️</span>
            <span>ContractScan</span>
          </div>
          <p>Not legal advice. For informational purposes only.</p>
        </div>
      </footer>
    </div>
  );
}
