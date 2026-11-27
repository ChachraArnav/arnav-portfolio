import { siteConfig } from "@/config/site";
import { ogSize, renderOgImage } from "@/lib/og";

export const alt = siteConfig.title;
export const size = ogSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    kicker: "Software, data and AI engineering",
    title: siteConfig.name,
    subtitle: siteConfig.headline,
  });
}
