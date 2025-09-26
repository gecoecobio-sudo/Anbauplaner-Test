"use client";

import { differenceInCalendarDays, parseISO } from "date-fns";
import { clsx } from "clsx";
import { useMemo } from "react";
import type { TimelinePlanting } from "@/hooks/useTimelineStore";

interface PlantingCardProps {
  planting: TimelinePlanting;
  dates: string[];
  onDragStart: (id: string | null) => void;
  onShift: (delta: number) => void;
  onResize: (edge: "start" | "end", delta: number) => void;
}

export function PlantingCard({ planting, dates, onDragStart, onShift, onResize }: PlantingCardProps) {
  const { columnStart, columnSpan, phases } = useMemo(() => {
    const start = planting.phases[0]?.start ?? dates[0];
    const end = planting.phases[planting.phases.length - 1]?.end ?? dates.at(-1)!;
    const startIndexCandidate = dates.findIndex((date) => date >= start);
    const startIndex = startIndexCandidate === -1 ? 0 : Math.max(0, startIndexCandidate);
    const endIndexCandidate = dates.findIndex((date) => date >= end);
    const endIndex = endIndexCandidate === -1 ? dates.length - 1 : Math.max(startIndex, endIndexCandidate);
    const span = Math.max(1, endIndex - startIndex + 1);
    return {
      columnStart: startIndex + 2,
      columnSpan: span,
      phases: planting.phases,
    };
  }, [planting.phases, dates]);

  const totalDays = useMemo(() => {
    const start = planting.phases[0]?.start ?? dates[0];
    const end = planting.phases[planting.phases.length - 1]?.end ?? dates.at(-1)!;
    return Math.max(1, differenceInCalendarDays(parseISO(end), parseISO(start)) + 1);
  }, [planting.phases, dates]);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("text/plain", planting.id);
    onDragStart(planting.id);
  };

  const handleDragEnd = () => onDragStart(null);

  const handleKeyMove = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      onShift(-1);
    }
    if (event.key === "ArrowRight") {
      onShift(1);
    }
  };

  const handleResizePointer = (edge: "start" | "end") => (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const originX = event.clientX;
    const grid = (event.currentTarget.ownerDocument?.querySelector("[data-timeline-grid]") as HTMLElement) ?? null;
    const gridRect = grid?.getBoundingClientRect();
    const dayWidth = gridRect ? (gridRect.width - 200) / dates.length : 60;
    let previousDelta = 0;

    const onMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - originX;
      const dayDelta = Math.round(dx / dayWidth);
      if (dayDelta !== previousDelta) {
        onResize(edge, dayDelta - previousDelta);
        previousDelta = dayDelta;
      }
    };

    const onUp = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyMove}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={clsx(
        "relative flex h-24 cursor-grab items-stretch overflow-hidden rounded-2xl border-2 border-transparent shadow-lg transition", 
        "focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[var(--accent-green)]",
      )}
      style={{ gridColumn: `${columnStart} / span ${columnSpan}` }}
    >
      <button
        type="button"
        className="absolute left-1 top-1 z-10 rounded-full bg-black/40 px-2 py-1 text-[10px] text-[var(--text-secondary)]"
        onPointerDown={handleResizePointer("start")}
      >
        ⟨
      </button>
      <button
        type="button"
        className="absolute right-1 top-1 z-10 rounded-full bg-black/40 px-2 py-1 text-[10px] text-[var(--text-secondary)]"
        onPointerDown={handleResizePointer("end")}
      >
        ⟩
      </button>
      <div className="flex flex-1">
        {phases.map((phase) => (
          <div
            key={phase.key}
            className={clsx("flex flex-1 flex-col justify-between border-r border-white/10 p-2 text-xs", phase.color)}
            style={{ flexBasis: `${100 / phases.length}%` }}
          >
            <div>
              <p className="font-semibold uppercase tracking-[0.15em]">{phase.name}</p>
              <p>{phase.start} → {phase.end}</p>
            </div>
            <div className="text-[10px] text-black/70">
              Tasks: {phase.tasks.join(", ")}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/70">
        <span>{planting.crop?.name ?? "Unbekannt"}</span>
        <span>{totalDays} Tage</span>
      </div>
    </div>
  );
}
