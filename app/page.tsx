"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./providers";
import AuthCard from "../components/AuthCard";

export default function HomePage() {
  const { session, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && session) {
      if (!profile?.user_role) {
        router.replace("/role-selection");
      } else if (profile.user_role === "TALENT" && !profile.has_accepted_dpdp) {
        router.replace("/consent");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [loading, session, profile, router]);

  return (
    <main className="layout-shell">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-soft">
        <div className="mb-6 space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">Meritsync</p>
          <h1 className="text-3xl font-semibold text-slate-100">Secure, role-aware login</h1>
          <p className="text-slate-400">Enter your work email to receive a secure OTP. Get a tailored Talent or Employer experience.</p>
        </div>
        <AuthCard />
        {loading && <p className="mt-6 text-sm text-slate-400">Loading session...</p>}
      </div>
    </main>
  );
}
