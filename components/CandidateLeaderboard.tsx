"use client";

import { useState } from "react";
import { Search, Filter, Download, Star, ExternalLink, Zap, CheckCircle2, ShieldCheck } from "lucide-react";

const MOCK_TALENT = [
  { id: "1", name: "Alex Rivera", role: "Senior Fullstack Engineer", score: 82, xai: "Expert in Next.js/React ecosystems. Led teams of 10+.", type: "FULL_TIME", isVerified: true, isPressureTested: true },
  { id: "2", name: "Samantha Lee", role: "Backend Developer", score: 88, xai: "High-compliance Fintech context. Go/Kubernetes specialist.", type: "FULL_TIME", isVerified: true, isPressureTested: false },
  { id: "3", name: "Jordan Smith", role: "Fullstack Developer", score: 68, xai: "Strong technical match. Lacks leadership depth.", type: "FREELANCE_FLEX", pitch: "Available for 4-week Stripe API migration.", isVerified: false, isPressureTested: false },
  { id: "4", name: "Casey Chen", role: "Frontend Specialist", score: 71, xai: "UI density expert. Previous Linear project experience.", type: "FREELANCE_FLEX", pitch: "Can handle dashboard overhaul sprint.", isVerified: true, isPressureTested: true },
];

export default function CandidateLeaderboard() {
  const [activeTab, setActiveTab] = useState<"FULL_TIME" | "FREELANCE_FLEX">("FULL_TIME");

  const filteredTalent = MOCK_TALENT.filter(t => t.type === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 rounded-2xl bg-slate-100 p-1 dark:bg-slate-900">
          <button
            onClick={() => setActiveTab("FULL_TIME")}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold transition rounded-xl ${
              activeTab === "FULL_TIME" ? "bg-white text-sky-600 shadow-sm dark:bg-slate-800" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <Star size={16} />
            High-Signal Leaderboard (≥75%)
          </button>
          <button
            onClick={() => setActiveTab("FREELANCE_FLEX")}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold transition rounded-xl ${
              activeTab === "FREELANCE_FLEX" ? "bg-white text-emerald-600 shadow-sm dark:bg-slate-800" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <Zap size={16} />
            Freelance Marketplace (60-74%)
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              placeholder="Search talent pool..."
              className="rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-sky-500 dark:border-slate-800 dark:bg-slate-950" 
            />
          </div>
          <button className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900">
            <Filter size={18} />
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white dark:bg-slate-100 dark:text-slate-950">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Candidate</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Match Score</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">XAI Highlight</th>
              {activeTab === "FREELANCE_FLEX" && (
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Contextual Pitch</th>
              )}
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredTalent.map((person) => (
              <tr key={person.id} className="group transition hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500">
                      {person.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{person.name}</p>
                        {person.isVerified && <CheckCircle2 size={14} className="text-emerald-500" />}
                        {person.isPressureTested && <ShieldCheck size={14} className="text-sky-500" />}
                      </div>
                      <p className="text-xs text-slate-500">{person.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`text-sm font-black ${
                    person.score >= 75 ? "text-sky-600 dark:text-sky-400" : "text-emerald-600 dark:text-emerald-400"
                  }`}>
                    {person.score}%
                  </span>
                </td>
                <td className="px-6 py-5 max-w-xs">
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                    "{person.xai}"
                  </p>
                </td>
                {activeTab === "FREELANCE_FLEX" && (
                  <td className="px-6 py-5 max-w-xs">
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                      {person.pitch}
                    </p>
                  </td>
                )}
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-sky-500 transition">
                      <ExternalLink size={18} />
                    </button>
                    <button className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
                      activeTab === "FULL_TIME" 
                        ? "bg-sky-600 text-white hover:bg-sky-500" 
                        : "bg-emerald-600 text-white hover:bg-emerald-500"
                    }`}>
                      {activeTab === "FULL_TIME" ? "Interview" : "Hire Direct"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
