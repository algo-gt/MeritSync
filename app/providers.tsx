"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";
import type { UserProfile } from "../lib/types";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  profile: null,
  loading: true
});

async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, user_role, onboarding_status, has_accepted_dpdp, provider_token")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Failed to load profile:", error.message);
    return null;
  }

  return data as UserProfile;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
      if (data.session?.user?.id) {
        const loaded = await fetchProfile(data.session.user.id);
        setProfile(loaded);
      }
    };

    init();

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user?.id) {
        const loaded = await fetchProfile(session.user.id);
        setProfile(loaded);
      } else {
        setProfile(null);
      }
    });

    return () => subscription?.subscription.unsubscribe();
  }, []);

  const value = useMemo(
    () => ({ session, user, profile, loading }),
    [session, user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
