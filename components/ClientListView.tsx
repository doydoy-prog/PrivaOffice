"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteOrganization, type OrganizationListItem } from "@/lib/actions/organizations";
import { ORGANIZATION_TYPE_LABELS } from "@/lib/types";

export default function ClientListView({
  organizations,
}: {
  organizations: OrganizationListItem[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleDelete(id: string, name: string) {
    if (!window.confirm(`למחוק את ${name}?`)) return;
    startTransition(async () => {
      await deleteOrganization(id);
      router.refresh();
    });
  }

  return (
    <div className="mx-auto max-w-[640px] px-5 py-16 text-center">
      <h1
        className="mb-2.5 text-[28px] font-extrabold"
        style={{ color: "var(--color-navy)" }}
      >
        🐝 DataBee
      </h1>
      <p
        className="mb-8 text-[15px] leading-relaxed"
        style={{ color: "var(--color-text-muted)" }}
      >
        פלטפורמת הסדרת פרטיות לארגונים ישראליים
        <br />
        בחר לקוח קיים או הוסף חדש כדי להתחיל
      </p>

      {organizations.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mb-6 grid gap-3 text-right">
          {organizations.map((org) => (
            <ClientCard
              key={org.id}
              org={org}
              disabled={pending}
              onDelete={() => handleDelete(org.id, org.name)}
            />
          ))}
        </div>
      )}

      <Link
        href="/new-client"
        className="btn btn-primary inline-flex"
        style={{ fontSize: 16, padding: "14px 32px" }}
      >
        ➕ הוסף לקוח חדש
      </Link>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card mb-6" style={{ padding: "40px 32px", textAlign: "center" }}>
      <div className="mb-3 text-[40px]">📋</div>
      <h2 className="mb-2 text-[20px] font-bold" style={{ color: "var(--color-navy)" }}>
        אין עדיין לקוחות
      </h2>
      <p className="text-[14px] leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
        הוסף לקוח ראשון כדי להתחיל את תהליך הסדרת הפרטיות - הגדרת מאגר, ניסוח
        מדיניות, הסכמי ספקים ועוד.
      </p>
    </div>
  );
}

function ClientCard({
  org,
  disabled,
  onDelete,
}: {
  org: OrganizationListItem;
  disabled: boolean;
  onDelete: () => void;
}) {
  const dataAssetName = org.dataAssetName || "טרם הוגדר מאגר";
  const typeLabel = ORGANIZATION_TYPE_LABELS[org.type];
  return (
    <Link
      href={`/${org.id}`}
      className="card flex items-center gap-3.5"
      style={{
        padding: 20,
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? "none" : undefined,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div className="avatar" style={{ width: 44, height: 44, fontSize: 18 }}>
        {org.name.charAt(0)}
      </div>
      <div className="flex-1">
        <div className="text-[16px] font-bold">{org.name}</div>
        <div className="text-[13px]" style={{ color: "var(--color-text-muted)" }}>
          {typeLabel} · {dataAssetName} · {org.tasksDone}/16 משימות
        </div>
      </div>
      <button
        type="button"
        className="btn btn-danger"
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete();
        }}
      >
        מחק
      </button>
    </Link>
  );
}
