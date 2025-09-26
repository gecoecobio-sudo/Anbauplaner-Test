import { create } from "zustand";
import { addDaysISO } from "@/lib/planning/dates";
import type { PlantingPhase, PlantingWithRelations, ViewMode } from "@/types/domain";

export interface TimelinePlanting extends PlantingWithRelations {
  phases: PlantingPhase[];
}

interface TimelineState {
  viewMode: ViewMode;
  referenceDate: string; // ISO date
  plantings: TimelinePlanting[];
  draggingPlantingId: string | null;
  selectedPlantingId: string | null;
  setViewMode: (mode: ViewMode) => void;
  setReferenceDate: (date: string) => void;
  setPlantings: (plantings: TimelinePlanting[]) => void;
  updatePlanting: (id: string, update: Partial<TimelinePlanting>) => void;
  shiftPlanting: (id: string, dayDelta: number) => void;
  resizePlanting: (id: string, edge: "start" | "end", dayDelta: number) => void;
  setDragging: (id: string | null) => void;
  setSelectedPlanting: (id: string | null) => void;
}

export const useTimelineStore = create<TimelineState>((set, get) => ({
  viewMode: "week",
  referenceDate: new Date().toISOString().slice(0, 10),
  plantings: [],
  draggingPlantingId: null,
  selectedPlantingId: null,
  setViewMode: (mode) => set({ viewMode: mode }),
  setReferenceDate: (date) => set({ referenceDate: date }),
  setPlantings: (plantings) => set({ plantings }),
  updatePlanting: (id, update) =>
    set((state) => ({
      plantings: state.plantings.map((planting) =>
        planting.id === id ? { ...planting, ...update } : planting,
      ),
    })),
  shiftPlanting: (id, dayDelta) => {
    const state = get();
    const target = state.plantings.find((p) => p.id === id);
    if (!target) return;
    const phases = target.phases.map((phase) => ({
      ...phase,
      start: addDaysISO(phase.start, dayDelta),
      end: addDaysISO(phase.end, dayDelta),
    }));
    set({
      plantings: state.plantings.map((p) =>
        p.id === id
          ? {
              ...p,
              phases,
            }
          : p,
      ),
    });
  },
  resizePlanting: (id, edge, dayDelta) => {
    if (dayDelta === 0) return;
    set((state) => ({
      plantings: state.plantings.map((planting) => {
        if (planting.id !== id) return planting;
        const phases = planting.phases.map((phase, index, array) => {
          if (edge === "start" && index === 0) {
            return {
              ...phase,
              start: addDaysISO(phase.start, dayDelta),
            };
          }
          if (edge === "end" && index === array.length - 1) {
            return {
              ...phase,
              end: addDaysISO(phase.end, dayDelta),
            };
          }
          return phase;
        });
        return { ...planting, phases };
      }),
    }));
  },
  setDragging: (id) => set({ draggingPlantingId: id }),
  setSelectedPlanting: (id) => set({ selectedPlantingId: id }),
}));
