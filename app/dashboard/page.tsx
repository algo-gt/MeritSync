"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../providers";
import ResumeUpload from "../../components/ResumeUpload";
import JobSearchBar from "../../components/JobSearchBar";
import PostJobForm from "../../components/PostJobForm";
import EmployerMarketplace from "../../components/EmployerMarketplace";
import OmniFeed from "../../components/OmniFeed";
import ResumeUpskiller from "../../components/ResumeUpskiller";
import CompanySettings from "../../components/CompanySettings";
import CandidateLeaderboard from "../../components/CandidateLeaderboard";
import ComplianceDashboard from "../../components/ComplianceDashboard";
import AppealReview from "../../components/AppealReview";
import { useState } from "react";
import { Briefcase, Users, Shield, Settings, AlertTriangle } from "lucide-react";

export default function DashboardPage() {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const [employerTab, setEmployerTab] = useState<"REQUISITIONS" | "TALENT" | "APPEALS" | "COMPLIANCE" | "SETTINGS">("REQUISITIONS");

  useEffect(() => {
    if (!loading && !profile) {
      router.replace("/");
    }
  }, [loading, profile, router]);

  if (loading) {
    return <div className="layout-shell">Loading…</div>;
  }

  return (
    <main className="layout-shell">
      <div className="w-full max-w-4xl rounded-[2rem] border border-white/10 bg-slate-950/90 p-10 shadow-soft">
        <div className="mb-8 grid gap-6 md:grid-cols-[1.6fr_1fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-sky-300/80">Welcome back</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-100">Your onboarding dashboard</h1>
            <p className="mt-3 text-slate-400">
              {profile?.user_role === "TALENT"
                ? "Upload your resume to begin AI suitability scoring and activate the Omni-Feed."
                : "Employer access is ready. Use candidate feeds and team workflows once your profile is complete."}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-800/90 bg-slate-900/80 p-6 text-sm text-slate-300">
            <p className="font-semibold text-slate-100">Status</p>
            <dl className="mt-4 space-y-3">
              <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3">
                <dt>Role</dt>
                <dd>{profile?.user_role ?? "Pending"}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3">
                <dt>Consent</dt>
                <dd>{profile?.has_accepted_dpdp ? "Accepted" : "Required"}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 pt-3">
                <dt>Onboarding</dt>
                <dd>{profile?.onboarding_status}</dd>
              </div>
            </dl>
          </div>
        </div>

        {profile?.user_role === "TALENT" ? (
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
              <div className="space-y-6">
                <ResumeUpload />
                <ResumeUpskiller />
              </div>
              <div className="space-y-6">
                <JobSearchBar />
                <OmniFeed />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <nav className="flex gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
              {[
                { id: "REQUISITIONS", label: "Requisitions", icon: Briefcase },
                { id: "TALENT", label: "Talent Pool", icon: Users },
                { id: "APPEALS", label: "Appeals", icon: AlertTriangle },
                { id: "COMPLIANCE", label: "Compliance", icon: Shield },
                { id: "SETTINGS", label: "Settings", icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setEmployerTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-bold transition rounded-xl ${
                    employerTab === tab.id ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="mt-8">
              {employerTab === "REQUISITIONS" && (
                <div className="space-y-8">
                  <PostJobForm />
                  <EmployerMarketplace />
                </div>
              )}
              {employerTab === "TALENT" && <CandidateLeaderboard />}
              {employerTab === "APPEALS" && <AppealReview />}
              {employerTab === "COMPLIANCE" && <ComplianceDashboard />}
              {employerTab === "SETTINGS" && <CompanySettings />}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
