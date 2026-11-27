import { ArrowUpRight, Star } from "lucide-react";
import { GitHubIcon } from "@/components/icons/brand";
import { siteConfig } from "@/config/site";
import { getRecentRepos } from "@/lib/github";
import { externalRel } from "@/lib/utils";

const dateFormat = new Intl.DateTimeFormat("en-CA", { month: "short", year: "numeric" });

function ProfileLink() {
  return (
    <a
      href={siteConfig.links.github}
      target="_blank"
      rel={externalRel}
      className="link-underline inline-flex items-center gap-1.5 text-sm text-text"
    >
      <GitHubIcon size={14} />
      github.com/{siteConfig.githubUsername}
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

/** Server component: recent public repositories, or a plain profile link if GitHub is unavailable. */
export async function GitHubActivity() {
  const result = await getRecentRepos(4);

  if (!result.ok || result.repos.length === 0) {
    return (
      <div className="flex flex-col gap-3 rounded-[var(--radius-panel)] border border-dashed border-line p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Recent repositories are loaded from GitHub. They aren&apos;t available right now, but
          everything is on my profile.
        </p>
        <ProfileLink />
      </div>
    );
  }

  return (
    <div>
      <ul className="grid gap-px overflow-hidden rounded-[var(--radius-panel)] border border-line bg-line sm:grid-cols-2">
        {result.repos.map((repo) => (
          <li key={repo.name} className="bg-surface">
            <a
              href={repo.url}
              target="_blank"
              rel={externalRel}
              className="group flex h-full flex-col p-5 transition-colors hover:bg-surface-raised"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="truncate font-mono text-sm text-text">{repo.name}</span>
                <ArrowUpRight
                  size={14}
                  aria-hidden
                  className="shrink-0 text-subtle group-hover:text-accent"
                />
              </span>
              <span className="mt-2 line-clamp-2 text-sm text-muted">
                {repo.description ?? "No description"}
              </span>
              <span className="mt-auto flex flex-wrap gap-x-4 pt-4 text-2xs text-subtle">
                {repo.language ? <span>{repo.language}</span> : null}
                {repo.stars > 0 ? (
                  <span className="inline-flex items-center gap-1">
                    <Star size={11} aria-hidden />
                    {repo.stars}
                    <span className="sr-only">stars</span>
                  </span>
                ) : null}
                <span>Updated {dateFormat.format(new Date(repo.pushedAt))}</span>
              </span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <ProfileLink />
      </div>
    </div>
  );
}

export function GitHubActivitySkeleton() {
  return (
    <div
      className="grid gap-px overflow-hidden rounded-[var(--radius-panel)] border border-line bg-line sm:grid-cols-2"
      aria-hidden="true"
    >
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-32 bg-surface p-5">
          <div className="h-3 w-32 rounded bg-surface-raised" />
          <div className="mt-4 h-2.5 w-full rounded bg-surface-raised" />
          <div className="mt-2 h-2.5 w-2/3 rounded bg-surface-raised" />
        </div>
      ))}
    </div>
  );
}
