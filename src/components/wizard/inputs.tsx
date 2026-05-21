"use client";

import { useEffect, useRef, useState } from "react";
import { StepIcon } from "./icons";
import type { WizardOption, WizardStep } from "@/lib/wizard-schema";
import { formatNumber } from "@/lib/utils";

interface CommonProps {
  step: WizardStep;
  onSubmit: (value: unknown) => void;
  initialValue?: unknown;
}

// ============ Continue (welcome step) ============

export function ContinueInput({ step, onSubmit }: CommonProps) {
  return (
    <div className="flex justify-end pt-3">
      <button
        type="button"
        onClick={() => onSubmit(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-navy px-7 py-3 text-sm font-semibold text-gold transition-all hover:-translate-y-px hover:bg-navy-light"
      >
        {step.ctaText || "המשך"}
        <StepIcon name="arrow" width={16} height={16} />
      </button>
    </div>
  );
}

// ============ Text / Textarea ============

export function TextInput({ step, onSubmit, initialValue }: CommonProps) {
  const [value, setValue] = useState<string>((initialValue as string) || "");
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setTimeout(() => ref.current?.focus(), 200);
  }, []);

  useEffect(() => {
    (window as unknown as { __useExample?: (v: string) => void }).__useExample = (v: string) => {
      setValue(v);
      ref.current?.focus();
    };
    return () => {
      (window as unknown as { __useExample?: (v: string) => void }).__useExample = undefined;
    };
  }, []);

  const valid = value.trim().length >= 2;

  return (
    <div className="space-y-3 pt-3">
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && valid) onSubmit(value.trim());
        }}
        placeholder={step.placeholder}
        className="w-full rounded-xl border-2 border-border bg-bg-card px-4 py-3 text-[15px] text-text transition-all focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/15"
      />
      <div className="flex justify-end">
        <button
          type="button"
          disabled={!valid}
          onClick={() => onSubmit(value.trim())}
          className="inline-flex items-center gap-2 rounded-xl bg-navy px-7 py-3 text-sm font-semibold text-gold transition-all hover:-translate-y-px hover:bg-navy-light disabled:cursor-not-allowed disabled:bg-border disabled:text-text-soft disabled:transform-none"
        >
          המשך
          <StepIcon name="arrow" width={16} height={16} />
        </button>
      </div>
    </div>
  );
}

export function TextareaInput({ step, onSubmit, initialValue }: CommonProps) {
  const [value, setValue] = useState<string>((initialValue as string) || "");
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    setTimeout(() => ref.current?.focus(), 200);
  }, []);

  useEffect(() => {
    (window as unknown as { __useExample?: (v: string) => void }).__useExample = (v: string) => {
      setValue(v);
      ref.current?.focus();
    };
    return () => {
      (window as unknown as { __useExample?: (v: string) => void }).__useExample = undefined;
    };
  }, []);

  const valid = value.trim().length >= 10;

  return (
    <div className="space-y-3 pt-3">
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={step.placeholder}
        className="min-h-24 w-full resize-none rounded-xl border-2 border-border bg-bg-card px-4 py-3 text-[15px] leading-relaxed text-text transition-all focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/15"
      />
      <div className="flex justify-end">
        <button
          type="button"
          disabled={!valid}
          onClick={() => onSubmit(value.trim())}
          className="inline-flex items-center gap-2 rounded-xl bg-navy px-7 py-3 text-sm font-semibold text-gold transition-all hover:-translate-y-px hover:bg-navy-light disabled:cursor-not-allowed disabled:bg-border disabled:text-text-soft disabled:transform-none"
        >
          המשך
          <StepIcon name="arrow" width={16} height={16} />
        </button>
      </div>
    </div>
  );
}

// ============ Number (with presets) ============

