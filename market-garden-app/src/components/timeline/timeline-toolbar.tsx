"use client";

import { useMemo } from "react";
import { useTimelineStore } from "@/hooks/useTimelineStore";
import { addDaysISO, formatDisplayDate } from "@/lib/planning/dates";

const VIEW_LABELS: Record<"week" | "day", string> = {
  week: "KW-Ansicht",
  day: "Tagesansicht",
};

export function TimelineToolbar() {
  const { viewMode, setViewMode, referenceDate, setReferenceDate } = useTimelineStore();

  const chips = useMemo(
    () => [
      { mode: "week" as const, label: VIEW_LABELS.week },
      { mode: "day" as const, label: VIEW_LABELS.day },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)]/70 p-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.45em] text-[var(--text-secondary)]">Aktuelle Referenz</p>
        <p className="text-2xl font-semibold">{formatDisplayDate(referenceDate, viewMode)}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-[var(--border)] px-2 py-1">
          {chips.map((chip) => (
            <button
              key={chip.mode}
              type="button"
              onClick={() => setViewMode(chip.mode)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                viewMode === chip.mode ? "bg-[var(--accent-green)] text-black" : "text-[var(--text-secondary)]"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-full border border-[var(--border)] px-3 py-2 text-sm"
            onClick={() => setReferenceDate(addDaysISO(referenceDate, viewMode === "week" ? -7 : -1))}
          >
            Zurück
          </button>
          <button
            type="button"
            className="rounded-full border border-[var(--border)] px-3 py-2 text-sm"
            onClick={() => setReferenceDate(new Date().toISOString().slice(0, 10))}
          >
            Heute
          </button>
          <button
            type="button"
            className="rounded-full border border-[var(--border)] px-3 py-2 text-sm"
            onClick={() => setReferenceDate(addDaysISO(referenceDate, viewMode === "week" ? 7 : 1))}
          >
            Weiter
          </button>
        </div>
      </div>
    </div>
  );
}
