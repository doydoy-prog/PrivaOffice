import type { ReactNode } from "react";

interface BotMessageProps {
  children: ReactNode;
  legalRef?: string;
  extra?: ReactNode;
}

export function BotMessage({ children, legalRef, extra }: BotMessageProps) {
  return (
    <div className="flex animate-slide-up items-start gap-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-navy text-lg font-bold text-gold">
        ע
      </div>
      <div className="flex-1 space-y-3">
        <div className="rounded-2xl border border-border bg-bg-card p-5 text-[15px] leading-relaxed text-navy shadow-soft">
          {children}
          {legalRef && (
            <div className="mt-3 inline-flex items-center gap-1 rounded-xl border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold-dark">
              <span className="font-bold">§</span>
              <span>{legalRef}</span>
            </div>
          )}
        </div>
        {extra}
      </div>
    </div>
  );
}

interface UserMessageProps {
  children: ReactNode;
}

export function UserMessage({ children }: UserMessageProps) {
  return (
    <div className="flex animate-slide-up items-start gap-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gold text-xs font-bold text-navy">
        אח
      </div>
      <div className="flex-1 pt-1">
        <div className="rounded-2xl bg-navy px-5 py-4 text-[15px] leading-relaxed text-white shadow-soft">
          {children}
        </div>
      </div>
    </div>
  );
}

export function TypingDots() {
  return (
    <div className="flex animate-slide-up items-start gap-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-navy text-lg font-bold text-gold">
        ע
      </div>
      <div className="flex gap-1 rounded-2xl border border-border bg-bg-card px-5 py-4 shadow-soft">
        <span className="h-2 w-2 animate-[typing_1.4s_ease-in-out_infinite] rounded-full bg-text-soft [animation-delay:0s]" />
        <span className="h-2 w-2 animate-[typing_1.4s_ease-in-out_infinite] rounded-full bg-text-soft [animation-delay:0.2s]" />
        <span className="h-2 w-2 animate-[typing_1.4s_ease-in-out_infinite] rounded-full bg-text-soft [animation-delay:0.4s]" />
        <style>{`@keyframes typing {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }`}</style>
      </div>
    </div>
  );
}

interface HelpCardProps {
  title: string;
  text?: string;
  examples?: string[];
  onExample?: (ex: string) => void;
}

export function HelpCard({ title, text, examples, onExample }: HelpCardProps) {
  return (
    <div className="rounded-xl border border-gold/35 bg-gradient-to-br from-[#fbf7ec] to-[#f5ecd6] p-4 text-sm text-navy">
      <div className="mb-2 flex items-center gap-1.5 text-[12.5px] font-semibold uppercase tracking-wider text-gold-dark">
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {title}
      </div>
      {text && <div className="leading-relaxed">{text}</div>}
      {examples && examples.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {examples.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => onExample?.(ex)}
              className="rounded-2xl border border-gold/40 bg-white px-3 py-1 text-xs text-navy-light transition-all hover:-translate-y-px hover:border-gold hover:bg-gold hover:text-navy"
            >
              {ex}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
