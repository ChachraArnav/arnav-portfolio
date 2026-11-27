import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/** Shared Open Graph card layout. Uses the default system font so no font files are fetched. */
export function renderOgImage({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle: string;
}) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "#161513",
        color: "#eee8df",
        backgroundImage:
          "linear-gradient(to right, rgba(238,232,223,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(238,232,223,0.04) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, color: "#a39d93" }}
      >
        <div
          style={{
            display: "flex",
            width: 44,
            height: 44,
            border: "2px solid #423f39",
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            color: "#c8a26b",
            fontSize: 18,
          }}
        >
          AC
        </div>
        {kicker}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>
          {title}
        </div>
        <div style={{ marginTop: 28, fontSize: 34, color: "#a39d93", maxWidth: 960 }}>
          {subtitle}
        </div>
      </div>
      <div style={{ display: "flex", height: 4, width: 120, background: "#c8a26b" }} />
    </div>,
    ogSize,
  );
}
