"use client";

import { useState } from "react";
import { TrendingUp, Users, Target, ShieldAlert, BarChart3, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const MOCK_STATS = [
  { label: "AI Avg Score", value: "72%", delta: "+2%", icon: Target },
  { label: "Human Approval Rate", value: "84%", delta: "-1%", icon: Users },
  { label: "Model Drift", value: "0.04", delta: "Low", icon: TrendingUp },
  { label: "Compliance Score", value: "99.9%", delta: "Stable", icon: BarChart3 },
];

const OVERRIDES = [
  { id: 1, candidate: "Arjun Mehta", ai_score: 64, recruiter_action: "APPROVED", reason: "Niche experience in Indian FinTech regulations missed by AI." },
  { id: 2, candidate: "Priya Sharma", ai_score: 81, recruiter_action: "HIRED", reason: "Matches AI high-signal profile exactly." },
  { id: 3, candidate: "Rahul Nair", ai_score: 58, recruiter_action: "REJECTED", reason: "Upholding AI gating - lack of technical depth." },
];

export default function AccuracyDashboard() {
  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Accuracy & Bias Dashboard</h1>
          <p className="text-sm text-slate-500">Monitoring Human-in-the-Loop Overrides & AI Drift</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950">
          Export Compliance CSV
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        {MOCK_STATS.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-xl bg-sky-500/10 p-2 text-sky-500">
                <stat.icon size={20} />
              </div>
              <span className={`text-[10px] font-bold uppercase ${
                stat.delta === "Low" || stat.delta === "Stable" ? "text-slate-400" : "text-emerald-500"
              }`}>
                {stat.delta}
              </span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Override List */}
      <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center gap-3 mb-8">
          <div className="rounded-full bg-amber-500/10 p-2 text-amber-500">
            <ShieldAlert size={20} />
          </div>
          <h2 className="text-xl font-bold">Recent Human Overrides</h2>
        </div>

        <div className="space-y-4">
          {OVERRIDES.map((item) => (
            <div key={item.id} className="group flex items-center justify-between rounded-2xl border border-slate-100 p-6 transition hover:border-sky-500/50 dark:border-slate-800 dark:hover:bg-slate-900/50">
              <div className="flex items-center gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.candidate}</p>
                  <p className="text-xs text-slate-500 italic">"{item.reason}"</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase text-slate-400">AI Score</p>
                  <p className="text-sm font-black text-amber-500">{item.ai_score}%</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Human Action</p>
                  <p className={`text-sm font-black ${item.recruiter_action === "APPROVED" ? "text-emerald-500" : "text-slate-400"}`}>
                    {item.recruiter_action}
                  </p>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-sky-500" size={18} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
