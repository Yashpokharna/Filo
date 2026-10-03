import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#161616" }}>
        <svg width="72" height="120" viewBox="0 0 190 318">
          <path
            fill="#faf8f4"
            d="M181.46,106.5c5.43,5.43,8.31,12.92,7.9,20.59l-3.48,66.46-1.62,30.91-49.15-9.76-6.2-78.12-61.31-61.32,21.2,242.36-53.56-9.58L0,27.29l14.39-5.24L61.45,4.92,74.96,0l53.96,53.96,52.54,52.54h0Z"
          />
        </svg>
      </div>
    ),
    size,
  );
}
