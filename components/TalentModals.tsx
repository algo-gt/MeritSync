"use client";

import { useState } from "react";
import { X, AlertCircle, AlertTriangle, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    job_id: string;
    suggested_skill?: string;
  };
}

export function GapReportModal({ isOpen, onClose, data }: ModalProps) {
  const [showAppeal, setShowAppeal] = useState(false);
  const [justification, setJustification] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokens, setTokens] = useState(3);

  if (!isOpen) return null;

  const handleAppeal = async () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setTokens(tokens - 1);
      setShowAppeal(false);
      alert("Manual review request submitted. A recruiter will review your profile shortly.");
    }, 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-950"
        >
          <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>

          {!showAppeal ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-rose-50 p-2 text-rose-500 dark:bg-rose-500/10">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Transparency Report</h2>
                  <p className="text-sm text-slate-500">Why you didn't meet the 75% threshold</p>
                </div>
              </div>

              <div className="space-y-4">
                <section className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Missing Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {["System Design", "AWS Lambda", "Redis"].map(tag => (
                      <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Experience Gaps</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                      Requirement for 5+ years of team leadership experience.
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                      Missing verifiable evidence of large-scale database migration.
                    </li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Skill-Gap Visualization</h3>
                  <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
                    <div className="h-full bg-rose-500 transition-all" style={{ width: "62%" }} />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>CURRENT: 62%</span>
                    <span>TARGET: 75%</span>
                  </div>
                </section>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowAppeal(true)}
                  className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                >
                  Appeal AI Score
                </button>
                <button className="flex-1 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950">
                  Update Resume
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-amber-500/10 p-2 text-amber-500">
                    <AlertTriangle size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Manual Review Request</h2>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Tokens Remaining</p>
                  <p className="text-sm font-black text-amber-500">{tokens}/3</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Request a human recruiter to evaluate context the AI may have missed. Manual reviews are finite to prevent system abuse.
                </p>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Justification</label>
                  <textarea
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    placeholder="e.g., The AI missed my specialized experience in proprietary legacy systems..."
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 outline-none transition focus:border-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowAppeal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAppeal}
                  disabled={isSubmitting || tokens === 0}
                  className="flex-1 rounded-xl bg-amber-500 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : tokens === 0 ? "No Tokens" : "Submit Appeal"}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export function FreelancePitchModal({ isOpen, onClose, data }: ModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pitchContent, setPitchContent] = useState("");
  const [rate, setRate] = useState("");
  const [timeline, setTimeline] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/v1/freelance/pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: data.job_id,
          pitch_content: pitchContent || `I see you need help with ${data.suggested_skill || 'this role'}. I can handle the migration in a 4-week sprint.`,
          suggested_rate: rate,
          suggested_timeline: timeline
        })
      });
      if (response.ok) setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-950"
        >
          <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>

          {!submitted ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-amber-50 p-2 text-amber-500 dark:bg-amber-500/10">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Pitch for Freelance</h2>
                  <p className="text-sm text-slate-500">Monetize your specific skill matches</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  MeritSync AI suggests this pitch based on your 100% match in <span className="font-bold text-amber-500">{data.suggested_skill || "Key Requirements"}</span>.
                </p>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Your AI-Generated Pitch</label>
                  <textarea
                    value={pitchContent}
                    onChange={(e) => setPitchContent(e.target.value)}
                    placeholder={`I see you need help with ${data.suggested_skill || 'this role'}. I can handle the migration in a 4-week sprint.`}
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 outline-none transition focus:border-amber-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Suggested Rate</label>
                    <input
                      type="text"
                      placeholder="$100/hr"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Timeline</label>
                    <input
                      type="text"
                      placeholder="4 Weeks"
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-900"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full rounded-xl bg-amber-500 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Pitch"}
              </button>
            </div>
          ) : (
            <div className="py-10 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Pitch Submitted!</h2>
              <p className="text-sm text-slate-500">The recruiter will see your proposal in their Freelance Marketplace tab.</p>
              <button onClick={onClose} className="text-sm font-semibold text-sky-500 hover:text-sky-400">
                Back to Feed
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
