import Link from "next/link";
import { Suspense } from "react";
import { LoginButton } from "@/components/ui/login-button";

export function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-dark)] text-[var(--text-primary)] flex flex-col items-center justify-center px-6 py-16">
      <div className="glass-panel max-w-4xl w-full rounded-3xl p-10 md:p-16 space-y-12 text-center">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent-green)]">Market Garden Toolkit</p>
          <h1 className="text-4xl md:text-5xl font-semibold">
            Intelligente Anbauplanung für Selbstpflück-Betriebe
          </h1>
          <p className="text-[var(--text-secondary)] text-lg md:text-xl">
            Plane Beete, Aufgaben und Ernten mit einer interaktiven Timeline, automatisierten Aufgaben und
            Mondkalender-Integration. Optimiert für Teams, Gewächshaus & Freiland.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 text-left">
          {[
            {
              title: "Drag & Drop Timeline",
              description: "Pflanzungen visualisieren, verschieben und skalieren – inklusive Mehrbeet-Zuweisung.",
            },
            {
              title: "Automatische Aufgaben",
              description: "Erhalte fertige To-Do-Listen basierend auf Phasen, Mondphasen und Ertragszielen.",
            },
            {
              title: "Multi-Tenant Sicherheit",
              description: "RLS-Policies schützen deine Daten – ideal für mehrere Betriebe oder Höfe.",
            },
          ].map((feature) => (
            <article key={feature.title} className="rounded-2xl border border-[var(--border)]/60 bg-black/20 p-6">
              <h2 className="text-xl font-semibold mb-2 text-[var(--accent-green)]">{feature.title}</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">{feature.description}</p>
            </article>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4">
          <Suspense fallback={<span className="text-sm text-[var(--text-secondary)]">Lade Auth …</span>}>
            <LoginButton />
          </Suspense>
          <Link href="/demo" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-green)]">
            Demo-Daten ansehen →
          </Link>
        </div>
      </div>
    </main>
  );
}
