export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      farms: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          settings: Json | null;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
          settings?: Json | null;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
          settings?: Json | null;
        };
      };
      fields: {
        Row: {
          id: string;
          farm_id: string;
          name: string;
          type: "OUTDOOR" | "GREENHOUSE" | "POLYTUNNEL";
          bed_count: number;
        };
        Insert: {
          id?: string;
          farm_id: string;
          name: string;
          type: "OUTDOOR" | "GREENHOUSE" | "POLYTUNNEL";
          bed_count: number;
        };
        Update: {
          id?: string;
          farm_id?: string;
          name?: string;
          type?: "OUTDOOR" | "GREENHOUSE" | "POLYTUNNEL";
          bed_count?: number;
        };
      };
      beds: {
        Row: {
          id: string;
          field_id: string;
          number: string;
          width: number;
          length: number;
        };
        Insert: {
          id?: string;
          field_id: string;
          number: string;
          width?: number;
          length?: number;
        };
        Update: {
          id?: string;
          field_id?: string;
          number?: string;
          width?: number;
          length?: number;
        };
      };
      crops: {
        Row: {
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
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          phases: Json;
          rows_per_bed: number;
          plant_spacing: number;
          row_spacing: number;
          seeds_per_spot?: number | null;
          seeds_per_tray?: number | null;
          yield_per_plant?: number | null;
          yield_unit: "kg" | "piece" | "bunch";
          moon_phase_preference?: string[];
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          phases?: Json;
          rows_per_bed?: number;
          plant_spacing?: number;
          row_spacing?: number;
          seeds_per_spot?: number | null;
          seeds_per_tray?: number | null;
          yield_per_plant?: number | null;
          yield_unit?: "kg" | "piece" | "bunch";
          moon_phase_preference?: string[];
        };
      };
      plantings: {
        Row: {
          id: string;
          bed_id: string;
          crop_id: string;
          phases_timeline: Json;
          plant_count: number;
          expected_yield: number | null;
          notes: string | null;
          created_by: string;
          status: "planned" | "active" | "harvesting" | "finished";
        };
        Insert: {
          id?: string;
          bed_id: string;
          crop_id: string;
          phases_timeline: Json;
          plant_count: number;
          expected_yield?: number | null;
          notes?: string | null;
          created_by: string;
          status?: "planned" | "active" | "harvesting" | "finished";
        };
        Update: {
          id?: string;
          bed_id?: string;
          crop_id?: string;
          phases_timeline?: Json;
          plant_count?: number;
          expected_yield?: number | null;
          notes?: string | null;
          created_by?: string;
          status?: "planned" | "active" | "harvesting" | "finished";
        };
      };
      tasks: {
        Row: {
          id: string;
          planting_id: string;
          type:
            | "SOW"
            | "TRANSPLANT"
            | "DIRECT_SEED"
            | "PREPARE"
            | "HARVEST_START"
            | "HARVEST_END";
          due_date: string;
          assigned_to: string | null;
          completed_at: string | null;
          completed_by: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          planting_id: string;
          type:
            | "SOW"
            | "TRANSPLANT"
            | "DIRECT_SEED"
            | "PREPARE"
            | "HARVEST_START"
            | "HARVEST_END";
          due_date: string;
          assigned_to?: string | null;
          completed_at?: string | null;
          completed_by?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          planting_id?: string;
          type?:
            | "SOW"
            | "TRANSPLANT"
            | "DIRECT_SEED"
            | "PREPARE"
            | "HARVEST_START"
            | "HARVEST_END";
          due_date?: string;
          assigned_to?: string | null;
          completed_at?: string | null;
          completed_by?: string | null;
          notes?: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          farm_id: string;
          role: "owner" | "worker";
          name: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id: string;
          farm_id: string;
          role?: "owner" | "worker";
          name: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          farm_id?: string;
          role?: "owner" | "worker";
          name?: string;
          email?: string;
          created_at?: string;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