export function NumberInput({ step, onSubmit, initialValue }: CommonProps) {
  const [value, setValue] = useState<number>((initialValue as number) || 0);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setTimeout(() => ref.current?.focus(), 200);
  }, []);

  const valid = value > 0;

  return (
    <div className="space-y-4 pt-3">
      <div className="text-center">
        <div className="text-5xl font-extrabold tracking-tight text-navy">
          {formatNumber(value)}
        </div>
        <div className="mt-1 text-xs text-text-muted">
          הזיני מספר מדויק או לחצי על הצעה
        </div>
      </div>
      <input
        ref={ref}
        type="number"
        min={0}
        value={value || ""}
        onChange={(e) => setValue(parseInt(e.target.value) || 0)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && valid) onSubmit(value);
        }}
        placeholder={step.placeholder}
        className="mx-auto block w-40 rounded-xl border-2 border-border bg-bg-card px-4 py-3 text-center text-[15px] font-semibold text-text transition-all focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/15"
      />
      {step.presets && (
        <div className="flex flex-wrap justify-center gap-1.5">
          {step.presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setValue(p)}
              className="rounded-2xl border border-border bg-bg px-3 py-1.5 text-xs text-text-muted transition-all hover:border-gold hover:text-navy"
            >
              {formatNumber(p)}
            </button>
          ))}
        </div>
      )}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          disabled={!valid}
          onClick={() => onSubmit(value)}
          className="inline-flex items-center gap-2 rounded-xl bg-navy px-7 py-3 text-sm font-semibold text-gold transition-all hover:-translate-y-px hover:bg-navy-light disabled:cursor-not-allowed disabled:bg-border disabled:text-text-soft disabled:transform-none"
        >
          המשך
          <StepIcon name="arrow" width={16} height={16} />
        </button>
      </div>
    </div>
  );
}

// ============ Options (single-choice) ============

