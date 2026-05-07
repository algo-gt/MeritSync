"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../providers";

const roles = [
  { label: "Talent", value: "TALENT" },
  { label: "Employer", value: "EMPLOYER" }
] as const;

export default function RoleSelectionPage() {
  const { session, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"TALENT" | "EMPLOYER" | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!selectedRole || !session) {
      setMessage("Select a role to continue.");
      return;
    }

    setBusy(true);
    setMessage(null);
    const providerToken = session.provider_token ?? null;
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: selectedRole, provider_token: providerToken })
    });

    setBusy(false);
    if (response.ok) {
      router.push(selectedRole === "TALENT" ? "/consent" : "/dashboard");
    } else {
      const data = await response.json();
      setMessage(data?.error ?? "Could not save role.");
    }
  };

  if (loading) {
    return <div className="layout-shell">Loading…</div>;
  }

  return (
    <main className="layout-shell">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-slate-950/90 p-8 shadow-soft">
        <div className="mb-8 space-y-4">
          <p className="text-sm uppercase tracking-[0.32em] text-sky-300/80">Role selection</p>
          <h1 className="text-3xl font-semibold text-slate-100">Choose your primary account type</h1>
          <p className="text-slate-400">This determines your onboarding flow and privacy guardrails.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {roles.map((role) => (
            <button
              key={role.value}
              type="button"
              onClick={() => setSelectedRole(role.value)}
              className={`rounded-[1.5rem] border px-6 py-5 text-left transition ${
                selectedRole === role.value
                  ? "border-sky-400 bg-sky-500/10 text-sky-200 shadow-lg shadow-sky-500/10"
                  : "border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-600"
              }`}
            >
              <span className="block text-xl font-semibold">{role.label}</span>
              <span className="mt-2 block text-sm text-slate-400">
                {role.value === "TALENT"
                  ? "Personalize your resume scoring and AI career assistant."
                  : "Access employer workflow, candidate analysis, and role management."}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">Role selection is mandatory for a tailored Meritsync experience.</p>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={busy}
            className="rounded-2xl bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Continue
          </button>
        </div>
        {message ? <p className="mt-4 text-sm text-rose-300">{message}</p> : null}
      </div>
    </main>
  );
}
