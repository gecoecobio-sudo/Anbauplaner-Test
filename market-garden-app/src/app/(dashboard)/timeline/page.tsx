import { createSupabaseServerClient } from "@/lib/supabase/server";
import { TimelineClient } from "@/components/timeline/timeline-client";
import { demoPlantings } from "@/data/demo";
import type { TimelinePlanting } from "@/hooks/useTimelineStore";
import type { PlantingPhase } from "@/types/domain";

function normalisePhases(phases: any): PlantingPhase[] {
  if (!Array.isArray(phases)) return [];
  return phases.map((phase, index) => ({
    key: phase.key ?? `phase-${index}`,
    name: phase.name ?? `Phase ${index + 1}`,
    start: phase.start,
    end: phase.end,
    tasks: phase.tasks ?? [],
    color: phase.color ?? "phase-wachstum",
  }));
}

export default async function TimelinePage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let plantings: TimelinePlanting[] = demoPlantings as unknown as TimelinePlanting[];

  if (session) {
    const { data } = await supabase
      .from("plantings")
      .select("*, crop:crops(*), bed:beds(*, field:fields(*))")
      .eq("created_by", session.user.id);

    if (data && data.length > 0) {
      plantings = data.map((planting) => ({
        ...planting,
        phases: normalisePhases(planting.phases_timeline ?? []),
      })) as TimelinePlanting[];
    }
  }

  return <TimelineClient initialPlantings={plantings} />;
}
