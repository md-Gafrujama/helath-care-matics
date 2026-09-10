import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 10,
          background: "#1F1725",
          paddingBottom: 42,
        }}
      >
        <div
          style={{
            width: 18,
            height: 48,
            borderRadius: 5,
            background: "#F5F2EF",
          }}
        />
        <div
          style={{
            width: 18,
            height: 72,
            borderRadius: 5,
            background: "#F5F2EF",
          }}
        />
        <div
          style={{
            width: 18,
            height: 96,
            borderRadius: 5,
            background: "#EE6A4D",
          }}
        />
        <div
          style={{
            width: 18,
            height: 60,
            borderRadius: 5,
            background: "#F5F2EF",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
