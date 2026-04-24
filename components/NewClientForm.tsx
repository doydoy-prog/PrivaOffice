"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createOrganization } from "@/lib/actions/organizations";
import { OrganizationType } from "@/lib/types";

export default function NewClientForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState<OrganizationType>("nonprofit");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createOrganization(form);
      if (!result.ok) {
        setError(result.error ?? "לא ניתן ליצור את הארגון");
        return;
      }
      router.push("/");
      router.refresh();
    });
  }

  return (
    <div className="mx-auto max-w-[640px] px-5 py-16">
      <div className="mb-8 text-center">
        <h1
          className="mb-2 text-[28px] font-extrabold"
          style={{ color: "var(--color-navy)" }}
        >
          לקוח חדש
        </h1>
        <p
          className="text-[15px] leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          הזן את פרטי הארגון. תוכל לערוך בהמשך.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <h2
          className="mb-5 text-[20px] font-bold"
          style={{ color: "var(--color-navy)" }}
        >
          פרטי הארגון
        </h2>

        <div className="mb-4">
          <label htmlFor="name" className="field-label">
            שם הארגון *
          </label>
          <input
            id="name"
            name="name"
            className="field-input"
            placeholder="לדוגמה: עמותת אחוות תורה"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            autoFocus
          />
        </div>

        <div className="mb-4">
          <label htmlFor="type" className="field-label">
            סוג ארגון
          </label>
          <select
            id="type"
            name="type"
            className="field-input field-select"
            value={type}
            onChange={(e) => setType(e.target.value as OrganizationType)}
          >
            <option value="nonprofit">עמותה</option>
            <option value="company">חברה</option>
            <option value="public">גוף ציבורי</option>
          </select>
        </div>

        {error && (
          <div
            className="mb-4 rounded-lg px-3 py-2 text-[13px]"
            style={{
              background: "var(--color-err-bg)",
              color: "var(--color-err)",
              border: "1px solid var(--color-err)",
            }}
          >
            {error}
          </div>
        )}

        <div className="mt-5 flex gap-2.5">
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? "שומר…" : "צור והתחל"}
          </button>
          <Link href="/" className="btn btn-ghost">
            ביטול
          </Link>
        </div>
      </form>
    </div>
  );
}
