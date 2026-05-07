"use client";

import { useState } from "react";
import { MessageSquare, ShieldAlert, Zap, BarChart3, TrendingUp, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AICoach({ onClose }: { onClose: () => void }) {
  const [isStressMode, setIsStressMode] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "I've reviewed your profile. Ready to prove you're more than just a resume? We can start a standard session or a 'Stress Interview' simulation." }
  ]);
  const [input, setInput] = useState("");
  const [showScorecard, setShowScorecard] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    // Simulated "Skeptical" AI response
    setTimeout(() => {
      setMessages([...newMessages, { 
        role: "assistant", 
        text: isStressMode 
          ? "That's a textbook answer. Let's dig deeper. If your production environment crashed during this deployment, how exactly would you justify your choice of architecture to a skeptical CTO?"
          : "Good point. How would you apply that same logic to a high-scale environment?" 
      }]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-4xl h-[75vh] flex flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-500">
              <MessageSquare size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Aggressive AI Coach</h2>
              <p className="text-sm text-slate-500">Practice your resilience in high-pressure simulations.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-slate-100 p-1 dark:bg-slate-900">
              <button 
                onClick={() => setIsStressMode(false)}
                className={`rounded-full px-4 py-1 text-xs font-bold transition ${!isStressMode ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}`}
              >
                Friendly
              </button>
              <button 
                onClick={() => setIsStressMode(true)}
                className={`rounded-full px-4 py-1 text-xs font-bold transition flex items-center gap-1 ${isStressMode ? "bg-rose-500 text-white shadow-sm" : "text-slate-500"}`}
              >
                <Zap size={10} />
                Stress Mode
              </button>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                m.role === "user" 
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900" 
                  : isStressMode 
                    ? "bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400" 
                    : "bg-white border border-slate-100 text-slate-700 shadow-sm dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300"
              }`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Resilience Scorecard Overlay */}
        <AnimatePresence>
          {showScorecard && (
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="absolute inset-x-0 bottom-0 top-1/2 bg-white/95 backdrop-blur-md border-t border-slate-200 p-8 dark:bg-slate-950/95 dark:border-slate-800 z-10 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <BarChart3 className="text-emerald-500" />
                  Resilience Scorecard
                </h3>
                <button onClick={() => setShowScorecard(false)} className="text-slate-400 hover:text-slate-600 font-bold">Close</button>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Emotional Stability</p>
                  <p className="text-2xl font-black text-emerald-500">88%</p>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden dark:bg-slate-900">
                    <div className="h-full bg-emerald-500 w-[88%]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Technical Depth</p>
                  <p className="text-2xl font-black text-sky-500">74%</p>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden dark:bg-slate-900">
                    <div className="h-full bg-sky-500 w-[74%]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Hesitation Index</p>
                  <p className="text-2xl font-black text-rose-500">Low</p>
                  <p className="text-[10px] text-slate-500 italic">"Consistent pacing even under pressure."</p>
                </div>
              </div>
              <div className="mt-8 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <strong>Coach's Verdict</strong>: Your technical depth on distributed systems is slightly shallow. I recommend the "System Design Mastery" Skill Quest to bridge this gap and unlock the 75% threshold.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={isStressMode ? "Justify your answer immediately..." : "Type your message..."}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm outline-none transition focus:border-sky-500 dark:bg-slate-900 dark:border-slate-800"
          />
          <button 
            onClick={handleSend}
            className="rounded-2xl bg-slate-900 p-4 text-white hover:bg-slate-800 transition dark:bg-slate-100 dark:text-slate-900"
          >
            <Send size={20} />
          </button>
          <button 
            onClick={() => setShowScorecard(true)}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 px-6 py-4 text-sm font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400"
          >
            <TrendingUp size={20} />
            Analyze Performance
          </button>
        </div>
      </motion.div>
    </div>
  );
}
