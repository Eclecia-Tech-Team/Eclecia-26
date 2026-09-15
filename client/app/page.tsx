"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, useSyncExternalStore } from "react";
import { sceneConfig as cfg, type AssetId } from "./scene.config";
import { clamp01, easeInOut, poseAt, sectionOpacity, seg, type Mode } from "./track";
import {
  HeroSection,
  StatsSection,
  DatesSection,
  DuskSection,
  FinaleSection,
} from "./sections";
import { SiteHeader } from "./Header";
import { SiteFooter } from "./Footer";
import { SKY_LQIP } from "./lqip";

const FRAME = cfg.frame;

/** Natural placement of each asset (Figma rect, frame coords) + its source. */
type Layer = {
  asset: AssetId;
  id: string;
  src: string;
  /** Natural rect in frame coords (for the scene PNGs: the Figma rect). */
  x: number;
  y: number;
  width: number;
  height: number;
  /** Paint order. */
  z: number;
  /** Alternate artwork for mobile / portrait (different image + natural size). */
  mobile?: { src: string; width: number; height: number };
};

// Layer order and geometry come from the Figma export (assets-src/reference.svg).
// Sources are WebP re-encodes of the Figma PNGs (see scripts/optimize-assets.mjs).
// Array order = paint order (bottom → top).
const LAYERS: Layer[] = [
  {
    asset: "bg",
    id: "bg-layer1",
    src: "/assets/opt/bg-layer1.webp",
    x: 0,
    y: 0,
    width: 1512,
    height: 864,
    z: 10,
  },
  // Ornaments sit above the sky, below the text panels (z 15) and the moon.
  {
    asset: "veena",
    id: "orn-veena",
    src: "/assets/opt/veena.webp",
    x: 0,
    y: 0,
    width: 1400,
    height: 933,
    z: 12,
  },
  {
    asset: "hand",
    id: "orn-hand",
    src: "/assets/opt/hand.webp",
    x: 0,
    y: 0,
    width: 800,
    height: 1000,
    z: 12,
  },
  {
    asset: "bannerL",
    id: "orn-banner-l",
    src: "/assets/opt/banner.webp",
    x: 0,
    y: 0,
    width: 700,
    height: 1050,
    z: 12,
  },
  {
    asset: "bannerR",
    id: "orn-banner-r",
    src: "/assets/opt/banner.webp",
    x: 0,
    y: 0,
    width: 700,
    height: 1050,
    z: 12,
  },
  {
    asset: "rays",
    id: "blacksun-layer2",
    src: "/assets/opt/blacksun-layer2.webp",
    x: 558,
    y: 38,
    width: 432,
    height: 432,
    z: 20,
  },
  {
    asset: "moon",
    id: "blacksun2-layer3",
    src: "/assets/opt/blacksun2-layer3.webp",
    x: 555,
    y: 33,
    width: 437,
    height: 437,
    z: 30,
  },
  {
    asset: "minisun",
    id: "minisun-layer4",
    src: "/assets/opt/minisun-layer4.webp",
    x: 707,
    y: 186,
    width: 133,
    height: 199,
    z: 40,
  },
  {
    asset: "suncover",
    id: "suncoverbg-layer5",
    src: "/assets/opt/suncoverbg-layer5.webp",
    x: -165,
    y: -122,
    width: 1672,
    height: 941,
    z: 50,
  },
  {
    asset: "mainart",
    id: "mainart-layer6",
    src: "/assets/opt/mainart-layer6.webp",
    x: -160,
    y: -39,
    width: 1672,
    height: 941,
    z: 60,
    // Portrait re-composition of the hero art for phones.
    mobile: {
      src: "/assets/opt/mainart-mobile.webp",
      width: 941,
      height: 1672,
    },
  },
  {
    asset: "bottom",
    id: "bottom-layer7",
    src: "/assets/opt/bottom.webp",
    x: -160,
    y: -39,
    width: 1672,
    height: 941,
    z: 70,
  },
];

// ---------- scroll cue ----------

/**
 * "This page scrolls" hint pinned to the bottom of the hero: a label plus a
 * bobbing double chevron. Fades out within the first few % of the track.
 * Tap/click glides to the dates section.
 */
