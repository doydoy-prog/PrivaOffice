"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  COLLECTION_OPTIONS,
  DATA_TYPE_OPTIONS,
  PURPOSE_OPTIONS,
  SUBJECT_OPTIONS,
} from "@/lib/data-asset-options";
import {
  type DataAssetState,
  type VendorInput,
  upsertDataAsset,
} from "@/lib/actions/data-asset";
import { calculateSecurityLevel, securityLevelLabel } from "@/lib/security";

export default function DataAssetForm({
  orgId,
  initial,
}: {
  orgId: string;
  initial: DataAssetState;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(initial.name);
  const [subjectsCount, setSubjectsCount] = useState<number>(initial.subjectsCount);
  const [permissionsCount, setPermissionsCount] = useState<number>(
    initial.permissionsCount,
  );
  const [transferAbroad, setTransferAbroad] = useState<boolean>(initial.transferAbroad);
  const [subjectCategories, setSubjectCategories] = useState<string[]>(
    initial.subjectCategories,
  );
  const [purpose, setPurpose] = useState<string[]>(initial.purpose);
  const [collectionMethods, setCollectionMethods] = useState<string[]>(
    initial.collectionMethods,
  );
  const [dataTypes, setDataTypes] = useState<string[]>(initial.dataTypes);
  const [managerName, setManagerName] = useState(initial.managerName);
  const [managerRole, setManagerRole] = useState(initial.managerRole);
  const [managerEmail, setManagerEmail] = useState(initial.managerEmail);
  const [vendors, setVendors] = useState<VendorInput[]>(initial.vendors);

  const sensitiveTypes = useMemo(
    () =>
      dataTypes.filter(
        (v) => DATA_TYPE_OPTIONS.find((o) => o.value === v)?.sensitive,
      ),
    [dataTypes],
  );
  const securityLevel = useMemo(
    () =>
      calculateSecurityLevel({
        sensitiveTypes,
        subjectsCount,
        permissionsCount,
      }),
    [sensitiveTypes, subjectsCount, permissionsCount],
  );

  function toggle(arr: string[], value: string): string[] {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await upsertDataAsset(orgId, {
        name,
        subjectsCount,
        permissionsCount,
        transferAbroad,
        subjectCategories,
        purpose,
        collectionMethods,
        dataTypes,
        managerName,
        managerRole,
        managerEmail,
        vendors,
      });
      if (!result.ok) {
        setError(result.error ?? "שמירה נכשלה");
        return;
      }
      setSavedAt(Date.now());
      router.refresh();
    });
  }

  return (
    <div className="mx-auto max-w-[800px] px-10 pt-8 pb-16">
      <Link
        href={`/${orgId}`}
        className="btn btn-ghost btn-sm mb-5 inline-flex"
      >
        ← חזרה לדשבורד
      </Link>

      <h1
        className="mb-1 text-[24px] font-extrabold"
        style={{ color: "var(--color-navy)" }}
      >
        הגדרות מאגר מידע
      </h1>
      <p
        className="mb-7 text-[14px] leading-relaxed"
        style={{ color: "var(--color-text-muted)" }}
      >
        מסמך הגדרות מאגר לפי תקנה 2 לתקנות הגנת הפרטיות (אבטחת מידע), התשע&quot;ז-2017.
      </p>

      <SecurityBanner level={securityLevel} sensitive={sensitiveTypes.length > 0} />

      <Section title="📋 פרטים בסיסיים">
        <Field label="שם המאגר">
          <input
            className="field-control"
            placeholder="לדוגמה: אוהדים ומתעניינים"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Field label="מספר נושאי מידע">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            className="field-control"
            placeholder="מספר אנשים"
            value={subjectsCount || ""}
            onChange={(e) => setSubjectsCount(Number(e.target.value) || 0)}
          />
        </Field>
        <Field label="מספר מורשי גישה">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            className="field-control"
            placeholder="מספר מורשים"
            value={permissionsCount || ""}
            onChange={(e) => setPermissionsCount(Number(e.target.value) || 0)}
          />
        </Field>
        <Field label="העברה לחו&quot;ל">
          <select
            className="field-control"
            value={transferAbroad ? "yes" : "no"}
            onChange={(e) => setTransferAbroad(e.target.value === "yes")}
          >
            <option value="no">לא</option>
            <option value="yes">כן</option>
          </select>
        </Field>
      </Section>

      <ChipSection
        title="👥 קטגוריות נושאי מידע"
        options={SUBJECT_OPTIONS}
        selected={subjectCategories}
        onToggle={(v) => setSubjectCategories(toggle(subjectCategories, v))}
      />
      <ChipSection
        title="🎯 מטרות שימוש"
        options={PURPOSE_OPTIONS}
        selected={purpose}
        onToggle={(v) => setPurpose(toggle(purpose, v))}
      />
      <ChipSection
        title="📥 שיטות איסוף"
        options={COLLECTION_OPTIONS}
        selected={collectionMethods}
        onToggle={(v) => setCollectionMethods(toggle(collectionMethods, v))}
      />

      <DataTypeSection
        selected={dataTypes}
        onToggle={(v) => setDataTypes(toggle(dataTypes, v))}
      />

      <VendorSection vendors={vendors} setVendors={setVendors} />

      <Section title="👤 מנהל המאגר (סעיף 2(א)(7))">
        <Field label="שם מלא">
          <input
            className="field-control"
            value={managerName}
            onChange={(e) => setManagerName(e.target.value)}
            placeholder="שם מלא"
          />
        </Field>
        <Field label="תפקיד">
          <input
            className="field-control"
            value={managerRole}
            onChange={(e) => setManagerRole(e.target.value)}
            placeholder="סמנכ״ל, מנכ״ל..."
          />
        </Field>
        <Field label="אימייל">
          <input
            type="email"
            className="field-control"
            value={managerEmail}
            onChange={(e) => setManagerEmail(e.target.value)}
            placeholder="email@org.co.il"
            dir="ltr"
          />
        </Field>
      </Section>

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

      <div className="sticky bottom-4 flex items-center gap-3 rounded-2xl border bg-white px-5 py-3"
        style={{ boxShadow: "var(--shadow-soft)", borderColor: "var(--color-border)" }}
      >
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSave}
          disabled={pending}
        >
          {pending ? "שומר…" : "שמור"}
        </button>
        <Link href={`/${orgId}`} className="btn btn-ghost">
          ביטול
        </Link>
        <div className="mr-auto text-[12px]" style={{ color: "var(--color-text-soft)" }}>
          {savedAt && !pending
            ? `✓ נשמר ב-${new Date(savedAt).toLocaleTimeString("he-IL")}`
            : "השינויים יישמרו בלחיצה על \"שמור\""}
        </div>
      </div>
    </div>
  );
}

