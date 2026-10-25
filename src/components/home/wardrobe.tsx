"use client";

import { useLenis } from "lenis/react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type AnimationPlaybackControls,
} from "motion/react";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { EASE } from "@/components/motion";
import { ButtonLink, TextLink } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CloseIcon } from "@/components/ui/icons";
import Image from "@/components/ui/image";
import { cn, formatPrice } from "@/lib/format";
import { useIntroDone } from "@/lib/store";

export type WardrobeColour = {
  handle: string;
  color: string;
  swatch: string;
  /** Up to two photographs: front, then an alternate view. */
  images: string[];
  available: boolean;
};

export type WardrobeItem = {
  family: string;
  name: string;
  fabric: string;
  lead: string;
  /** Lowest price across the style's colourways. */
  price: number;
  colours: WardrobeColour[];
};

/* ---------------------------------------------------------------- print -- */

/** useId, reduced to characters that are safe inside url(#…) references. */
const useSvgId = () => `w${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

/** Image sizes on the rail; the fitting room layers a sharper copy on top. */
const RAIL_SIZES = "(min-width:768px) 210px, 40vw";
const STAGE_SIZES = "(min-width:768px) 36vw, 80vw";

/**
 * A lookbook print: the colourway's photograph on matte paper, gripped by the
 * hanger clips. Padding is in % of width so the print scales as one piece
 * (5 : 7) between the rail, the flight and the stage.
 */
function Print({
  colour,
  label,
  view = 0,
  sharp = false,
  className,
}: {
  colour: WardrobeColour;
  label: string;
  /** Which photograph of the colourway to show. */
  view?: number;
  /** Add a high-resolution layer (fitting room). */
  sharp?: boolean;
  className?: string;
}) {
  const src = colour.images[view] ?? colour.images[0];
  return (
    <div
      className={cn(
        "@container relative bg-[#f4f0e7] px-[5%] pb-[16%] pt-[6%] shadow-[0_22px_34px_-16px_var(--cast),0_2px_5px_rgb(0_0_0/0.1)]",
        className,
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#e4e1da]">
        <AnimatePresence initial={false}>
          <motion.div
            key={src}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.15 } }}
            transition={{ duration: 0.5 }}
          >
            <Image src={src} alt="" fill sizes={RAIL_SIZES} className="object-cover" />
            {sharp && <Image src={src} alt="" fill sizes={STAGE_SIZES} className="object-cover" />}
          </motion.div>
        </AnimatePresence>
        <span className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgb(0_0_0/0.06)]" />
      </div>
      <p className="absolute inset-x-[5%] bottom-[5%] flex items-baseline justify-between font-mono text-[5cqw] leading-none tracking-normal text-black/55">
        <span>FILO</span>
        <span className="truncate pl-2">{label}</span>
      </p>
    </div>
  );
}

/* --------------------------------------------------------------- hanger -- */

/** Clip hanger in a 120 × 66 box; the clips grip the waistband at y = 55. */
function Hanger() {
  const id = useSvgId();
  return (
    <svg viewBox="0 0 120 66" className="relative z-10 block h-auto w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id={`${id}s`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#7d8288" />
          <stop offset="0.4" stopColor="#f3f4f5" />
          <stop offset="0.65" stopColor="#a4a8ad" />
          <stop offset="1" stopColor="#5b5f64" />
        </linearGradient>
        <linearGradient id={`${id}w`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#dcb991" />
          <stop offset="0.5" stopColor="#c19466" />
          <stop offset="1" stopColor="#9b6f46" />
        </linearGradient>
        <linearGradient id={`${id}m`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#eceef0" />
          <stop offset="0.55" stopColor="#a9adb2" />
          <stop offset="1" stopColor="#6c7075" />
        </linearGradient>
      </defs>
      <path
        d="M60 41 V21 C60 15 67 13.5 67 8 C67 3.6 63.6 1.2 60 1.2 C56.4 1.2 53.4 3.6 53.4 7"
        fill="none"
        stroke={`url(#${id}s)`}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <rect x="57.2" y="35.5" width="5.6" height="6.5" rx="1.2" fill={`url(#${id}m)`} />
      <rect x="6" y="40" width="108" height="8.5" rx="4.25" fill={`url(#${id}w)`} />
      <rect x="10" y="41.1" width="100" height="1.3" rx="0.65" fill="#fff" opacity="0.4" />
      <rect x="6" y="40" width="108" height="8.5" rx="4.25" fill="none" stroke="rgb(0 0 0 / 0.12)" strokeWidth="0.5" />
      {[24, 96].map((x) => (
        <g key={x}>
          <rect x={x - 1.1} y="47" width="2.2" height="4" fill={`url(#${id}m)`} />
          <rect x={x - 6.5} y="50" width="13" height="13.5" rx="1.8" fill={`url(#${id}m)`} />
          <path d={`M${x - 6.5} 56.4 H${x + 6.5}`} stroke="rgb(0 0 0 / 0.22)" strokeWidth="0.6" />
          <path d={`M${x - 5.2} 51.3 H${x + 5.2}`} stroke="#fff" strokeOpacity="0.55" strokeWidth="0.6" />
          <rect x={x - 6.5} y="61.4" width="13" height="2.1" rx="0.9" fill="#3a3c3f" opacity="0.55" />
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ tag -- */

/** Price tag on a string from the clip. `flip` hangs it on the left clip instead. */
function HangTag({ no, item, flip }: { no: string; item: WardrobeItem; flip: boolean }) {
  const s = flip ? -1 : 1;
  return (
    <motion.div
      className={cn(
        "pointer-events-none absolute top-[4%] z-30 w-[6.5rem] origin-top",
        flip ? "right-[73%]" : "left-[73%]",
      )}
      initial={{ opacity: 0, rotate: -28 * s, y: -6 }}
      animate={{ opacity: 1, rotate: -5 * s, y: 0 }}
      exit={{ opacity: 0, rotate: 12 * s, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 240, damping: 13 }}
    >
      <span className="absolute -top-[14px] left-1/2 h-[18px] w-px -translate-x-1/2 bg-[#141414]/45" />
      <div className="relative rounded-[3px] bg-[#f4f0e7] px-2.5 pb-2.5 pt-4 text-[#141414] shadow-[0_12px_24px_-10px_rgb(0_0_0/0.45)] [clip-path:polygon(14%_0,86%_0,100%_9%,100%_100%,0_100%,0_9%)]">
        <span className="absolute left-1/2 top-1.5 size-1.5 -translate-x-1/2 rounded-full bg-[#141414]/20 ring-1 ring-[#141414]/25" />
        <p className="flex justify-between font-mono text-[9px] tracking-normal text-black/50">
          <span>FILO</span>
          <span>No.{no}</span>
        </p>
        <p className="mt-1.5 text-[13px] font-medium leading-tight">{item.name}</p>
        <p className="mt-0.5 text-[10px] text-black/55">{item.fabric}</p>
        <p className="mt-2 border-t border-dashed border-black/20 pt-1.5 text-[11px] tabular-nums">
          From {formatPrice(item.price)}
        </p>
      </div>
    </motion.div>
  );
}

/* ----------------------------------------------------------------- slot -- */

type Kick = (velocity: number) => void;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

function Slot({
  item,
  index,
  total,
  colour,
  hovered,
  dimmed,
  offset,
  out,
  shown,
  register,
  garment,
  trigger,
  onEnter,
  onOpen,
}: {
  item: WardrobeItem;
  index: number;
  total: number;
  colour: number;
  hovered: boolean;
  dimmed: boolean;
  offset: number;
  out: boolean;
  shown: boolean;
  register: (index: number, kick: Kick | null) => void;
  garment: (el: HTMLDivElement | null) => void;
  trigger: (el: HTMLButtonElement | null) => void;
  onEnter: (index: number, e: React.PointerEvent) => void;
  onOpen: (index: number) => void;
}) {
  const reduce = useReducedMotion();
  const rotate = useMotionValue(0);
  const no = String(index + 1).padStart(2, "0");
  const look = item.colours[colour] ?? item.colours[0];

  // A pendulum: each kick adds angular velocity (deg/s) and lets it ring out.
  const kick = useCallback<Kick>(
    (v) => {
      if (reduce) return;
      animate(rotate, 0, {
        type: "spring",
        stiffness: 22,
        damping: 1.15,
        mass: 1,
        restDelta: 0.02,
        velocity: clamp(rotate.getVelocity() + v, -70, 70),
      });
    },
    [reduce, rotate],
  );

  useEffect(() => {
    register(index, kick);
    return () => register(index, null);
  }, [register, index, kick]);

  return (
    <li
      className="@container relative flex w-[46vw] shrink-0 snap-start flex-col sm:w-[28vw] md:w-[clamp(160px,14.5vw,224px)]"
      style={{ zIndex: hovered ? 20 : undefined }}
      onPointerEnter={(e) => onEnter(index, e)}
    >
      <motion.div
        initial={reduce ? false : { y: -64, opacity: 0 }}
        animate={shown ? { y: 0, opacity: 1 } : undefined}
        transition={{ duration: 1.1, ease: EASE, delay: 0.15 + index * 0.07 }}
        onAnimationComplete={() => kick(index % 2 ? 16 : -16)}
      >
        <motion.div
          animate={{ x: offset, y: hovered ? -12 : 0 }}
          transition={{ type: "spring", stiffness: 210, damping: 24 }}
        >
          <motion.div className="-mt-[4.6cqw] origin-[50%_2cqw] will-change-transform" style={{ rotate }}>
            <button
              ref={trigger}
              type="button"
              onClick={() => onOpen(index)}
              aria-haspopup="dialog"
              aria-label={`${item.name} — ${item.fabric}, from ${formatPrice(item.price)}. Take it off the rail`}
              data-cursor={out ? undefined : "Try on"}
              className="block w-full cursor-pointer text-left outline-offset-8"
            >
              <Hanger />
              {/* Hidden while it's in the fitting room; shown again the instant it lands back. */}
              <div ref={garment} className="relative mx-auto -mt-[7.5cqw] w-[84%]" style={{ opacity: out ? 0 : 1 }}>
                <div
                  className={cn(
                    "transition-[opacity,filter] duration-700 ease-out-expo",
                    dimmed && "md:opacity-75 md:saturate-[0.35]",
                  )}
                >
                  <Print colour={look} label={look.color} />
                </div>
                <AnimatePresence>
                  {hovered && !out && <HangTag no={no} item={item} flip={index >= total - 2} />}
                </AnimatePresence>
              </div>
            </button>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="mt-auto flex flex-col items-center gap-1.5 px-1 pt-20 text-center">
        <span className="font-mono text-[10px] text-muted">{no}</span>
        <span
          className={cn(
            "max-w-full truncate text-xs font-medium transition-colors duration-500 md:text-[13px]",
            dimmed && "md:text-muted",
          )}
        >
          {item.name}
        </span>
        <span className="flex gap-1" aria-hidden>
          {item.colours.slice(0, 6).map((c, ci) => (
            <span
              key={c.handle}
              className={cn(
                "size-1.5 rounded-full",
                ci === colour && "ring-1 ring-fg ring-offset-1 ring-offset-surface",
              )}
              style={{ background: c.swatch, boxShadow: "inset 0 0 0 0.5px rgb(127 127 127 / 0.5)" }}
            />
          ))}
        </span>
      </div>
    </li>
  );
}

/* ------------------------------------------------------------- wardrobe -- */

/**
 * The style index as a clothes rail. Running the cursor along it brushes the
 * trousers so they swing; hovering lifts a pair and slides its neighbours
 * apart; clicking takes it off the hanger and into the fitting room.
 */
export function Wardrobe({ items }: { items: WardrobeItem[] }) {
  const rack = useRef<HTMLDivElement>(null);
  const ready = useIntroDone();
  const inView = useInView(rack, { once: true, margin: "0px 0px -20% 0px" });
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [from, setFrom] = useState<DOMRect | null>(null);
  const [colours, setColours] = useState(() => items.map(() => 0));
  const kicks = useRef<(Kick | null)[]>([]);
  const garments = useRef<(HTMLDivElement | null)[]>([]);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const pointer = useRef({ x: 0, t: 0, v: 0 });
  const scroll = useRef(0);
  const track = useRef<HTMLUListElement>(null);
  const { scrollXProgress } = useScroll({ container: track });
  const [edges, setEdges] = useState({ start: true, end: false });

  useMotionValueEvent(scrollXProgress, "change", (v) => setEdges({ start: v < 0.01, end: v > 0.99 }));

  // Slide the rail by about half its visible width.
  const slide = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.6, behavior: "smooth" });
  };

  const register = useCallback((i: number, k: Kick | null) => {
    kicks.current[i] = k;
  }, []);
  const kick = (i: number, v: number) => kicks.current[i]?.(v);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const now = performance.now();
    const p = pointer.current;
    p.v = (e.clientX - p.x) / Math.max(8, now - p.t);
    p.x = e.clientX;
    p.t = now;
  };

  const onEnter = (i: number, e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || open !== null) return;
    // Brushing past: the hem trails the pointer, so moving right tips it left.
    kick(i, clamp(-pointer.current.v * 26, -30, 30));
    // Neighbours being slid aside sway as they move.
    for (let j = i - 2; j <= i + 2; j++) if (j !== i) kick(j, j < i ? -8 : 8);
    setHover(i);
  };

  const onScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const x = e.currentTarget.scrollLeft;
    const dx = x - scroll.current;
    scroll.current = x;
    kicks.current.forEach((k) => k?.(clamp(-dx * 1.4, -8, 8)));
  };

  const take = (i: number) => {
    const el = garments.current[i];
    if (!el) return;
    setFrom(el.getBoundingClientRect());
    setHover(null);
    setOpen(i);
    kick(i, i % 2 ? 46 : -46);
  };

  const step = (dir: 1 | -1) => {
    if (open === null) return;
    const next = (open + dir + items.length) % items.length;
    kick(open, 14);
    kick(next, dir * 30);
    setOpen(next);
  };

  const returned = () => {
    if (open === null) return;
    kick(open, open % 2 ? -20 : 20);
    triggers.current[open]?.focus({ preventScroll: true });
    setOpen(null);
  };

  // Spread the rail apart around the hovered pair, like sliding hangers aside.
  const offsetFor = (i: number) => {
    if (hover === null || i === hover) return 0;
    const d = Math.abs(i - hover);
    const push = d === 1 ? 24 : d === 2 ? 11 : 5;
    return Math.sign(i - hover) * push;
  };

  return (
    <div>
      <div
        ref={rack}
        className="wardrobe relative overflow-hidden rounded-[clamp(1rem,2vw,1.75rem)] [--rail:52px] md:[--rail:76px]"
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        {/* Ceiling mounts */}
        <div aria-hidden className="pointer-events-none absolute inset-x-[8%] top-0 hidden h-[var(--rail)] md:block">
          {["left-0", "right-0"].map((side) => (
            <span key={side} className={cn("wardrobe-rod absolute top-0 h-full w-[3px]", side)}>
              <span className="absolute -left-[5px] top-0 h-1.5 w-[13px] rounded-b-sm bg-[#8d9196]" />
            </span>
          ))}
        </div>
        {/* The rail runs wall to wall; the hangers slide along it. */}
        <div
          aria-hidden
          className="wardrobe-rail pointer-events-none absolute inset-x-0 top-[calc(var(--rail)-4px)] z-[1] h-2"
        />

        <ul
          ref={track}
          aria-label="Every FILO style"
          onScroll={onScroll}
          className="no-scrollbar relative z-[2] flex snap-x snap-mandatory scroll-px-[6vw] overflow-x-auto px-[6vw] pt-[var(--rail)] md:scroll-px-[4%] md:px-[4%]"
        >
          {items.map((item, i) => (
            <Slot
              key={item.family}
              item={item}
              index={i}
              total={items.length}
              colour={colours[i]}
              hovered={hover === i}
              dimmed={hover !== null && hover !== i}
              offset={offsetFor(i)}
              out={open === i}
              shown={(inView && ready) || !!reduce}
              register={register}
              garment={(el) => {
                garments.current[i] = el;
              }}
              trigger={(el) => {
                triggers.current[i] = el;
              }}
              onEnter={onEnter}
              onOpen={take}
            />
          ))}
        </ul>

        <div aria-hidden className="wardrobe-floor pointer-events-none absolute inset-x-0 bottom-0 h-[6.75rem]" />

        {open !== null && from && (
          <FittingRoom
            item={items[open]}
            index={open}
            total={items.length}
            colour={colours[open]}
            onColour={(c) => setColours((all) => all.map((v, j) => (j === open ? c : v)))}
            from={from}
            target={() => garments.current[open]?.getBoundingClientRect() ?? null}
            onStep={step}
            onReturned={returned}
          />
        )}
      </div>

      <div className="mt-6 flex items-center gap-6">
        <div className="relative h-px flex-1 bg-line">
          <motion.div
            className="absolute inset-y-0 left-0 w-full origin-left bg-fg"
            style={{ scaleX: scrollXProgress }}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => slide(-1)}
            disabled={edges.start}
            aria-label="Slide the rail left"
            className="grid size-11 place-items-center rounded-full border border-line transition-colors hover:border-fg disabled:opacity-30"
          >
            <ChevronLeft width={18} />
          </button>
          <button
            type="button"
            onClick={() => slide(1)}
            disabled={edges.end}
            aria-label="Slide the rail right"
            className="grid size-11 place-items-center rounded-full border border-line transition-colors hover:border-fg disabled:opacity-30"
          >
            <ChevronRight width={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------- fitting room -- */

type Phase = "in" | "docked" | "out";

/**
 * Store copy is often a run of "Fabric: … Fit: … Care: …" notes. Split it into
 * rows; prose (no leading label) returns null.
 */
function specsOf(text: string) {
  const labels = [...text.matchAll(/\b([A-Z][a-z]+(?: [a-z]+)?):\s+/g)];
  if (labels.length < 2 || labels[0].index !== 0) return null;
  return labels.map((m, i) => [m[1], text.slice(m.index + m[0].length, labels[i + 1]?.index).trim()] as const);
}

/** Width of the garment on the stage: as tall as the stage allows, never wider than half of it. */
const PRINT_RATIO = "100 / 142"; // 3:4 photo plus the paper margins
const STAGE_WIDTH = "min(46%, calc(var(--gh) / 1.42))";

function FittingRoom({
  item,
  index,
  total,
  colour,
  onColour,
  from,
  target,
  onStep,
  onReturned,
}: {
  item: WardrobeItem;
  index: number;
  total: number;
  colour: number;
  onColour: (c: number) => void;
  from: DOMRect;
  target: () => DOMRect | null;
  onStep: (dir: 1 | -1) => void;
  onReturned: () => void;
}) {
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const titleId = useId();
  const dialog = useRef<HTMLDivElement>(null);
  const place = useRef<HTMLDivElement>(null);
  const flyer = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>(reduce ? "docked" : "in");
  const phaseRef = useLatest(phase);
  const onReturnedRef = useLatest(onReturned);
  const flying = useRef(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const rotate = useMotionValue(0);
  const active = item.colours[colour] ?? item.colours[0];
  const [view, setView] = useState(0);
  const step = (dir: 1 | -1) => {
    setView(0);
    onStep(dir);
  };
  const stepRef = useLatest(step);
  const no = String(index + 1).padStart(2, "0");
  const specs = specsOf(item.lead);

  // Flight between the hanger and the stage. The flyer is pinned over the
  // stage slot and transformed (from its top-centre, like holding the
  // waistband) to wherever the garment currently is.
  useLayoutEffect(() => {
    if (phase === "docked") return;
    const el = flyer.current;
    const slot = place.current;
    if (!el || !slot) return;
    const stage = slot.getBoundingClientRect();
    Object.assign(el.style, { left: `${stage.left}px`, top: `${stage.top}px`, width: `${stage.width}px` });
    const rel = (r: DOMRect) => ({
      x: r.left + r.width / 2 - (stage.left + stage.width / 2),
      y: r.top - stage.top,
      s: r.width / stage.width,
    });

    // A stopped flight may still resolve; only the current one may finish.
    let live = true;
    let runs: AnimationPlaybackControls[];
    if (phase === "in") {
      const a = rel(from);
      const lift = Math.max(28, from.height * 0.14);
      const timing = { duration: 1.15, times: [0, 0.24, 1] };
      x.set(a.x);
      y.set(a.y);
      scale.set(a.s);
      flying.current = true;
      // The lift eases in so the first frame (after the dialog's first paint) doesn't jump.
      runs = [
        animate(y, [a.y, a.y - lift, 0], { ...timing, ease: ["easeInOut", [0.16, 1, 0.3, 1]] }),
        animate(x, [a.x, a.x, 0], { ...timing, ease: ["linear", [0.16, 1, 0.3, 1]] }),
        animate(scale, [a.s, a.s * 1.04, 1], { ...timing, ease: ["easeInOut", [0.16, 1, 0.3, 1]] }),
        animate(rotate, [0, a.x < 0 ? 3 : -3, 0], { ...timing, ease: ["easeInOut", [0.16, 1, 0.3, 1]] }),
      ];
      runs[0].finished.then(() => {
        if (!live) return;
        flying.current = false;
        setPhase("docked");
      });
    } else {
      // Leave from wherever it is (mid-flight or docked), rise, glide back
      // and drop onto the clips.
      const start = flying.current ? { x: x.get(), y: y.get(), s: scale.get() } : { x: 0, y: 0, s: 1 };
      const end = target();
      if (!end) {
        onReturnedRef.current();
        return;
      }
      const b = rel(end);
      const drop = Math.max(18, end.height * 0.08);
      const timing = { duration: 1, times: [0, 0.78, 1] };
      x.set(start.x);
      y.set(start.y);
      scale.set(start.s);
      runs = [
        animate(y, [start.y, b.y - drop, b.y], { ...timing, ease: [[0.65, 0, 0.35, 1], "easeIn"] }),
        animate(x, [start.x, b.x, b.x], { ...timing, ease: [[0.65, 0, 0.35, 1], "linear"] }),
        animate(scale, [start.s, b.s, b.s], { ...timing, ease: [[0.65, 0, 0.35, 1], "linear"] }),
        animate(rotate, [rotate.get(), b.x < 0 ? -2 : 2, 0], { ...timing, ease: [[0.65, 0, 0.35, 1], "easeOut"] }),
      ];
      runs[0].finished.then(() => live && onReturnedRef.current());
    }
    return () => {
      live = false;
      runs.forEach((r) => r.stop());
    };
    // Flights start only when the phase changes; `from`/`target` are read at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const close = useCallback(() => {
    if (reduce) onReturnedRef.current();
    else setPhase("out");
  }, [reduce, onReturnedRef]);

  // Scroll lock, focus entry, Escape / arrow keys and a focus trap.
  useEffect(() => {
    lenis?.stop();
    const t = setTimeout(() => {
      const buttons = dialog.current?.querySelectorAll<HTMLElement>("[data-close]") ?? [];
      [...buttons].find((b) => b.offsetParent)?.focus({ preventScroll: true });
    }, 80);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight" && phaseRef.current === "docked") stepRef.current(1);
      if (e.key === "ArrowLeft" && phaseRef.current === "docked") stepRef.current(-1);
      if (e.key !== "Tab") return;
      const items = [
        ...(dialog.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []),
      ].filter((el) => el.offsetParent);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [lenis, close, phaseRef, stepRef]);

  const visible = phase !== "out";
  const docked = phase === "docked";

  return createPortal(
    <div
      ref={dialog}
      className="fixed inset-0 z-[60] flex p-2 sm:p-4 md:p-6 lg:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <motion.div
        className="absolute inset-0 bg-black/45 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: visible ? 0.6 : 0.8, ease: EASE }}
        onClick={close}
      />

      <motion.div
        data-lenis-prevent
        className={cn(
          "relative mx-auto flex w-full max-w-[1380px] flex-col overflow-y-auto overscroll-contain rounded-[22px] bg-bg text-fg shadow-2xl md:grid md:grid-cols-[1.12fr_1fr] md:overflow-hidden",
          !visible && "pointer-events-none",
        )}
        initial={{ opacity: 0, clipPath: "inset(3% 3% 3% 3% round 28px)" }}
        animate={
          visible
            ? { opacity: 1, clipPath: "inset(0% 0% 0% 0% round 22px)" }
            : { opacity: 0, clipPath: "inset(2% 2% 2% 2% round 26px)" }
        }
        transition={{ duration: visible ? 0.8 : 0.55, ease: EASE, delay: visible ? 0.05 : 0.1 }}
      >
        {/* On phones the panel scrolls as one, so the close button stays pinned. */}
        <div className="sticky top-0 z-20 h-0 md:hidden">
          <button
            type="button"
            data-close
            onClick={close}
            className="absolute right-3 top-3 grid size-11 place-items-center rounded-full border border-line bg-bg/80 backdrop-blur-md"
            aria-label="Put it back on the rail"
          >
            <CloseIcon width={18} />
          </button>
        </div>

        {/* Stage */}
        <div className="wardrobe relative flex min-h-[54svh] shrink-0 items-center justify-center overflow-hidden [--gh:42svh] md:min-h-0 md:[--gh:min(66svh,640px)]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={item.family}
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center type-display text-[clamp(5rem,15vw,15rem)] text-fg/[0.045]"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              {item.name}
            </motion.span>
          </AnimatePresence>

          <p className="absolute left-5 top-5 flex gap-3 type-label text-muted md:left-8 md:top-8">
            <span className="font-mono tracking-normal">({no})</span> Off the rail
          </p>

          <div ref={place} className="relative" style={{ width: STAGE_WIDTH, aspectRatio: PRINT_RATIO }}>
            {/* Mounted with the print, so landing swaps in place and only style changes animate. */}
            {docked && (
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={item.family}
                  className="absolute inset-x-0 top-0"
                  initial={{ opacity: 0, x: 60, rotate: 4 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  exit={{ opacity: 0, x: -60, rotate: -4, transition: { duration: 0.35 } }}
                  transition={{ duration: 0.9, ease: EASE }}
                  style={{ transformOrigin: "50% 0%" }}
                >
                  <Print colour={active} label={active.color} view={view} sharp />
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* The colourway's other photograph; tap to swap it onto the main print. */}
          <AnimatePresence>
            {docked && active.images.length > 1 && (
              <motion.div
                key={active.handle}
                className="absolute bottom-5 right-5 w-[24%] max-w-[150px] md:bottom-8 md:right-8"
                initial={{ opacity: 0, y: 24, rotate: 9 }}
                animate={{ opacity: 1, y: 0, rotate: 4 }}
                exit={{ opacity: 0, y: 12, rotate: 6, transition: { duration: 0.3 } }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
              >
                <button
                  type="button"
                  onClick={() => setView((v) => 1 - v)}
                  aria-label={`Show the other photograph of ${item.name} in ${active.color}`}
                  className="relative block w-full rounded-[4px] bg-[#f4f0e7] p-1.5 pb-6 shadow-[0_24px_40px_-16px_rgb(0_0_0/0.5)] transition-transform duration-700 ease-out-expo hover:-rotate-4"
                >
                  <span className="relative block aspect-[3/4] overflow-hidden rounded-[2px] bg-[#e9e7e2]">
                    <Image src={active.images[1 - view]} alt="" fill sizes="150px" className="object-cover" />
                  </span>
                  <span className="absolute inset-x-0 bottom-1.5 truncate px-2 text-center font-mono text-[9px] text-black/55">
                    Another look
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Details */}
        <div className="relative flex flex-col px-6 pb-6 pt-6 md:overflow-y-auto md:px-10 md:pb-8 md:pt-8 lg:px-14">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs tabular-nums text-muted">
              {no} <span className="opacity-50">/ {String(total).padStart(2, "0")}</span>
            </p>
            <button
              type="button"
              data-close
              onClick={close}
              className="-mr-2 grid size-11 place-items-center rounded-full border border-line transition-colors hover:border-fg max-md:hidden"
              aria-label="Put it back on the rail"
            >
              <CloseIcon width={18} />
            </button>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={item.family}
              className="flex flex-1 flex-col"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <div className="mt-10 md:mt-auto">
                <motion.p
                  className="type-label text-muted"
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
                >
                  {item.fabric}
                </motion.p>
                <h3 id={titleId} className="mt-4 type-display text-[clamp(3rem,5.6vw,5.75rem)]">
                  <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                    <motion.span
                      className="block"
                      initial={reduce ? false : { y: "110%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: 1.1, ease: EASE, delay: 0.4 }}
                    >
                      {item.name}
                    </motion.span>
                  </span>
                </h3>
                {item.lead && (
                  <motion.div
                    className="mt-6 max-w-md text-sm leading-relaxed"
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
                  >
                    {specs ? (
                      <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
                        {specs.map(([k, v]) => (
                          <div key={k}>
                            <dt className="type-label text-muted">{k}</dt>
                            <dd className="mt-1 first-letter:uppercase">{v}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : (
                      <p className="line-clamp-4 text-muted">{item.lead}</p>
                    )}
                  </motion.div>
                )}
              </div>

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.58 }}
              >
                <dl className="mt-8 grid grid-cols-3 border-t border-line text-sm">
                  {[
                    ["From", formatPrice(item.price)],
                    ["Waist", "28 — 40"],
                    ["Colours", String(item.colours.length)],
                  ].map(([k, v]) => (
                    <div key={k} className="border-b border-line py-3.5">
                      <dt className="type-label text-muted">{k}</dt>
                      <dd className="mt-1 tabular-nums">{v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-7">
                  <p className="text-sm">
                    <span className="text-muted">Colour — </span>
                    {active.color}
                    {!active.available && <span className="ml-2 text-xs text-muted">(Sold out)</span>}
                  </p>
                  <div role="radiogroup" aria-label="Colour" className="mt-3 flex flex-wrap gap-2.5">
                    {item.colours.map((c, ci) => (
                      <button
                        key={c.handle}
                        type="button"
                        role="radio"
                        aria-checked={ci === colour}
                        aria-label={c.color}
                        onClick={() => {
                          setView(0);
                          onColour(ci);
                        }}
                        className={cn(
                          "relative size-8 rounded-full ring-1 ring-offset-[3px] ring-offset-bg transition-shadow duration-300",
                          ci === colour ? "ring-fg" : "ring-transparent hover:ring-muted",
                          !c.available && "opacity-45",
                        )}
                        style={{ background: c.swatch, boxShadow: "inset 0 0 0 1px rgb(127 127 127 / 0.35)" }}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <ButtonLink href={`/products/${active.handle}`} arrow>
                    Shop {item.name}
                  </ButtonLink>
                  <TextLink href="/shop">Compare every style</TextLink>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-between border-t border-line pt-5 text-sm">
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={!docked}
              className="group flex items-center gap-2 text-muted transition-colors hover:text-fg disabled:opacity-40"
            >
              <ChevronLeft
                width={16}
                className="transition-transform duration-500 ease-out-expo group-hover:-translate-x-1"
              />
              Previous
            </button>
            <span className="hidden type-label text-muted sm:block">Esc to hang it back</span>
            <button
              type="button"
              onClick={() => step(1)}
              disabled={!docked}
              className="group flex items-center gap-2 text-muted transition-colors hover:text-fg disabled:opacity-40"
            >
              Next
              <ChevronRight
                width={16}
                className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* The garment in flight, above everything else. */}
      {!docked && (
        <motion.div
          ref={flyer}
          aria-hidden
          className="pointer-events-none fixed z-10"
          style={{ x, y, scale, rotate, transformOrigin: "50% 0%" }}
        >
          <Print colour={active} label={active.color} view={view} />
        </motion.div>
      )}
    </div>,
    document.body,
  );
}

/** Ref that always holds the latest value, for listeners bound once. */
function useLatest<T>(value: T): RefObject<T> {
  const ref = useRef(value);
  useLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
}
