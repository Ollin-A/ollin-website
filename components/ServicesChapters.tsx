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
        // Mobile-only copy (shorter, breathes)
        headlineMobile: "Look established fast.",
        bodyMobile: "Brand, website, and social that feel consistent—and earn the first call.",
        linkText: "Explore Foundation →",
        to: "/services/foundation",
    },
    {
        id: "demand",
        label: "MORE CALLS + ESTIMATES",
        title: "DEMAND",
        headline: "Turn intent into booked calls.",
        body: "Strategy, campaigns, optimization, and tracking—built for real estimates, not vanity metrics.",
        headlineMobile: "Turn intent into calls.",
        bodyMobile: "Ads + Maps + Tracking built for real estimates (not vanity metrics).",
        linkText: "Explore Demand →",
        to: "/services/demand",
    },
    {
        id: "retention",
        label: "FOLLOW-UPS + 5-STARS",
        title: "RETENTION",
        headline: "Make revenue compound.",
        body: "Real-time lead handling plus reviews and reactivation—so jobs turn into 5-stars, referrals, and repeat work.",
        headlineMobile: "Make revenue compound.",
        bodyMobile: "Faster follow-up + more 5-stars + repeat work when seasonality hits.",
        linkText: "Explore Retention →",
        to: "/services/retention",
    },
    {
        id: "audit",
        label: "REVENUE LEAK AUDIT",
        title: "AUDIT",
        headline: "Start with the 360° Revenue Leak Audit.",
        body: "We map where calls, leads, and margin are leaking—then give you a clear priority plan to fix it.",
        headlineMobile: "Start with the Audit.",
        bodyMobile: "Find the leak, fix the order. Clear priorities—no guessing, no rebuild required.",
        linkText: "Get the Audit →",
        to: "/services/audit",
    },
];

