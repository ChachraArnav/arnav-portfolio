/** Joins class names, skipping falsy values. Small enough not to need a dependency. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** rel value for links that open a new tab. */
export const externalRel = "noopener noreferrer";

/** Builds an absolute URL from a site-relative path. */
export function absoluteUrl(base: string, path = "/"): string {
  return new URL(path, base.endsWith("/") ? base : `${base}/`).toString();
}
