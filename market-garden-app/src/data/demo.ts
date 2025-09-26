import { addDays } from "date-fns";
import { researchCrops } from "@/data/crops";
import type { PlantingPhase } from "@/types/domain";

const today = new Date();

function phaseDates(offsetStart: number, durations: number[]): PlantingPhase[] {
  let cursor = addDays(today, offsetStart);
  return durations.map((duration, index) => {
    const start = cursor;
    const end = addDays(cursor, duration);
    cursor = addDays(cursor, duration + 1);
    const labels = ["Anzucht", "Wachstum", "Ernte"];
    return {
      key: `${offsetStart}-${index}`,
      name: labels[index] ?? `Phase ${index + 1}`,
      start: start.toISOString().slice(0, 10),
      end: end.toISOString().slice(0, 10),
      tasks: index === 0 ? ["SOW"] : index === 1 ? ["TRANSPLANT"] : ["HARVEST_START"],
      color: index === 0 ? "phase-anzucht" : index === 1 ? "phase-wachstum" : "phase-ernte",
    };
  });
}

export const demoBeds = [
  {
    id: "bed-1",
    field: { id: "field-1", name: "Freiland", type: "OUTDOOR", farm_id: "demo-farm", bed_count: 6 },
    field_id: "field-1",
    number: "1",
    width: 80,
    length: 2500,
  },
  {
    id: "bed-2",
    field: { id: "field-1", name: "Freiland", type: "OUTDOOR", farm_id: "demo-farm", bed_count: 6 },
    field_id: "field-1",
    number: "2",
    width: 80,
    length: 2500,
  },
  {
    id: "bed-3",
    field: { id: "field-2", name: "Gewächshaus 1", type: "GREENHOUSE", farm_id: "demo-farm", bed_count: 4 },
    field_id: "field-2",
    number: "3",
    width: 80,
    length: 2000,
  },
];

const [salad, carrot, tomato] = researchCrops;

export const demoPlantings = [
  {
    id: "planting-1",
    bed_id: "bed-1",
    crop_id: salad.id,
    plant_count: 480,
    expected_yield: 180,
    notes: "Salat für Wochenmarkt",
    created_by: "demo-user",
    status: "active" as const,
    phases_timeline: [],
    phases: phaseDates(-7, [21, 35, 10]),
    crop: salad,
    bed: demoBeds[0],
  },
  {
    id: "planting-2",
    bed_id: "bed-2",
    crop_id: carrot.id,
    plant_count: 800,
    expected_yield: 440,
    notes: null,
    created_by: "demo-user",
    status: "planned" as const,
    phases_timeline: [],
    phases: phaseDates(5, [0, 75, 14]),
    crop: carrot,
    bed: demoBeds[1],
  },
  {
    id: "planting-3",
    bed_id: "bed-3",
    crop_id: tomato.id,
    plant_count: 120,
    expected_yield: 360,
    notes: "Stabtomaten Sorte Matina",
    created_by: "demo-user",
    status: "harvesting" as const,
    phases_timeline: [],
    phases: phaseDates(-30, [42, 65, 45]),
    crop: tomato,
    bed: demoBeds[2],
  },
];
