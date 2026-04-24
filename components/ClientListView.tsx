"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  deleteClient,
  listClients,
  setActiveClient,
} from "@/lib/store";
import { ClientOrganization, ORGANIZATION_TYPE_LABELS } from "@/lib/types";

export default function ClientListView() {
  const [hydrated, setHydrated] = useState(false);
  const [clients, setClients] = useState<ClientOrganization[]>([]);

  useEffect(() => {
    setClients(listClients());
    setHydrated(true);
  }, []);

  function handleDelete(id: string, name: string) {
    if (!window.confirm(`למחוק את ${name}?`)) return;
    deleteClient(id);
    setClients(listClients());
  }

  function handleSelect(id: string) {
    setActiveClient(id);
    // Dashboard route is implemented in the next step — for now, surface a
    // placeholder so the click target is not a dead link.
    window.alert(
      "לקוח נבחר. מסך הדשבורד יתווסף בצעד הבא של פיתוח המוצר.",
    );
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

      {!hydrated ? (
        <div className="text-sm" style={{ color: "var(--color-text-soft)" }}>
          טוען…
        </div>
      ) : clients.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mb-6 grid gap-3 text-right">
          {clients.map((c) => (
            <ClientCard
              key={c.id}
              client={c}
              onSelect={() => handleSelect(c.id)}
              onDelete={() => handleDelete(c.id, c.name)}
            />
          ))}
        </div>
      )}

      {hydrated && (
        <Link
          href="/new-client"
          className="btn btn-primary inline-flex"
          style={{ fontSize: 16, padding: "14px 32px" }}
        >
          ➕ הוסף לקוח חדש
        </Link>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="card mb-6"
      style={{ padding: "40px 32px", textAlign: "center" }}
    >
      <div className="mb-3 text-[40px]">📋</div>
      <h2
        className="mb-2 text-[20px] font-bold"
        style={{ color: "var(--color-navy)" }}
      >
        אין עדיין לקוחות
      </h2>
      <p
        className="text-[14px] leading-relaxed"
        style={{ color: "var(--color-text-muted)" }}
      >
        הוסף לקוח ראשון כדי להתחיל את תהליך הסדרת הפרטיות - הגדרת מאגר, ניסוח
        מדיניות, הסכמי ספקים ועוד.
      </p>
    </div>
  );
}

function ClientCard({
  client,
  onSelect,
  onDelete,
}: {
  client: ClientOrganization;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const dataAssetName = client.dataAsset.name || "טרם הוגדר מאגר";
  const typeLabel = ORGANIZATION_TYPE_LABELS[client.type];
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className="card flex cursor-pointer items-center gap-3.5"
      style={{ padding: 20 }}
    >
      <div
        className="avatar"
        style={{ width: 44, height: 44, fontSize: 18 }}
      >
        {client.name.charAt(0)}
      </div>
      <div className="flex-1">
        <div className="text-[16px] font-bold">{client.name}</div>
        <div
          className="text-[13px]"
          style={{ color: "var(--color-text-muted)" }}
        >
          {typeLabel} · {dataAssetName}
        </div>
      </div>
      <button
        type="button"
        className="btn btn-danger"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        מחק
      </button>
    </div>
  );
}
