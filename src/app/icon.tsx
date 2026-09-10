import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** App icon — pulse bars matching HealthMatics brand mark. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 3,
          background: "#1F1725",
          borderRadius: 7,
          paddingBottom: 7,
        }}
      >
        <div style={{ width: 4, height: 10, borderRadius: 1.5, background: "#F5F2EF" }} />
        <div style={{ width: 4, height: 15, borderRadius: 1.5, background: "#F5F2EF" }} />
        <div style={{ width: 4, height: 20, borderRadius: 1.5, background: "#EE6A4D" }} />
        <div style={{ width: 4, height: 13, borderRadius: 1.5, background: "#F5F2EF" }} />
      </div>
    ),
    { ...size },
  );
}
