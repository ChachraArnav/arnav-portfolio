import "server-only";
import { cacheLife } from "next/cache";
import { siteConfig } from "@/config/site";

/**
 * Public GitHub repositories, fetched on the server with the official REST API.
 *
 * - Runs only on the server, so an optional GITHUB_TOKEN never reaches the browser.
 * - Results are cached for an hour (`cacheLife('hours')`), keeping well inside
 *   GitHub's unauthenticated rate limit of 60 requests/hour.
 * - On any failure the caller receives `{ ok: false }` and renders fallback
 *   content; the failure is cached briefly so a GitHub outage isn't retried on
 *   every request.
 */

export interface RepoSummary {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  pushedAt: string;
}

export type ReposResult = { ok: true; repos: RepoSummary[] } | { ok: false; reason: string };

interface GitHubRepoResponse {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  private: boolean;
}

function isRepoArray(value: unknown): value is GitHubRepoResponse[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as GitHubRepoResponse).name === "string" &&
        typeof (item as GitHubRepoResponse).html_url === "string",
    )
  );
}

export function toRepoSummaries(data: GitHubRepoResponse[], limit: number): RepoSummary[] {
  return data
    .filter((repo) => !repo.fork && !repo.archived && !repo.private)
    // Repos without a description are usually course assignments or scratch work.
    .filter((repo) => (repo.description ?? "").trim().length > 0)
    .slice(0, limit)
    .map((repo) => ({
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      pushedAt: repo.pushed_at,
    }));
}

export async function getRecentRepos(limit = 4): Promise<ReposResult> {
  "use cache";

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "arnav-chachra-portfolio",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const endpoint = `https://api.github.com/users/${encodeURIComponent(
    siteConfig.githubUsername,
  )}/repos?sort=pushed&per_page=30&type=owner`;

  try {
    const response = await fetch(endpoint, {
      headers,
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      cacheLife("minutes");
      return { ok: false, reason: `GitHub responded with ${response.status}` };
    }
    const data: unknown = await response.json();
    if (!isRepoArray(data)) {
      cacheLife("minutes");
      return { ok: false, reason: "Unexpected response shape" };
    }
    cacheLife("hours");
    return { ok: true, repos: toRepoSummaries(data, limit) };
  } catch {
    cacheLife("minutes");
    return { ok: false, reason: "GitHub could not be reached" };
  }
}
