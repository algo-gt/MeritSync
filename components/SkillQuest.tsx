"use client";

import { useState } from "react";
import { Code2, CheckCircle2, XCircle, Timer, Zap, Play, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";

interface SkillQuestProps {
  skill: string;
  onComplete: (score: number) => void;
  onClose: () => void;
}

export default function SkillQuest({ skill, onComplete, onClose }: SkillQuestProps) {
  const [code, setCode] = useState(`// Task: Implement a high-performance debounced search function\n// Your solution should handle rapid keystrokes and edge cases.\n\nfunction debounce(func, wait) {\n  // Your code here\n}`);
  const [status, setStatus] = useState<"IDLE" | "RUNNING" | "SUCCESS" | "FAILED">("IDLE");
  const [score, setScore] = useState(0);

  const runTest = () => {
    setStatus("RUNNING");
    setTimeout(() => {
      // Simulated Evaluation
      const success = true; 
      if (success) {
        setStatus("SUCCESS");
        setScore(92);
      } else {
        setStatus("FAILED");
      }
    }, 2000);
  };

  const handleFinish = () => {
    onComplete(score);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-6xl h-[85vh] flex flex-col rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-8 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-sky-500/10 p-3 text-sky-500">
              <Code2 size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Skill Quest: {skill}</h2>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-600">Active Challenge</span>
              </div>
              <p className="text-sm text-slate-500">Pass this quest to earn your "Verified" badge and unlock the 75% threshold.</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-400">
              <Timer size={20} />
              <span className="font-mono font-bold">14:59</span>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">
              <XCircle size={24} />
            </button>
          </div>
        </div>

        {/* Quest Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Instructions */}
          <div className="w-80 border-r border-slate-100 p-8 space-y-6 overflow-y-auto dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">The Problem</h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                You are building a high-traffic e-commerce search bar. To prevent database overload, you must implement a debounce function that ensures the search only triggers after the user stops typing for a specified duration.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Test Cases</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-xl bg-white p-3 text-[11px] shadow-sm border border-slate-100 dark:bg-slate-950 dark:border-slate-800">
                  <span className="font-mono">Case 1: Execution Delay</span>
                  <Check size={14} className="text-emerald-500" />
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white p-3 text-[11px] shadow-sm border border-slate-100 dark:bg-slate-950 dark:border-slate-800">
                  <span className="font-mono">Case 2: Context Binding</span>
                  <Check size={14} className="text-emerald-500" />
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white p-3 text-[11px] shadow-sm border border-slate-100 dark:bg-slate-950 dark:border-slate-800">
                  <span className="font-mono">Case 3: Arguments Pass</span>
                  <Check size={14} className="text-slate-300" />
                </div>
              </div>
            </section>

            <div className="rounded-2xl bg-sky-500/5 p-4 border border-sky-500/10">
              <div className="flex items-center gap-2 mb-2 text-sky-600">
                <Zap size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">AI Hint</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Think about how `clearTimeout` works in the lifecycle of the returned function.
              </p>
            </div>
          </div>

          {/* Editor Pane */}
          <div className="flex-1 flex flex-col relative">
            <div className="flex-1">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                value={code}
                onChange={(v: string | undefined) => setCode(v || "")}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: "on",
                  padding: { top: 20 },
                  fontFamily: "var(--font-mono)",
                }}
              />
            </div>

            {/* Status Overlays */}
            <AnimatePresence>
              {status === "RUNNING" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-white"
                >
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="mb-4 text-sky-400"
                  >
                    <Zap size={48} />
                  </motion.div>
                  <p className="text-lg font-bold">AI Gatekeeper evaluating your code...</p>
                  <p className="text-sm text-slate-400">Verifying logic, edge cases, and performance.</p>
                </motion.div>
              )}

              {status === "SUCCESS" && (
                <motion.div 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-md rounded-3xl bg-emerald-500 p-8 shadow-2xl text-white text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="rounded-full bg-white/20 p-4">
                      <CheckCircle2 size={48} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black mb-2">Quest Mastered!</h3>
                  <p className="text-sm text-emerald-50/80 mb-6">You scored <strong>{score}%</strong>. Your skill "{skill}" is now VERIFIED. The 75% gate is opening.</p>
                  <button 
                    onClick={handleFinish}
                    className="w-full rounded-2xl bg-white py-4 text-emerald-600 font-bold hover:bg-emerald-50 transition"
                  >
                    Claim Verification Badge
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 dark:border-slate-800">
          <div className="text-xs text-slate-400 font-medium italic">
            Your code is being analyzed for semantic correctness and runtime complexity.
          </div>
          <div className="flex gap-4">
            <button 
              onClick={runTest}
              disabled={status === "RUNNING" || status === "SUCCESS"}
              className="flex items-center gap-2 rounded-2xl bg-slate-900 px-10 py-4 text-sm font-bold text-white hover:bg-slate-800 transition disabled:opacity-50 dark:bg-white dark:text-slate-900"
            >
              <Play size={18} />
              Run & Submit
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