export function OptionsInput({ step, onSubmit }: CommonProps) {
  const [selected, setSelected] = useState<WizardOption["value"] | null>(null);

  return (
    <div className="grid grid-cols-1 gap-2.5 pt-3 sm:grid-cols-2">
      {step.options?.map((opt) => {
        const isSelected =
          selected !== null && String(selected) === String(opt.value);
        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => {
              setSelected(opt.value);
              setTimeout(() => onSubmit(opt.value), 280);
            }}
            className={`flex items-center gap-3 rounded-xl border-2 p-3.5 text-right text-sm transition-all ${
              isSelected
                ? "border-navy bg-navy text-white"
                : "border-border bg-bg-card text-text hover:-translate-y-px hover:border-gold hover:bg-[#FFFBF2]"
            }`}
          >
            <StepIcon
              name={opt.icon}
              width={22}
              height={22}
              className={`flex-shrink-0 ${isSelected ? "text-gold" : "text-gold-dark"}`}
            />
            <span className="flex-1">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ============ Multi-select (sensitive flags) ============

export function MultiSelectInput({ step, onSubmit, initialValue }: CommonProps) {
  const [selected, setSelected] = useState<string[]>(
    (initialValue as string[]) || [],
  );

  const toggle = (v: string) => {
    setSelected((arr) =>
      arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v],
    );
  };

  const valid = selected.length > 0;

  return (
    <div className="space-y-3 pt-3">
      <div className="grid gap-2 md:grid-cols-2">
        {step.options?.map((opt) => {
          const checked = selected.includes(String(opt.value));
          return (
            <label
              key={String(opt.value)}
              className={`flex cursor-pointer select-none items-center gap-3 rounded-lg border-2 p-3 text-sm transition-all ${
                checked
                  ? opt.sensitive
                    ? "border-gold-dark bg-[#fbf3e2]"
                    : "border-navy bg-[#F0F4FA]"
                  : "border-border bg-bg-card hover:border-gold hover:bg-[#FFFBF2]"
              }`}
            >
              <div
                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
                  checked
                    ? opt.sensitive
                      ? "border-gold-dark bg-gold-dark"
                      : "border-navy bg-navy"
                    : "border-border"
                }`}
              >
                {checked && (
                  <StepIcon
                    name="check"
                    width={12}
                    height={12}
                    className="text-white"
                  />
                )}
              </div>
              <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={() => toggle(String(opt.value))}
              />
              <span className="flex-1">
                {opt.label}
                {opt.sensitive && (
                  <span className="ms-2 rounded bg-gold/25 px-1.5 py-0.5 text-[10px] font-bold text-gold-dark">
                    רגיש
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
      <div className="flex justify-end pt-2">
        <button
          type="button"
          disabled={!valid}
          onClick={() => onSubmit(selected)}
          className="inline-flex items-center gap-2 rounded-xl bg-navy px-7 py-3 text-sm font-semibold text-gold transition-all hover:-translate-y-px hover:bg-navy-light disabled:cursor-not-allowed disabled:bg-border disabled:text-text-soft disabled:transform-none"
        >
          המשך
          <StepIcon name="arrow" width={16} height={16} />
        </button>
      </div>
    </div>
  );
}

// ============ Vendors ============

export interface VendorEntry {
  name: string;
  activity: string;
  location?: string;
}

export function VendorsInput({ onSubmit, initialValue }: CommonProps) {
  const [list, setList] = useState<VendorEntry[]>(
    (initialValue as VendorEntry[]) || [],
  );

  const addVendor = () =>
    setList([...list, { name: "", activity: "", location: "" }]);
  const removeVendor = (idx: number) =>
    setList(list.filter((_, i) => i !== idx));
  const updateVendor = (idx: number, field: keyof VendorEntry, value: string) =>
    setList(list.map((v, i) => (i === idx ? { ...v, [field]: value } : v)));

  const cleaned = list.filter((v) => v.name.trim().length > 0);

  return (
    <div className="space-y-3 pt-3">
      <div className="space-y-2">
        {list.map((v, idx) => (
          <div
            key={idx}
            className="grid grid-cols-[1fr_1fr_auto] items-center gap-2 rounded-xl border border-border bg-bg-card p-3"
          >
            <input
              type="text"
              value={v.name}
              onChange={(e) => updateVendor(idx, "name", e.target.value)}
              placeholder="שם הספק (Google, Monday.com)"
              className="rounded-md border border-border px-3 py-2 text-sm focus:border-gold focus:outline-none"
            />
            <input
              type="text"
              value={v.activity}
              onChange={(e) => updateVendor(idx, "activity", e.target.value)}
              placeholder="סוג הפעילות"
              className="rounded-md border border-border px-3 py-2 text-sm focus:border-gold focus:outline-none"
            />
            <button
              type="button"
              onClick={() => removeVendor(idx)}
              className="flex items-center justify-center rounded-md p-1.5 text-danger transition-colors hover:bg-danger-bg"
              aria-label="מחק ספק"
            >
              <StepIcon name="trash" width={18} height={18} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addVendor}
        className="w-full rounded-xl border-[1.5px] border-dashed border-border bg-transparent py-2.5 text-sm text-text-muted transition-all hover:border-gold hover:bg-[#FFFBF2] hover:text-navy"
      >
        + הוסף ספק
      </button>
      <div className="flex justify-between gap-2 pt-2">
        <button
          type="button"
          onClick={() => onSubmit([])}
          className="rounded-xl border border-border bg-transparent px-5 py-3 text-sm font-semibold text-text-muted transition-colors hover:border-navy hover:text-navy"
        >
          אין ספקים חיצוניים
        </button>
        <button
          type="button"
          onClick={() => onSubmit(cleaned)}
          className="inline-flex items-center gap-2 rounded-xl bg-navy px-7 py-3 text-sm font-semibold text-gold transition-all hover:-translate-y-px hover:bg-navy-light"
        >
          המשך עם {cleaned.length} ספקים
          <StepIcon name="arrow" width={16} height={16} />
        </button>
      </div>
    </div>
  );
}

// ============ Manager ============

export function ManagerInput({ onSubmit, initialValue }: CommonProps) {
  const initial =
    (initialValue as { name: string; role: string; email: string }) || {
      name: "",
      role: "",
      email: "",
    };
  const [name, setName] = useState(initial.name);
  const [role, setRole] = useState(initial.role);
  const [email, setEmail] = useState(initial.email);
  const valid =
    name.trim().length > 1 &&
    role.trim().length > 1 &&
    /^\S+@\S+\.\S+$/.test(email);

  return (
    <div className="space-y-3 pt-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="שם מלא"
        className="w-full rounded-xl border-2 border-border bg-bg-card px-4 py-3 text-[15px] text-text transition-all focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/15"
      />
      <input
        type="text"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="תפקיד (לדוגמה: סמנכ״ל אופרציה)"
        className="w-full rounded-xl border-2 border-border bg-bg-card px-4 py-3 text-[15px] text-text transition-all focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/15"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="אימייל"
        dir="ltr"
        className="w-full rounded-xl border-2 border-border bg-bg-card px-4 py-3 text-left text-[15px] text-text transition-all focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/15"
      />
      <div className="flex justify-end pt-2">
        <button
          type="button"
          disabled={!valid}
          onClick={() => onSubmit({ name, role, email })}
          className="inline-flex items-center gap-2 rounded-xl bg-navy px-7 py-3 text-sm font-semibold text-gold transition-all hover:-translate-y-px hover:bg-navy-light disabled:cursor-not-allowed disabled:bg-border disabled:text-text-soft disabled:transform-none"
        >
          סיים ויצור דשבורד מלא
          <StepIcon name="check" width={16} height={16} />
        </button>
      </div>
    </div>
  );
}
