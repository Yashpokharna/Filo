/* eslint-disable @next/next/no-img-element -- frames are preloaded by exact URL so cuts never flash blank */
"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  type TargetAndTransition,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

type Move = "push" | "pull" | "pan" | "rise";
type Enter = "cut" | "wipe-up" | "wipe-left" | "zoom" | "slide";

export type FilmShot =
  | { kind: "photo"; src: string; move: Move; enter: Enter; seconds: number }
  | {
      kind: "triptych";
      srcs: [string, string, string];
      enter: Enter;
      seconds: number;
    };

const sized = (src: string, w: number) =>
  `${src}${src.includes("?") ? "&" : "?"}width=${w}`;

const ENTER: Record<
  Enter,
  { initial: TargetAndTransition; animate: TargetAndTransition }
> = {
  cut: { initial: { opacity: 1 }, animate: { opacity: 1 } },
  "wipe-up": {
    initial: { clipPath: "inset(100% 0% 0% 0%)" },
    animate: { clipPath: "inset(0% 0% 0% 0%)" },
  },
  "wipe-left": {
    initial: { clipPath: "inset(0% 0% 0% 100%)" },
    animate: { clipPath: "inset(0% 0% 0% 0%)" },
  },
  zoom: {
    initial: { opacity: 0, scale: 1.25 },
    animate: { opacity: 1, scale: 1 },
  },
  slide: { initial: { x: "100%" }, animate: { x: "0%" } },
};

const MOVE: Record<
  Move,
  { from: TargetAndTransition; to: TargetAndTransition }
> = {
  push: { from: { scale: 1 }, to: { scale: 1.12 } },
  pull: { from: { scale: 1.14 }, to: { scale: 1 } },
  pan: { from: { x: "4%", scale: 1.08 }, to: { x: "-4%", scale: 1.08 } },
  rise: { from: { y: "4%", scale: 1.08 }, to: { y: "-3%", scale: 1.08 } },
};

const EASE = [0.76, 0, 0.24, 1] as const;

/** A sharp, portrait frame centred over a soft, blurred extension of itself. */
function Photo({
  src,
  move,
  seconds,
  still,
}: {
  src: string;
  move: Move;
  seconds: number;
  still: boolean;
}) {
  const m = MOVE[move];
  return (
    <>
      <img
        src={sized(src, 64)}
        alt=""
        className="absolute inset-0 h-full w-full scale-125 object-cover blur-2xl brightness-[0.7]"
      />
      <div className="absolute inset-y-0 left-1/2 aspect-[3/4] h-full -translate-x-1/2 overflow-hidden">
        <motion.img
          src={sized(src, 1400)}
          alt=""
          className="h-full w-full object-cover"
          initial={still ? false : m.from}
          animate={still ? undefined : m.to}
          transition={{ duration: seconds + 1, ease: "linear" }}
        />
      </div>
    </>
  );
}

function Triptych({ srcs, still }: { srcs: string[]; still: boolean }) {
  return (
    <div className="absolute inset-0 flex items-stretch justify-center gap-[0.6vw]">
      {srcs.map((src, i) => (
        <motion.div
          key={src}
          className="relative aspect-[3/4] h-full shrink-0 overflow-hidden"
          initial={still ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 0.7, ease: EASE, delay: i * 0.12 }}
        >
          <img
            src={sized(src, 900)}
            alt=""
            className="h-full w-full object-cover"
          />
        </motion.div>
      ))}
    </div>
  );
}

/**
 * FILO's own campaign film, cut live from the product photography: camera
 * moves on single looks and a quick triptych.
 * Plays only while on screen and holds on the first frame for reduced motion.
 */
export function FiloFilm({
  shots,
  playing = true,
}: {
  shots: FilmShot[];
  playing?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "10% 0px" });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const run = playing && inView && !reduce;
  const shot = shots[step % shots.length];

  // Warm the cache so every cut lands on a decoded frame.
  useEffect(() => {
    const urls = shots.flatMap((s) =>
      s.kind === "photo"
        ? [sized(s.src, 1400), sized(s.src, 64)]
        : s.srcs.map((x) => sized(x, 900)),
    );
    urls.forEach((u) => {
      const img = new window.Image();
      img.src = u;
    });
  }, [shots]);

  useEffect(() => {
    if (!run) return;
    const t = setTimeout(() => setStep((n) => n + 1), shot.seconds * 1000);
    return () => clearTimeout(t);
  }, [run, step, shot.seconds]);

  const still = !run;
  const enter = ENTER[shot.enter];

  return (
    <div
      ref={ref}
      className="absolute inset-0 overflow-hidden bg-black"
      aria-hidden
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={step}
          className="absolute inset-0"
          style={{ zIndex: step }}
          initial={enter.initial}
          animate={enter.animate}
          // The outgoing shot dims underneath until the new one has covered it.
          exit={{ filter: "brightness(0.55)", transition: { duration: 0.9 } }}
          transition={{ duration: shot.enter === "cut" ? 0 : 0.85, ease: EASE }}
        >
          {shot.kind === "photo" && (
            <Photo
              src={shot.src}
              move={shot.move}
              seconds={shot.seconds}
              still={still}
            />
          )}
          {shot.kind === "triptych" && (
            <Triptych srcs={shot.srcs} still={still} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Film finish: vignette + moving grain. */}
      <div className="pointer-events-none absolute inset-0 z-[9999] bg-[radial-gradient(ellipse_at_center,transparent_55%,rgb(0_0_0/0.35))]" />
      <div className="film-grain pointer-events-none absolute -inset-[50%] z-[9999] opacity-[0.09] mix-blend-overlay" />
    </div>
  );
}
