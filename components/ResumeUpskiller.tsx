"use client";

import { useState, useMemo } from "react";
import { Wand2, Check, RefreshCcw, Sparkles, AlertCircle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const REPHRASING_SUGGESTIONS = [
  {
    original: "Managed team of 10 developers",
    suggested: "Led a cross-functional engineering team of 10, increasing sprint velocity by 25%.",
    category: "Leadership"
  },
  {
    original: "Built a payment system",
    suggested: "Architected a high-concurrency payment gateway handling 10k+ transactions per minute using Stripe API.",
    category: "Technical"
  },
  {
    original: "Worked on frontend with React",
    suggested: "Developed performance-optimized UI components in React, reducing bundle size by 40% through code splitting.",
    category: "Technical"
  }
];

export default function ResumeUpskiller() {
  const [activeTab, setActiveTab] = useState<"SUGGESTIONS" | "OPTIMIZE">("SUGGESTIONS");
  const [applied, setApplied] = useState<number[]>([]);
  const [isUpskilling, setIsUpskilling] = useState(false);

  const toggleApply = (index: number) => {
    if (applied.includes(index)) {
      setApplied(applied.filter(i => i !== index));
    } else {
      setApplied([...applied, index]);
    }
  };

  const projectedImpact = useMemo(() => {
    return applied.length * 4; // Each suggestion adds ~4% for this demo
  }, [applied]);

  return (
    <div className="rounded-[2.5rem] border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
      <div className="flex border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => setActiveTab("SUGGESTIONS")}
          className={`flex-1 py-5 text-xs font-bold uppercase tracking-widest transition ${
            activeTab === "SUGGESTIONS" ? "text-sky-500 border-b-2 border-sky-500" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          AI Suggestions
        </button>
        <button 
          onClick={() => setActiveTab("OPTIMIZE")}
          className={`flex-1 py-5 text-xs font-bold uppercase tracking-widest transition ${
            activeTab === "OPTIMIZE" ? "text-sky-500 border-b-2 border-sky-500" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Delta Analysis
        </button>
      </div>

      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Wand2 size={20} className="text-sky-500" />
            <h2 className="text-xl font-bold">Resume Upskiller</h2>
          </div>
          {projectedImpact > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <TrendingUp size={14} />
              +{projectedImpact}% Match
            </div>
          )}
        </div>

        {activeTab === "OPTIMIZE" ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-500/20 dark:bg-amber-500/5">
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <AlertCircle size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Semantic Gaps Identified</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                The AI identified skills you likely possess but haven't described using JD-aligned terminology.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["CI/CD Pipelines", "System Architecture", "Microservices"].map(tag => (
                <span key={tag} className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {REPHRASING_SUGGESTIONS.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`group space-y-3 rounded-3xl border p-5 transition ${
                  applied.includes(index) ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/5" : "border-slate-100 bg-slate-50 hover:border-sky-200 dark:border-slate-800 dark:bg-slate-900/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.category}</span>
                  <button 
                    onClick={() => toggleApply(index)}
                    className={`rounded-full p-1.5 transition ${
                      applied.includes(index) ? "bg-emerald-500 text-white" : "bg-white text-slate-400 shadow-sm hover:text-slate-600 dark:bg-slate-800"
                    }`}
                  >
                    {applied.includes(index) ? <Check size={14} /> : <RefreshCcw size={14} />}
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Original Phrasing</p>
                    <p className="text-xs text-slate-400 line-through">"{item.original}"</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-sky-500">AI-Optimized (Truthful)</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">"{item.suggested}"</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="rounded-2xl bg-sky-500/5 border border-sky-500/10 p-5">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 mb-2">
            <Sparkles size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">The "Truthfulness" Guardrail</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-500">
            MeritSync AI operates on <strong>Semantic Translation</strong>. We only rephrase your existing experience and never fabricate new skills or tools.
          </p>
        </div>

        <button 
          className={`w-full rounded-2xl py-4 text-sm font-bold text-white shadow-xl transition shadow-sky-500/20 ${
            applied.length > 0 ? "bg-sky-600 hover:bg-sky-500" : "bg-slate-400 cursor-not-allowed"
          }`}
        >
          One-Click Apply & Recalculate
        </button>
      </div>
    </div>
  );
}
