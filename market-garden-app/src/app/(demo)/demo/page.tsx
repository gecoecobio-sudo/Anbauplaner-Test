import { TimelineClient } from "@/components/timeline/timeline-client";
import { demoPlantings } from "@/data/demo";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-dark)] px-4 py-10 text-[var(--text-primary)]">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-2 text-center">
          <h1 className="text-4xl font-semibold">Demo: Market Garden Timeline</h1>
          <p className="text-[var(--text-secondary)]">
            Interaktive Vorschau mit drei typischen Pflanzungen. Anmeldung notwendig, um eigene Daten zu speichern.
          </p>
        </header>
        <TimelineClient initialPlantings={demoPlantings as any} />
      </div>
    </div>
  );
}
