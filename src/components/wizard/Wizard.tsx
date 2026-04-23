"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { BotMessage, HelpCard, TypingDots, UserMessage } from "./ChatMessage";
import {
  ContinueInput,
  ManagerInput,
  MultiSelectInput,
  NumberInput,
  OptionsInput,
  TextInput,
  TextareaInput,
  VendorsInput,
} from "./inputs";
import { LiveSidebar } from "./LiveSidebar";
import { ResultScreen } from "./ResultScreen";
import { WIZARD_STEPS, TOTAL_STEPS, type WizardStep } from "@/lib/wizard-schema";
import {
  emptyAnswers,
  isStepValid,
} from "@/lib/wizard-validation";
import { SENSITIVE_TYPES } from "@/lib/security-engine";
import type { WizardAnswers } from "@/lib/document-generator";
import { formatNumber } from "@/lib/utils";

const STORAGE_KEY = "databee:wizard:v1";

interface WizardState {
  currentIdx: number;
  answers: WizardAnswers;
  history: { stepId: string; userText: string | null }[];
  completed: boolean;
}

type Action =
  | { type: "HYDRATE"; payload: WizardState }
  | { type: "ANSWER"; stepId: string; field: string | undefined; value: unknown; userText: string | null }
  | { type: "RESET" };

function describeAnswer(stepId: string, value: unknown): string | null {
  switch (stepId) {
    case "welcome":
      return null;
    case "dbName":
      return `המאגר ייקרא <strong>"${value}"</strong>`;
    case "purpose":
      return `מטרת המאגר: <strong>${value}</strong>`;
    case "collectionMethod": {
      const labels: Record<string, string> = {
        direct: "ישירות מנושאי המידע",
        thirdParty: "מצדדים שלישיים",
        mixed: "שילוב של שני המקורות",
      };
      return `המידע נאסף <strong>${labels[value as string]}</strong>`;
    }
    case "subjectsCount":
      return `יש במאגר <strong>${formatNumber(value as number)}</strong> נושאי מידע`;
    case "permissionsCount":
      return `יש <strong>${value}</strong> מורשי גישה`;
    case "dataTypes":
      return `נבחרו <strong>${(value as string[]).length}</strong> סוגי מידע`;
    case "subjectCategories":
      return `נבחרו <strong>${(value as string[]).length}</strong> קטגוריות של נושאי מידע`;
    case "transferAbroad":
      return value
        ? 'יש <strong>העברת מידע לחו"ל</strong>'
        : "אין העברת מידע לחו״ל";
    case "vendors": {
      const count = (value as unknown[]).length;
      return count
        ? `נוספו <strong>${count}</strong> ספקים`
        : "אין ספקים חיצוניים";
    }
    case "manager": {
      const m = value as { name: string; role: string };
      return `מנהל המאגר: <strong>${m.name}</strong> (${m.role})`;
    }
    default:
      return null;
  }
}

function reducer(state: WizardState, action: Action): WizardState {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;
    case "RESET":
      return {
        currentIdx: 0,
        answers: emptyAnswers(),
        history: [],
        completed: false,
      };
    case "ANSWER": {
      const step = WIZARD_STEPS[state.currentIdx];
      const answers = { ...state.answers };
      if (action.field) {
        // Special-case dataTypes to also compute sensitiveTypes
        if (action.field === "dataTypes") {
          const values = action.value as string[];
          answers.dataTypes = values;
          answers.sensitiveTypes = values.filter((v) =>
            SENSITIVE_TYPES.includes(v as (typeof SENSITIVE_TYPES)[number]),
          );
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (answers as any)[action.field] = action.value;
        }
      }
      const history = [
        ...state.history,
        { stepId: step.id, userText: action.userText },
      ];
      const nextIdx = state.currentIdx + 1;
      const completed = nextIdx >= TOTAL_STEPS;
      return {
        currentIdx: nextIdx,
        answers,
        history,
        completed,
      };
    }
  }
}

interface WizardProps {
  orgName: string;
}

