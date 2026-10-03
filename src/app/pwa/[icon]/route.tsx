import { ImageResponse } from "next/og";

/* App icons for the web app manifest, prerendered at build time. */

const MARK =
  "M181.46,106.5c5.43,5.43,8.31,12.92,7.9,20.59l-3.48,66.46-1.62,30.91-49.15-9.76-6.2-78.12-61.31-61.32,21.2,242.36-53.56-9.58L0,27.29l14.39-5.24L61.45,4.92,74.96,0l53.96,53.96,52.54,52.54h0Z";

const ICONS = {
  "icon-192.png": { size: 192, maskable: false },
  "icon-512.png": { size: 512, maskable: false },
  "maskable-192.png": { size: 192, maskable: true },
  "maskable-512.png": { size: 512, maskable: true },
} as const;

export function generateStaticParams() {
  return Object.keys(ICONS).map((icon) => ({ icon }));
}

export async function GET(_request: Request, { params }: RouteContext<"/pwa/[icon]">) {
  const spec = ICONS[(await params).icon as keyof typeof ICONS];
  if (!spec) return new Response("Not found", { status: 404 });

  const { size, maskable } = spec;
  // Maskable icons are full-bleed with the mark inside the 80% safe zone.
  const markHeight = size * (maskable ? 0.44 : 0.56);
  const markWidth = (markHeight * 190) / 318;

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#141414",
          borderRadius: maskable ? 0 : size * 0.22,
        }}
      >
        <svg width={markWidth} height={markHeight} viewBox="0 0 190 318" style={{ marginLeft: markWidth * 0.06 }}>
          <path fill="#ecebe6" d={MARK} />
        </svg>
      </div>
    </div>,
    { width: size, height: size },
  );
}
