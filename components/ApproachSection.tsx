import React, { useEffect, useMemo, useRef, useState } from "react";

type Lane = "Baseline" | "Growth";

const ApproachSection: React.FC = () => {
    const cards = useMemo(
        () => [
            {
                n: "01",
                lane: "Baseline" as Lane,
                title: "Kickoff + simple plan",
                body: "We learn your service area, your best jobs, and what to say so homeowners understand you fast.",
                micro: "Clear plan. No fluff.",
            },
            {
                n: "02",
                lane: "Baseline" as Lane,
                title: "Look trustworthy online",
                body: "We tighten the essentials so people instantly see what you do, where you work, and how to reach you.",
                micro: "Clean, simple, credible.",
            },
            {
                n: "03",
                lane: "Baseline" as Lane,
                title: "Make it easy to contact you",
                body: "We set up your contact flow so calls and messages don’t get lost—and you reply fast.",
                micro: "Fewer missed leads.",
            },
            {
                n: "04",
                lane: "Growth" as Lane,
                title: "Get found near you",
                body: "We strengthen your Google presence so you show up when people search for your service nearby.",
                micro: "More local visibility.",
            },
            {
                n: "05",
                lane: "Growth" as Lane,
                title: "Bring in real calls",
                body: "We launch simple call-focused campaigns to reach people already looking for your service.",
                micro: "Less junk. More serious leads.",
            },
            {
                n: "06",
                lane: "Growth" as Lane,
                title: "Follow-ups that book",
                body: "We add reminders and follow-ups so estimates don’t slip through the cracks.",
                micro: "More booked work.",
            },
            {
                n: "07",
                lane: "Baseline" as Lane,
                title: "Launch + weekly improvement",
                body: "We review what’s working and adjust every week based on calls, estimates, and booked jobs.",
                micro: "Small changes add up.",
            },
        ],
        []
    );

    const trackRef = useRef<HTMLDivElement | null>(null);
    const [active, setActive] = useState(0);
    const activeRef = useRef(0);

    // Progress (0..1) across steps (index-based, stable)
    const progress = cards.length > 1 ? active / (cards.length - 1) : 0;

    const getItems = (track: HTMLDivElement) => {
        return Array.from(track.children).filter(
            (el) => (el as HTMLElement).dataset.card === "1"
        ) as HTMLElement[];
    };

    const scrollToIndex = (idx: number) => {
        const track = trackRef.current;
        if (!track) return;

        const items = getItems(track);
        const el = items[idx];
        if (!el) return;

        // Make sure we always land on a clean left-edge position (one-by-one)
        track.scrollTo({
            left: el.offsetLeft,
            behavior: "smooth",
        });
    };

    const goPrev = () => {
        const curr = activeRef.current;
        const next = Math.max(0, curr - 1);
        if (next === curr) return;
        scrollToIndex(next);
    };

    const goNext = () => {
        const curr = activeRef.current;
        const next = Math.min(cards.length - 1, curr + 1);
        if (next === curr) return;
        scrollToIndex(next);
    };

    // Keep `active` synced to scroll position (buttons drive it, but this keeps it accurate)
    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        let raf = 0;

        const updateFromScroll = () => {
            raf = 0;

            const items = getItems(track);
            if (!items.length) return;

            const x = track.scrollLeft;

            // nearest card by left edge distance
            let bestIdx = 0;
            let bestDist = Number.POSITIVE_INFINITY;

            for (let i = 0; i < items.length; i++) {
                const dist = Math.abs(items[i].offsetLeft - x);
                if (dist < bestDist) {
                    bestDist = dist;
                    bestIdx = i;
                }
            }

            if (bestIdx !== activeRef.current) {
                activeRef.current = bestIdx;
                setActive(bestIdx);
            }
        };

        const onScroll = () => {
            if (raf) return;
            raf = window.requestAnimationFrame(updateFromScroll);
        };

        track.addEventListener("scroll", onScroll, { passive: true });
        updateFromScroll();

        return () => {
            track.removeEventListener("scroll", onScroll);
            if (raf) window.cancelAnimationFrame(raf);
        };
    }, [cards.length]);

    // Prevent mouse-wheel / trackpad horizontal scrolling (buttons-only on desktop behavior)
    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const onWheel = (e: WheelEvent) => {
            // block horizontal intent (shift-wheel or deltaX)
            const horizontalIntent = e.shiftKey || Math.abs(e.deltaX) > 0;
            if (horizontalIntent) e.preventDefault();
        };

        track.addEventListener("wheel", onWheel, { passive: false });
        return () => track.removeEventListener("wheel", onWheel);
    }, []);

    const ArrowIcon = ({ dir }: { dir: "left" | "right" }) => (
        <svg
            width="44"
            height="18"
            viewBox="0 0 44 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block"
        >
            {dir === "right" ? (
                <>
                    <path d="M1 9H41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path
                        d="M34 2L41 9L34 16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </>
            ) : (
                <>
                    <path d="M43 9H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path
                        d="M10 16L3 9L10 2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </>
            )}
        </svg>
    );

    return (
        <section id="approach" className="relative w-full bg-ollin-bg text-ollin-black py-20 md:py-28">
            <style>{`
        #approach ._hideScroll::-webkit-scrollbar{ display:none; }

        /* Progress rail */
        #approach .progRail{
          height: 2px;
          background: rgba(17,17,17,0.10);
          overflow: hidden;
        }
        #approach .progFill{
          height: 100%;
          background: rgba(17,17,17,0.38);
          transform-origin: left center;
          will-change: transform;
        }

        /* Dots nav */
        #approach .dotsRow{
          display:flex;
          align-items:center;
          justify-content:center;
          gap:10px;
          flex-wrap:wrap;
        }
        #approach .dot{
          width:8px;
          height:8px;
          border-radius:999px;
          background:rgba(17,17,17,0.18);
          border:0;
          padding:0;
          cursor:pointer;
          transition:transform 160ms ease, background 160ms ease, opacity 160ms ease;
          opacity:0.9;
        }
        #approach .dot:hover{
          background:rgba(17,17,17,0.28);
          transform:scale(1.15);
        }
        #approach .dot[data-active="true"]{
          background:rgba(17,17,17,0.44);
          transform:scale(1.35);
          opacity:1;
        }
        #approach .dot:focus-visible{
          outline:2px solid rgba(17,17,17,0.22);
          outline-offset:3px;
        }
      `}</style>

            <div className="max-w-[1500px] mx-auto px-[5vw] w-full">
                {/* Top copy */}
                <div className="max-w-[980px]">
                    <h3 className="text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.02] font-medium">
                        <span className="text-ollin-black">Your</span>{" "}
                        <span className="text-ollin-black">first</span>{" "}
                        <span className="text-ollin-black/65">14 days.</span>
                    </h3>

                    <p className="mt-5 text-base md:text-lg leading-snug text-ollin-black/70 max-w-[820px]">
                        We start with what you need now—then we add what brings calls and closes estimates.
                        <br />
                        Some steps are <span className="text-ollin-black/80 font-medium">Baseline</span>. Others unlock faster{" "}
                        <span className="text-ollin-black/80 font-medium">Growth</span>.
                        <br />
                        <span className="text-ollin-black/70">
                            Most contractors start with a website and social. That’s fine. The real win is when the phone rings—and
                            leads don’t slip.
                        </span>
                    </p>
                </div>

                {/* Arrows only (top row) */}
                <div className="mt-10 md:mt-12 flex items-center justify-end">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={goPrev}
                            disabled={active === 0}
                            className={[
                                "h-11 w-14 grid place-items-center",
                                "border border-black/10",
                                "text-ollin-black/70",
                                "transition-colors duration-150",
                                "hover:border-black/20 hover:text-ollin-black",
                                active === 0 ? "opacity-35 cursor-not-allowed" : "opacity-100",
                            ].join(" ")}
                            aria-label="Previous"
                        >
                            <ArrowIcon dir="left" />
                        </button>

                        <button
                            onClick={goNext}
                            disabled={active === cards.length - 1}
                            className={[
                                "h-11 w-14 grid place-items-center",
                                "border border-black/10",
                                "text-ollin-black/70",
                                "transition-colors duration-150",
                                "hover:border-black/20 hover:text-ollin-black",
                                active === cards.length - 1 ? "opacity-35 cursor-not-allowed" : "opacity-100",
                            ].join(" ")}
                            aria-label="Next"
                        >
                            <ArrowIcon dir="right" />
                        </button>
                    </div>
                </div>

                {/* Progress rail */}
                <div className="mt-6">
                    <div className="progRail w-full">
                        <div className="progFill" style={{ transform: `scaleX(${progress})` }} />
                    </div>
                </div>

                {/* Carousel */}
                <div className="mt-6">
                    <div
                        ref={trackRef}
                        className={[
                            "_hideScroll",
                            "flex gap-6",
                            "overflow-x-auto",
                            "snap-x snap-mandatory",
                            "scroll-smooth",
                            "pb-2",
                            "[scrollbar-width:none]",
                            "[-ms-overflow-style:none]",
                            "select-none",
                        ].join(" ")}
                        style={{
                            WebkitOverflowScrolling: "touch",
                            scrollSnapStop: "always",
                        }}
                    >
                        {cards.map((c) => (
                            <div
                                key={c.n}
                                data-card="1"
                                className={[
                                    "snap-start",
                                    "shrink-0",
                                    "relative",
                                    "border border-black/10",
                                    "bg-transparent",
                                    "px-8 py-8",
                                    "w-[88%]",
                                    "sm:w-[520px]",
                                    "lg:w-[620px]",
                                    "transition-colors duration-200",
                                    "hover:border-black/20",
                                ].join(" ")}
                            >
                                {/* Baseline / Growth label */}
                                <div className="text-[11px] uppercase tracking-[0.18em] text-ollin-black/45">
                                    <span
                                        className={[
                                            "inline-flex items-center gap-2",
                                            "px-2.5 py-1",
                                            "border",
                                            c.lane === "Growth" ? "border-black/15 text-ollin-black/70" : "border-black/10 text-ollin-black/55",
                                        ].join(" ")}
                                    >
                                        <span
                                            className={[
                                                "h-[6px] w-[6px] rounded-full",
                                                c.lane === "Growth" ? "bg-ollin-black/45" : "bg-ollin-black/25",
                                            ].join(" ")}
                                        />
                                        {c.lane}
                                    </span>
                                </div>

                                <div className="mt-4 text-sm font-semibold tracking-tight text-ollin-black/85">{c.title}</div>

                                <div className="mt-2 text-sm md:text-[15px] leading-snug text-ollin-black/65 max-w-[52ch]">
                                    {c.body}
                                </div>

                                <div className="mt-5 text-xs text-ollin-black/55">{c.micro}</div>

                                <div className="absolute bottom-6 right-8 text-6xl md:text-7xl font-medium tracking-tight text-ollin-black/16 select-none">
                                    {c.n}
                                </div>
                            </div>
                        ))}

                        {/* End spacer: lets the last cards align cleanly without getting stuck */}
                        <div
                            aria-hidden
                            data-spacer="1"
                            className="shrink-0 w-[12%] sm:w-[calc(100%-520px)] lg:w-[calc(100%-620px)]"
                        />
                    </div>
                </div>

                {/* Dots BELOW the cards, centered */}
                <div className="mt-8">
                    <div className="dotsRow" aria-label="Jump to a step">
                        {cards.map((c, i) => (
                            <button
                                key={c.n}
                                type="button"
                                className="dot"
                                data-active={i === active ? "true" : "false"}
                                aria-label={`Go to step ${c.n}: ${c.title} (${c.lane})`}
                                onClick={() => scrollToIndex(i)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ApproachSection;
