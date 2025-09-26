import { differenceInCalendarDays } from "date-fns";
import type { PlantingPhase, Task, TaskType } from "@/types/domain";

export interface SeedRequirement {
  type: "direct" | "tray";
  seedsNeeded: number;
  unit: string;
}

interface TaskInput {
  plantingId: string;
  phases: PlantingPhase[];
  plantCount: number;
  seedsPerTray?: number | null;
  seedsPerSpot?: number | null;
}

const TASK_NOTES: Record<TaskType, string> = {
  SOW: "Aussaat vorbereiten (Trays, Etiketten, Substrat).",
  TRANSPLANT: "Pikieren/Verpflanzen ins Beet, Beete vorbereiten.",
  DIRECT_SEED: "Direktsaat – Saattiefe und Abstand beachten.",
  PREPARE: "Beet vorbereiten, Boden lockern und Kompost ausbringen.",
  HARVEST_START: "Ernte starten, Qualität dokumentieren.",
  HARVEST_END: "Ernte abschließen, Beet räumen und mulchen.",
};

export function generateTasksFromPhases({
  plantingId,
  phases,
  plantCount,
  seedsPerTray,
  seedsPerSpot,
}: TaskInput): Task[] {
  const generated: Task[] = [];

  phases.forEach((phase, index) => {
    phase.tasks.forEach((type) => {
      generated.push({
        id: `${plantingId}-${type}-${index}`,
        planting_id: plantingId,
        type,
        due_date: phase.start,
        assigned_to: null,
        completed_at: null,
        completed_by: null,
        notes: TASK_NOTES[type],
      });
    });
  });

  // Always add harvest end marker on final day if harvest phase exists
  const harvestPhase = phases.find((phase) => phase.tasks.includes("HARVEST_START"));
  if (harvestPhase) {
    generated.push({
      id: `${plantingId}-HARVEST_END`,
      planting_id: plantingId,
      type: "HARVEST_END",
      due_date: harvestPhase.end,
      assigned_to: null,
      completed_at: null,
      completed_by: null,
      notes: TASK_NOTES.HARVEST_END,
    });
  }

  // Add optional preparation task on earliest phase start
  const earliest = phases.reduce((min, phase) =>
    !min || phase.start < min ? phase.start : min,
  "");
  if (earliest) {
    generated.unshift({
      id: `${plantingId}-PREPARE`,
      planting_id: plantingId,
      type: "PREPARE",
      due_date: earliest,
      assigned_to: null,
      completed_at: null,
      completed_by: null,
      notes: TASK_NOTES.PREPARE,
    });
  }

  // Add metadata for seeds on sowing tasks
  generated.forEach((task) => {
    if (task.type === "SOW" || task.type === "DIRECT_SEED") {
      const seedInfo = calculateSeedRequirements({
        type: task.type === "SOW" ? "tray" : "direct",
        plantCount,
        seedsPerTray: seedsPerTray ?? null,
        seedsPerSpot: seedsPerSpot ?? null,
      });
      if (seedInfo) {
        task.notes = `${task.notes} Saatgut: ${seedInfo.seedsNeeded.toFixed(0)} ${seedInfo.unit}.`;
      }
    }
  });

  return generated;
}

export function calculateSeedRequirements({
  type,
  plantCount,
  seedsPerTray,
  seedsPerSpot,
}: {
  type: "direct" | "tray";
  plantCount: number;
  seedsPerTray: number | null;
  seedsPerSpot: number | null;
}): SeedRequirement | null {
  if (type === "tray") {
    if (!seedsPerTray || seedsPerTray <= 0) return null;
    const seedsNeeded = plantCount * seedsPerTray * 1.1; // 10% Verlustpuffer
    return { type, seedsNeeded, unit: "Samen" };
  }

  if (!seedsPerSpot || seedsPerSpot <= 0) return null;
  const seedsNeeded = plantCount * seedsPerSpot * 1.2; // 20% Puffer für Direktsaat
  return { type, seedsNeeded, unit: "Samen" };
}

export function detectPhaseOverlap(phases: PlantingPhase[]): number {
  if (phases.length < 2) return 0;
  let overlap = 0;

  for (let i = 1; i < phases.length; i += 1) {
    const prev = phases[i - 1];
    const current = phases[i];
    const diff = differenceInCalendarDays(new Date(prev.end), new Date(current.start));
    if (diff >= 0) {
      overlap += diff + 1;
    }
  }

  return overlap;
}
