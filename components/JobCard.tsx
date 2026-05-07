"use client";
import { useState, useEffect } from "react";
import { Sparkles, MapPin, Building2, Globe, MessageSquare, Loader2, Zap, MessageCircle } from "lucide-react";
import MatchGauge from "./MatchGauge";
import AICoach from "./AICoach";
import SkillQuest from "./SkillQuest";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    source: string;
    snippet: string;
    score: number;
    metadata?: {
      is_social?: boolean;
      source?: string;
    };
    apply_url?: string;
  };
  onAction?: (action: "APPLY" | "PITCH" | "REPORT", data: any) => void;
}

export default function JobCard({ job, onAction }: JobCardProps) {
  const [isCalculating, setIsCalculating] = useState(false);
  const [matchData, setMatchData] = useState<any>(null);
  const [showCoach, setShowCoach] = useState(false);
  const [activeQuest, setActiveQuest] = useState<string | null>(null);

  useEffect(() => {
    const fetchScore = async () => {
      if (job.score === 0 && !matchData) {
        setIsCalculating(true);
        try {
          const response = await fetch("/api/v1/jobs/score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              job_id: job.id,
              candidate_id: "current_user_id", // In production, get from session
              resume_data: {}, // Mock resume
              job_description: "Senior Fullstack Engineer with Next.js experience." // Mock JD
            })
          });
          const result = await response.json();
          if (result.status === "success") {
            setMatchData(result.data);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsCalculating(false);
        }
      }
    };
    fetchScore();
  }, [job.id, job.score, matchData]);

  const score = matchData?.total_score || job.score;
  const xaiSummary = matchData?.xai_notes || [job.snippet];

  // Gatekeeper Logic for Button Rendering
  const renderAction = () => {
    if (job.metadata?.is_social) {
      return (
        <a 
          href={job.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
        >
          <MessageSquare size={16} />
          View Original Post
        </a>
      );
    }
    if (score >= 75) {
      return (
        <button 
          onClick={() => onAction?.("APPLY", job)}
          className="w-full rounded-lg bg-sky-600 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500"
        >
          Apply Now
        </button>
      );
    }
    if (score >= 60) {
      const suggestedSkill = matchData?.gap_analysis?.missing_skills?.[0] || "Technical Proficiency";
      return (
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveQuest(suggestedSkill)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-500"
          >
            <Zap size={14} />
            Start Skill Quest
          </button>
          <button 
            onClick={() => onAction?.("PITCH", job)}
            className="w-full rounded-lg border border-amber-500 py-2.5 text-sm font-semibold text-amber-600 transition hover:bg-amber-500/5 dark:text-amber-400"
          >
            Pitch for Freelance
          </button>
        </div>
      );
    }
    return (
      <button 
        onClick={() => onAction?.("REPORT", job)}
        className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
      >
        Unlock Match Report
      </button>
    );
  };

  return (
    <div className="group flex flex-col rounded-lg border border-slate-200 bg-white p-5 transition hover:border-sky-500 hover:shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-900">
            <Building2 size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold leading-tight text-slate-900 dark:text-slate-100">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <span>{job.company}</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {job.location}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                via {job.source}
              </span>
              {job.metadata?.is_social && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-sky-500">
                  {job.metadata.source === "X" ? <MessageCircle size={10} /> : <Globe size={10} />}
                  SOCIAL SIGNAL
                </span>
              )}
            </div>
          </div>
        </div>
        <MatchGauge score={score} />
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-900/50">
        <Sparkles size={14} className={`mt-0.5 shrink-0 ${
          score >= 75 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-rose-500"
        }`} />
        <div className="space-y-1">
          {xaiSummary.map((bullet: string, i: number) => (
            <p key={i} className="text-[11px] leading-snug text-slate-600 dark:text-slate-400">
              • {bullet}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-5">
        {isCalculating ? (
          <div className="flex w-full items-center justify-center gap-3 rounded-lg bg-slate-50 py-3 text-xs font-bold text-slate-400 dark:bg-slate-900">
            <Loader2 size={16} className="animate-spin text-sky-500" />
            AI GATEKEEPER ANALYZING...
          </div>
        ) : renderAction()}
        
        <button 
          onClick={() => setShowCoach(true)}
          className="mt-4 flex w-full items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-500 transition"
        >
          <MessageCircle size={14} />
          Chat with AI Coach
        </button>
      </div>

      {showCoach && <AICoach onClose={() => setShowCoach(false)} />}
      {activeQuest && (
        <SkillQuest 
          skill={activeQuest} 
          onClose={() => setActiveQuest(null)} 
          onComplete={(score) => {
            console.log("Quest completed with score:", score);
            setActiveQuest(null);
            // Trigger score recalculation logic
          }} 
        />
      )}
    </div>
  );
}
