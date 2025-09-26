import type { Json } from "@/types/database";

export type PhaseType = "Anzucht" | "Wachstum" | "Ernte" | "Custom";

export interface PhaseTemplate {
  key: string;
  name: string;
  color: string;
  tasks: TaskType[];
  defaultDurationDays: number;
}

export type TaskType =
  | "SOW"
  | "TRANSPLANT"
  | "DIRECT_SEED"
  | "PREPARE"
  | "HARVEST_START"
  | "HARVEST_END";

export interface PlantingPhase {
  key: string;
  name: string;
  start: string;
  end: string;
  tasks: TaskType[];
  color: string;
}

export type PlantingStatus = "planned" | "active" | "harvesting" | "finished";

export interface PlantingWithRelations {
  id: string;
  crop_id: string;
  bed_id: string;
  plant_count: number;
  expected_yield: number | null;
  notes: string | null;
  created_by: string;
  status: PlantingStatus;
  phases_timeline: Json;
  crop?: Crop;
  bed?: BedWithField;
}

export interface CropPhaseModel {
  key: string;
  label: string;
  phases: PhaseTemplate[];
}

export interface Crop {
  id: string;
  name: string;
  category: string;
  phases: Json;
  rows_per_bed: number;
  plant_spacing: number;
  row_spacing: number;
  seeds_per_spot: number | null;
  seeds_per_tray: number | null;
  yield_per_plant: number | null;
  yield_unit: "kg" | "piece" | "bunch";
  moon_phase_preference: string[];
}

export interface BedWithField {
  id: string;
  field_id: string;
  number: string;
  width: number;
  length: number;
  field: Field;
}

export interface Field {
  id: string;
  farm_id: string;
  name: string;
  type: "OUTDOOR" | "GREENHOUSE" | "POLYTUNNEL";
  bed_count: number;
}

export interface Farm {
  id: string;
  name: string;
  created_at: string;
  settings: Json | null;
}

export interface Task {
  id: string;
  planting_id: string;
  type: TaskType;
  due_date: string;
  assigned_to: string | null;
  completed_at: string | null;
  completed_by: string | null;
  notes: string | null;
  planting?: PlantingWithRelations;
}

export interface TimelineConflict {
  plantingId: string;
  conflictingPlantingId: string;
  overlapDays: number;
}

export type ViewMode = "week" | "day";

export interface MoonPhaseInfo {
  phase: "new" | "waxing" | "full" | "waning";
  illuminatedFraction: number;
  biodynamicType: "root" | "leaf" | "flower" | "fruit";
}
