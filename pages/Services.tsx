import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const CHAPTERS = [
  {
    id: "foundation",
    label: "LOOK PRO + TRUST",
    title: "FOUNDATION",
    headline: "Look established in 30 seconds.",
    body: "A consistent brand everywhere, a high-converting website, and a social presence that builds trust.",
    linkText: "Explore Foundation →",
    to: "/services/foundation",
  },
  {
    id: "demand",
    label: "MORE CALLS + ESTIMATES",
    title: "DEMAND",
    headline: "Turn intent into booked calls.",
    body: "Strategy, campaigns, optimization, and tracking—built for real estimates, not vanity metrics.",
    linkText: "Explore Demand →",
    to: "/services/demand",
  },
  {
    id: "retention",
    label: "FOLLOW-UPS + 5-STARS",
    title: "RETENTION",
    headline: "Make revenue compound.",
    body: "Real-time lead handling plus reviews and reactivation—so jobs turn into 5-stars, referrals, and repeat work.",
    linkText: "Explore Retention →",
    to: "/services/retention",
  },
];

// Timing
const CHAPTER_SCREENS = 1.2;
const BUFFER_SCREENS = 0.4;
const TOTAL_SCREENS = 1 + CHAPTERS.length * CHAPTER_SCREENS + BUFFER_SCREENS; // 5.0

type Phase = "before" | "pinned" | "after";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function ChapterCanvas({
  active,
  prefersReducedMotion,
}: {
  active: number;
  prefersReducedMotion: boolean;
}) {
  return (
    <div className="h-screen w-full flex items-center">
      <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-12 gap-10 items-center">
          {/* Progress */}
          <div className="col-span-12 md:col-span-2">
            <span className="font-[Montserrat] text-sm md:text-base font-medium tracking-widest text-ollin-black/40">
              0{active + 1} <span className="mx-1">/</span> 03
            </span>
          </div>

          {/* Content */}
          <div className="col-span-12 md:col-span-8 md:col-start-4">
            <div className="relative min-h-[360px] md:min-h-[420px]">
              {CHAPTERS.map((chapter, index) => {
                const isActive = index === active;

                return (
                  <div
                    key={chapter.id}
                    className={cx(
                      "absolute inset-0",
                      prefersReducedMotion
                        ? ""
                        : "transition-opacity duration-500 ease-out",
                      isActive
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    )}
                  >
                    <p className="text-xs md:text-sm font-bold tracking-[0.2em] mb-4 text-ollin-black/50 uppercase">
                      {chapter.label}
                    </p>

                    <h2 className="text-[3rem] md:text-[5rem] lg:text-[6rem] leading-[0.9] font-[Montserrat] font-normal tracking-tight mb-6">
                      {chapter.title}
                    </h2>

                    <p className="text-xl md:text-2xl font-medium mb-4 max-w-2xl">
                      {chapter.headline}
                    </p>

                    <p className="text-base md:text-lg text-ollin-black/70 mb-8 max-w-xl leading-relaxed">
                      {chapter.body}
                    </p>

                    <Link
                      to={chapter.to}
                      className="inline-block border-b border-black pb-1 text-sm md:text-base font-medium hover:opacity-60 transition-opacity"
                    >
                      {chapter.linkText}
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Screen reader stability */}
            <span className="sr-only">{CHAPTERS[active].id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesChapters() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  const [phase, setPhase] = useState<Phase>("before");
  const phaseRef = useRef<Phase>("before");

  const metricsRef = useRef({
    vh: 1,
    wrapperH: 1,
    maxPin: 0,
    chapterPx: 1,
    chapterTravel: 1,
  });

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const computeMetrics = () => {
      const vh = window.innerHeight || 1;
      const wrapperH = Math.max(1, Math.round(vh * TOTAL_SCREENS));
      const maxPin = Math.max(0, wrapperH - vh);
      const chapterPx = Math.max(1, vh * CHAPTER_SCREENS);
      const chapterTravel = Math.max(1, chapterPx * CHAPTERS.length);

      metricsRef.current = { vh, wrapperH, maxPin, chapterPx, chapterTravel };

      // Fix wrapper height in px for consistent timing
      wrapper.style.height = `${wrapperH}px`;
    };

    let raf: number | null = null;

    const tick = () => {
      raf = null;
      const w = wrapperRef.current;
      if (!w) return;

      const { vh, maxPin, chapterPx, chapterTravel } = metricsRef.current;

      const rect = w.getBoundingClientRect();

      // Phase (only changes at boundaries)
      let nextPhase: Phase;
      if (rect.top > 0) nextPhase = "before";
      else if (rect.bottom < vh) nextPhase = "after";
      else nextPhase = "pinned";

      if (nextPhase !== phaseRef.current) {
        phaseRef.current = nextPhase;
        setPhase(nextPhase);
      }

      // Progress used ONLY to compute chapter index (no DOM transforms!)
      const progress = clamp(-rect.top, 0, maxPin);
      const within = clamp(progress, 0, chapterTravel - 1);
      const idx = clamp(Math.floor(within / chapterPx), 0, CHAPTERS.length - 1);

      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
    };

    const requestTick = () => {
      if (raf != null) return;
      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => requestTick();
    const onResize = () => {
      computeMetrics();
      requestTick();
    };

    computeMetrics();
    tick();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // If layout changes affect wrapper, keep it stable
    const ro = new ResizeObserver(() => onResize());
    ro.observe(wrapper);

    return () => {
      if (raf != null) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, []);

  const portalTarget =
    typeof document !== "undefined" ? document.body : null;

  const { vh, maxPin } = metricsRef.current;
  const afterTop = Math.round(maxPin);

  return (
    <section className="relative w-full">
      {/* Scroll spacer */}
      <div
        ref={wrapperRef}
        className="relative w-full"
        // fallback if JS is slow
        style={{ height: `${TOTAL_SCREENS * 100}vh` }}
      >
        {/* INLINE STAGE (renders when NOT pinned) */}
        <div
          aria-hidden={phase === "pinned"}
          className={cx(
            "absolute left-0 w-full",
            phase === "pinned" ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
          style={{
            top: phase === "after" ? afterTop : 0,
            height: `${vh}px`,
          }}
        >
          <ChapterCanvas active={active} prefersReducedMotion={prefersReducedMotion} />
        </div>

        {/* PINNED STAGE (fixed, via portal to avoid transformed ancestors) */}
        {phase === "pinned" && portalTarget
          ? createPortal(
              <div className="fixed inset-0 z-[60]">
                <ChapterCanvas
                  active={active}
                  prefersReducedMotion={prefersReducedMotion}
                />
              </div>,
              portalTarget
            )
          : null}
      </div>

      {/* Closing section */}
      <div className="relative py-24 md:py-32 flex flex-col items-center justify-center text-center bg-transparent">
        <p className="text-2xl md:text-4xl font-[Montserrat] font-normal leading-tight">
          <span className="block mb-2">Start with one pillar.</span>
          <span className="block text-ollin-black/50">
            Stack the rest as you grow.
          </span>
        </p>
      </div>
    </section>
  );
}