import { areIntervalsOverlapping, parseISO } from "date-fns";
import type { PlantingPhase, TimelineConflict } from "@/types/domain";

export function detectConflicts(
  plantingId: string,
  phases: PlantingPhase[],
  otherPlantings: { plantingId: string; phases: PlantingPhase[] }[],
): TimelineConflict[] {
  const conflicts: TimelineConflict[] = [];

  otherPlantings.forEach((other) => {
    if (other.plantingId === plantingId) return;
    phases.forEach((phase) => {
      other.phases.forEach((otherPhase) => {
        const overlaps = areIntervalsOverlapping(
          { start: parseISO(phase.start), end: parseISO(phase.end) },
          { start: parseISO(otherPhase.start), end: parseISO(otherPhase.end) },
          { inclusive: true },
        );
        if (overlaps) {
          conflicts.push({
            plantingId,
            conflictingPlantingId: other.plantingId,
            overlapDays: 1,
          });
        }
      });
    });
  });

  return conflicts;
}
