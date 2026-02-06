import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

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

// === TUNABLES ===
// Each chapter lasts 1.2 screens
const CHAPTER_VH = 120; // 120vh per chapter
const BUFFER_VH = 40;   // extra after last chapter (release feels clean)
// Wrapper height must be: viewport(100vh) + (3*120vh + 40vh) = 500vh
const WRAPPER_VH = 100 + CHAPTERS.length * CHAPTER_VH + BUFFER_VH; // 500vh

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

// Find the real scroll container (window OR nearest overflow-y scroll/auto element)
function getScrollParent(el: HTMLElement | null): Window | HTMLElement {
    if (!el) return window;
    let parent: HTMLElement | null = el.parentElement;

    while (parent) {
        const style = getComputedStyle(parent);
        const overflowY = style.overflowY;
        const isScrollable =
            (overflowY === "auto" || overflowY === "scroll") &&
            parent.scrollHeight > parent.clientHeight + 1;

        if (isScrollable) return parent;
        parent = parent.parentElement;
    }

    return window;
}

export default function ServicesChapters() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const pinRef = useRef<HTMLDivElement>(null);

    const scrollerRef = useRef<Window | HTMLElement>(window);
    const rafRef = useRef<number | null>(null);

    const [activeChapterIndex, setActiveChapterIndex] = useState(0);

    const prefersReducedMotion = useMemo(() => {
        if (typeof window === "undefined" || !window.matchMedia) return false;
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }, []);

    useEffect(() => {
        // detect scroller after mount
        scrollerRef.current = getScrollParent(wrapperRef.current);

        const onTick = () => {
            rafRef.current = null;
            const wrapper = wrapperRef.current;
            const pin = pinRef.current;
            if (!wrapper || !pin) return;

            const scroller = scrollerRef.current;

            const isWindow = scroller === window;

            const scrollTop = isWindow
                ? window.scrollY || window.pageYOffset || 0
                : (scroller as HTMLElement).scrollTop;

            const viewportH = isWindow
                ? window.innerHeight || 1
                : (scroller as HTMLElement).clientHeight || 1;

            // Wrapper top in "scrollTop coordinate space"
            const wrapperRect = wrapper.getBoundingClientRect();

            let wrapperTop: number;
            if (isWindow) {
                wrapperTop = scrollTop + wrapperRect.top;
            } else {
                const scrollerRect = (scroller as HTMLElement).getBoundingClientRect();
                // wrapper position inside the scroll container
                wrapperTop = scrollTop + (wrapperRect.top - scrollerRect.top);
            }

            const wrapperHeight = wrapperRect.height;
            const maxPin = Math.max(0, wrapperHeight - viewportH);

            // scroll progress INSIDE the wrapper (px)
            const inside = scrollTop - wrapperTop;

            // This is the “pin” translation (px). When inside increases, we translate down,
            // visually cancelling the wrapper's movement => appears pinned.
            const pinY = clamp(inside, 0, maxPin);
            pin.style.transform = `translate3d(0, ${pinY}px, 0)`;

            // Chapter index by 1.2 screens each (px)
            const chapterPx = (CHAPTER_VH / 100) * viewportH; // 120vh => 1.2*viewportH
            const chaptersSpanPx = chapterPx * CHAPTERS.length;

            // keep the buffer from creating a fake 4th chapter
            const withinChapters = clamp(inside, 0, chaptersSpanPx - 1);

            const nextIdx = clamp(Math.floor(withinChapters / chapterPx), 0, CHAPTERS.length - 1);

            setActiveChapterIndex((prev) => (prev === nextIdx ? prev : nextIdx));
        };

        const requestTick = () => {
            if (rafRef.current != null) return;
            rafRef.current = requestAnimationFrame(onTick);
        };

        const scroller = scrollerRef.current;
        const isWindow = scroller === window;

        // Initial layout
        requestTick();

        // Listen to the ACTUAL scroller
        if (isWindow) {
            window.addEventListener("scroll", requestTick, { passive: true });
        } else {
            (scroller as HTMLElement).addEventListener("scroll", requestTick, { passive: true });
        }

        window.addEventListener("resize", requestTick);

        return () => {
            if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
            if (isWindow) {
                window.removeEventListener("scroll", requestTick);
            } else {
                (scroller as HTMLElement).removeEventListener("scroll", requestTick);
            }
            window.removeEventListener("resize", requestTick);
        };
    }, []);

    return (
        <section className="relative w-full">
            {/* Wrapper defines total scroll length for the pinned chapters */}
            <div
                ref={wrapperRef}
                className="relative w-full"
                style={{ height: `${WRAPPER_VH}vh` }}
            >
                {/* Pinned canvas (NOT sticky): absolutely positioned + JS translate to pin */}
                <div
                    ref={pinRef}
                    className="absolute top-0 left-0 w-full h-screen will-change-transform"
                    style={{
                        transform: "translate3d(0,0,0)",
                        transition: prefersReducedMotion ? "none" : undefined,
                    }}
                >
                    <div className="h-full w-full flex items-center">
                        <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12">
                            <div className="grid grid-cols-12 gap-10 items-center">
                                {/* Progress */}
                                <div className="col-span-12 md:col-span-2">
                                    <span className="font-[Montserrat] text-sm md:text-base font-medium tracking-widest text-ollin-black/40">
                                        0{activeChapterIndex + 1} <span className="mx-1">/</span> 03
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="col-span-12 md:col-span-8 md:col-start-4">
                                    <div className="relative min-h-[360px] md:min-h-[420px]">
                                        {CHAPTERS.map((chapter, index) => {
                                            const isActive = index === activeChapterIndex;
                                            return (
                                                <div
                                                    key={chapter.id}
                                                    className={cx(
                                                        "absolute inset-0",
                                                        prefersReducedMotion
                                                            ? ""
                                                            : "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                                                        isActive
                                                            ? "opacity-100 translate-y-0 pointer-events-auto"
                                                            : "opacity-0 translate-y-6 pointer-events-none"
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
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Closing section AFTER the wrapper finishes (no SiteOutro here) */}
            <div className="relative py-24 md:py-32 flex flex-col items-center justify-center text-center bg-transparent">
                <p className="text-2xl md:text-4xl font-[Montserrat] font-normal leading-tight">
                    <span className="block mb-2">Start with one pillar.</span>
                    <span className="block text-ollin-black/50">Stack the rest as you grow.</span>
                </p>
            </div>
        </section>
    );
}
