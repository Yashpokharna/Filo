/* Thread paths in real pixels for a box of width w × height h (one band per chapter). */

/** Desktop: the thread swings out behind each chapter's image and back to the centre gutter. */
export function weavePath(sides: ("left" | "right")[], w: number, h: number) {
  const step = h / sides.length;
  const cx = w * 0.5;
  let d = `M${cx},0`;
  sides.forEach((side, i) => {
    const x = side === "left" ? w * 0.22 : w * 0.78;
    const y = i * step;
    d += ` C${cx},${y + step * 0.25} ${x},${y + step * 0.3} ${x},${y + step * 0.5}`;
    d += ` S${cx},${y + step * 0.8} ${cx},${y + step}`;
  });
  return d;
}

/** Mobile: a gentle wave inside a narrow left gutter. */
export function gutterPath(count: number, w: number, h: number) {
  const step = h / count;
  const cx = w * 0.5;
  let d = `M${cx},0`;
  for (let i = 0; i < count; i++) {
    const y = i * step;
    d += ` C${cx},${y + step * 0.25} ${w * 0.15},${y + step * 0.3} ${w * 0.15},${y + step * 0.5}`;
    d += ` S${w * 0.85},${y + step * 0.8} ${cx},${y + step}`;
  }
  return d;
}
