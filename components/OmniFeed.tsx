"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import JobCard from "./JobCard";
import { GapReportModal, FreelancePitchModal } from "./TalentModals";

const MOCK_JOBS = [
  {
    id: "1",
    title: "Senior Fullstack Engineer",
    company: "Stripe",
    location: "San Francisco, CA",
    source: "Workday",
    snippet: "Your experience with Next.js is a 100% match for this role. Leading payment systems at scale.",
    score: 82
  },
  {
    id: "2",
    title: "Backend Specialist",
    company: "Vercel",
    location: "Remote",
    source: "LinkedIn",
    snippet: "Strong match for Serverless functions. Lacks direct Team Lead experience for this senior slot.",
    score: 68
  },
  {
    id: "3",
    title: "Frontend Developer",
    company: "Linear",
    location: "New York, NY",
    source: "SAP",
    snippet: "High-density UI experience is valued. Domain mismatch in project management software.",
    score: 54
  },
  {
    id: "4",
    title: "React Native Engineer",
    company: "Coinbase",
    location: "London, UK",
    source: "Workday",
    snippet: "Mobile expertise matches perfectly. Previous Fintech experience is a significant bonus.",
    score: 79
  }
];

export default function OmniFeed() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "QUALIFIED" | "FLEX">("ALL");
  const [modalState, setModalState] = useState<{
    type: "REPORT" | "PITCH" | null;
    data: any;
  }>({ type: null, data: null });

  const filteredJobs = useMemo(() => {
    return MOCK_JOBS.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           job.company.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (filterType === "QUALIFIED") return matchesSearch && job.score >= 75;
      if (filterType === "FLEX") return matchesSearch && job.score >= 60 && job.score < 75;
      return matchesSearch;
    });
  }, [searchQuery, filterType]);

  const handleAction = (action: "APPLY" | "PITCH" | "REPORT", data: any) => {
    if (action === "APPLY") {
      alert(`Initiating application for ${data.title} at ${data.company}...`);
    } else {
      setModalState({ type: action as any, data: { job_id: data.id, ...data } });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search jobs, companies, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-sky-500 dark:border-slate-800 dark:bg-slate-950"
          />
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setFilterType("ALL")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              filterType === "ALL" ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950" : "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400"
            }`}
          >
            All Jobs
          </button>
          <button 
            onClick={() => setFilterType("QUALIFIED")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              filterType === "QUALIFIED" ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400"
            }`}
          >
            Qualified
          </button>
          <button 
            onClick={() => setFilterType("FLEX")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              filterType === "FLEX" ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400"
            }`}
          >
            Freelance Flex
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {filteredJobs.map(job => (
          <JobCard key={job.id} job={job} onAction={handleAction} />
        ))}
      </div>

      <GapReportModal 
        isOpen={modalState.type === "REPORT"} 
        onClose={() => setModalState({ type: null, data: null })} 
        data={modalState.data} 
      />
      
      <FreelancePitchModal 
        isOpen={modalState.type === "PITCH"} 
        onClose={() => setModalState({ type: null, data: null })} 
        data={modalState.data} 
      />

      {filteredJobs.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-slate-500">No jobs found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
