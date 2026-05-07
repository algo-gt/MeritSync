"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../providers";

const consentVersion = "DPDP 2023 - v1";

export default function ConsentPage() {
  const { profile, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  if (loading) {
    return <div className="layout-shell">Loading…</div>;
  }

  if (profile?.user_role !== "TALENT") {
    router.replace("/dashboard");
    return null;
  }

  const handleAccept = async () => {
    setBusy(true);
    setMessage(null);
    const response = await fetch("/api/compliance/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ consent_version: consentVersion })
    });
    setBusy(false);
    if (response.ok) {
      router.push("/dashboard");
    } else {
      const data = await response.json();
      setMessage(data?.error ?? "Unable to record consent.");
    }
  };

  return (
    <main className="layout-shell">
      <div className="relative w-full max-w-3xl rounded-[2rem] border border-white/10 bg-slate-950/90 p-10 shadow-soft">
        <div className="absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r from-sky-500 to-emerald-400" />
        <div className="space-y-6 pb-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-sky-300/80">Compliance gate</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-100">DPDP 2023 Consent Required</h1>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300">
              {consentVersion}
            </span>
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-800/90 bg-slate-900/80 p-6 text-sm leading-7 text-slate-300">
            <p>
              As a Talent user, Meritsync requires your explicit consent for AI processing of your professional data. This includes LLM-based resume parsing, scoring, and skill matching.
            </p>
            <p>
              Purpose of Processing: Analyze your resume for role suitability, generate career insights, and provide tailored job feed recommendations using large language models.
            </p>
            <p>
              We will store the consent event in our audit ledger and only enable the Omni-Feed and Resume Upload once consent is active.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800/90 bg-slate-950/80 p-5 text-sm text-slate-400">
            <p className="font-semibold text-slate-100">What you are consenting to</p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>LLM-driven resume scoring and feedback.</li>
              <li>Storage of consent metadata for regulatory audit.</li>
              <li>Access restriction until consent is granted.</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">This modal cannot be dismissed until consent is recorded.</p>
          <button
            type="button"
            onClick={handleAccept}
            disabled={busy}
            className="rounded-2xl bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Accept and continue
          </button>
        </div>
        {message ? <p className="mt-4 text-sm text-rose-300">{message}</p> : null}
      </div>
    </main>
  );
}
