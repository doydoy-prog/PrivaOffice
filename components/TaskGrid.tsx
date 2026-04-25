import Link from "next/link";
import { TASKS, TaskDefinition, TaskPriority } from "@/lib/tasks";

export default function TaskGrid({
  orgId,
  statuses,
}: {
  orgId: string;
  statuses: Record<string, "open" | "in_progress" | "done">;
}) {
  return (
    <div
      className="grid gap-3.5"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))" }}
    >
      {TASKS.map((task) => (
        <TaskCard
          key={task.id}
          orgId={orgId}
          task={task}
          status={statuses[task.id] ?? "open"}
        />
      ))}
    </div>
  );
}

function TaskCard({
  orgId,
  task,
  status,
}: {
  orgId: string;
  task: TaskDefinition;
  status: "open" | "in_progress" | "done";
}) {
  const href = `/${orgId}/module/${task.id}` as const;
  const priorityLabel: Record<TaskPriority, string> = {
    high: "גבוהה",
    medium: "בינונית",
    low: "נמוכה",
  };
  const priorityClass: Record<TaskPriority, string> = {
    high: "task-badge-hi",
    medium: "task-badge-md",
    low: "task-badge-lo",
  };

  const statusClass =
    status === "done" ? "is-done" : status === "in_progress" ? "is-progress" : "";

  return (
    <Link
      href={href}
      className={`task-card ${statusClass}`}
      style={{
        background: "var(--color-bg-card)",
        border: "1.5px solid var(--color-border)",
        borderRadius: 14,
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        position: "relative",
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      {status === "done" && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "var(--color-ok)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          ✓
        </span>
      )}
      {status === "in_progress" && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            left: 0,
            height: 3,
            background:
              "linear-gradient(90deg,var(--color-gold-deep),var(--color-gold))",
          }}
        />
      )}

      <div className="flex items-center gap-3">
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            flexShrink: 0,
            ...(task.type === "deep"
              ? { background: "var(--color-navy)", color: "var(--color-gold)" }
              : {
                  background: "var(--color-bg)",
                  color: "var(--color-text-muted)",
                  border: "1px solid var(--color-border)",
                }),
          }}
        >
          {task.icon}
        </div>
        <div>
          <div
            className="text-[15px] font-bold leading-tight"
            style={{ color: "var(--color-navy)" }}
          >
            {task.title}
          </div>
          <div
            className="text-[12px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            {task.sub}
          </div>
        </div>
      </div>

      <div
        className="text-[13px] leading-normal"
        style={{ color: "var(--color-text-muted)" }}
      >
        {task.desc}
      </div>

      <div className="mt-auto flex flex-wrap gap-1.5">
        <span className={`task-badge ${priorityClass[task.priority]}`}>
          עדיפות {priorityLabel[task.priority]}
        </span>
        <span className="task-badge task-badge-ref">{task.legalRef}</span>
        {task.type === "deep" && (
          <span className="task-badge task-badge-deep">מודול מלא</span>
        )}
      </div>
    </Link>
  );
}