function ScrollCue({ opacity }: { opacity: number }) {
  const hidden = opacity < 0.01;
  const go = () => {
    const trackPx = cfg.scrollVh * window.innerHeight - window.innerHeight;
    window.scrollTo({ top: cfg.navTargets.dates * trackPx, behavior: "smooth" });
  };
  return (
    <button
      type="button"
      onClick={go}
      aria-label="Scroll to explore"
      className="scroll-cue fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-95 flex -translate-x-1/2 flex-col items-center gap-2 text-gold/80 transition-opacity duration-300 hover:text-gold"
      style={{
        opacity,
        pointerEvents: hidden ? "none" : "auto",
        visibility: hidden ? "hidden" : "visible",
      }}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.35em]">
        Scroll
      </span>
      <svg
        aria-hidden
        className="scroll-cue-chevron"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 7l6 6 6-6" />
        <path d="M6 13l6 6 6-6" opacity="0.5" />
      </svg>
    </button>
  );
}

// ---------- hooks ----------

// Scale the fixed frame so it covers the viewport (fills width and height,
// keeps aspect ratio, crops the overflow edge).
function useCover() {
  const [v, setV] = useState<{ scale: number; w: number; h: number }>({
    scale: 1,
    w: FRAME.width,
    h: FRAME.height,
  });
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setV({ scale: Math.max(w / FRAME.width, h / FRAME.height), w, h });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return v;
}

// Layout tier: tablet (see cfg.tabletQuery) beats mobile (cfg.mobileQuery), else desktop.
function subscribeMode(cb: () => void) {
  const qs = [cfg.tabletQuery, cfg.tabletPortraitQuery, cfg.mobileQuery].map((q) => window.matchMedia(q));
  qs.forEach((q) => q.addEventListener("change", cb));
  return () => qs.forEach((q) => q.removeEventListener("change", cb));
}
function readMode(): Mode {
  if (window.matchMedia(cfg.tabletQuery).matches) return "tablet";
  if (window.matchMedia(cfg.tabletPortraitQuery).matches) return "tabletPortrait";
  if (window.matchMedia(cfg.mobileQuery).matches) return "mobile";
  return "desktop";
}
function useMode(): Mode {
  return useSyncExternalStore(subscribeMode, readMode, () => "desktop");
}

// Progress 0..1 across the pinned scroll track, eased toward the scrollbar's
// position each frame so the scene glides instead of jumping with the wheel.
function useTrackProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    let target = 0;
    let current = 0;
    const k = cfg.scrollSmoothing;
    const readTarget = () => {
      const vh = window.innerHeight;
      const trackPx = cfg.scrollVh * vh - vh;
      target = trackPx > 0 ? clamp01(window.scrollY / trackPx) : 0;
    };
    const tick = () => {
      raf = 0;
      const diff = target - current;
      if (k <= 0 || Math.abs(diff) < 0.0004) {
        current = target;
        setP(current);
        return; // settled: stop the loop until the next scroll event
      }
      current += diff * k;
      setP(current);
      raf = requestAnimationFrame(tick);
    };
    const schedule = () => {
      readTarget();
      if (!raf) raf = requestAnimationFrame(tick);
    };
    // Initial sync (e.g. reload mid-page) goes through the same frame loop.
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return p;
}

// Section anchors on the track: where each section rests (hold start; finale = 1).
const ANCHORS = Object.values(cfg.layout).map((sec) => sec.hold[0]);

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// After the user stops scrolling, glide to the next section in their direction.
// Programmatic scrolls are ignored by the listener; any new input cancels the glide.
function useSectionSnap() {
  useEffect(() => {
    if (!cfg.snap.enabled) return;
    const S = cfg.snap;
    let lastY = window.scrollY;
    let dir = 0;
    let idle = 0;
    let anim = 0;
    let animating = false;

    const trackPx = () => cfg.scrollVh * window.innerHeight - window.innerHeight;

    const cancel = () => {
      if (anim) cancelAnimationFrame(anim);
      anim = 0;
      animating = false;
    };

    const glideTo = (targetY: number) => {
      const startY = window.scrollY;
      const dist = Math.abs(targetY - startY);
      if (dist < 2) return;
      const ms = Math.min(S.maxMs, Math.max(S.minMs, dist * 0.9));
      const t0 = performance.now();
      animating = true;
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / ms);
        window.scrollTo(0, startY + (targetY - startY) * easeInOutCubic(t));
        if (t < 1) anim = requestAnimationFrame(step);
        else {
          animating = false;
          anim = 0;
          lastY = window.scrollY;
        }
      };
      anim = requestAnimationFrame(step);
    };

    const snap = () => {
      const tp = trackPx();
      if (tp <= 0) return;
      const p = window.scrollY / tp;
      if (p >= 1) return; // past the pinned scene: leave the page alone
      // Segment we're in.
      let i = 0;
      while (i + 1 < ANCHORS.length && ANCHORS[i + 1] <= p) i++;
      const lo = ANCHORS[i];
      const hi = ANCHORS[Math.min(i + 1, ANCHORS.length - 1)];
      let target = lo;
      if (dir > 0) target = p - lo < S.deadZone ? lo : hi;
      else if (dir < 0) target = hi - p < S.deadZone ? hi : lo;
      else target = p - lo < hi - p ? lo : hi;
      glideTo(target * tp);
    };

    const onScroll = () => {
      if (animating) return;
      const y = window.scrollY;
      if (y !== lastY) dir = Math.sign(y - lastY);
      lastY = y;
      clearTimeout(idle);
      idle = window.setTimeout(snap, S.idleMs);
    };
    const onInput = () => {
      // Fresh user intent: stop any glide so it never fights the finger/wheel.
      if (animating) cancel();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onInput, { passive: true });
    window.addEventListener("touchstart", onInput, { passive: true });
    window.addEventListener("keydown", onInput);
    return () => {
      clearTimeout(idle);
      cancel();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onInput);
      window.removeEventListener("touchstart", onInput);
      window.removeEventListener("keydown", onInput);
    };
  }, []);
}