// Timing
const CHAPTER_SCREENS = 1.2;
const BUFFER_SCREENS = 0.4;
const TOTAL_SCREENS = 1 + CHAPTERS.length * CHAPTER_SCREENS + BUFFER_SCREENS;

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
        // ✅ Restore your original centering behavior EXACTLY
        <div className="servicesChaptersCanvas h-screen w-full flex items-center">
            <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-12 gap-10 items-center max-md:gap-7">
                    <div className="col-span-12 md:col-span-8 md:col-start-4">
                        {/* ✅ CRITICAL: bring back min-height so absolute slides don't collapse layout */}
                        <div className="relative min-h-[360px] md:min-h-[420px]">
                            {CHAPTERS.map((chapter, index) => {
                                const isActive = index === active;
                                const ctaText = chapter.linkText.replace(/\s*→\s*$/, "");

                                return (
                                    <div
                                        key={chapter.id}
                                        className={cx(
                                            "absolute inset-0",
                                            prefersReducedMotion ? "" : "transition-opacity duration-500 ease-out",
                                            isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                                        )}
                                    >
                                        {/* Label — desktop unchanged; mobile slightly softer */}
                                        <p className="text-xs md:text-sm font-bold tracking-[0.2em] mb-4 text-ollin-black/50 uppercase max-md:font-semibold max-md:mb-5">
                                            {chapter.label}
                                        </p>

                                        {/* Title — desktop unchanged EXACTLY; mobile uses clamp override only under md */}
                                        <h2 className="text-[3rem] md:text-[5rem] lg:text-[6rem] leading-[0.9] font-[Montserrat] font-normal tracking-tight mb-6 max-md:text-[clamp(44px,10.5vw,64px)]">
                                            {chapter.title}
                                        </h2>

                                        {/* Headline */}
                                        {/* Mobile */}
                                        <p className="md:hidden text-[clamp(18px,5vw,22px)] font-medium mb-4 leading-[1.25] max-w-[26ch]">
                                            {chapter.headlineMobile ?? chapter.headline}
                                        </p>
                                        {/* Desktop (unchanged) */}
                                        <p className="hidden md:block text-xl md:text-2xl font-medium mb-4 max-w-2xl">
                                            {chapter.headline}
                                        </p>

                                        {/* Body */}
                                        {/* Mobile */}
                                        <p className="md:hidden text-[15px] sm:text-[16px] text-ollin-black/70 mb-8 max-w-[46ch] leading-relaxed">
                                            {chapter.bodyMobile ?? chapter.body}
                                        </p>
                                        {/* Desktop (unchanged) */}
                                        <p className="hidden md:block text-base md:text-lg text-ollin-black/70 mb-8 max-w-xl leading-relaxed">
                                            {chapter.body}
                                        </p>

                                        {/* CTA — keep your original behavior/position; just a tiny mobile tap breathing */}
                                        <Link
                                            to={chapter.to}
                                            data-ollin-cta14="services-chapters"
                                            className="inline-block text-sm md:text-base font-medium hover:opacity-60 transition-opacity max-md:py-1"
                                            aria-label={ctaText}
                                        >
                                            <span className="chaptersCta14Text inline-block" data-text={ctaText}>
                                                {ctaText}
                                            </span>

                                            <span className="chaptersCta14Arrow" aria-hidden="true">
                                                <svg className="chaptersCta14ArrowLineSvg" viewBox="0 0 100 16" fill="none">
                                                    <line
                                                        x1="0"
                                                        y1="8"
                                                        x2="100"
                                                        y2="8"
                                                        stroke="currentColor"
                                                        strokeWidth="1"
                                                        strokeLinecap="butt"
                                                        vectorEffect="non-scaling-stroke"
                                                    />
                                                </svg>

                                                <svg
                                                    className="chaptersCta14ArrowHeadSvg"
                                                    viewBox="0 0 18 16"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M0 3 L12 8 L0 13" vectorEffect="non-scaling-stroke" />
                                                </svg>
                                            </span>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>

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

    const pinnedFlagRef = useRef<boolean>(false);

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

    const applyPinnedFlag = (pinned: boolean) => {
        if (typeof document === "undefined") return;
        if (pinnedFlagRef.current === pinned) return;

        pinnedFlagRef.current = pinned;

        const root = document.documentElement;
        if (pinned) root.setAttribute("data-services-pinned", "true");
        else root.removeAttribute("data-services-pinned");

        window.dispatchEvent(new CustomEvent("services:pinned", { detail: { pinned } }));
    };

    useLayoutEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        applyPinnedFlag(false);

        const computeMetrics = () => {
            const vh = window.innerHeight || 1;
            const wrapperH = Math.max(1, Math.round(vh * TOTAL_SCREENS));
            const maxPin = Math.max(0, wrapperH - vh);
            const chapterPx = Math.max(1, vh * CHAPTER_SCREENS);
            const chapterTravel = Math.max(1, chapterPx * CHAPTERS.length);

            metricsRef.current = { vh, wrapperH, maxPin, chapterPx, chapterTravel };
            wrapper.style.height = `${wrapperH}px`;
        };

        let raf: number | null = null;

        const tick = () => {
            raf = null;
            const w = wrapperRef.current;
            if (!w) return;

            const { vh, maxPin, chapterPx, chapterTravel } = metricsRef.current;
            const rect = w.getBoundingClientRect();

            let nextPhase: Phase;
            if (rect.top > 0) nextPhase = "before";
            else if (rect.bottom < vh) nextPhase = "after";
            else nextPhase = "pinned";

            if (nextPhase !== phaseRef.current) {
                phaseRef.current = nextPhase;
                applyPinnedFlag(nextPhase === "pinned");
                setPhase(nextPhase);
            } else {
                applyPinnedFlag(nextPhase === "pinned");
            }

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

        const ro = new ResizeObserver(() => onResize());
        ro.observe(wrapper);

        return () => {
            applyPinnedFlag(false);
            if (raf != null) cancelAnimationFrame(raf);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
            ro.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const portalTarget = typeof document !== "undefined" ? document.body : null;

    const { vh, maxPin } = metricsRef.current;
    const afterTop = Math.round(maxPin);

    return (
        <section className="relative w-full">
            <style>{`
        /* ✅ Mobile pinned stability (does NOT affect desktop) */
        @supports (height: 100svh) {
          @media (max-width: 767px) {
            .servicesChaptersCanvas { height: 100svh; }
          }
        }
        @supports (height: 100dvh) {
          @media (max-width: 767px) {
            .servicesChaptersCanvas { height: 100dvh; }
          }
        }

        a[data-ollin-cta14="services-chapters"]{
          --arrowLen: 18px;
          --arrowLenHover: 46px;
          --arrowOverlap: 7.5px;
          transition: color 280ms ease-out;
        }
        a[data-ollin-cta14="services-chapters"]:hover{
          --arrowLen: var(--arrowLenHover);
        }

        .chaptersCta14Text{
          position: relative;
          line-height: 1;
        }
        .chaptersCta14Text::after{
          content: attr(data-text);
          position: absolute;
          inset: 0;
          color: transparent;
          background-image: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 248, 220, 0.92) 45%,
            transparent 62%
          );
          background-size: 220% 100%;
          background-position: 220% 0;
          -webkit-background-clip: text;
          background-clip: text;
          opacity: 0;
          pointer-events: none;
        }

        @keyframes ollinSheenOnceLR_Chapters14{
          0%   { background-position: 220% 0; opacity: 0; }
          12%  { opacity: 0.70; }
          88%  { opacity: 0.70; }
          100% { background-position: -220% 0; opacity: 0; }
        }

        a[data-ollin-cta14="services-chapters"]:hover .chaptersCta14Text::after{
          animation: ollinSheenOnceLR_Chapters14 720ms ease-out 1;
        }

        .chaptersCta14Arrow{
          position: relative;
          display: inline-block;
          width: 68px;
          height: 12px;
          margin-left: 8px;
          pointer-events: none;
          vertical-align: baseline;
        }

        .chaptersCta14ArrowLineSvg{
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: var(--arrowLen);
          height: 12px;
          overflow: visible;
          transition: width 380ms cubic-bezier(0.2, 0.7, 0.2, 1);
          will-change: width;
        }

        .chaptersCta14ArrowHeadSvg{
          position: absolute;
          left: 0;
          top: 50%;
          width: 13px;
          height: 12px;
          transform: translate3d(calc(var(--arrowLen) - var(--arrowOverlap)), -50%, 0);
          transition: transform 380ms cubic-bezier(0.2, 0.7, 0.2, 1);
          will-change: transform;
        }

        @media (prefers-reduced-motion: reduce){
          a[data-ollin-cta14="services-chapters"]{ transition: none !important; }
          .chaptersCta14ArrowLineSvg,
          .chaptersCta14ArrowHeadSvg{ transition: none !important; }
          a[data-ollin-cta14="services-chapters"]:hover .chaptersCta14Text::after{
            animation: none !important;
          }
        }

        @media (hover: none) and (pointer: coarse){
          a[data-ollin-cta14="services-chapters"]{
            --arrowLen: 32px;
          }
          a[data-ollin-cta14="services-chapters"]:active{
            --arrowLen: var(--arrowLenHover);
          }
          a[data-ollin-cta14="services-chapters"]:active .chaptersCta14Text::after{
            animation: ollinSheenOnceLR_Chapters14 720ms ease-out 1;
          }
        }
      `}</style>

            <div ref={wrapperRef} className="relative w-full" style={{ height: `${TOTAL_SCREENS * 100}vh` }}>
                {/* INLINE STAGE */}
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

                {/* PINNED STAGE */}
                {phase === "pinned" && portalTarget
                    ? createPortal(
                        <div className="fixed inset-0 z-[60]">
                            <ChapterCanvas active={active} prefersReducedMotion={prefersReducedMotion} />
                        </div>,
                        portalTarget
                    )
                    : null}
            </div>

            {/* Closing section — restore EXACT original */}
            <div className="relative py-24 md:py-32 flex flex-col items-center justify-center text-center bg-transparent">
                <p className="text-2xl md:text-4xl font-[Montserrat] font-normal leading-tight">
                    <span className="block mb-2">Start with one pillar.</span>
                    <span className="block text-ollin-black/50">Stack the rest as you grow.</span>
                </p>
            </div>
        </section>
    );
}
