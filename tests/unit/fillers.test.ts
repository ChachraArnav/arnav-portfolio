import { describe, expect, it } from "vitest";
import { findMarks, segment } from "@/lib/fillers";

describe("filler check", () => {
  it("marks fillers and hedges, and 'like' only in context", () => {
    const text = "So, um, I like Python and, like, I think it was basically fine, you know.";
    expect(findMarks(text).map((m) => `${m.kind}:${m.text}`)).toEqual([
      "filler:um",
      "filler:like",
      "hedge:I think",
      "filler:basically",
      "filler:you know",
    ]);
  });

  it("segments back into the original text", () => {
    const text = "Um, maybe we shipped it.";
    expect(segment(text, findMarks(text)).map((p) => p.text).join("")).toBe(text);
  });
});
