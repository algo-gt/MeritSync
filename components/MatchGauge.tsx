"use client";

import { motion } from "framer-motion";

interface MatchGaugeProps {
  score: number;
}

export default function MatchGauge({ score }: MatchGaugeProps) {
  // Normalize score between 0 and 100
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  
  // Color logic based on thresholds
  let color = "stroke-rose-500";
  let label = "Gated";
  
  if (normalizedScore >= 75) {
    color = "stroke-emerald-500";
    label = "Qualified";
  } else if (normalizedScore >= 60) {
    color = "stroke-amber-500";
    label = "Flex";
  }

  // SVG parameters for a semi-circle
  const radius = 32;
  const strokeWidth = 8;
  const circumference = radius * Math.PI; // Full circumference for a half-circle
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-16 w-32 overflow-hidden">
        <svg className="h-32 w-32 -rotate-180" viewBox="0 0 80 80">
          {/* Background circle */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            className="text-slate-100 dark:text-slate-800"
          />
          {/* Foreground circle (progress) */}
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={`${color}`}
            style={{ strokeLinecap: "round" }}
          />
        </svg>
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end">
          <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{normalizedScore}%</span>
        </div>
      </div>
      <span className={`mt-1 text-[10px] font-bold uppercase tracking-wider ${color.replace("stroke-", "text-")}`}>
        {label}
      </span>
    </div>
  );
}
