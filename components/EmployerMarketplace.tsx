"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, FileText, Send, Zap } from "lucide-react";
import SOWEditor from "./SOWEditor";

type Candidate = {
  id: string;
  name: string;
  score: number;
  type: "FULL_TIME" | "FREELANCE_FLEX";
  pitch?: string;
  xai: string[];
  gap?: string;
};

const MOCK_CANDIDATES: Candidate[] = [
  {
    id: "1",
    name: "Alex Rivera",
    score: 82,
    type: "FULL_TIME",
    xai: [
      "5+ years of React architecture experience.",
      "Previous lead role at a FinTech unicorn.",
      "100% match on technical stack (Next.js, Tailwind)."
    ]
  },
  {
    id: "2",
    name: "Jordan Smith",
    score: 68,
    type: "FREELANCE_FLEX",
    pitch: "You match 100% on the Stripe API requirements for this role. Suggest a 4-week contract to build the payment gateway module.",
    gap: "Missing 5+ years of Team Leadership required for the Senior Full-Time role.",
    xai: [
      "Primary Match: Matches 100% of 'Payment Gateway Integration' requirements (Stripe API).",
      "The 'Gap': Score is 68% due to lacking team leadership depth.",
      "Flex Recommendation: Highly qualified for a 4-6 week sprint to build out the billing module."
    ]
  },
  {
    id: "3",
    name: "Casey Chen",
    score: 71,
    type: "FREELANCE_FLEX",
    pitch: "Expert in responsive UI components. Can deliver the dashboard overhaul in a 3-week sprint.",
    gap: "Lacks specialized Fintech domain experience.",
    xai: [
      "Expertise in high-density Tailwind layouts.",
      "Strong portfolio in e-commerce dashboarding.",
      "Ideal for modular UI development tasks."
    ]
  }
];

export default function EmployerMarketplace() {
  const [activeTab, setActiveTab] = useState<"FULL_TIME" | "FREELANCE_FLEX">("FULL_TIME");
  const [pitches, setPitches] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [sowData, setSowData] = useState<{ content: string; pitchText: string; id: string } | null>(null);

  const handleAccept = async (candidate: Candidate) => {
    setAcceptingId(candidate.id);
    try {
      const response = await fetch("/api/v1/freelance/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pitch_id: candidate.id, is_preview: true })
      });
      const data = await response.json();
      if (response.ok) {
        setSowData({ content: data.sow_content, pitchText: data.pitch_text, id: candidate.id });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAcceptingId(null);
    }
  };

  const filteredCandidates = pitches.filter(c => c.type === activeTab);

  return (
    <section className="rounded-[2rem] border border-slate-800/90 bg-slate-950/50 p-8 shadow-soft">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h2 className="text-2xl font-semibold text-slate-100">Job Requisition: Senior Fullstack Engineer</h2>
          <div className="flex gap-2 rounded-2xl bg-slate-900 p-1">
            <button
              onClick={() => setActiveTab("FULL_TIME")}
              className={`px-4 py-2 text-sm font-semibold transition rounded-xl ${
                activeTab === "FULL_TIME" ? "bg-sky-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Full-Time Leaderboard
            </button>
            <button
              onClick={() => setActiveTab("FREELANCE_FLEX")}
              className={`px-4 py-2 text-sm font-semibold transition rounded-xl ${
                activeTab === "FREELANCE_FLEX" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Freelance Marketplace
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="group relative rounded-3xl border border-slate-800 bg-slate-900/50 p-6 transition hover:border-slate-600"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-slate-100">{candidate.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      candidate.type === "FULL_TIME" ? "bg-sky-500/10 text-sky-400" : "bg-emerald-500/10 text-emerald-400"
                    }`}>
                      {candidate.score}% Match
                    </span>
                  </div>

                  {candidate.type === "FREELANCE_FLEX" && (
                    <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/10 p-4 italic text-sm text-emerald-300/90">
                      " {candidate.pitch} "
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Explainable AI (XAI) Summary</p>
                    <ul className="space-y-1">
                      {candidate.xai.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-sky-400" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {candidate.gap && (
                    <div className="text-sm">
                      <span className="font-semibold text-rose-400">Skill Gap Analysis:</span>{" "}
                      <span className="text-slate-400">{candidate.gap}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <button 
                    disabled={acceptingId === candidate.id}
                    onClick={() => candidate.type === "FREELANCE_FLEX" ? handleAccept(candidate) : null}
                    className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                    candidate.type === "FULL_TIME" 
                      ? "bg-sky-500 text-slate-950 hover:bg-sky-400" 
                      : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                  }`}>
                    {acceptingId === candidate.id ? "Processing..." : candidate.type === "FULL_TIME" ? "Interview" : "Direct-to-Contract"}
                  </button>
                  <button className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sowData && (
          <SOWEditor 
            pitchId={sowData.id}
            initialContent={sowData.content}
            pitchText={sowData.pitchText}
            onClose={() => setSowData(null)}
            onSave={(newContent) => {
              console.log("Finalized SOW:", newContent);
              setSowData(null);
              // Trigger HRIS export logic here
            }}
          />
        )}

        <div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs text-slate-500">
          <p>Demographic fairness verified via MeritSync Bias Audit Logs.</p>
          <button className="hover:text-slate-300">Download Fairness Report (.pdf)</button>
        </div>
      </div>
    </section>
  );
}
