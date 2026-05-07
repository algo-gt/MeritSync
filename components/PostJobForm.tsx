"use client";

import { useState } from "react";

export default function PostJobForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsPosting(true);
    setStatus("Analyzing job requirements and querying AI Gatekeeper...");

    // Simulate posting job and matching candidates
    setTimeout(() => {
      setStatus(`Job posted successfully! AI is currently sourcing and scoring the best-suited candidates...`);
      setIsPosting(false);
      setTitle("");
      setDescription("");
    }, 2500);
  };

  return (
    <section className="rounded-[2rem] border border-slate-800/90 bg-slate-900/80 p-8 shadow-soft">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-100">Post a Job</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Publish a requisition. The AI Gatekeeper will automatically score and present the best-suited candidates from the platform.
          </p>
        </div>

        <form onSubmit={handlePost} className="mt-4 flex flex-col gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPosting}
            placeholder="Job Title (e.g., Senior Backend Engineer)"
            className="w-full rounded-2xl border border-slate-800/90 bg-slate-950 px-5 py-4 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 disabled:opacity-60"
          />
          
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isPosting}
            placeholder="Job Description and requirements..."
            rows={4}
            className="w-full resize-none rounded-2xl border border-slate-800/90 bg-slate-950 px-5 py-4 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={isPosting || !title.trim() || !description.trim()}
            className="self-start rounded-xl bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPosting ? "Processing with AI..." : "Post Requisition"}
          </button>
        </form>

        {status && (
          <div className="rounded-xl bg-slate-950/50 p-4 text-sm text-sky-300">
            {status}
          </div>
        )}
      </div>
    </section>
  );
}
