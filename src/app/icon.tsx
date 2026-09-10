import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** App icon, HealthMatics pine mark with ECG pulse. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0C5245",
          borderRadius: 8,
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 64 64"
          fill="none"
        >
          <path
            d="M14 33h8.5l4-12 5.5 28 5-16H50"
            stroke="#E8F3EF"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="45.5" cy="33" r="3.6" fill="#B0842B" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
