import { siteConfig } from "@/config/site";
import { getProject, projects } from "@/data/projects";
import { ogSize, renderOgImage } from "@/lib/og";

export const alt = "Project case study";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  return renderOgImage({
    kicker: `${siteConfig.name}, case study`,
    title: project?.title ?? siteConfig.name,
    subtitle: project?.tagline ?? siteConfig.headline,
  });
}
