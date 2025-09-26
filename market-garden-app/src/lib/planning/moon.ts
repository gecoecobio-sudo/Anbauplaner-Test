import { differenceInMilliseconds } from "date-fns";
import type { MoonPhaseInfo } from "@/types/domain";

const SYNODIC_MONTH = 29.53058867; // Tage
const KNOWN_NEW_MOON = new Date("2000-01-06T18:14:00Z").getTime();

function lunarAge(date: Date): number {
  const diff = differenceInMilliseconds(date, new Date(KNOWN_NEW_MOON));
  const days = diff / (1000 * 60 * 60 * 24);
  const age = days % SYNODIC_MONTH;
  return age < 0 ? age + SYNODIC_MONTH : age;
}

function phaseFromAge(age: number): MoonPhaseInfo["phase"] {
  if (age < 1 || age > SYNODIC_MONTH - 1) return "new";
  if (age < SYNODIC_MONTH / 2 - 1) return "waxing";
  if (age < SYNODIC_MONTH / 2 + 1) return "full";
  if (age < SYNODIC_MONTH - 1) return "waning";
  return "new";
}

function biodynamicFromAge(age: number): MoonPhaseInfo["biodynamicType"] {
  const ratio = age / SYNODIC_MONTH;
  if (ratio < 0.25) return "root"; // erdige Phase
  if (ratio < 0.5) return "flower"; // luftige Phase
  if (ratio < 0.75) return "leaf"; // wässrige Phase
  return "fruit"; // feurige Phase
}

export function getMoonPhaseInfo(date: Date | string): MoonPhaseInfo {
  const target = typeof date === "string" ? new Date(`${date}T00:00:00Z`) : date;
  const age = lunarAge(target);
  const phase = phaseFromAge(age);
  const illuminatedFraction = 0.5 * (1 - Math.cos((2 * Math.PI * age) / SYNODIC_MONTH));
  const biodynamicType = biodynamicFromAge(age);

  return {
    phase,
    illuminatedFraction,
    biodynamicType,
  };
}