function SecurityBanner({
  level,
  sensitive,
}: {
  level: "basic" | "medium" | "high";
  sensitive: boolean;
}) {
  const labels: Record<string, { color: string; bg: string; explain: string }> = {
    basic: {
      color: "var(--color-ok)",
      bg: "var(--color-ok-bg)",
      explain: "תקנה 4 — נוהל אבטחה ארגוני בסיסי.",
    },
    medium: {
      color: "var(--color-warn)",
      bg: "var(--color-warn-bg)",
      explain: "מאגר עם מידע רגיש — נדרש נוהל אבטחה ברמה בינונית, ביקורת תקופתית.",
    },
    high: {
      color: "var(--color-err)",
      bg: "var(--color-err-bg)",
      explain:
        "מאגר ברמה גבוהה — נדרשים מבדקי חדירות, סקר סיכונים, ביקורת ופיקוח דירקטוריון.",
    },
  };
  const cfg = labels[level];
  return (
    <div
      className="mb-5 flex items-center gap-3 rounded-xl border px-4 py-3"
      style={{ background: cfg.bg, borderColor: cfg.color }}
    >
      <div
        className="text-[12px] font-bold"
        style={{
          padding: "4px 10px",
          borderRadius: 8,
          background: cfg.color,
          color: "#fff",
        }}
      >
        רמת אבטחה {securityLevelLabel(level)}
      </div>
      <div className="text-[13px]" style={{ color: "var(--color-navy)" }}>
        {cfg.explain}
        {sensitive && " המאגר מכיל מידע בעל רגישות מיוחדת."}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-4 rounded-2xl border bg-white px-6 py-5"
      style={{ borderColor: "var(--color-border)", boxShadow: "var(--shadow-soft)" }}
    >
      <h3 className="mb-3 text-[17px] font-bold" style={{ color: "var(--color-navy)" }}>
        {title}
      </h3>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="flex items-center gap-2 rounded-lg border px-3 py-2"
      style={{ background: "var(--color-bg)", borderColor: "var(--color-border)" }}
    >
      <label
        className="min-w-[120px] text-[13px] font-semibold"
        style={{ color: "var(--color-text-muted)" }}
      >
        {label}
      </label>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function ChipSection({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <Section title={title}>
      <div className="flex flex-wrap gap-1.5 py-1">
        {options.map((o) => (
          <button
            type="button"
            key={o.value}
            onClick={() => onToggle(o.value)}
            className={`chip ${selected.includes(o.value) ? "chip-on" : ""}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </Section>
  );
}

function DataTypeSection({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <Section title="🔐 סוגי מידע">
      <p className="text-[13px]" style={{ color: "var(--color-text-muted)" }}>
        פריטים בזהב = מידע בעל רגישות מיוחדת לפי החוק.
      </p>
      <div className="flex flex-wrap gap-1.5 py-1">
        {DATA_TYPE_OPTIONS.map((o) => {
          const on = selected.includes(o.value);
          let cls = "chip";
          if (o.sensitive) cls += " chip-sensitive";
          if (on) cls += " chip-on";
          return (
            <button
              type="button"
              key={o.value}
              onClick={() => onToggle(o.value)}
              className={cls}
            >
              {o.label}
              {o.sensitive && " ⚠"}
            </button>
          );
        })}
      </div>
    </Section>
  );
}

function VendorSection({
  vendors,
  setVendors,
}: {
  vendors: VendorInput[];
  setVendors: React.Dispatch<React.SetStateAction<VendorInput[]>>;
}) {
  function update(i: number, key: "name" | "activity", value: string) {
    setVendors((curr) => curr.map((v, idx) => (idx === i ? { ...v, [key]: value } : v)));
  }
  function add() {
    setVendors((curr) => [...curr, { name: "", activity: "" }]);
  }
  function remove(i: number) {
    setVendors((curr) => curr.filter((_, idx) => idx !== i));
  }

  return (
    <Section title="🏢 ספקים חיצוניים (תקנה 15 — מיקור חוץ)">
      {vendors.length === 0 && (
        <p className="text-[13px]" style={{ color: "var(--color-text-soft)" }}>
          אין ספקים. כל ספק עם גישה למידע אישי מחייב הסכם DPA.
        </p>
      )}
      {vendors.map((v, i) => (
        <div
          key={i}
          className="flex items-center gap-2 rounded-lg border px-3 py-2"
          style={{
            background: "var(--color-bg)",
            borderColor: "var(--color-border)",
          }}
        >
          <span
            className="min-w-[60px] text-[12px] font-semibold"
            style={{ color: "var(--color-text-muted)" }}
          >
            ספק {i + 1}
          </span>
          <input
            className="field-control"
            placeholder="שם ספק"
            value={v.name}
            onChange={(e) => update(i, "name", e.target.value)}
          />
          <input
            className="field-control"
            placeholder="תחום פעילות"
            value={v.activity}
            onChange={(e) => update(i, "activity", e.target.value)}
          />
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => remove(i)}
            aria-label="מחק ספק"
          >
            ✕
          </button>
        </div>
      ))}
      <div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={add}>
          + הוסף ספק
        </button>
      </div>
    </Section>
  );
}
