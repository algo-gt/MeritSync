"use client";

import { useState } from "react";
import { MessageSquare, ThumbsUp, ThumbsDown, AlertTriangle, ShieldCheck } from "lucide-react";

type Appeal = {
  id: string;
  candidate_name: string;
  ai_score: number;
  justification: string;
  job_title: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
};

const MOCK_APPEALS: Appeal[] = [
  {
    id: "app_1",
    candidate_name: "Morgan Stark",
    ai_score: 62,
    justification: "The AI missed my specialized experience in proprietary legacy systems at my previous firm, which directly relates to the backend integration you need.",
    job_title: "Senior Backend Engineer",
    status: "PENDING"
  }
];

export default function AppealReview() {
  const [appeals, setAppeals] = useState<Appeal[]>(MOCK_APPEALS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleAction = (id: string, status: "APPROVED" | "REJECTED") => {
    setAppeals(appeals.map(a => a.id === id ? { ...a, status } : a));
    setSelectedId(null);
  };

  const selectedAppeal = appeals.find(a => a.id === selectedId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-amber-500/10 p-2 text-amber-500">
            <AlertTriangle size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Manual Review Queue (Appeals)</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500 dark:bg-slate-900">
          {appeals.filter(a => a.status === "PENDING").length} Pending Appeals
        </span>
      </div>

      <div className="grid gap-4">
        {appeals.map((appeal) => (
          <div 
            key={appeal.id}
            onClick={() => setSelectedId(appeal.id)}
            className={`cursor-pointer rounded-2xl border p-6 transition ${
              selectedId === appeal.id ? "border-sky-500 bg-sky-500/5" : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{appeal.candidate_name}</p>
                <p className="text-xs text-slate-500">Appealing score for {appeal.job_title}</p>
              </div>
              <span className={`text-sm font-black ${appeal.ai_score < 75 ? "text-amber-500" : "text-emerald-500"}`}>
                AI Score: {appeal.ai_score}%
              </span>
            </div>
            {selectedId === appeal.id && (
              <div className="mt-6 space-y-4 border-t border-slate-100 pt-6 dark:border-slate-800">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Candidate Justification</label>
                  <p className="text-sm italic text-slate-700 dark:text-slate-300">"{appeal.justification}"</p>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleAction(appeal.id, "APPROVED")}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white transition hover:bg-emerald-500"
                  >
                    <ThumbsUp size={16} />
                    Approve & Force Lead
                  </button>
                  <button 
                    onClick={() => handleAction(appeal.id, "REJECTED")}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                  >
                    <ThumbsDown size={16} />
                    Uphold AI Gating
                  </button>
                </div>
              </div>
            )}
            {appeal.status !== "PENDING" && (
              <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase">
                <ShieldCheck size={14} className={appeal.status === "APPROVED" ? "text-emerald-500" : "text-rose-500"} />
                <span className={appeal.status === "APPROVED" ? "text-emerald-500" : "text-rose-500"}>
                  {appeal.status}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
