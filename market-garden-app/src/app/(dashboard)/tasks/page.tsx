import { createSupabaseServerClient } from "@/lib/supabase/server";
import { TaskBoard } from "@/components/tasks/task-board";
import { demoPlantings } from "@/data/demo";
import { generateTasksFromPhases } from "@/lib/planning/tasks";
import type { Task } from "@/types/domain";

export default async function TasksPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let tasks: Task[] = demoPlantings.flatMap((planting) =>
    generateTasksFromPhases({
      plantingId: planting.id,
      phases: planting.phases,
      plantCount: planting.plant_count,
      seedsPerTray: planting.crop?.seeds_per_tray ?? null,
      seedsPerSpot: planting.crop?.seeds_per_spot ?? null,
    }),
  );

  if (session) {
    const { data } = await supabase
      .from("tasks")
      .select("*, planting:plantings(*, crop:crops(*))")
      .eq("planting.created_by", session.user.id);

    if (data) {
      tasks = data as unknown as Task[];
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold">Aufgabenplan</h1>
        <p className="text-[var(--text-secondary)]">Automatisch generierte Todos pro Phase und Beet.</p>
      </header>
      <TaskBoard tasks={tasks} />
    </div>
  );
}
