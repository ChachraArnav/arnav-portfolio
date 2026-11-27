"use client";

import { motion } from "motion/react";
import { useReduceMotion } from "@/lib/motion-pref";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

/**
 * Hero visual: a small, real dataflow graph of the systems Arnav has built.
 * Each lane is a project or role; hovering or focusing a node traces every
 * node upstream and downstream of it, and the caption explains that step.
 *
 * Static by default. The only automatic motion is a one-time edge draw on
 * load, which is skipped when the visitor prefers reduced motion.
 */

interface GraphNode {
  id: string;
  label: string;
  col: number;
  y: number;
  caption: string;
}

const COLS = [69, 217, 365, 511];
const NODE_W = 138;
const NODE_H = 34;

const columns = ["Inputs", "Processing", "Logic", "Outputs"];

const nodes: GraphNode[] = [
  {
    id: "cam",
    label: "Webcam + mic",
    col: 0,
    y: 64,
    caption: "A candidate answering spoken interview questions on camera in Interview Mirror.",
  },
  {
    id: "whisper",
    label: "Whisper speech",
    col: 1,
    y: 40,
    caption:
      "OpenAI's open-source Whisper, run in the browser with Transformers.js to transcribe each answer.",
  },
  {
    id: "face",
    label: "Face tracking",
    col: 1,
    y: 88,
    caption:
      "MediaPipe Face Landmarker estimates head angle and iris position five times a second to measure eye contact.",
  },
  {
    id: "llm",
    label: "On-device LLM",
    col: 2,
    y: 40,
    caption:
      "A small open language model on WebGPU checks the answer's structure, quotes the transcript as evidence and asks a follow-up.",
  },
  {
    id: "feedback",
    label: "Interview feedback",
    col: 3,
    y: 64,
    caption:
      "Delivery, structure and eye-contact feedback, with nothing uploaded: every model runs on the candidate's own device.",
  },
  {
    id: "ops",
    label: "Operational data",
    col: 0,
    y: 192,
    caption:
      "Paramedic operations data at York Region, the starting point for dashboards and dispatch analysis.",
  },
  {
    id: "market",
    label: "ETF price history",
    col: 0,
    y: 288,
    caption: "Historical data for 13 ETFs from Yahoo Finance, the input to MarketLens.",
  },
  {
    id: "docs",
    label: "Study notes",
    col: 0,
    y: 384,
    caption: "Lecture notes and readings a student pastes or uploads to Academic Decoder.",
  },
  {
    id: "users",
    label: "Team members",
    col: 0,
    y: 480,
    caption: "Managers and staff at an architectural firm, the users of EMAK Solutions.",
  },
  {
    id: "sql",
    label: "SQL extraction",
    col: 1,
    y: 168,
    caption: "SQL queries that pulled and shaped operational data for reporting at York Region.",
  },
  {
    id: "pandas",
    label: "Python · Pandas",
    col: 1,
    y: 240,
    caption:
      "Python data work: mapping-API travel-time workflows at York Region, and cleaning and feature engineering in MarketLens.",
  },
  {
    id: "nlp",
    label: "spaCy NLP",
    col: 1,
    y: 384,
    caption:
      "Sentence splitting, lemmas, part-of-speech tags, named entities and word vectors from one spaCy pass.",
  },
  {
    id: "web",
    label: "React client",
    col: 1,
    y: 480,
    caption:
      "The React and TypeScript interface for EMAK, where I worked on frontend functionality and API integration.",
  },
  {
    id: "ml",
    label: "Model comparison",
    col: 2,
    y: 288,
    caption:
      "Logistic regression, random forest and a neural network compared on the same features in MarketLens.",
  },
  {
    id: "quiz",
    label: "Summary + quiz",
    col: 2,
    y: 384,
    caption:
      "Word-frequency summary, and fill-in-the-blank questions with wrong answers drawn from the same notes.",
  },
  {
    id: "api",
    label: "Express API + JWT",
    col: 2,
    y: 480,
    caption:
      "EMAK's REST API, with JWT authentication and role-based access enforced on the server.",
  },
  {
    id: "bi",
    label: "Power BI dashboards",
    col: 3,
    y: 192,
    caption: "Dashboards used to identify operational bottlenecks and support staffing decisions.",
  },
  {
    id: "streamlit",
    label: "Streamlit dashboards",
    col: 3,
    y: 288,
    caption: "Interactive views of trends, risk indicators and model results in MarketLens.",
  },
  {
    id: "study",
    label: "Study material",
    col: 3,
    y: 384,
    caption: "A summary, key terms and a practice quiz, all quoted from the student's own notes.",
  },
  {
    id: "pg",
    label: "PostgreSQL",
    col: 3,
    y: 480,
    caption: "EMAK's system of record: users, projects, tasks and the activity log.",
  },
];

