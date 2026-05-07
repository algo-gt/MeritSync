"use client";

import { AuthProvider } from "./providers";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}