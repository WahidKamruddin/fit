import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseConfig/client";

// Sign in with Google (redirects to Google, then back to /dashboard)
export async function googleSignIn() {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
}

// Log out
export async function logOut() {
  await supabase.auth.signOut();
}

// User hook — returns current Supabase User or null
export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Hydrate from existing session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth state changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return user;
}