const edges: Array<[string, string]> = [
  ["cam", "whisper"],
  ["cam", "face"],
  ["whisper", "llm"],
  ["llm", "feedback"],
  ["face", "feedback"],
  ["ops", "sql"],
  ["ops", "pandas"],
  ["sql", "bi"],
  ["pandas", "bi"],
  ["market", "pandas"],
  ["pandas", "ml"],
  ["ml", "streamlit"],
  ["docs", "nlp"],
  ["nlp", "quiz"],
  ["quiz", "study"],
  ["users", "web"],
  ["web", "api"],
  ["api", "pg"],
];

const byId = new Map(nodes.map((n) => [n.id, n]));

function edgePath(fromId: string, toId: string): string {
  const a = byId.get(fromId);
  const b = byId.get(toId);
  if (!a || !b) return "";
  const x1 = (COLS[a.col] ?? 0) + NODE_W / 2;
  const x2 = (COLS[b.col] ?? 0) - NODE_W / 2;
  const mid = (x1 + x2) / 2;
  return `M ${x1} ${a.y} C ${mid} ${a.y}, ${mid} ${b.y}, ${x2} ${b.y}`;
}

/** Every node reachable upstream or downstream of `id`, plus the edges between them. */
export function traceGraph(id: string, edgeList: ReadonlyArray<readonly [string, string]> = edges) {
  const nodeSet = new Set<string>([id]);
  const walk = (current: string, direction: "down" | "up") => {
    for (const [from, to] of edgeList) {
      const next =
        direction === "down" ? (from === current ? to : null) : to === current ? from : null;
      if (next && !nodeSet.has(next)) {
        nodeSet.add(next);
        walk(next, direction);
      }
    }
  };
  walk(id, "down");
  walk(id, "up");
  // Only follow the linear chain through the hovered node, not sibling branches of its ancestors.
  const edgeSet = new Set(
    edgeList
      .filter(([from, to]) => nodeSet.has(from) && nodeSet.has(to))
      .map(([from, to]) => `${from}->${to}`),
  );
  return { nodes: nodeSet, edges: edgeSet };
}

/** One node per lane: the idle tour highlights each system in turn. */
export const TOUR = ["llm", "pandas", "nlp", "api", "sql"] as const;
const TOUR_INTERVAL_MS = 3400;

