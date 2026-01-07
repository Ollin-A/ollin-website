import React, { useEffect, useMemo, useRef, useState } from "react";

const ApproachSection: React.FC = () => {
    const cards = useMemo(
        () => [
            {
                n: "01",
                title: "Answer fast",
                body: "Missed call = missed money. We set up instant text-back + follow-ups.",
                micro: "Reply in minutes.",
            },
            {
                n: "02",
                title: "Look legit fast",
                body: "Pages, reviews, and clear offers that build trust before they call.",
                micro: "Easy to say yes.",
            },
            {
                n: "03",
                title: "Win your service area",
                body: "We tune your Maps + local presence so you show up nearby.",
                micro: "Get found locally.",
            },
            {
                n: "04",
                title: "Ads that bring calls",
                body: "Campaigns built for real phone calls. No junk clicks.",
                micro: "Better leads.",
            },
            {
                n: "05",
                title: "Make choosing you easy",
                body: "Packages + pricing framing so your estimate feels safe and clear.",
                micro: "Less back-and-forth.",
            },
            {
                n: "06",
                title: "Follow-ups + reviews",
                body: "Automations that cut no-shows and bring in steady 5-stars.",
                micro: "More trust. More work.",
            },
            {
                n: "07",
                title: "Weekly tighten-up",
                body: "We review calls, estimates, and results. Then we adjust what’s not working.",
                micro: "Small tweaks, better weeks.",
            },
        ],
        []
    );

    const trackRef = useRef<HTMLDivElement | null>(null);
    const [active, setActive] = useState(0);
    const activeRef = useRef(0);

    // ✅ How we help: stays mounted during close animation
    const [helpOpen, setHelpOpen] = useState(false);
    const [helpClosing, setHelpClosing] = useState(false);
    const btnRef = useRef<HTMLButtonElement | null>(null);
    const popRef = useRef<HTMLDivElement | null>(null);
    const helpId = "approach-how-we-help";

    // ✅ refs to compute the gap (between button row and the REAL start of carousel)
    const sectionRef = useRef<HTMLElement | null>(null);
    const helpRowRef = useRef<HTMLDivElement | null>(null);
    const carouselEdgeRef = useRef<HTMLDivElement | null>(null);

    const [popTop, setPopTop] = useState<number | null>(null);
    const [popTight, setPopTight] = useState(false);

    const openHelp = () => {
        setHelpClosing(false);
        setPopTight(false);
        setHelpOpen(true);
    };
    const closeHelp = () => {
        setHelpClosing(true);
    };
    const toggleHelp = () => {
        if (!helpOpen) openHelp();
        else closeHelp();
    };

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

    // Keep `active` synced to the actual scroll position
    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        let raf = 0;

        const updateActiveFromScroll = () => {
            raf = 0;
            const items = getItems(track);
            if (!items.length) return;

            const x = track.scrollLeft;

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
            raf = window.requestAnimationFrame(updateActiveFromScroll);
        };

        track.addEventListener("scroll", onScroll, { passive: true });
        updateActiveFromScroll();

        return () => {
            track.removeEventListener("scroll", onScroll);
            if (raf) window.cancelAnimationFrame(raf);
        };
    }, [cards.length]);

    // Block horizontal wheel on carousel
    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const onWheel = (e: WheelEvent) => {
            const wouldScrollHorizontally = e.shiftKey || Math.abs(e.deltaX) > 0;
            if (wouldScrollHorizontally) e.preventDefault();
        };

        track.addEventListener("wheel", onWheel, { passive: false });
        return () => {
            track.removeEventListener("wheel", onWheel);
        };
    }, []);

    // Close on outside click + ESC
    useEffect(() => {
        if (!helpOpen) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !helpClosing) closeHelp();
        };

        const onPointerDown = (e: PointerEvent) => {
            if (helpClosing) return;

            const t = e.target as Node | null;
            if (!t) return;

            const btn = btnRef.current;
            const pop = popRef.current;

            const insideBtn = !!btn && btn.contains(t);
            const insidePop = !!pop && pop.contains(t);

            if (!insideBtn && !insidePop) closeHelp();
        };

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("pointerdown", onPointerDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("pointerdown", onPointerDown);
        };
    }, [helpOpen, helpClosing]);

    // ✅ Place popup centered between help row and carousel start.
    // No internal scrolling. If it doesn't fit, switch to "tight" mode automatically.
    useEffect(() => {
        if (!helpOpen) {
            setPopTop(null);
            setPopTight(false);
            return;
        }

        let raf1 = 0;
        let raf2 = 0;

        const recalc = () => {
            const section = sectionRef.current;
            const topEl = helpRowRef.current;
            const bottomEl = carouselEdgeRef.current;
            const popEl = popRef.current;

            if (!section || !topEl || !bottomEl || !popEl) return;

            const pad = 16;

            const sR = section.getBoundingClientRect();
            const tR = topEl.getBoundingClientRect();
            const bR = bottomEl.getBoundingClientRect();

            const gTop = tR.bottom + pad;
            const gBot = bR.top - pad;
            const avail = Math.max(0, gBot - gTop);

            // Ensure we measure after styles apply
            raf2 = window.requestAnimationFrame(() => {
                const popNow = popRef.current;
                const secNow = sectionRef.current;
                const topNow = helpRowRef.current;
                const botNow = carouselEdgeRef.current;

                if (!popNow || !secNow || !topNow || !botNow) return;

                const sR2 = secNow.getBoundingClientRect();
                const tR2 = topNow.getBoundingClientRect();
                const bR2 = botNow.getBoundingClientRect();

                const gTop2 = tR2.bottom + pad;
                const gBot2 = bR2.top - pad;
                const avail2 = Math.max(0, gBot2 - gTop2);

                const popH = popNow.getBoundingClientRect().height;

                // If it doesn't fit and we haven't tightened yet, tighten and re-run.
                if (!popTight && popH > avail2) {
                    setPopTight(true);
                    return;
                }

                // Center within the gap, clamped to not touch edges
                const fitH = Math.min(popH, avail2);
                const desiredTop = gTop2 + (avail2 - fitH) / 2;
                const clampedTop = Math.min(Math.max(desiredTop, gTop2), gBot2 - fitH);

                setPopTop(Math.max(0, clampedTop - sR2.top));
            });
        };

        raf1 = window.requestAnimationFrame(recalc);

        const onResize = () => recalc();
        const onScroll = () => recalc();

        window.addEventListener("resize", onResize);
        window.addEventListener("scroll", onScroll, true);

        return () => {
            if (raf1) window.cancelAnimationFrame(raf1);
            if (raf2) window.cancelAnimationFrame(raf2);
            window.removeEventListener("resize", onResize);
            window.removeEventListener("scroll", onScroll, true);
        };
    }, [helpOpen, popTight]);

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

    const copyNormal =
        "You’re busy running jobs. Your marketing shouldn’t be another full-time job. We handle your social, your brand, and your website so you look legit and get found in your area. Then we tighten the follow-ups so missed calls don’t turn into missed money. Simple setup, steady improvements, and work that keeps coming in.";

    // Tight mode: shorter so it always fits without scroll, without touching cards
    const copyTight =
        "You’re busy running jobs. We handle your website, local presence, and follow-ups so you get found and booked. Faster replies, clearer offers, and tighter systems that turn missed calls into jobs.";

    return (
        <section ref={sectionRef} id="approach" className="relative w-full bg-ollin-bg text-ollin-black py-20 md:py-28">
            <style>{`
        /* =========================
           How we help (pill + panel)
           ========================= */
        #approach .helpWrap{
          position: static; /* popup anchored to section, not the button */
          display: inline-block;
        }

        #approach .helpPill{
          --bg: rgba(17,17,17,0.04);
          --bgHover: rgba(17,17,17,0.09);
          --bd: rgba(17,17,17,0.10);
          --bdHover: rgba(17,17,17,0.18);

          display: inline-flex;
          align-items: center;
          justify-content: center;

          padding: 14px 22px;
          border-radius: 999px;
          border: 1px solid var(--bd);
          background: var(--bg);
          color: rgba(17,17,17,0.88);

          cursor: pointer;
          user-select: none;

          transition: background 180ms ease, border-color 180ms ease, color 180ms ease;
        }

        #approach .helpPill:hover{
          background: var(--bgHover);
          border-color: var(--bdHover);
          color: rgba(17,17,17,0.98);
        }

        #approach .helpPill[data-open="true"]{
          background: var(--bgHover);
          border-color: var(--bdHover);
          color: rgba(17,17,17,0.98);
        }

        #approach .helpPillLabel{
          font-weight: 650;
          letter-spacing: -0.01em;
          line-height: 1;
        }

        /* =========================
           Popup: centered, wide, no internal scroll
           ========================= */
        #approach .helpPop{
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: min(980px, calc(100vw - 10vw));
          z-index: 40;
          pointer-events: auto;
        }

        #approach .helpPopInner{
          border-radius: 0px;
          background: rgba(17,17,17,0.06);
          border: 1px solid rgba(17,17,17,0.08);

          padding: 18px 22px;
          overflow: hidden; /* ✅ no scrollbars */
          will-change: transform, opacity, filter;
        }

        /* Tight mode: slightly smaller + tighter padding so it fits in the gap */
        #approach .helpPopInner[data-tight="true"]{
          padding: 14px 18px;
        }

        #approach .helpPopText{
          color: rgba(17,17,17,0.82);
          font-size: 16px;
          line-height: 1.55;
        }

        #approach .helpPopText[data-tight="true"]{
          font-size: 15px;
          line-height: 1.5;
        }

        /* open/close animation */
        @keyframes helpIn {
          0%   { opacity: 0; transform: translateX(-6px) scaleX(0.05); filter: blur(1.6px); }
          55%  { opacity: 1; transform: translateX(0px) scaleX(1.02); filter: blur(0.6px); }
          100% { opacity: 1; transform: translateX(0px) scaleX(1.00); filter: blur(0px); }
        }
        @keyframes helpOut {
          0%   { opacity: 1; transform: translateX(0px) scaleX(1.00); filter: blur(0px); }
          100% { opacity: 0; transform: translateX(-6px) scaleX(0.05); filter: blur(1.6px); }
        }

        #approach .helpPopInner[data-state="open"]{ animation: helpIn 320ms cubic-bezier(.2,.9,.2,1) both; }
        #approach .helpPopInner[data-state="closing"]{ animation: helpOut 220ms cubic-bezier(.2,.9,.2,1) both; }

        /* =========================
           Mobile: centered modal + overlay
           ========================= */
        #approach .helpOverlay{ display: none; }

        @media (max-width: 640px){
          #approach .helpOverlay{
            display: block;
            position: fixed;
            inset: 0;
            z-index: 45;
            background: rgba(0,0,0,0.22);
          }

          #approach .helpPop{
            position: fixed;
            left: 50%;
            top: 50% !important;
            transform: translate(-50%, -50%);
            width: min(92vw, 680px);
            z-index: 50;
          }
        }

        @media (prefers-reduced-motion: reduce){
          #approach .helpPopInner[data-state="open"],
          #approach .helpPopInner[data-state="closing"]{ animation: none !important; }
        }
      `}</style>

            <div className="max-w-[1500px] mx-auto px-[5vw] w-full">
                {/* Top copy */}
                <div className="max-w-[980px]">
                    <h3 className="text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.02] font-medium">
                        <span className="text-ollin-black">Your</span>{" "}
                        <span className="text-ollin-black/65">marketing</span>{" "}
                        <span className="text-ollin-black">team,</span>{" "}
                        <span className="text-ollin-black/45">built for local</span>{" "}
                        <span className="text-ollin-black">contractors</span>.
                    </h3>

                    <p className="mt-5 text-base md:text-lg leading-snug text-ollin-black/70 max-w-[760px]">
                        <span className="text-ollin-black/80">
                            Most contractors don’t need more ideas. They need execution that brings calls and closes estimates.
                        </span>
                        <br />
                        We run ads, Maps visibility, and follow-ups. Then we improve it every week.
                        <br />
                        <span className="text-ollin-black/70">Bilingual. Contractor-first. Built for speed.</span>
                    </p>
                </div>

                {/* Button between text and cards */}
                <div ref={helpRowRef} className="mt-10 md:mt-12 flex justify-start">
                    <div className="helpWrap">
                        <button
                            ref={btnRef}
                            type="button"
                            className="helpPill"
                            data-open={helpOpen ? "true" : "false"}
                            aria-expanded={helpOpen}
                            aria-controls={helpId}
                            onClick={toggleHelp}
                        >
                            <span className="helpPillLabel">How we help</span>
                        </button>

                        {helpOpen && (
                            <div
                                className="helpOverlay"
                                aria-hidden="true"
                                onClick={() => {
                                    if (!helpClosing) closeHelp();
                                }}
                            />
                        )}

                        {helpOpen && (
                            <div
                                ref={popRef}
                                id={helpId}
                                className="helpPop"
                                style={{ top: popTop ?? 0 }}
                                role="dialog"
                                aria-label="How we help"
                            >
                                <div
                                    className="helpPopInner"
                                    data-state={helpClosing ? "closing" : "open"}
                                    data-tight={popTight ? "true" : "false"}
                                    onAnimationEnd={() => {
                                        if (helpClosing) {
                                            setHelpOpen(false);
                                            setHelpClosing(false);
                                            setPopTight(false);
                                            setPopTop(null);
                                        }
                                    }}
                                >
                                    <p className="helpPopText" data-tight={popTight ? "true" : "false"}>
                                        {popTight ? copyTight : copyNormal}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Header row: nav only */}
                <div className="mt-10 md:mt-10 flex items-center justify-end">
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

                {/* Carousel (this ref is the REAL bottom boundary for the popup gap) */}
                <div ref={carouselEdgeRef} className="mt-6">
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
                            paddingRight: "clamp(120px, 35vw, 520px)",
                        }}
                    >
                        <style>{`
              #approach ._hideScroll::-webkit-scrollbar{ display:none; }
            `}</style>

                        {cards.map((c) => (
                            <div
                                key={c.n}
                                data-card="1"
                                className={[
                                    "snap-start",
                                    "relative",
                                    "border border-black/10",
                                    "bg-transparent",
                                    "px-8 py-8",
                                    "min-w-[88%]",
                                    "sm:min-w-[520px]",
                                    "lg:min-w-[620px]",
                                    "transition-colors duration-200",
                                    "hover:border-black/20",
                                ].join(" ")}
                            >
                                <div className="text-sm font-semibold tracking-tight text-ollin-black/85">{c.title}</div>

                                <div className="mt-2 text-sm md:text-[15px] leading-snug text-ollin-black/65 max-w-[52ch]">
                                    {c.body}
                                </div>

                                <div className="mt-5 text-xs text-ollin-black/55">{c.micro}</div>

                                <div className="absolute bottom-6 right-8 text-6xl md:text-7xl font-medium tracking-tight text-ollin-black/16 select-none">
                                    {c.n}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ApproachSection;
