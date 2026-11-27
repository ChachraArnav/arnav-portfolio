/**
 * Filler-word and hedge detection, the same rules Interview Mirror uses on
 * its transcripts (src/lib/analysis.ts in that repo). Rule-based, no model.
 */

export type MarkKind = "filler" | "hedge";

export interface Mark {
  kind: MarkKind;
  start: number;
  end: number;
  text: string;
}

const FILLER_SOUNDS = /\b(?:u+m+|u+h+|uh-huh|e+r+m+|er|a+h+|h+m+|m{2,})\b/gi;

const FILLER_PHRASES: RegExp[] = [
  /(?:,\s*|\b(?:and|so|just|um|uh)\s+)(like)\b/gi,
  /\b(like)(?=\s*,)/gi,
  /\b(you know)(?=\s*[,.?!]|\s*$)/gi,
  /\b(I mean)(?=\s*,)/gi,
  /\b(basically|literally)\b/gi,
];

const HEDGES =
  /\b(I think|I guess|I feel like|kind of|sort of|maybe|probably|hopefully|I'm not sure)\b/gi;

function collect(text: string, pattern: RegExp, kind: MarkKind, group = 0): Mark[] {
  const marks: Mark[] = [];
  for (const match of text.matchAll(pattern)) {
    const phrase = match[group] ?? match[0];
    const offset = (match.index ?? 0) + match[0].lastIndexOf(phrase);
    marks.push({ kind, start: offset, end: offset + phrase.length, text: phrase });
  }
  return marks;
}

/** Filler words and hedges, sorted, with overlaps removed. */
export function findMarks(text: string): Mark[] {
  const all = [
    ...collect(text, FILLER_SOUNDS, "filler"),
    ...FILLER_PHRASES.flatMap((p) => collect(text, p, "filler", 1)),
    ...collect(text, HEDGES, "hedge"),
  ].sort((a, b) => a.start - b.start || b.end - a.end);
  const kept: Mark[] = [];
  for (const mark of all) {
    const last = kept[kept.length - 1];
    if (last && mark.start < last.end) continue;
    kept.push(mark);
  }
  return kept;
}

/** Split text into plain and marked pieces for rendering. */
export function segment(text: string, marks: Mark[]) {
  const parts: Array<{ text: string; kind: MarkKind | null }> = [];
  let at = 0;
  for (const m of marks) {
    if (m.start > at) parts.push({ text: text.slice(at, m.start), kind: null });
    parts.push({ text: text.slice(m.start, m.end), kind: m.kind });
    at = m.end;
  }
  if (at < text.length) parts.push({ text: text.slice(at), kind: null });
  return parts;
}
