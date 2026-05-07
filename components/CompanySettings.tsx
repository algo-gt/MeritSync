"use client";

import { useState } from "react";
import { Globe, RefreshCw, Edit3, Check, AlertCircle } from "lucide-react";

export default function CompanySettings() {
  const [url, setUrl] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"IDLE" | "SUCCESS" | "ERROR">("IDLE");
  const [overrideMode, setOverrideMode] = useState(false);

  const handleSync = () => {
    if (!url) return;
    setIsSyncing(true);
    setSyncStatus("IDLE");
    
    // Simulate Python Scraper trigger
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus("SUCCESS");
    }, 3000);
  };

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Company Command Center</h2>
            <p className="mt-1 text-sm text-slate-500">Configure your automated requisition ingestion engine.</p>
          </div>
          <button 
            onClick={() => setOverrideMode(!overrideMode)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
          >
            <Edit3 size={16} />
            {overrideMode ? "Exit Override" : "Manual Override"}
          </button>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Requisition Ingestion Source</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="url"
                placeholder="https://company.myworkdayjobs.com/careers"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-11 pr-4 text-sm outline-none transition focus:border-sky-500 dark:border-slate-800 dark:bg-slate-900"
              />
            </div>
            <button 
              onClick={handleSync}
              disabled={isSyncing || !url}
              className="flex items-center gap-2 rounded-2xl bg-sky-600 px-6 py-4 text-sm font-bold text-white transition hover:bg-sky-500 disabled:opacity-50"
            >
              {isSyncing ? <RefreshCw className="animate-spin" size={18} /> : "Sync Requisitions"}
            </button>
          </div>
          
          {syncStatus === "SUCCESS" && (
            <div className="flex items-center gap-2 text-sm text-emerald-500 font-medium">
              <Check size={16} />
              Requisitions synced successfully! 4 active JDs found and ingested.
            </div>
          )}
        </div>

        {overrideMode && (
          <div className="rounded-2xl bg-amber-500/5 border border-amber-500/10 p-6 space-y-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertCircle size={18} />
              <h3 className="text-sm font-bold uppercase tracking-wider">AI Gatekeeper Override</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Refine the requirements for your "Senior Backend Engineer" role to adjust the AI scoring logic.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mandatory Hard Skills</label>
                <input 
                  defaultValue="Next.js, Go, Kubernetes"
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-950" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Min. Scale (Team Size)</label>
                <input 
                  type="number"
                  defaultValue={10}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-950" 
                />
              </div>
            </div>
            <button className="rounded-xl bg-slate-900 px-6 py-2 text-sm font-bold text-white dark:bg-slate-100 dark:text-slate-950">
              Update Scorer Weights
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
