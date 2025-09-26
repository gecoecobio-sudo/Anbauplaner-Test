"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface DashboardShellProps {
  children: ReactNode;
  profile: any;
}

const NAV_ITEMS = [
  { href: "/timeline", label: "Timeline" },
  { href: "/tasks", label: "Aufgaben" },
  { href: "/settings", label: "Betrieb" },
];

export function DashboardShell({ children, profile }: DashboardShellProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-[var(--text-primary)] flex flex-col">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-lg sticky top-0 z-50">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[var(--accent-green)]">{profile?.farm?.name ?? "Dein Hof"}</p>
            <h1 className="text-2xl font-semibold">Market Garden Cockpit</h1>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-4 text-sm">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 transition ${
                    pathname === item.href ? "bg-[var(--accent-green)] text-black" : "hover:bg-[var(--surface)]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="text-right">
              <p className="text-sm font-medium">{profile?.name ?? "Unbekannt"}</p>
              <p className="text-xs text-[var(--text-secondary)]">{profile?.role ?? "Mitarbeiter"}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-[var(--border)] px-4 py-2 text-sm hover:border-[var(--accent-green)]"
            >
              Abmelden
            </button>
          </div>
        </div>
        <nav className="md:hidden px-6 pb-4 flex gap-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 rounded-full px-4 py-2 text-center text-sm transition ${
                pathname === item.href ? "bg-[var(--accent-green)] text-black" : "bg-[var(--surface)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-10">{children}</div>
      </main>
    </div>
  );
}
