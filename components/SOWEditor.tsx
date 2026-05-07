"use client";

import { useState } from "react";
import { Save, FileText, Send, History, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SOWEditorProps {
  pitchId: string;
  initialContent: string;
  pitchText: string;
  onClose: () => void;
  onSave: (newContent: string) => void;
}

export default function SOWEditor({ pitchId, initialContent, pitchText, onClose, onSave }: SOWEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate Audit Log entry
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      onSave(content);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-6xl h-[80vh] flex flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-sky-500/10 p-2 text-sky-500">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">SOW Preview & Synthesis</h2>
              <p className="text-sm text-slate-500">Human-in-the-Loop Validation Phase</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <History size={20} />
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Area - Split Pane */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Pane: SOW Content */}
          <div className="flex-1 flex flex-col border-r border-slate-100 dark:border-slate-800">
            <div className="p-4 bg-slate-50/50 border-b border-slate-100 dark:bg-slate-900/50 dark:border-slate-800 flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">AI-Generated Statement of Work</span>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-bold text-sky-600 hover:text-sky-500"
              >
                {isEditing ? "View Preview" : "Edit Content"}
              </button>
            </div>
            <div className="flex-1 p-8 overflow-y-auto">
              {isEditing ? (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-full bg-transparent font-mono text-sm leading-relaxed outline-none resize-none text-slate-700 dark:text-slate-300"
                />
              ) : (
                <div className="prose prose-slate dark:prose-invert max-w-none font-sans whitespace-pre-wrap text-sm leading-relaxed">
                  {content}
                </div>
              )}
            </div>
          </div>

          {/* Right Pane: Source Data */}
          <div className="w-80 bg-slate-50 p-8 overflow-y-auto dark:bg-slate-900/50">
            <div className="space-y-8">
              <section className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Candidate's Pitch</h3>
                <div className="rounded-2xl bg-white p-4 text-xs italic text-slate-600 shadow-sm border border-slate-200 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 leading-relaxed">
                  "{pitchText}"
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Verification Check</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500">
                    <CheckCircle2 size={12} />
                    SKILL MATCH VERIFIED
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-rose-500">
                    <X size={12} />
                    GAPS EXCLUDED
                  </div>
                </div>
              </section>

              <div className="p-4 rounded-2xl bg-sky-500/5 border border-sky-500/10 text-[10px] text-slate-500 leading-relaxed">
                <strong>Legal Guardrail</strong>: Standard T&Cs from Company Settings have been automatically prepended to the final PDF.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 italic">
            {isEditing ? "Unsaved changes in editor" : "Last synthesized 2 minutes ago"}
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleSave}
              disabled={isSaving || !isEditing}
              className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition ${
                isEditing ? "bg-sky-600 text-white hover:bg-sky-500" : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              <Save size={18} />
              {isSaving ? "Saving Audit..." : "Log & Save Edits"}
            </button>
            <button 
              onClick={() => onSave(content)}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white hover:bg-slate-800 transition dark:bg-slate-100 dark:text-slate-950"
            >
              <Send size={18} />
              Finalize & Export
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
