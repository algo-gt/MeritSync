"use client";

import { useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AuthCard() {
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const buttonStyle = useMemo(
    () =>
      "inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400",
    []
  );


  const handleSendOtp = async () => {
    if (!contact || !contact.includes("@")) {
      setMessage("Please enter a valid email address.");
      return;
    }
    setBusy(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email: contact,
      options: {
        emailRedirectTo: `${window.location.origin}`
      }
    });

    setBusy(false);
    if (error) {
      setMessage(error.message);
    } else {
      setShowOtpInput(true);
      setMessage("OTP code sent — check your inbox.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }
    setBusy(true);
    setMessage(null);

    const { error } = await supabase.auth.verifyOtp({
      email: contact,
      token: otp,
      type: "email"
    });

    setBusy(false);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Successfully authenticated!");
      // The auth state change listener in page.tsx will handle the redirect
    }
  };

  return (
    <section className="space-y-6">

      <div className="rounded-3xl border border-slate-800/90 bg-slate-950/90 p-5">
        <label className="block text-sm font-semibold text-slate-200" htmlFor="contact">
          Work Email
        </label>
        <div className="mt-3 flex flex-col gap-3">
          <div className="flex gap-3">
            <input
              id="contact"
              type="text"
              autoComplete="username"
              value={contact}
              onChange={(event) => {
                setContact(event.target.value);
                setShowOtpInput(false);
                setMessage(null);
              }}
              className="w-full rounded-2xl border border-slate-800/90 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              placeholder="you@company.com"
              disabled={showOtpInput && busy}
            />
            {!showOtpInput && (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={busy || !contact}
                className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Send
              </button>
            )}
          </div>
          
          {showOtpInput && (
            <div className="mt-2 flex gap-3">
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                className="w-full rounded-2xl border border-slate-800/90 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                placeholder="Enter 6-digit OTP"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={busy || !otp}
                className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Verify
              </button>
            </div>
          )}
        </div>
      </div>

      {message ? <p className="text-sm text-slate-300">{message}</p> : null}
    </section>
  );
}
