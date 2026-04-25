"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setTaskStatus, type TaskStatus } from "@/lib/actions/tasks";

const STATUS_LABELS: Record<TaskStatus, string> = {
  open: "פתוח",
  in_progress: "בעבודה",
  done: "הושלם",
};

export default function MarkTaskDoneButton({
  orgId,
  taskType,
  status,
}: {
  orgId: string;
  taskType: string;
  status: TaskStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function update(next: TaskStatus) {
    startTransition(async () => {
      await setTaskStatus(orgId, taskType, next);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-3">
      <span
        className="rounded-lg px-3 py-1 text-[12px] font-bold"
        style={{
          background: status === "done" ? "var(--color-ok-bg)" : "var(--color-bg)",
          color:
            status === "done"
              ? "var(--color-ok)"
              : status === "in_progress"
              ? "var(--color-gold-deep)"
              : "var(--color-text-muted)",
          border: `1px solid ${
            status === "done" ? "var(--color-ok)" : "var(--color-border)"
          }`,
        }}
      >
        סטטוס: {STATUS_LABELS[status]}
      </span>

      {status !== "done" ? (
        <>
          {status === "open" && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => update("in_progress")}
              disabled={pending}
            >
              סמן בעבודה
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => update("done")}
            disabled={pending}
          >
            {pending ? "שומר…" : "סמן כהושלם"}
          </button>
        </>
      ) : (
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => update("open")}
          disabled={pending}
        >
          פתח מחדש
        </button>
      )}
    </div>
  );
}
