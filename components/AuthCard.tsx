"use client";

import { useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const providers = [
  { name: "Google", provider: "google", color: "bg-red-600 hover:bg-red-500 text-white" }
] as const;

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

  const handleOAuth = async (provider: string) => {
    setBusy(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider as "google",
      options: {
        redirectTo: `${window.location.origin}`
      }
    });
    setBusy(false);
    if (error) {
      setMessage(error.message);
    }
  };

  const handleSendOtp = async () => {
    if (!contact) {
      setMessage("Please enter a valid email or mobile number.");
      return;
    }
    setBusy(true);
    setMessage(null);

    const emailMode = contact.includes("@");
    setIsPhone(!emailMode);

    let error;
    if (emailMode) {
      const { error: emailError } = await supabase.auth.signInWithOtp({
        email: contact,
        options: {
          emailRedirectTo: `${window.location.origin}`
        }
      });
      error = emailError;
    } else {
      const { error: phoneError } = await supabase.auth.signInWithOtp({
        phone: contact
      });
      error = phoneError;
    }

    setBusy(false);
    if (error) {
      setMessage(error.message);
    } else {
      setShowOtpInput(true);
      if (emailMode) {
        setMessage("Magic link / OTP sent — check your inbox.");
      } else {
        setMessage("OTP sent — check your mobile messages.");
      }
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
      email: !isPhone ? contact : undefined,
      phone: isPhone ? contact : undefined,
      token: otp,
      type: isPhone ? "sms" : "email"
    } as any);

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
      <div className="grid gap-3">
        {providers.map((item) => (
          <button
            key={item.provider}
            type="button"
            className={`${buttonStyle} ${item.color} shadow-lg shadow-black/10`}
            onClick={() => handleOAuth(item.provider)}
            disabled={busy}
          >
            Continue with {item.name}
          </button>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-800/90 bg-slate-950/90 p-5">
        <label className="block text-sm font-semibold text-slate-200" htmlFor="contact">
          Email or Mobile Number
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
              placeholder="you@company.com or +1234567890"
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