export function SystemGraph() {
  const [userActive, setUserActive] = useState<string | null>(null);
  const [tourIndex, setTourIndex] = useState<number | null>(null);
  const [tookOver, setTookOver] = useState(false);
  const reduceMotion = useReduceMotion();
  const figureRef = useRef<HTMLElement>(null);

  // Idle tour: runs only while the graph is on screen, the tab is visible and
  // nobody has interacted with it. Never runs with reduced motion.
  useEffect(() => {
    if (reduceMotion || tookOver) return;
    const figure = figureRef.current;
    if (!figure || typeof IntersectionObserver === "undefined") return;
    let visible = false;
    let timer: ReturnType<typeof setInterval> | null = null;
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };
    const start = () => {
      if (timer || !visible || document.hidden) return;
      timer = setInterval(() => {
        setTourIndex((i) => (i === null ? 0 : (i + 1) % TOUR.length));
      }, TOUR_INTERVAL_MS);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      if (visible) start();
      else stop();
    });
    const onVisibility = () => (document.hidden ? stop() : start());
    observer.observe(figure);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduceMotion, tookOver]);

  const setActive = (id: string | null) => {
    if (!tookOver) {
      setTookOver(true);
      setTourIndex(null);
    }
    setUserActive(id);
  };

  const touring = !tookOver && tourIndex !== null;
  const active = userActive ?? (touring ? (TOUR[tourIndex] ?? null) : null);
  const trace = useMemo(() => (active ? traceGraph(active) : null), [active]);
  const activeNode = active ? byId.get(active) : null;

  return (
    <figure ref={figureRef} className="relative">
      <svg
        viewBox="0 0 580 520"
        className="h-auto w-full overflow-visible"
        role="group"
        aria-label="Dataflow graph of systems I've built. Focus a node to read what it does."
      >
        {columns.map((label, i) => (
          <text
            key={label}
            x={COLS[i]}
            y={12}
            textAnchor="middle"
            className="fill-subtle text-[11px]"
            aria-hidden="true"
          >
            {label}
          </text>
        ))}

        <g aria-hidden="true">
          {edges.map(([from, to], i) => {
            const key = `${from}->${to}`;
            const state = trace ? (trace.edges.has(key) ? "active" : "dim") : "idle";
            const d = edgePath(from, to);
            return (
              <g key={key}>
                {/* Draw-in on load is pure CSS (.graph-draw), so server and client markup match. */}
                <path
                  d={d}
                  pathLength={1}
                  className="graph-edge graph-draw"
                  data-state={state}
                  style={{ "--i": i } as CSSProperties}
                />
                {state === "active" && !reduceMotion ? <path d={d} className="graph-flow" /> : null}
              </g>
            );
          })}
        </g>

        {nodes.map((node, i) => {
          const cx = COLS[node.col] ?? 0;
          const isActive = active === node.id;
          const inTrace = trace?.nodes.has(node.id) ?? false;
          const dim = trace !== null && !inTrace;
          return (
            <motion.g
              key={node.id}
              role="button"
              tabIndex={0}
              aria-label={`${node.label}. ${node.caption}`}
              aria-pressed={isActive}
              onPointerEnter={() => setActive(node.id)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(node.id)}
              onBlur={() => setActive(null)}
              onClick={() => setActive(node.id)}
              className="graph-node cursor-default outline-none [&:focus-visible>rect]:stroke-accent [&:focus-visible>rect]:[stroke-width:2]"
              initial={false}
              animate={{ opacity: dim ? 0.35 : 1 }}
              transition={{ duration: 0.25 }}
              style={{ "--i": i } as CSSProperties}
            >
              <rect
                x={cx - NODE_W / 2}
                y={node.y - NODE_H / 2}
                width={NODE_W}
                height={NODE_H}
                rx={6}
                className={
                  inTrace
                    ? "fill-surface-raised stroke-accent transition-colors"
                    : "fill-surface stroke-line-strong transition-colors"
                }
                strokeWidth={1}
              />
              <circle
                cx={cx - NODE_W / 2 + 12}
                cy={node.y}
                r={2.5}
                className={inTrace ? "fill-accent" : "fill-subtle"}
              />
              <text
                x={cx - NODE_W / 2 + 22}
                y={node.y + 4}
                className={inTrace ? "fill-text text-[11.5px]" : "fill-muted text-[11.5px]"}
              >
                {node.label}
              </text>
            </motion.g>
          );
        })}
      </svg>
      <figcaption className="mt-4 min-h-[3.5rem] max-w-[52ch] text-sm text-muted">
        {touring ? (
          <span className="mb-1.5 flex items-center gap-2 font-mono text-2xs text-subtle">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
            Auto-tour {tourIndex + 1}/{TOUR.length} · hover or tab to take over
          </span>
        ) : null}
        {activeNode ? (
          <>
            <span className="text-text">{activeNode.label}.</span> {activeNode.caption}
          </>
        ) : (
          "Hover or tab through the graph to trace how data moves through the systems I've built."
        )}
      </figcaption>
    </figure>
  );
}
