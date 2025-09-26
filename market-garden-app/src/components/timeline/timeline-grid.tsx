"use client";

import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { useMemo } from "react";
import { clsx } from "clsx";
import { useTimelineStore, type TimelinePlanting } from "@/hooks/useTimelineStore";
import type { MoonPhaseInfo, ViewMode } from "@/types/domain";
import { PlantingCard } from "@/components/timeline/planting-card";

interface TimelineGridProps {
  dates: string[];
  plantings: TimelinePlanting[];
  moonData: Record<string, MoonPhaseInfo>;
  viewMode: ViewMode;
}

export function TimelineGrid({ dates, plantings, moonData, viewMode }: TimelineGridProps) {
  const { shiftPlanting, setDragging, resizePlanting } = useTimelineStore();

  const beds = useMemo(() => {
    const groups = new Map<string, { bed: TimelinePlanting["bed"]; plantings: TimelinePlanting[] }>();
    plantings.forEach((planting) => {
      if (!planting.bed) return;
      if (!groups.has(planting.bed_id)) {
        groups.set(planting.bed_id, { bed: planting.bed, plantings: [] });
      }
      groups.get(planting.bed_id)!.plantings.push(planting);
    });
    return Array.from(groups.values());
  }, [plantings]);

  const handleDrop = (date: string) => (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const plantingId = event.dataTransfer.getData("text/plain");
    const planting = plantings.find((p) => p.id === plantingId);
    if (!planting) return;
    const start = planting.phases[0]?.start;
    if (!start) return;
    const delta = differenceInCalendarDays(parseISO(date), parseISO(start));
    shiftPlanting(plantingId, delta);
    setDragging(null);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto scrollbar-thin">
        <div
          className="min-w-[900px]"
          data-timeline-grid
          style={{
            display: "grid",
            gridTemplateColumns: `200px repeat(${dates.length}, minmax(60px, 1fr))`,
            rowGap: "12px",
          }}
        >
          <div className="sticky left-0 z-20 bg-[var(--surface)]/95 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
            Beet
          </div>
          {dates.map((date) => {
            const info = moonData[date];
            const isWeekStart = parseISO(date).getUTCDay() === 1; // Monday
            return (
              <div
                key={date}
                className={clsx(
                  "flex flex-col items-center justify-center border-l border-[var(--border)]/40 px-2 py-1 text-xs",
                  isWeekStart && "bg-[var(--surface)]/40",
                )}
              >
                <span>{format(parseISO(date), viewMode === "day" ? "dd.MM" : "dd.MM")}</span>
                {info ? (
                  <span className="text-[10px] text-[var(--text-secondary)]">
                    {info.biodynamicType}
                  </span>
                ) : null}
              </div>
            );
          })}

          {beds.map(({ bed, plantings: rowPlantings }) => (
            <div key={bed?.id ?? "unknown"} className="contents">
              <div className="sticky left-0 z-10 flex h-full flex-col justify-center gap-1 bg-[var(--surface)]/80 px-4 py-3">
                <p className="text-lg font-semibold">{bed?.field?.name}</p>
                <p className="text-xs text-[var(--text-secondary)]">Beet {bed?.number}</p>
              </div>
              {dates.map((date) => (
                <div
                  key={`${bed?.id}-${date}`}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={handleDrop(date)}
                  className="relative h-24 border border-[var(--border)]/30 bg-[var(--surface)]/40"
                />
              ))}

              {rowPlantings.map((planting) => (
                <PlantingCard
                  key={planting.id}
                  planting={planting}
                  dates={dates}
                  onDragStart={setDragging}
                  onShift={(delta) => shiftPlanting(planting.id, delta)}
                  onResize={(edge, delta) => resizePlanting(planting.id, edge, delta)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
