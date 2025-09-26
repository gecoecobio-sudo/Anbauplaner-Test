"use client";

import { useTransition } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginButton() {
  const [pending, startTransition] = useTransition();

  const handleLogin = () => {
    startTransition(async () => {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    });
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      disabled={pending}
      className="px-6 py-3 rounded-full bg-[var(--accent-green)] text-black font-semibold transition hover:bg-emerald-400 disabled:opacity-60"
    >
      {pending ? "Weiterleiten …" : "Mit Google anmelden"}
    </button>
  );
}
