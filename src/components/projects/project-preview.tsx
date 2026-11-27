import type { PreviewKind } from "@/types/content";

/**
 * Code-drawn schematic previews used until real screenshots are added.
 * They describe each project's *shape* (a chart, a task board, a pipeline),
 * never real results. Shapes are fixed so nothing implies actual data.
 */

const common = "h-full w-full";

function MirrorPreview() {
  // A dressing-room mirror ringed with bulbs, a transcript with one filler
  // word marked, and a rubric being ticked off. Shapes only, no results.
  const bulbs: Array<[number, number]> = [];
  for (let i = 0; i < 5; i++) bulbs.push([22 + i * 22, 10], [22 + i * 22, 120]);
  for (let i = 0; i < 4; i++) bulbs.push([10, 28 + i * 25], [122, 28 + i * 25]);
  const rubric = ["S", "T", "A", "R"];
  return (
    <svg viewBox="0 0 300 130" className={common} aria-hidden="true">
      <rect x="16" y="16" width="100" height="98" rx="10" className="fill-surface stroke-line-strong" strokeWidth="1" />
      <circle cx="66" cy="54" r="15" className="fill-line-strong" />
      <path d="M38 112 C38 86 94 86 94 112 Z" className="fill-line-strong" />
      {bulbs.map(([x, y], i) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r="3.2"
          className="mirror-bulb fill-accent"
          style={{ animationDelay: `${(i % 7) * 140}ms` }}
        />
      ))}
      {[22, 38, 54].map((y, i) => (
        <rect key={y} x="142" y={y} width={[138, 112, 126][i]} height="6" rx="3" className="fill-line-strong" />
      ))}
      <rect x="196" y="35" width="26" height="12" rx="6" className="mirror-filler fill-signal-soft stroke-accent" strokeWidth="1" />
      <text x="209" y="44" textAnchor="middle" className="fill-text text-[9px] font-mono">um</text>
      {rubric.map((letter, i) => (
        <g key={letter} className="mirror-tick" style={{ animationDelay: `${i * 380}ms` }}>
          <rect
            x={142 + i * 36}
            y="80"
            width="30"
            height="30"
            rx="6"
            className={i < 3 ? "fill-accent-soft stroke-accent" : "fill-surface stroke-line-strong"}
            strokeWidth="1"
          />
          <text
            x={157 + i * 36}
            y="99"
            textAnchor="middle"
            className={i < 3 ? "fill-text text-[11px]" : "fill-subtle text-[11px]"}
          >
            {letter}
          </text>
        </g>
      ))}
    </svg>
  );
}

function MarketPreview() {
  const line =
    "M10 92 L40 84 L62 88 L88 70 L112 74 L138 58 L160 63 L186 46 L210 52 L236 38 L262 44 L290 30";
  const upper =
    "M10 82 L40 72 L62 76 L88 56 L112 60 L138 44 L160 48 L186 30 L210 36 L236 22 L262 28 L290 14";
  const lower =
    "M290 46 L262 60 L236 54 L210 68 L186 62 L160 78 L138 72 L112 88 L88 84 L62 100 L40 96 L10 102";
  return (
    <svg viewBox="0 0 300 130" className={common} aria-hidden="true" preserveAspectRatio="none">
      {[30, 60, 90].map((y) => (
        <line key={y} x1="0" x2="300" y1={y} y2={y} className="stroke-line" strokeWidth="1" />
      ))}
      <path d={`${upper} ${lower.replace("M", "L")} Z`} className="fill-signal-soft" />
      <path d={line} className="stroke-accent" strokeWidth="1.75" fill="none" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
        <rect
          key={i}
          x={14 + i * 21.5}
          y={118 - ((i * 7) % 12)}
          width="10"
          height={4 + ((i * 7) % 12)}
          className="fill-line-strong"
        />
      ))}
    </svg>
  );
}

