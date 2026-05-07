"use client";

import { useState } from "react";
import { ShieldCheck, Download, Users, BarChart3, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function ComplianceDashboard() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 2000);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-500">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Bias & Compliance Hub</h2>
            <p className="text-sm text-slate-500">Ensuring ethical AI operations and DPDP 2023 compliance.</p>
          </div>
        </div>
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950"
        >
          <Download size={18} />
          {isExporting ? "Generating PDF..." : "Export Compliance Audit"}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between mb-4">
            <Users className="text-slate-400" size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Gated</span>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-slate-100">1,248</p>
          <p className="text-xs text-slate-500 mt-2">Candidates scoring &lt; 75% in the last 30 days.</p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="text-emerald-500" size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Fairness Index</span>
          </div>
          <p className="text-3xl font-black text-emerald-500">98.2%</p>
          <p className="text-xs text-slate-500 mt-2">Algorithmic parity across protected demographics.</p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between mb-4">
            <Lock className="text-sky-500" size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Data Privacy</span>
          </div>
          <p className="text-3xl font-black text-sky-500">Secured</p>
          <p className="text-xs text-slate-500 mt-2">100% anonymization of personal identifiers in logs.</p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-10 dark:border-slate-800 dark:bg-slate-950">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Demographic Skill Distribution (Anonymized)</h3>
        <div className="space-y-6">
          {[
            { label: "Technical Competency", value: 85, color: "bg-sky-500" },
            { label: "Leadership Experience", value: 42, color: "bg-indigo-500" },
            { label: "Domain Relevance", value: 64, color: "bg-emerald-500" },
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-slate-600 dark:text-slate-400">{stat.label}</span>
                <span className="text-slate-900 dark:text-slate-100">{stat.value}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.value}%` }}
                  transition={{ duration: 1, delay: i * 0.2 }}
                  className={`h-full ${stat.color}`} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
