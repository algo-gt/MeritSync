"use client";

import { useState } from "react";

export default function JobSearchBar() {
  const [query, setQuery] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsScraping(true);
    setStatus("Initializing AI Web Scrapers...");

    // Simulate the trigger to the Python Scraper microservice.
    // In production, this will hit our Next.js API route which forwards to FastAPI.
    setTimeout(() => {
      setStatus(`Scraping active jobs for "${query}" across Workday, SAP, and LinkedIn...`);
      
      setTimeout(() => {
        setIsScraping(false);
        setStatus(`Successfully queued "${query}". The AI is extracting structured data in the background.`);
        setQuery("");
      }, 3000);
    }, 1500);
  };

  return (
    <section className="rounded-[2rem] border border-slate-800/90 bg-slate-900/80 p-8 shadow-soft">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-100">AI Source Engine</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Enter job titles or skills. MeritSync's AI will traverse the internet to discover, scrape, and aggregate the latest open roles.
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative mt-4 flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isScraping}
            placeholder="e.g. Senior React Developer in FinTech..."
            className="w-full rounded-2xl border border-slate-800/90 bg-slate-950 px-5 py-4 pl-12 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 disabled:opacity-60"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          <button
            type="submit"
            disabled={isScraping || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-sky-500 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isScraping ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                </svg>
                Scraping...
              </span>
            ) : (
              "Discover Jobs"
            )}
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
