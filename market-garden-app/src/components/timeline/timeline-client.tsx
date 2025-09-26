"use client";

import { useEffect, useMemo } from "react";
import { useTimelineStore, type TimelinePlanting } from "@/hooks/useTimelineStore";
import { buildDateRange, addDaysISO } from "@/lib/planning/dates";
import { getMoonPhaseInfo } from "@/lib/planning/moon";
import type { MoonPhaseInfo } from "@/types/domain";
import { TimelineToolbar } from "@/components/timeline/timeline-toolbar";
import { TimelineGrid } from "@/components/timeline/timeline-grid";

interface TimelineClientProps {
  initialPlantings: TimelinePlanting[];
}

export function TimelineClient({ initialPlantings }: TimelineClientProps) {
  const { plantings, setPlantings, viewMode, referenceDate } = useTimelineStore();

  useEffect(() => {
    setPlantings(initialPlantings);
  }, [initialPlantings, setPlantings]);

  const visibleDates = useMemo(() => {
    const span = viewMode === "week" ? 14 * 7 : 14;
    const start = addDaysISO(referenceDate, -span);
    const end = addDaysISO(referenceDate, span);
    return buildDateRange(start, end);
  }, [viewMode, referenceDate]);

  const moonData = useMemo(() => {
    return visibleDates.reduce<Record<string, MoonPhaseInfo>>((acc, date) => {
      acc[date] = getMoonPhaseInfo(date);
      return acc;
    }, {});
  }, [visibleDates]);

  return (
    <div className="space-y-6">
      <TimelineToolbar />
      <TimelineGrid
        dates={visibleDates}
        plantings={plantings}
        moonData={moonData}
        viewMode={viewMode}
      />
    </div>
  );
}
