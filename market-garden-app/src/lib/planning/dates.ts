import {
  addDays,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfWeek,
  format,
  parseISO,
  startOfDay,
  startOfWeek,
} from "date-fns";

export function toISODate(date: Date | string): string {
  if (typeof date === "string") return date.slice(0, 10);
  return date.toISOString().slice(0, 10);
}

export function fromISODate(iso: string): Date {
  return startOfDay(parseISO(iso));
}

export function buildDateRange(start: string, end: string): string[] {
  const days = eachDayOfInterval({ start: fromISODate(start), end: fromISODate(end) });
  return days.map(toISODate);
}

export function weeksBetween(start: string, end: string): number {
  return Math.max(1, Math.ceil(differenceInCalendarDays(fromISODate(end), fromISODate(start)) / 7));
}

export function getWeekBoundaries(date: string) {
  const start = startOfWeek(fromISODate(date), { weekStartsOn: 1 });
  const end = endOfWeek(start, { weekStartsOn: 1 });
  return { start: toISODate(start), end: toISODate(end) };
}

export function formatDisplayDate(iso: string, view: "week" | "day" = "week") {
  const date = fromISODate(iso);
  return view === "week" ? `KW ${format(date, "II")}` : format(date, "dd.MM.");
}

export function addDaysISO(date: string, offset: number) {
  return toISODate(addDays(fromISODate(date), offset));
}
