"use client";

import { differenceInCalendarDays, format, parseISO } from "date-fns";
import type { Task } from "@/types/domain";
import { useState } from "react";

interface TaskBoardProps {
  tasks: Task[];
}

type Filter = "today" | "upcoming" | "history";

export function TaskBoard({ tasks }: TaskBoardProps) {
  const [filter, setFilter] = useState<Filter>("today");

  const filteredTasks = tasks.filter((task) => {
    const delta = differenceInCalendarDays(parseISO(task.due_date), new Date());
    if (filter === "today") return delta === 0;
    if (filter === "upcoming") return delta > 0;
    return delta < 0;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(
          [
            { key: "today", label: "Heute" },
            { key: "upcoming", label: "Zukunft" },
            { key: "history", label: "Vergangenheit" },
          ] as { key: Filter; label: string }[]
        ).map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setFilter(item.key)}
            className={`rounded-full px-4 py-2 text-sm ${
              filter === item.key ? "bg-[var(--accent-green)] text-black" : "bg-[var(--surface)] text-[var(--text-secondary)]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)]">Keine Aufgaben in dieser Ansicht.</p>
        ) : (
          filteredTasks.map((task) => (
            <article
              key={task.id}
              className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em]">{task.type}</p>
                <p className="text-base">{task.notes}</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  Fällig am {format(parseISO(task.due_date), "dd.MM.yyyy")}
                </p>
              </div>
              <button
                type="button"
                className="rounded-full border border-[var(--border)] px-4 py-2 text-sm hover:border-[var(--accent-green)]"
              >
                Erledigt
              </button>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
