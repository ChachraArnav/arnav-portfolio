import Link from "next/link";
import { getProject } from "@/data/projects";
import { FillerCheck } from "./filler-check";

/**
 * The latest project, shown big: its real screen recording in a browser frame
 * that settles into place as it scrolls in, and a live piece of its logic.
 */
export function Spotlight() {
  const project = getProject("interview-mirror");
  if (!project?.video) return null;
  const { video } = project;

  return (
    <section aria-labelledby="spotlight-title" className="section border-t border-line">
      <div className="container-page">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="text-sm text-subtle">Latest build</p>
            <h2
              id="spotlight-title"
              className="mt-3 text-4xl font-semibold tracking-tight text-text md:text-6xl"
            >
              An interviewer that lives in your browser.
            </h2>
          </div>
          <p className="text-base text-muted md:col-span-5">
            {project.title} asks you questions out loud, transcribes your answer with Whisper, has
            an on-device language model ask a follow-up and tracks your eye contact. Three AI
            models, no server, nothing uploaded.
          </p>
        </div>

        <div className="spotlight-stage mt-12 md:mt-16">
          <div className="spotlight-frame overflow-hidden rounded-[var(--radius-panel)] border border-line-strong bg-surface shadow-2xl">
            <div
              className="flex items-center gap-1.5 border-b border-line px-4 py-3"
              aria-hidden="true"
            >
              <span className="size-2.5 rounded-full bg-line-strong" />
              <span className="size-2.5 rounded-full bg-line-strong" />
              <span className="size-2.5 rounded-full bg-line-strong" />
              <span className="ml-3 text-2xs text-subtle">Interview Mirror</span>
            </div>
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <video
                src={video.src}
                poster={video.poster}
                aria-label={video.label}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="spotlight-video absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <FillerCheck />
          </div>
          <div className="flex flex-col gap-4 md:col-span-4 md:col-start-9">
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-text">Speech to text</dt>
                <dd className="text-muted">Whisper, run in the browser with Transformers.js</dd>
              </div>
              <div>
                <dt className="text-text">Follow-up questions</dt>
                <dd className="text-muted">Qwen 2.5 or Llama 3.2 on the GPU through WebLLM</dd>
              </div>
              <div>
                <dt className="text-text">Eye contact</dt>
                <dd className="text-muted">MediaPipe face landmarks, five times a second</dd>
              </div>
            </dl>
            <div className="mt-2 flex flex-wrap gap-3">
              <Link
                href={`/projects/${project.slug}`}
                className="rounded-[var(--radius-control)] bg-text px-4 py-2.5 text-sm font-medium text-bg"
              >
                Read the case study
              </Link>
              <a
                href={project.repository.url ?? "#"}
                className="rounded-[var(--radius-control)] border border-line-strong px-4 py-2.5 text-sm text-text"
              >
                Source code
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
