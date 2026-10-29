import { ImageResponse } from "next/og";

export const alt = "Daniel Brooks, Senior Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Social share card (1200x630). Satori supports flexbox only, so no grid here.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0a0a0a",
          color: "#fafafa",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: "#a3a3a3" }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#f5f5f5" }} />
          OPEN TO SELECT PROJECTS
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 120, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>Daniel Brooks</div>
          <div style={{ marginTop: 28, fontSize: 44, color: "#a3a3a3" }}>Senior Software Engineer</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#6b6b6b" }}>
          <span>AI/ML and Data Engineering</span>
          <span>Ashburn, Virginia, USA</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
