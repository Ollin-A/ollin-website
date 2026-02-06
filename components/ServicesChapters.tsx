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
                                const ctaText = chapter.linkText.replace(/\s*→\s*$/, "");

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

                                        {/* ✅ MISMA POSICIÓN / MISMO SIZE:
                        - Conserva el layout (no “botón hero”)
                        - Solo le añade sheen + flecha animada */}
                                        <Link
                                            to={chapter.to}
                                            data-ollin-cta14="services-chapters"
                                            className="inline-block text-sm md:text-base font-medium hover:opacity-60 transition-opacity"
                                            aria-label={ctaText}
                                        >
                                            {/* underline igual que antes (solo bajo el texto, no bajo el aire del arrow) */}
                                            <span
                                                className="chaptersCta14Text inline-block"
                                                data-text={ctaText}
                                            >
                                                {ctaText}
                                            </span>

                                            <span className="chaptersCta14Arrow" aria-hidden="true">
                                                <svg
                                                    className="chaptersCta14ArrowLineSvg"
                                                    viewBox="0 0 100 16"
                                                    fill="none"
                                                >
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

        // Global marker (CSS/hooks if needed)
        const root = document.documentElement;
        if (pinned) root.setAttribute("data-services-pinned", "true");
        else root.removeAttribute("data-services-pinned");

        // Event for Navbar (and anything else)
        window.dispatchEvent(new CustomEvent("services:pinned", { detail: { pinned } }));
    };

    useLayoutEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        // Ensure we start clean
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

            // Phase boundaries
            let nextPhase: Phase;
            if (rect.top > 0) nextPhase = "before";
            else if (rect.bottom < vh) nextPhase = "after";
            else nextPhase = "pinned";

            // If phase changes, update flag immediately (not 1 render later)
            if (nextPhase !== phaseRef.current) {
                phaseRef.current = nextPhase;
                applyPinnedFlag(nextPhase === "pinned");
                setPhase(nextPhase);
            } else {
                // Still keep flag consistent (safety)
                applyPinnedFlag(nextPhase === "pinned");
            }

            // Progress → active chapter (no transforms)
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
            // Clean up flag ALWAYS
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
            {/* ✅ Estilos GLOBALMENTE seguros (no dependen de un padre),
          para que funcionen también cuando el canvas está en portal */}
            <style>{`
        a[data-ollin-cta14="services-chapters"]{
          --arrowLen: 18px;
          --arrowLenHover: 46px;
          --arrowOverlap: 7.5px;
          transition: color 280ms ease-out;
        }
        a[data-ollin-cta14="services-chapters"]:hover{
          --arrowLen: var(--arrowLenHover);
        }

        /* Sheen: solo afecta el span del texto */
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

        /* Arrow */
        .chaptersCta14Arrow{
          position: relative;
          display: inline-block;
          width: 68px;
          height: 12px;
          margin-left: 8px; /* similar al “→” sin cambiar layout */
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

            {/* Scroll spacer */}
            <div
                ref={wrapperRef}
                className="relative w-full"
                style={{ height: `${TOTAL_SCREENS * 100}vh` }}
            >
                {/* INLINE STAGE (not pinned) */}
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

                {/* PINNED STAGE (fixed via portal) */}
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
                    <span className="block text-ollin-black/50">Stack the rest as you grow.</span>
                </p>
            </div>
        </section>
    );
}
