import type { CropPhaseModel } from "@/types/domain";

export const PHASE_MODELS: Record<string, CropPhaseModel> = {
  anzucht: {
    key: "anzucht",
    label: "Anzucht & Pflanzung",
    phases: [
      {
        key: "seedling",
        name: "Anzucht",
        color: "phase-anzucht",
        tasks: ["SOW"],
        defaultDurationDays: 21,
      },
      {
        key: "grow",
        name: "Wachstum",
        color: "phase-wachstum",
        tasks: ["TRANSPLANT"],
        defaultDurationDays: 45,
      },
      {
        key: "harvest",
        name: "Ernte",
        color: "phase-ernte",
        tasks: ["HARVEST_START"],
        defaultDurationDays: 21,
      },
    ],
  },
  direktsaat: {
    key: "direktsaat",
    label: "Direktsaat",
    phases: [
      {
        key: "grow",
        name: "Wachstum",
        color: "phase-wachstum",
        tasks: ["DIRECT_SEED"],
        defaultDurationDays: 42,
      },
      {
        key: "harvest",
        name: "Ernte",
        color: "phase-ernte",
        tasks: ["HARVEST_START"],
        defaultDurationDays: 21,
      },
    ],
  },
  custom: {
    key: "custom",
    label: "Benutzerdefiniert",
    phases: [],
  },
};
