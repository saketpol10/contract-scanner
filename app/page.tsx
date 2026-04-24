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
            <span className="text-xl">💼</span>
            <span className="font-bold text-white text-lg">OfferScan</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a
              href="#analyze"
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Analyze free
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 tracking-wide uppercase">
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
          Free · Instant · No signup
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight mb-6">
          Read your job offer<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
            before it reads you
          </span>
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          Paste your job offer or employment contract. Get an instant plain-English breakdown
          of non-competes, IP grabs, equity traps, arbitration clauses, and anything else
          that could cost you later.
        </p>
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-16">
          <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> No signup required</span>
          <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Never stored</span>
          <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Results in &lt;15 seconds</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-20">
          {[
            { value: "10K+", label: "Offers analyzed" },
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
          <h2 className="text-white font-semibold text-lg mb-1">Analyze your offer</h2>
          <p className="text-gray-500 text-sm mb-6">Paste your offer letter, employment contract, or NDA</p>
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
              title: "Paste your offer",
              desc: "Drop in your offer letter, employment contract, or NDA as text or PDF.",
            },
            {
              step: "02",
              icon: "🤖",
              title: "AI scans every clause",
              desc: "Our AI flags non-competes, IP assignments, at-will clauses, equity traps, and more.",
            },
            {
              step: "03",
              icon: "🛡️",
              title: "Know before you sign",
              desc: "Get plain-English explanations of every risky clause plus what you can negotiate.",
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
          The clauses buried in tech job offers that most people miss — until it's too late.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "🚫", title: "Non-compete clauses", desc: "Restrictions that lock you out of your industry or stop you from joining competitors." },
            { icon: "💡", title: "IP assignment", desc: "Clauses that hand over side projects, open source work, or anything you build on your own time." },
            { icon: "📈", title: "Equity traps", desc: "Vesting cliffs, acceleration terms, and clauses that let the company claw back your stock." },
            { icon: "🔚", title: "At-will termination", desc: "How easily they can let you go and what severance (if any) you're entitled to." },
            { icon: "🔄", title: "Moonlighting bans", desc: "Restrictions on freelancing, side projects, or working for anyone else in your spare time." },
            { icon: "💸", title: "Bonus clawbacks", desc: "Sign-on or performance bonuses you'd have to repay if you leave before a certain date." },
            { icon: "⚖️", title: "Arbitration clauses", desc: "Forcing disputes into private arbitration instead of courts — usually favors the employer." },
            { icon: "🌍", title: "Jurisdiction & governing law", desc: "Which state's laws apply and where you'd have to file a dispute." },
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
          Employment lawyers charge $300–$500/hr. OfferScan is free.
        </p>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: "🎓",
              title: "First job / new grad",
              desc: "Your first offer letter is full of legal language. Know what you're agreeing to before you sign.",
            },
            {
              icon: "🔄",
              title: "Switching companies",
              desc: "Check non-competes, IP clauses, and notice periods before leaving your current role.",
            },
            {
              icon: "🚀",
              title: "Joining a startup",
              desc: "Equity vesting, cliff periods, acceleration clauses — understand what you're actually getting.",
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
              q: "Is my offer letter stored anywhere?",
              a: "No. Your document is sent to the AI for analysis and immediately discarded. We store nothing.",
            },
            {
              q: "Is this legal advice?",
              a: "No. OfferScan is an AI-powered tool for informational purposes. For high-stakes offers — senior roles, equity-heavy packages — consult an employment attorney.",
            },
            {
              q: "What documents can I analyze?",
              a: "Offer letters, employment contracts, NDAs, equity agreements, contractor agreements, and IP assignment agreements.",
            },
            {
              q: "How accurate is it?",
              a: "The AI is strong at identifying common risky patterns in tech employment contracts and explaining them clearly. It may miss highly specialized legal nuance, so treat it as a first pass.",
            },
            {
              q: "Is it really free?",
              a: "Yes. No credit card, no account, no limits beyond 5 analyses per hour to prevent abuse.",
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
          <h2 className="text-3xl font-bold text-white mb-4">Got an offer? Scan it first.</h2>
          <p className="text-gray-400 mb-8">Free, instant, no account needed.</p>
          <a
            href="#analyze"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Analyze my offer →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-gray-600 text-sm">
          <div className="flex items-center gap-2">
            <span>💼</span>
            <span>OfferScan</span>
          </div>
          <p>Not legal advice. For informational purposes only.</p>
        </div>
      </footer>
    </div>
  );
}
