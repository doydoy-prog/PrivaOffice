import type { Priority, Task, TaskStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface Props {
  tasks: Task[];
}

const priorityStyles: Record<Priority, string> = {
  high: "bg-danger-bg text-danger",
  medium: "bg-warning-bg text-warning",
  low: "bg-success-bg text-success",
};

const priorityLabels: Record<Priority, string> = {
  high: "עדיפות גבוהה",
  medium: "עדיפות בינונית",
  low: "עדיפות נמוכה",
};

const statusLabels: Record<TaskStatus, string> = {
  not_started: "לא התחיל",
  in_progress: "בעבודה",
  awaiting_dpo: "בבדיקת DPO",
  needs_edit: "דורש עריכה",
  completed: "הושלם",
  skipped: "דילוג",
};

const statusStyles: Record<TaskStatus, string> = {
  not_started: "bg-bg text-text-muted border-border",
  in_progress: "bg-[#E5ECF5] text-navy border-navy/20",
  awaiting_dpo: "bg-[#F5E8C4] text-gold-dark border-gold/40",
  needs_edit: "bg-warning-bg text-warning border-warning/30",
  completed: "bg-success-bg text-success border-success/30",
  skipped: "bg-bg text-text-soft border-border",
};

export function TaskList({ tasks }: Props) {
  const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
  const statusOrder: Record<TaskStatus, number> = {
    needs_edit: 0,
    awaiting_dpo: 1,
    in_progress: 2,
    not_started: 3,
    skipped: 4,
    completed: 5,
  };

  const sorted = [...tasks].sort((a, b) => {
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <section className="rounded-2xl border border-border bg-bg-card p-6 shadow-soft">
      <header className="mb-5 flex items-center justify-between border-b border-border pb-4">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-navy">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-gold">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </span>
            משימות ההסדרה ({tasks.length})
          </h3>
          <p className="mt-1 text-xs text-text-muted">
            ממוין לפי סטטוס ועדיפות - אישור DPO נדרש ראשון
          </p>
        </div>
      </header>

      <ul className="flex flex-col gap-2">
        {sorted.map((task, idx) => (
          <li
            key={task.id}
            className={`flex items-start gap-4 rounded-xl border border-border bg-bg p-4 transition-all hover:border-gold hover:bg-[#FFFBF2] ${
              task.status === "completed" ? "opacity-60" : ""
            }`}
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-gold">
              {idx + 1}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h4 className="text-sm font-semibold text-navy md:text-base">
                  {task.title}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {task.module === "deep" && (
                    <span className="rounded-md bg-navy/10 px-2 py-0.5 text-[11px] font-semibold text-navy">
                      מודול עמוק
                    </span>
                  )}
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold ${statusStyles[task.status]}`}
                  >
                    {statusLabels[task.status]}
                  </span>
                </div>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-text-muted">
                {task.description}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                <span className={`rounded-md px-2 py-0.5 font-semibold ${priorityStyles[task.priority]}`}>
                  {priorityLabels[task.priority]}
                </span>
                <span className="rounded-md bg-navy/5 px-2 py-0.5 font-medium text-navy">
                  § {task.legalReference}
                </span>
                {task.dueDate && task.status !== "completed" && (
                  <span className="text-text-muted">
                    עד {formatDate(task.dueDate)}
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