export function Wizard({ orgName }: WizardProps) {
  const [state, dispatch] = useReducer(reducer, {
    currentIdx: 0,
    answers: emptyAnswers(),
    history: [],
    completed: false,
  });
  const [hydrated, setHydrated] = useState(false);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as WizardState;
        if (
          parsed &&
          typeof parsed.currentIdx === "number" &&
          parsed.answers
        ) {
          dispatch({ type: "HYDRATE", payload: parsed });
        }
      }
    } catch {
      // ignore - corrupt storage
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [state, hydrated]);

  // Auto scroll on new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [state.history.length, state.currentIdx, typing]);

  const currentStep: WizardStep | undefined = WIZARD_STEPS[state.currentIdx];
  const progressPct = state.completed
    ? 100
    : Math.round((state.currentIdx / TOTAL_STEPS) * 100);

  const handleSubmit = (value: unknown) => {
    if (!currentStep) return;
    const stepId = currentStep.id;
    // Validate (safety)
    const probe = { ...state.answers };
    if (currentStep.field) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (probe as any)[currentStep.field] = value;
      if (currentStep.field === "dataTypes") {
        probe.sensitiveTypes = (value as string[]).filter((v) =>
          SENSITIVE_TYPES.includes(v as (typeof SENSITIVE_TYPES)[number]),
        );
      }
    }
    if (!isStepValid(stepId, probe)) {
      return;
    }

    const userText = describeAnswer(stepId, value);
    dispatch({
      type: "ANSWER",
      stepId,
      field: currentStep.field,
      value,
      userText,
    });

    setTyping(true);
    window.setTimeout(() => setTyping(false), 700);
  };

  const handleReset = () => {
    if (confirm("האם למחוק את ההתקדמות ולהתחיל מחדש?")) {
      localStorage.removeItem(STORAGE_KEY);
      dispatch({ type: "RESET" });
    }
  };

  if (!hydrated) {
    return <div className="h-64" />;
  }

  if (state.completed) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <ResultScreen
          answers={state.answers}
          orgName={orgName}
          onReset={handleReset}
        />
        <LiveSidebar
          answers={state.answers}
          currentStepId="done"
          progressPct={100}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
      <div className="flex min-w-0 flex-col">
        {/* Progress bar */}
        <div className="mb-6 flex items-center gap-3 border-b border-border pb-5">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold-dark to-gold transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="whitespace-nowrap text-xs text-text-muted">
            שלב <strong className="text-navy">{Math.min(state.currentIdx + 1, TOTAL_STEPS)}</strong>{" "}
            מתוך <strong className="text-navy">{TOTAL_STEPS}</strong>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-md px-2 py-1 text-[11px] text-text-soft transition-colors hover:text-danger"
          >
            התחל מחדש
          </button>
        </div>

        {/* Chat history */}
        <div className="flex flex-col gap-5 pb-8">
          {state.history.map((entry, idx) => {
            const step = WIZARD_STEPS.find((s) => s.id === entry.stepId);
            if (!step) return null;
            return (
              <div key={`${entry.stepId}-${idx}`} className="flex flex-col gap-4">
                <BotMessage legalRef={step.legalRef}>
                  <span dangerouslySetInnerHTML={{ __html: step.bot }} />
                </BotMessage>
                {entry.userText && (
                  <UserMessage>
                    <span dangerouslySetInnerHTML={{ __html: entry.userText }} />
                  </UserMessage>
                )}
              </div>
            );
          })}

          {typing && <TypingDots />}

          {!typing && currentStep && (
            <BotMessage
              legalRef={currentStep.legalRef}
              extra={
                currentStep.help && (
                  <HelpCard
                    title={currentStep.help.title}
                    text={currentStep.help.text}
                    examples={currentStep.help.examples}
                    onExample={(ex) => {
                      const fn = (
                        window as unknown as {
                          __useExample?: (v: string) => void;
                        }
                      ).__useExample;
                      fn?.(ex);
                    }}
                  />
                )
              }
            >
              <span dangerouslySetInnerHTML={{ __html: currentStep.bot }} />
              <div className="pe-14">
                {renderInput(currentStep, handleSubmit, state.answers)}
              </div>
            </BotMessage>
          )}

          <div ref={scrollRef} />
        </div>
      </div>

      <LiveSidebar
        answers={state.answers}
        currentStepId={currentStep?.id || ""}
        progressPct={progressPct}
      />
    </div>
  );
}

function renderInput(
  step: WizardStep,
  onSubmit: (v: unknown) => void,
  answers: WizardAnswers,
) {
  const initialValue = step.field
    ? (answers as unknown as Record<string, unknown>)[step.field]
    : undefined;
  switch (step.input) {
    case "continue":
      return <ContinueInput step={step} onSubmit={onSubmit} />;
    case "text":
      return (
        <TextInput step={step} onSubmit={onSubmit} initialValue={initialValue} />
      );
    case "textarea":
      return (
        <TextareaInput
          step={step}
          onSubmit={onSubmit}
          initialValue={initialValue}
        />
      );
    case "number":
      return (
        <NumberInput
          step={step}
          onSubmit={onSubmit}
          initialValue={initialValue}
        />
      );
    case "options":
      return <OptionsInput step={step} onSubmit={onSubmit} />;
    case "multiSelect":
      return (
        <MultiSelectInput
          step={step}
          onSubmit={onSubmit}
          initialValue={initialValue}
        />
      );
    case "vendors":
      return (
        <VendorsInput
          step={step}
          onSubmit={onSubmit}
          initialValue={initialValue}
        />
      );
    case "manager":
      return (
        <ManagerInput
          step={step}
          onSubmit={onSubmit}
          initialValue={initialValue}
        />
      );
  }
}
