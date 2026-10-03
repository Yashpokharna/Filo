"use client";

import qrcode from "qrcode-generator";
import { useMemo, useSyncExternalStore } from "react";

const noop = () => () => {};

/** QR code for a path on the current site (origin resolved in the browser). */
export function QrCode({ path, className }: { path: string; className?: string }) {
  const origin = useSyncExternalStore(
    noop,
    () => window.location.origin,
    () => "",
  );

  const cells = useMemo(() => {
    if (!origin) return null;
    const qr = qrcode(0, "M");
    qr.addData(`${origin}${path}`);
    qr.make();
    const count = qr.getModuleCount();
    let d = "";
    for (let r = 0; r < count; r++) for (let c = 0; c < count; c++) if (qr.isDark(r, c)) d += `M${c},${r}h1v1h-1z`;
    return { count, d };
  }, [origin, path]);

  return (
    <div className={className} aria-label={`QR code linking to ${origin}${path}`} role="img">
      {cells ? (
        <svg
          viewBox={`-2 -2 ${cells.count + 4} ${cells.count + 4}`}
          className="block size-full"
          shapeRendering="crispEdges"
        >
          <rect x="-2" y="-2" width={cells.count + 4} height={cells.count + 4} fill="#ffffff" />
          <path d={cells.d} fill="#141414" />
        </svg>
      ) : (
        <div className="size-full animate-pulse rounded bg-surface" />
      )}
    </div>
  );
}
