import {
  sceneConfig as cfg,
  type AssetId,
  type Pose,
  type SectionLayout,
} from "./scene.config";

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Normalised progress of p within [a, b]. */
export const seg = (p: number, a: number, b: number) =>
  clamp01((p - a) / (b - a));
export const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
export const easeIn = (t: number) => t * t * t;
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Pose with defaults filled and flips expressed as axis signs (-1..1) so they can interpolate. */
export type ResolvedPose = {
  x: number;
  y: number;
  w: number;
  rotate: number;
  opacity: number;
  sx: number;
  sy: number;
};

const NAMES = Object.keys(cfg.layout) as (keyof typeof cfg.layout)[];
const SECTIONS = NAMES.map((n) => cfg.layout[n]) as readonly SectionLayout[];
type Overrides = Record<string, Partial<Record<AssetId, Pose>>>;
const MOBILE = NAMES.map((n) => (cfg.layoutMobile as Overrides)[n] ?? {});
const TABLET = NAMES.map((n) => (cfg.layoutTablet as Overrides)[n] ?? {});
const TABLET_P = NAMES.map((n) => (cfg.layoutTabletPortrait as Overrides)[n] ?? {});

export type Mode = "desktop" | "tablet" | "tabletPortrait" | "mobile";

/** Pose of `asset` in section i: tablet → mobile → desktop fallbacks. */
const poseIn = (i: number, asset: AssetId, mode: Mode | boolean): Pose => {
  const m: Mode = mode === true ? "mobile" : mode === false ? "desktop" : mode;
  if (m === "tablet") return TABLET[i][asset] ?? MOBILE[i][asset] ?? SECTIONS[i][asset];
  if (m === "tabletPortrait") return TABLET_P[i][asset] ?? MOBILE[i][asset] ?? SECTIONS[i][asset];
  if (m === "mobile") return MOBILE[i][asset] ?? SECTIONS[i][asset];
  return SECTIONS[i][asset];
};

const fill = (p: Pose): ResolvedPose => ({
  x: p.x,
  y: p.y,
  w: p.w,
  rotate: p.rotate ?? 0,
  opacity: p.opacity ?? 1,
  sx: p.flipX ? -1 : 1,
  sy: p.flipY ? -1 : 1,
});

/**
 * Pose of `asset` at track progress p: holds inside a section's window,
 * eases between consecutive sections otherwise.
 */
export function poseAt(
  asset: AssetId,
  p: number,
  mobile: Mode | boolean = false,
): ResolvedPose {
  const first = SECTIONS[0];
  const lastI = SECTIONS.length - 1;
  const last = SECTIONS[lastI];
  if (p <= first.hold[0]) return fill(poseIn(0, asset, mobile));
  if (p >= last.hold[1]) return fill(poseIn(lastI, asset, mobile));

  for (let i = 0; i < SECTIONS.length; i++) {
    const s = SECTIONS[i];
    if (p >= s.hold[0] && p <= s.hold[1]) return fill(poseIn(i, asset, mobile));
    const n = SECTIONS[i + 1];
    if (n && p > s.hold[1] && p < n.hold[0]) {
      const a = fill(poseIn(i, asset, mobile));
      const b = fill(poseIn(i + 1, asset, mobile));
      const t = easeInOut(seg(p, s.hold[1], n.hold[0]));
      const travelling = a.x !== b.x || a.y !== b.y;
      const dir = n.arrive === "up" ? -1 : n.arrive === "down" ? 1 : 0;
      const dip =
        travelling && (asset === "moon" || asset === "rays")
          ? dir * Math.sin(t * Math.PI) * cfg.orbitArcPx
          : 0;
      return {
        x: lerp(a.x, b.x, t),
        y: lerp(a.y, b.y, t) + dip,
        w: lerp(a.w, b.w, t),
        rotate: lerp(a.rotate, b.rotate, t),
        opacity: lerp(a.opacity, b.opacity, t),
        sx: lerp(a.sx, b.sx, t),
        sy: lerp(a.sy, b.sy, t),
      };
    }
  }
  return fill(poseIn(lastI, asset, mobile));
}

/** Opacity for a text block that fades in over `fadeIn` and out over `fadeOut`. */
export function sectionOpacity(
  p: number,
  s: { fadeIn: readonly [number, number]; fadeOut: readonly [number, number] },
) {
  return (
    easeInOut(seg(p, s.fadeIn[0], s.fadeIn[1])) *
    (1 - easeInOut(seg(p, s.fadeOut[0], s.fadeOut[1])))
  );
}