// ---------- choreography for the PNG layers ----------

type LayerStyle = { transform: string; opacity: number };

/** Move the layer so its centre lands on the pose, scaled to the pose width. */
function layerStyle(layer: Layer, p: number, mode: Mode): LayerStyle {
  const pose = poseAt(layer.asset, p, mode);
  // Portrait art only on phones; tablets keep the landscape composition.
  const art = (mode === "mobile" || mode === "tabletPortrait") && layer.mobile ? layer.mobile : layer;
  const cx0 = layer.x + art.width / 2;
  const cy0 = layer.y + art.height / 2;
  const scale = pose.w / art.width;
  return {
    transform: `translate(${pose.x - cx0}px, ${pose.y - cy0}px) scale(${scale}) rotate(${pose.rotate}deg) scale(${pose.sx}, ${pose.sy})`,
    opacity: pose.opacity,
  };
}

export default function Home() {
  const { scale, w, h } = useCover();
  const mode = useMode();
  const mobile = mode !== "desktop"; // panels + compact type for both tablet and phone
  const p = useTrackProgress();
  useSectionSnap();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Smooth initial entrance fade to prevent abrupt pop-in on page load
    const timer = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(timer);
  }, []);

  const headerO = easeInOut(seg(p, cfg.header.fadeIn[0], cfg.header.fadeIn[1]));
  const heroO = sectionOpacity(p, cfg.text.hero);
  const statsO = sectionOpacity(p, cfg.text.stats);
  const datesO = sectionOpacity(p, cfg.text.dates);
  const duskO = sectionOpacity(p, cfg.text.dusk);
  const finaleO = sectionOpacity(p, cfg.text.finale);

  // Where the moon is right now, in frame px and in viewport px.
  const moonNow = poseAt("moon", p, mode);
  const frameLeft = (w - FRAME.width * scale) / 2;
  const frameTop = (h - FRAME.height * scale) / 2;
  const moonVx = frameLeft + moonNow.x * scale;
  const moonVy = frameTop + moonNow.y * scale;

  // Desktop: panels live inside the frame (frame px). Mobile: viewport px.
  const emergeFor = (win: readonly [number, number]) => ({
    t: easeInOut(seg(p, win[0], win[1])),
    fromX: mobile ? moonVx : moonNow.x,
    fromY: mobile ? moonVy : moonNow.y,
  });
  // Visible vertical band for panels: viewport minus the header, in the panel's
  // own coordinate space (frame px on desktop, viewport px on mobile/tablet).
  const headerPx = mobile ? 64 : 80;
  const bounds = mobile
    ? { top: headerPx, bottom: h }
    : {
        top: Math.max(0, -frameTop) + headerPx / scale,
        bottom: Math.min(FRAME.height, (h - frameTop) / scale),
      };

  // Tablets: phone markup, scaled up (see cfg.panelScaleMax). Phones: 1.
  const panelScale = mobile ? Math.min(cfg.panelScaleMax, Math.max(1, Math.min(w / 520, h / 720))) : 1;

  type Frac = { x: number; y: number; w: number };
  type TextOverrides = Partial<Record<keyof typeof cfg.textMobile, Frac>>;
  const rectFor = (name: keyof typeof cfg.textMobile) => {
    if (!mobile) return cfg.text[name].rect;
    const over =
      mode === "tablet"
        ? (cfg.textTablet as TextOverrides)[name]
        : mode === "tabletPortrait"
          ? (cfg.textTabletPortrait as TextOverrides)[name]
          : undefined;
    const r = over ?? cfg.textMobile[name];
    // Overlay scales around its centre, so shrink the box by the same factor
    // to keep the effective width (and centre) as configured.
    const fullW = w * r.w;
    const boxW = fullW / panelScale;
    return { x: w * r.x + (fullW - boxW) / 2, y: h * r.y, w: boxW };
  };

  const panels = (
    <>
      <HeroSection
        opacity={heroO}
        emerge={emergeFor(cfg.text.hero.fadeIn)}
        rect={rectFor("hero")}
        bounds={bounds}
        compact={mobile}
        scale={panelScale}
      />
      <StatsSection
        opacity={statsO}
        emerge={emergeFor(cfg.text.stats.fadeIn)}
        rect={rectFor("stats")}
        bounds={bounds}
        compact={mobile}
        scale={panelScale}
        isTablet={mode === "tablet" || mode === "tabletPortrait"}
      />
      <DatesSection
        opacity={datesO}
        emerge={emergeFor(cfg.text.dates.fadeIn)}
        rect={rectFor("dates")}
        bounds={bounds}
        compact={mobile}
        scale={panelScale}
      />
      <DuskSection
        opacity={duskO}
        emerge={emergeFor(cfg.text.dusk.fadeIn)}
        rect={rectFor("dusk")}
        bounds={bounds}
        compact={mobile}
        // Tablets: enlarge heading and paragraph for better readability in tablet view
        scale={panelScale * (mode === "tablet" || mode === "tabletPortrait" ? 1.35 : 1)}
      />
      <FinaleSection
        opacity={finaleO}
        emerge={emergeFor(cfg.text.finale.fadeIn)}
        rect={rectFor("finale")}
        bounds={bounds}
        compact={mobile}
        // Tablets: closing line + CTA get an extra bump; the sky above the hills is empty anyway.
        scale={panelScale * (mode === "tablet" || mode === "tabletPortrait" ? 1.35 : 1)}
      />
    </>
  );

  return (
    <>
      {/* Pinned scroll track: gives the scene its scroll length. */}
      {/* dvh so iOS's collapsing address bar doesn't change the track mid-scroll */}
      <div className="scroll-track" style={{ height: `${cfg.scrollVh * 100}dvh` }} aria-hidden />

      {/* Always-on backing: a tiny blurred sky so the first paint is never plain black */}
      <div
        aria-hidden
        className="fixed inset-0 bg-black"
        style={{ backgroundImage: `url(${SKY_LQIP})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />

      {/* Fixed scene with smooth initial entrance fade */}
      <div
        className={`fixed inset-0 overflow-hidden transition-opacity duration-1000 ease-out ${loaded ? "opacity-100" : "opacity-0"}`}
      >
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: FRAME.width,
            height: FRAME.height,
            transform: `translate3d(-50%, -50%, 0) scale(${scale})`,
            transformOrigin: "center",
            contain: "strict",
          }}
        >
          {LAYERS.map((layer) => {
            const s = layerStyle(layer, p, mode);
            const art = (mode === "mobile" || mode === "tabletPortrait") && layer.mobile ? layer.mobile : layer;
            return (
              <img
                key={layer.id}
                id={layer.id}
                src={art.src}
                alt=""
                draggable={false}
                className="absolute block max-w-none select-none pointer-events-none will-change-[transform,opacity] backface-hidden"
                decoding="async"
                loading="eager"
                fetchPriority={
                  layer.asset === "bg" || layer.asset === "mainart"
                    ? "high"
                    : "auto"
                }
                style={{
                  left: layer.x,
                  top: layer.y,
                  width: art.width,
                  height: art.height,
                  zIndex: layer.z,
                  transform: s.transform,
                  transformOrigin: "center",
                  opacity: s.opacity,
                }}
              />
            );
          })}

          {/* Desktop: panels share the frame's coordinates and sit on z-80 above the moon */}
          {!mobile && <div className="absolute inset-0 z-80 pointer-events-none">{panels}</div>}
        </div>

        {/* Mobile: panels in a viewport layer above the scene so they always fit the screen */}
        {mobile && <div className="absolute inset-0 z-80">{panels}</div>}
      </div>

      <SiteFooter />

      <SiteHeader opacity={headerO} />

      <ScrollCue opacity={loaded ? 1 - clamp01(p / 0.03) : 0} />
    </>
  );
}
