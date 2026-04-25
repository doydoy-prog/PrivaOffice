export default function ScoreRing({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  const circumference = 2 * Math.PI * 34;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        viewBox="0 0 80 80"
        className="h-20 w-20"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx="40"
          cy="40"
          r="34"
          fill="none"
          stroke="rgba(255,255,255,.12)"
          strokeWidth="6"
        />
        <circle
          cx="40"
          cy="40"
          r="34"
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset .8s" }}
        />
        <text
          x="40"
          y="40"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#fff"
          fontSize="22"
          fontWeight="800"
          style={{
            transform: "rotate(90deg)",
            transformOrigin: "center",
          }}
        >
          {clamped}%
        </text>
      </svg>
      <div
        className="text-[11px] font-semibold"
        style={{ color: "var(--color-gold)" }}
      >
        ציון תאימות
      </div>
    </div>
  );
}