function WorkflowPreview() {
  const columns = [
    { x: 10, cards: 3 },
    { x: 108, cards: 2 },
    { x: 206, cards: 1 },
  ];
  return (
    <svg viewBox="0 0 300 130" className={common} aria-hidden="true">
      {columns.map((col, ci) => (
        <g key={col.x}>
          <rect x={col.x} y="8" width="84" height="6" rx="2" className="fill-line-strong" />
          {Array.from({ length: col.cards }).map((_, i) => (
            <g key={i}>
              <rect
                x={col.x}
                y={22 + i * 34}
                width="84"
                height="28"
                rx="4"
                className={
                  ci === 1 && i === 0
                    ? "fill-accent-soft stroke-accent"
                    : "fill-surface-raised stroke-line"
                }
                strokeWidth="1"
              />
              <rect
                x={col.x + 8}
                y={30 + i * 34}
                width="44"
                height="4"
                rx="2"
                className="fill-muted/60"
              />
              <circle cx={col.x + 72} cy={36 + i * 34} r="5" className="fill-line-strong" />
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

function PipelinePreview() {
  const stages = [10, 82, 154, 226];
  return (
    <svg viewBox="0 0 300 130" className={common} aria-hidden="true">
      {stages.slice(0, -1).map((x) => (
        <path
          key={x}
          d={`M${x + 58} 65 L${x + 72} 65`}
          className="stroke-line-strong"
          strokeWidth="1.5"
        />
      ))}
      <rect
        x="10"
        y="30"
        width="58"
        height="70"
        rx="4"
        className="fill-surface-raised stroke-line"
      />
      {[42, 52, 62, 72, 82].map((y, i) => (
        <rect
          key={y}
          x="18"
          y={y}
          width={i % 2 ? 30 : 42}
          height="3"
          rx="1.5"
          className="fill-muted/50"
        />
      ))}
      <rect
        x="82"
        y="45"
        width="58"
        height="40"
        rx="4"
        className="fill-surface-raised stroke-line"
      />
      <rect
        x="154"
        y="45"
        width="58"
        height="40"
        rx="20"
        className="fill-accent-soft stroke-accent"
      />
      <circle cx="183" cy="65" r="6" className="fill-accent" />
      <rect
        x="226"
        y="30"
        width="64"
        height="70"
        rx="4"
        className="fill-surface-raised stroke-line"
      />
      {[42, 58, 74].map((y) => (
        <g key={y}>
          <rect x="234" y={y} width="6" height="6" rx="1" className="fill-none stroke-signal" />
          <rect x="246" y={y + 1.5} width="34" height="3" rx="1.5" className="fill-muted/50" />
        </g>
      ))}
    </svg>
  );
}

function TrackerPreview() {
  const rings = [
    { cx: 60, dash: "70 100" },
    { cx: 150, dash: "45 100" },
    { cx: 240, dash: "85 100" },
  ];
  return (
    <svg viewBox="0 0 300 130" className={common} aria-hidden="true">
      {rings.map((ring) => (
        <g key={ring.cx} transform={`rotate(-90 ${ring.cx} 60)`}>
          <circle
            cx={ring.cx}
            cy="60"
            r="30"
            pathLength={100}
            className="fill-none stroke-line"
            strokeWidth="6"
          />
          <circle
            cx={ring.cx}
            cy="60"
            r="30"
            pathLength={100}
            strokeDasharray={ring.dash}
            className="fill-none stroke-accent"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </g>
      ))}
      {[30, 120, 210].map((x) => (
        <rect key={x} x={x + 12} y="110" width="36" height="4" rx="2" className="fill-muted/50" />
      ))}
    </svg>
  );
}

export function ProjectPreview({ kind }: { kind: PreviewKind }) {
  switch (kind) {
    case "mirror":
      return <MirrorPreview />;
    case "market":
      return <MarketPreview />;
    case "workflow":
      return <WorkflowPreview />;
    case "pipeline":
      return <PipelinePreview />;
    case "tracker":
      return <TrackerPreview />;
  }
}
