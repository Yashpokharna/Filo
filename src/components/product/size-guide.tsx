"use client";

import { Sheet } from "@/components/ui/sheet";
import { CloseIcon } from "@/components/ui/icons";

export function SizeGuide({ open, onClose, sizes }: { open: boolean; onClose: () => void; sizes: string[] }) {
  return (
    <Sheet open={open} onClose={onClose} label="Size guide">
      <div className="flex items-center justify-between border-b border-line px-6 py-5">
        <p className="text-sm font-medium">Size guide</p>
        <button type="button" onClick={onClose} className="-mr-2 grid size-10 place-items-center" aria-label="Close size guide">
          <CloseIcon />
        </button>
      </div>
      <div className="px-6 py-8">
        <p className="type-heading text-4xl leading-tight">Find your waist size</p>
        <p className="mt-4 text-sm leading-relaxed text-fg/80">
          FILO trousers are sized by waist measurement in inches. Wrap a soft tape around your natural waist — where you
          normally wear your trousers — keeping it snug but not tight. Between sizes? Choose the larger size.
        </p>

        <table className="mt-8 w-full text-sm tabular-nums">
          <thead>
            <tr className="border-b border-fg text-left">
              <th className="py-3 font-medium">FILO size</th>
              <th className="py-3 font-medium">Waist (in)</th>
              <th className="py-3 font-medium">Waist (cm)</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((s) => (
              <tr key={s} className="border-b border-line">
                <td className="py-3">{s}</td>
                <td className="py-3 text-fg/80">{s}″</td>
                <td className="py-3 text-fg/80">{Math.round(Number(s) * 2.54)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 rounded-2xl bg-surface p-5 text-sm leading-relaxed text-fg/80">
          Still unsure? Write to us at{" "}
          <a href="mailto:hello@filoclothing.com" className="underline underline-offset-4">
            hello@filoclothing.com
          </a>{" "}
          with your usual size and we’ll help you choose.
        </div>
      </div>
    </Sheet>
  );
}
