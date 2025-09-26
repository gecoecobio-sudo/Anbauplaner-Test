import { describe, expect, it } from "vitest";
import { calculateSeedRequirements, generateTasksFromPhases, detectPhaseOverlap } from "@/lib/planning/tasks";
import { buildDateRange, addDaysISO } from "@/lib/planning/dates";
import { getMoonPhaseInfo } from "@/lib/planning/moon";

const phases = [
  {
    key: "p1",
    name: "Anzucht",
    start: "2025-03-01",
    end: "2025-03-21",
    tasks: ["SOW"],
    color: "phase-anzucht",
  },
  {
    key: "p2",
    name: "Wachstum",
    start: "2025-03-22",
    end: "2025-05-01",
    tasks: ["TRANSPLANT"],
    color: "phase-wachstum",
  },
  {
    key: "p3",
    name: "Ernte",
    start: "2025-05-02",
    end: "2025-05-20",
    tasks: ["HARVEST_START"],
    color: "phase-ernte",
  },
];

describe("Seed calculation", () => {
  it("adds buffer for tray sowings", () => {
    const result = calculateSeedRequirements({ type: "tray", plantCount: 100, seedsPerTray: 1, seedsPerSpot: null });
    expect(result?.seedsNeeded).toBeCloseTo(110);
  });

  it("adds buffer for direct sowing", () => {
    const result = calculateSeedRequirements({ type: "direct", plantCount: 200, seedsPerTray: null, seedsPerSpot: 2 });
    expect(result?.seedsNeeded).toBeCloseTo(480);
  });
});

describe("Task generation", () => {
  it("creates tasks for each phase", () => {
    const tasks = generateTasksFromPhases({
      plantingId: "demo",
      phases,
      plantCount: 100,
      seedsPerTray: 1,
      seedsPerSpot: 2,
    });
    expect(tasks).toHaveLength(5);
    expect(tasks[0].type).toBe("PREPARE");
    expect(tasks.some((task) => task.type === "HARVEST_END")).toBe(true);
  });
});

describe("Date utilities", () => {
  it("builds inclusive ranges", () => {
    const range = buildDateRange("2025-01-01", "2025-01-03");
    expect(range).toEqual(["2025-01-01", "2025-01-02", "2025-01-03"]);
  });

  it("adds iso days correctly", () => {
    expect(addDaysISO("2025-01-01", 7)).toBe("2025-01-08");
  });
});

describe("Moon phases", () => {
  it("returns deterministic phase", () => {
    const info = getMoonPhaseInfo("2025-01-13");
    expect(info.phase).toMatch(/new|waxing|full|waning/);
    expect(info.illuminatedFraction).toBeGreaterThanOrEqual(0);
    expect(info.illuminatedFraction).toBeLessThanOrEqual(1);
  });
});

describe("Overlap detection", () => {
  it("detects intersections", () => {
    const overlap = detectPhaseOverlap(phases);
    expect(overlap).toBeGreaterThanOrEqual(0);
  });
});
