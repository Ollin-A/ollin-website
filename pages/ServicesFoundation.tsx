import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function Chip({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a
            href={href}
            className="inline-flex items-center rounded-full border border-black/15 px-4 py-2 max-md:px-3 max-md:py-2 text-[12px] md:text-[13px] tracking-[0.14em] uppercase text-ollin-black/80 hover:bg-black/5 transition-colors"
        >
            {children}
        </a>
    );
}

function SectionTitle({
    kicker,
    title,
    subtitle,
    subtitleTablet,
    subtitleMobile,
}: {
    kicker: string;
    title: string;
    subtitle: string;
    subtitleTablet?: string;
    subtitleMobile?: string;
}) {
    return (
        <div className="max-w-[1100px]">
            <p className="text-[11px] md:text-[12px] tracking-[0.28em] uppercase text-ollin-black/45 mb-4 max-md:mb-5">
                {kicker}
            </p>

            <h2 className="font-[Montserrat] font-normal tracking-tight leading-[0.95] text-[clamp(34px,4.4vw,56px)] mb-4">
                {title}
            </h2>

            {/* Desktop copy (unchanged intent) */}
            <p className="hidden md:block text-[15px] md:text-[17px] leading-relaxed text-ollin-black/70 max-w-[70ch] max-md:max-w-[46ch]">
                {subtitle}
            </p>

            {/* Tablet copy (sm.. <md) */}
            <p className="hidden sm:block md:hidden text-[14px] leading-relaxed text-ollin-black/70 max-w-[58ch] break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                {subtitleTablet ?? subtitle}
            </p>

            {/* Mobile copy (<sm) */}
            <p className="sm:hidden text-[14px] leading-relaxed text-ollin-black/70 max-w-[46ch] break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                {subtitleMobile ?? subtitleTablet ?? subtitle}
            </p>
        </div>
    );
}

function Divider() {
    return <div className="h-px w-full bg-black/10" />;
}

function Card({
    tone = "glass",
    className = "",
    children,
}: {
    tone?: "glass" | "soft" | "mid";
    className?: string;
    children: React.ReactNode;
}) {
    const bg =
        tone === "glass" ? "bg-white/35" : tone === "soft" ? "bg-white/20" : "bg-white/30";
    return (
        <div
            className={cx(
                `rounded-none border border-black/10 ${bg} p-6 sm:p-7 md:p-9`,
                // MOBILE SAFETY: prevents “goes to infinity” horizontally (doesn't touch desktop)
                "max-md:max-w-full max-md:box-border max-md:overflow-hidden",
                className
            )}
        >
            {children}
        </div>
    );
}

function Label({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-[13px] tracking-[0.2em] uppercase text-ollin-black/45 mb-3 md:mb-4">
            {children}
        </p>
    );
}

function Chevron({ open, reducedMotion }: { open: boolean; reducedMotion: boolean }) {
    return (
        <span
            className={cx(
                "inline-flex items-center justify-center w-4 h-4",
                reducedMotion ? "" : "transition-transform duration-300 ease-out",
                open ? "rotate-180" : "rotate-0"
            )}
            aria-hidden="true"
        >
            <svg className="block" viewBox="0 0 16 16" width="16" height="16" fill="none">
                <path
                    d="M3.5 6.25L8 10.25L12.5 6.25"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </span>
    );
}

type ExpandLabels = { more: string; less: string };

function BulletList({
    items,
    itemsTablet,
    itemsMobile,
    collapsibleMobile = true,
    collapsibleTablet = true,
    labels,
    reducedMotion,
}: {
    items: string[];
    itemsTablet?: string[];
    itemsMobile?: string[];
    collapsibleMobile?: boolean;
    collapsibleTablet?: boolean;
    labels?: ExpandLabels;
    reducedMotion: boolean;
}) {
    const tablet = itemsTablet ?? items;
    const mobile = itemsMobile ?? tablet;

    const canExpandMobile = collapsibleMobile && items.length > mobile.length;
    const canExpandTablet = collapsibleTablet && items.length > tablet.length;

    const [open, setOpen] = useState(false);

    const moreLabel = labels?.more ?? "See details";
    const lessLabel = labels?.less ?? "Hide details";

    return (
        <>
            {/* Desktop list (full) */}
            <div className="hidden md:block space-y-3 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/70 max-md:text-[13.5px]">
                {items.map((t, i) => (
                    <p key={i}>• {t}</p>
                ))}
            </div>

            {/* Tablet list (sm.. <md) */}
            <div className="hidden sm:block md:hidden text-ollin-black/70">
                <div className="space-y-3 text-[13.5px] leading-relaxed">
                    {tablet.map((t, i) => (
                        <p key={`t-${i}`} className="break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                            • {t}
                        </p>
                    ))}
                </div>

                {canExpandTablet ? (
                    <div className="mt-4">
                        <div
                            className={cx(
                                "grid",
                                reducedMotion ? "" : "transition-[grid-template-rows,opacity,transform] duration-350 ease-out",
                                open ? "grid-rows-[1fr] opacity-100 translate-y-0" : "grid-rows-[0fr] opacity-0 -translate-y-1"
                            )}
                            style={{
                                transitionProperty: reducedMotion ? undefined : "grid-template-rows, opacity, transform",
                            }}
                            aria-hidden={!open}
                        >
                            <div className="overflow-hidden">
                                <div className="mt-3 space-y-3 text-[13.5px] leading-relaxed">
                                    {items.map((t, i) => (
                                        <p
                                            key={`t-full-${i}`}
                                            className="break-words hyphens-auto max-md:[overflow-wrap:anywhere]"
                                        >
                                            • {t}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setOpen((v) => !v)}
                            className={cx(
                                "mt-4 w-full flex items-center justify-between",
                                "cursor-pointer select-none",
                                "text-[12px] tracking-[0.14em] uppercase text-ollin-black/55 hover:text-ollin-black",
                                reducedMotion ? "" : "transition-colors"
                            )}
                            aria-expanded={open}
                        >
                            <span className="opacity-80">{open ? lessLabel : moreLabel}</span>
                            <Chevron open={open} reducedMotion={reducedMotion} />
                        </button>
                    </div>
                ) : null}
            </div>

            {/* Mobile list (<sm) */}
            <div className="sm:hidden text-ollin-black/70">
                <div className="space-y-3 text-[13.5px] leading-relaxed">
                    {mobile.map((t, i) => (
                        <p key={`m-${i}`} className="break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                            • {t}
                        </p>
                    ))}
                </div>

                {canExpandMobile ? (
                    <div className="mt-4">
                        <div
                            className={cx(
                                "grid",
                                reducedMotion ? "" : "transition-[grid-template-rows,opacity,transform] duration-350 ease-out",
                                open ? "grid-rows-[1fr] opacity-100 translate-y-0" : "grid-rows-[0fr] opacity-0 -translate-y-1"
                            )}
                            style={{
                                transitionProperty: reducedMotion ? undefined : "grid-template-rows, opacity, transform",
                            }}
                            aria-hidden={!open}
                        >
                            <div className="overflow-hidden">
                                <div className="mt-3 space-y-3 text-[13.5px] leading-relaxed">
                                    {items.map((t, i) => (
                                        <p
                                            key={`m-full-${i}`}
                                            className="break-words hyphens-auto max-md:[overflow-wrap:anywhere]"
                                        >
                                            • {t}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setOpen((v) => !v)}
                            className={cx(
                                "mt-4 w-full flex items-center justify-between",
                                "cursor-pointer select-none",
                                "text-[12px] tracking-[0.14em] uppercase text-ollin-black/55 hover:text-ollin-black",
                                reducedMotion ? "" : "transition-colors"
                            )}
                            aria-expanded={open}
                        >
                            <span className="opacity-80">{open ? lessLabel : moreLabel}</span>
                            <Chevron open={open} reducedMotion={reducedMotion} />
                        </button>
                    </div>
                ) : null}
            </div>
        </>
    );
}

function StepList({ steps }: { steps: string[] }) {
    return (
        <div className="space-y-3 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/70 max-md:text-[13.5px]">
            {steps.map((t, i) => (
                <p
                    key={i}
                    className="max-md:break-words max-md:hyphens-auto max-md:[overflow-wrap:anywhere]"
                >
                    <span className="font-medium text-ollin-black/80">{i + 1}.</span> {t}
                </p>
            ))}
        </div>
    );
}

function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return;

        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setReduced(!!mq.matches);
        update();

        if (mq.addEventListener) mq.addEventListener("change", update);
        else mq.addListener(update);

        return () => {
            if (mq.removeEventListener) mq.removeEventListener("change", update);
            else mq.removeListener(update);
        };
    }, []);

    return reduced;
}

function useRevealOnEnter(threshold = 0.35) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        if (revealed) return;

        const el = ref.current;
        if (!el || typeof IntersectionObserver === "undefined") {
            setRevealed(true);
            return;
        }

        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setRevealed(true);
                    io.disconnect();
                }
            },
            { threshold, rootMargin: "0px 0px -10% 0px" }
        );

        io.observe(el);
        return () => io.disconnect();
    }, [revealed, threshold]);

    return { ref, revealed } as const;
}

function LeadPathRail({ steps }: { steps: string[] }) {
    const reducedMotion = usePrefersReducedMotion();
    const { ref, revealed } = useRevealOnEnter(0.35);

    const showNow = reducedMotion ? true : revealed;

    // ✅ Slower, appreciable
    const DURATION_MS = 2800;
    const DELAY_MS = 140;
    const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

    // Background must match page
    const curtainColorClass = "bg-ollin-bg";

    // ✅ Dots: solid gray, opaque
    const DOT_SIZE = 12; // px (h-3 w-3)
    const DOT_COLOR = "#7A7A7A"; // neutral gray, opaque (tweak if you want lighter)

    // Geometry (do NOT change rail/tick positions)
    const RAIL_Y = 6;

    // ✅ Text spacing fix (ONLY text, not lines):
    // This is the key: create a stable gap from tick end to text top.
    const TEXT_GAP_DESKTOP = 14; // px from tick bottom to label top (more breathing room)
    const TEXT_LINE_HEIGHT_DESKTOP = 1.15;

    // Mobile spacing (label to the right; keep comfy)
    const MOBILE_LABEL_PADLEFT = 36;
    const MOBILE_ROW_MINH = 26;

    return (
        <div ref={ref} className="mt-5 md:mt-6">
            {/* MOBILE: vertical timeline (reveal top -> bottom) */}
            <div className="md:hidden relative">
                <div className="relative pl-8">
                    {/* main vertical rail */}
                    <div className="absolute left-[6px] top-[6px] bottom-[6px] w-px bg-black/20" />

                    <div className="space-y-6">
                        {steps.map((label) => (
                            <div
                                key={label}
                                className="relative"
                                style={{ minHeight: `${MOBILE_ROW_MINH}px` }}
                            >
                                {/* Dot */}
                                <div
                                    className="absolute left-[0px] top-[2px] rounded-full"
                                    style={{
                                        width: `${DOT_SIZE}px`,
                                        height: `${DOT_SIZE}px`,
                                        backgroundColor: DOT_COLOR,
                                    }}
                                />

                                {/* Tick (anchored) */}
                                <div className="absolute left-[12px] top-[7px] h-px w-[16px] bg-black/15" />

                                {/* Label (more breathing room happens naturally here) */}
                                <p
                                    className="text-[13.5px] font-medium text-ollin-black/80 max-w-[34ch]"
                                    style={{
                                        paddingLeft: `${MOBILE_LABEL_PADLEFT}px`,
                                        lineHeight: 1.25,
                                    }}
                                >
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Curtain wipe ABOVE content */}
                    {!reducedMotion && (
                        <div
                            aria-hidden
                            className={`pointer-events-none absolute inset-0 ${curtainColorClass}`}
                            style={{
                                zIndex: 30,
                                transformOrigin: "bottom",
                                transform: showNow ? "scaleY(0)" : "scaleY(1)",
                                transitionProperty: "transform",
                                transitionDuration: `${DURATION_MS}ms`,
                                transitionTimingFunction: EASE,
                                transitionDelay: `${DELAY_MS}ms`,
                                willChange: "transform",
                            }}
                        />
                    )}
                </div>
            </div>

            {/* DESKTOP/TABLET: horizontal timeline (reveal left -> right) */}
            <div className="hidden md:block relative">
                <div className="relative">
                    {/* rail */}
                    <div className="absolute left-0 right-0" style={{ top: `${RAIL_Y}px` }}>
                        <div className="h-px w-full bg-black/20" />
                    </div>

                    <div className="grid grid-cols-4">
                        {steps.map((label) => (
                            <div key={label} className="relative flex flex-col items-center">
                                {/* Dot */}
                                <div
                                    className="rounded-full"
                                    style={{
                                        width: `${DOT_SIZE}px`,
                                        height: `${DOT_SIZE}px`,
                                        backgroundColor: DOT_COLOR,
                                    }}
                                />

                                {/* Tick stays as-is (do not move) */}
                                <div className="mt-3 h-7 w-px bg-black/15" />

                                {/* ✅ Label spacing fix:
                    We DO NOT touch the tick/rail, only add a stable gap under the tick. */}
                                <p
                                    className="text-center text-[14px] font-medium text-ollin-black/80 max-w-[22ch]"
                                    style={{
                                        marginTop: `${TEXT_GAP_DESKTOP}px`,
                                        lineHeight: TEXT_LINE_HEIGHT_DESKTOP,
                                    }}
                                >
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Curtain wipe ABOVE content */}
                    {!reducedMotion && (
                        <div
                            aria-hidden
                            className={`pointer-events-none absolute inset-0 ${curtainColorClass}`}
                            style={{
                                zIndex: 30,
                                transformOrigin: "right",
                                transform: showNow ? "scaleX(0)" : "scaleX(1)",
                                transitionProperty: "transform",
                                transitionDuration: `${DURATION_MS}ms`,
                                transitionTimingFunction: EASE,
                                transitionDelay: `${DELAY_MS}ms`,
                                willChange: "transform",
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ServicesFoundation() {
    const leadSteps = useMemo(
        () => ["Visit", "Service page matches the job", "Call / Form", "Booked fast"],
        []
    );

    const prefersReducedMotion = useMemo(() => {
        if (typeof window === "undefined" || !window.matchMedia) return false;
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }, []);

    return (
        <main className={cx("w-full", "max-md:overflow-x-hidden")}>
            {/* ✅ Height-based fixes for landscape phones (md width but short height) */}
            <style>{`
        @media (max-height: 520px){
          .foundationHero{
            padding-top: 88px !important;
            padding-bottom: 40px !important;
          }
          .foundationHeroTitle{
            font-size: clamp(54px, 8vw, 104px) !important;
          }
          .foundationHeroSub{
            margin-top: 14px !important;
          }
          .foundationHeroChips{
            margin-top: 18px !important;
          }
          .foundationHeroTiles{
            margin-top: 18px !important;
          }
        }

        /* Hardening: avoid “infinite right” from any odd element in mobile */
        @media (max-width: 767px){
          .foundationSafeX *{
            min-width: 0;
            max-width: 100%;
            box-sizing: border-box;
          }
        }
      `}</style>

            {/* HERO */}
            <section className="foundationSafeX foundationHero w-full max-w-[1500px] mx-auto px-[5vw] pt-28 md:pt-32 pb-10 md:pb-14">
                <Link
                    to="/services"
                    className="inline-flex items-center text-[12px] md:text-[13px] tracking-[0.14em] uppercase text-ollin-black/55 hover:text-ollin-black transition-colors max-md:py-2"
                >
                    ← Back to Services
                </Link>

                <div className="mt-10 md:mt-12 max-md:mt-9">
                    <p className="text-[11px] md:text-[12px] tracking-[0.28em] uppercase text-ollin-black/45 mb-4 max-md:mb-5">
                        LOOK LIKE THE REAL DEAL
                    </p>

                    <h1 className="foundationHeroTitle font-[Montserrat] font-normal tracking-tight leading-[0.85] text-[clamp(44px,12.6vw,92px)] md:text-[clamp(64px,9vw,140px)]">
                        FOUNDATION
                    </h1>

                    <p className="foundationHeroSub mt-6 text-[18px] md:text-[22px] font-medium text-ollin-black/85 max-w-[60ch] max-md:mt-5 max-md:max-w-[26ch] leading-snug">
                        Look established in 30 seconds.
                    </p>

                    {/* Desktop paragraphs (unchanged) */}
                    <div className="hidden md:block mt-4 space-y-3 max-w-[78ch]">
                        <p className="text-[15px] md:text-[17px] leading-relaxed text-ollin-black/70">
                            People decide fast: your logo, website, and social pages either feel legit—or “new.”
                        </p>
                        <p className="text-[15px] md:text-[17px] leading-relaxed text-ollin-black/70">
                            Foundation makes everything match, look clean, and convert the first visit into the first call.
                        </p>
                    </div>

                    {/* Tablet paragraphs */}
                    <div className="hidden sm:block md:hidden mt-4 space-y-3 max-w-[60ch]">
                        <p className="text-[14px] leading-relaxed text-ollin-black/70 break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                            People decide fast: your brand either feels legit—or “new.”
                        </p>
                        <p className="text-[14px] leading-relaxed text-ollin-black/70 break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                            We make everything match and convert the first visit into a call.
                        </p>
                    </div>

                    {/* Mobile paragraphs */}
                    <div className="sm:hidden mt-4 space-y-3 max-w-[46ch]">
                        <p className="text-[14px] leading-relaxed text-ollin-black/70 break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                            Look legit fast.
                        </p>
                        <p className="text-[14px] leading-relaxed text-ollin-black/70 break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                            Make the first visit turn into the first call.
                        </p>
                    </div>

                    <div className="foundationHeroChips mt-8 flex flex-wrap gap-3 max-md:mt-7">
                        <Chip href="#brand">Brand & Creative</Chip>
                        <Chip href="#websites">Website That Gets Calls</Chip>
                        <Chip href="#social">Social That Looks Active</Chip>
                    </div>

                    <div className="foundationHeroTiles mt-10 md:mt-12 grid grid-cols-12 gap-8 max-md:mt-9 max-md:gap-6">
                        <div className="col-span-12 md:col-span-4">
                            <Card tone="soft">
                                <Label>CONSISTENCY</Label>
                                <p className="text-[16px] md:text-[18px] font-medium text-ollin-black/85 mb-4 max-md:mb-3">
                                    Everything matches, everywhere.
                                </p>
                                <BulletList
                                    reducedMotion={prefersReducedMotion}
                                    collapsibleMobile={false}
                                    collapsibleTablet={false}
                                    items={[
                                        "Same logo + colors across web, trucks, and profiles.",
                                        "No more “different company” vibes.",
                                    ]}
                                    itemsMobile={["Same look everywhere.", "No “different company” vibes."]}
                                />
                            </Card>
                        </div>

                        <div className="col-span-12 md:col-span-4">
                            <Card tone="soft">
                                <Label>CLARITY</Label>
                                <p className="text-[16px] md:text-[18px] font-medium text-ollin-black/85 mb-4 max-md:mb-3">
                                    Visitors instantly know what you do.
                                </p>
                                <BulletList
                                    reducedMotion={prefersReducedMotion}
                                    collapsibleMobile={false}
                                    collapsibleTablet={false}
                                    items={[
                                        "Clear services + service area + next step.",
                                        "Less confusion = more calls.",
                                    ]}
                                    itemsMobile={["Clear services + area + next step.", "Less confusion = more calls."]}
                                />
                            </Card>
                        </div>

                        <div className="col-span-12 md:col-span-4">
                            <Card tone="soft">
                                <Label>TRUST SIGNALS</Label>
                                <p className="text-[16px] md:text-[18px] font-medium text-ollin-black/85 mb-4 max-md:mb-3">
                                    Proof in the right places.
                                </p>
                                <BulletList
                                    reducedMotion={prefersReducedMotion}
                                    collapsibleMobile={false}
                                    collapsibleTablet={false}
                                    items={[
                                        "Reviews, photos, and credibility where people look.",
                                        "Feels established—not risky.",
                                    ]}
                                    itemsMobile={["Reviews + photos where it matters.", "Feels established, not risky."]}
                                />
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            <section className="foundationSafeX w-full max-w-[1500px] mx-auto px-[5vw] pb-20 md:pb-28 space-y-16 md:space-y-20">
                <div id="brand" className="scroll-mt-28">
                    <SectionTitle
                        kicker="Consistency everywhere"
                        title="Brand & Creative"
                        subtitle="We clean up what you have (or build it from scratch) so your logo, website, trucks, and profiles all look like one real company."
                        subtitleTablet="We clean up (or build) your brand so your logo, website, trucks, and profiles look like one real company."
                        subtitleMobile="We clean up (or build) your brand so everything looks like one real company."
                    />

                    <div className="mt-10 grid grid-cols-12 gap-8 max-md:mt-8 max-md:gap-6">
                        <div className="col-span-12 md:col-span-7">
                            <div className="space-y-8 max-md:space-y-6">
                                <Card tone="glass">
                                    <Label>WHAT YOU GET</Label>
                                    <p className="text-[15px] md:text-[17px] leading-relaxed text-ollin-black/75 mb-6 max-md:mb-5 max-md:break-words max-md:hyphens-auto max-md:[overflow-wrap:anywhere]">
                                        A practical brand kit built for real-world use.
                                    </p>

                                    <BulletList
                                        reducedMotion={prefersReducedMotion}
                                        labels={{ more: "See what’s included in Brand", less: "Hide Brand details" }}
                                        items={[
                                            "Light & dark variations (works on any background).",
                                            "Simple usage rules (spacing, min size, do/don’t examples).",
                                            "Basic template set (profile images + simple post layout) to stay consistent.",
                                        ]}
                                        itemsTablet={[
                                            "Light & dark variations (works on any background).",
                                        ]}
                                        itemsMobile={[
                                            "Clean logo versions (stacked / horizontal / icon).",
                                            "Printer-ready exports (PNG / SVG / PDF).",
                                        ]}
                                    />
                                </Card>

                                <Card tone="mid">
                                    <Label>HOW IT WORKS</Label>
                                    <StepList
                                        steps={[
                                            "We review what you have + where it breaks (truck, hats, social, web).",
                                            "We rebuild the clean versions + test legibility at real sizes.",
                                            "We deliver the full handoff pack so your printer/sign guy stops asking.",
                                        ]}
                                    />
                                </Card>
                            </div>
                        </div>

                        <div className="col-span-12 md:col-span-5">
                            <div className="space-y-8 max-md:space-y-6">
                                <Card tone="soft" className="h-full">
                                    <Label>OUTCOMES</Label>
                                    <BulletList
                                        reducedMotion={prefersReducedMotion}
                                        collapsibleMobile={false}
                                        collapsibleTablet={false}
                                        items={[
                                            "You look established, not improvised.",
                                            "Your brand stops changing across platforms.",
                                            "Everything gets faster to produce (posts, ads, signs).",
                                        ]}
                                        itemsMobile={[
                                            "Look established, not improvised.",
                                            "Stop changing across platforms.",
                                            "Faster to produce posts/ads/signs.",
                                        ]}
                                    />
                                </Card>

                                <Card tone="soft" className="h-full">
                                    <Label>WHAT THIS IS NOT</Label>
                                    <BulletList
                                        reducedMotion={prefersReducedMotion}
                                        collapsibleMobile={false}
                                        collapsibleTablet={false}
                                        items={[
                                            "Not an endless “creative direction” project.",
                                            "Not a full photoshoot/content production package.",
                                            "Not a naming/brand strategy deep-dive unless scoped separately.",
                                        ]}
                                        itemsMobile={[
                                            "Not endless creative direction.",
                                            "Not a full photoshoot package.",
                                            "Strategy deep-dive is separate.",
                                        ]}
                                    />
                                </Card>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 max-md:mt-6">
                        <Card tone="soft">
                            <Label>REAL-WORLD TEST</Label>

                            {/* Desktop (unchanged) */}
                            <p className="hidden md:block text-[14px] md:text-[15px] leading-relaxed text-ollin-black/70 max-w-[90ch] max-md:max-w-[52ch]">
                                We test your logo at tiny sizes (profile icon), mid sizes (website header), and real sizes (truck/yard sign)
                                so it stays readable.
                            </p>

                            {/* Tablet */}
                            <p className="hidden sm:block md:hidden text-[14px] leading-relaxed text-ollin-black/70 max-w-[64ch] break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                                We test your logo at real sizes (profile, website header, truck/sign) so it stays readable.
                            </p>

                            {/* Mobile */}
                            <p className="sm:hidden text-[14px] leading-relaxed text-ollin-black/70 max-w-[46ch] break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                                We test your logo at real sizes so it stays readable.
                            </p>
                        </Card>
                    </div>
                </div>

                <Divider />

                <div id="websites" className="scroll-mt-28">
                    <SectionTitle
                        kicker="More calls, less leaks"
                        title="Websites"
                        subtitle="A website built to turn visits into calls: clear services, strong proof, fast load times, and forms that actually reach you."
                        subtitleTablet="A website built to turn visits into calls: clear services, strong proof, fast load times, and forms that reach you."
                        subtitleMobile="A website built to turn visits into calls—fast, clear, and proven."
                    />

                    <div className="mt-10 max-md:mt-8">
                        <Label>THE LEAD PATH</Label>

                        {/* DO NOT TOUCH: timeline stays exactly as-is */}
                        <LeadPathRail steps={leadSteps} />
                    </div>

                    <div className="mt-8 grid grid-cols-12 gap-8 max-md:gap-6">
                        <div className="col-span-12 md:col-span-7">
                            <div className="space-y-8 max-md:space-y-6">
                                <Card tone="glass">
                                    <Label>BUILT TO GET CALLS</Label>
                                    <p className="text-[15px] md:text-[17px] leading-relaxed text-ollin-black/75 mb-6 max-md:mb-5 max-md:break-words max-md:hyphens-auto max-md:[overflow-wrap:anywhere]">
                                        No fluff. Just clarity, speed, and conversion.
                                    </p>

                                    <BulletList
                                        reducedMotion={prefersReducedMotion}
                                        labels={{ more: "See what the Website includes", less: "Hide Website details" }}
                                        items={[
                                            "Proof blocks (reviews, before/after, credibility) in conversion spots.",
                                            "Forms that deliver (email + sheet) with spam protection.",
                                            "Basic tracking setup so you can measure calls + form leads.",
                                            "Tune-ups available if the site exists but leaks leads.",
                                        ]}
                                        itemsTablet={[
                                            "Proof blocks (reviews, before/after, credibility) in conversion spots.",
                                        ]}
                                        itemsMobile={[
                                            "Service pages match search intent.",
                                            "Clear CTAs (call/text) where people decide.",
                                        ]}
                                    />
                                </Card>

                                <Card tone="mid">
                                    <Label>HOW IT WORKS</Label>
                                    <StepList
                                        steps={[
                                            "We map your services + service area + primary offer.",
                                            "We build the pages and conversion flow (speed + clarity first).",
                                            "We connect tracking + test the whole lead path end-to-end.",
                                        ]}
                                    />
                                </Card>
                            </div>
                        </div>

                        <div className="col-span-12 md:col-span-5">
                            <div className="space-y-8 max-md:space-y-6">
                                <Card tone="soft" className="h-full">
                                    <Label>WHAT WE AVOID</Label>
                                    <BulletList
                                        reducedMotion={prefersReducedMotion}
                                        collapsibleMobile={false}
                                        collapsibleTablet={false}
                                        items={[
                                            "Slow, flashy stuff that hurts load speed.",
                                            "“Pretty but unclear” pages with no next step.",
                                            "Broken forms/tracking that ruin ads later.",
                                        ]}
                                        itemsMobile={[
                                            "Slow, flashy stuff that kills speed.",
                                            "Pretty but unclear pages.",
                                            "Broken forms/tracking.",
                                        ]}
                                    />
                                </Card>

                                <Card tone="soft" className="h-full">
                                    <Label>PAIRS WITH</Label>
                                    <BulletList
                                        reducedMotion={prefersReducedMotion}
                                        collapsibleMobile={false}
                                        collapsibleTablet={false}
                                        items={[
                                            "Performance Marketing (ads work better when the page matches intent).",
                                            "Analytics & Tracking (so you know what turns into real jobs).",
                                        ]}
                                        itemsMobile={[
                                            "Performance Marketing (page matches intent).",
                                            "Analytics & Tracking (know what turns into jobs).",
                                        ]}
                                    />
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

                <Divider />

                <div id="social" className="scroll-mt-28">
                    <SectionTitle
                        kicker="Stay active + look legit"
                        title="Social Management"
                        subtitle="Consistent posts + monitoring so your pages don’t look abandoned—and leads don’t get ignored."
                        subtitleTablet="Consistent posts + monitoring so your pages don’t look abandoned—and leads don’t get ignored."
                        subtitleMobile="Stay active and look legit—so leads don’t get ignored."
                    />

                    <div className="mt-10 grid grid-cols-12 gap-8 max-md:mt-8 max-md:gap-6">
                        <div className="col-span-12 md:col-span-7">
                            <div className="space-y-8 max-md:space-y-6">
                                <Card tone="glass">
                                    <Label>YOUR ONLINE STOREFRONT</Label>
                                    <p className="text-[15px] md:text-[17px] leading-relaxed text-ollin-black/75 mb-6 max-md:mb-5 max-md:break-words max-md:hyphens-auto max-md:[overflow-wrap:anywhere]">
                                        We keep your pages active, consistent, and professional.
                                    </p>

                                    <BulletList
                                        reducedMotion={prefersReducedMotion}
                                        collapsibleMobile={false}
                                        collapsibleTablet={false}
                                        items={[
                                            "Monthly plan + content creation + scheduling.",
                                            "Branded templates so everything looks like one company.",
                                            "Captions that sound human (EN/ES available).",
                                            "Monitoring for messages/comments (so leads aren’t ignored).",
                                        ]}
                                        itemsMobile={[
                                            "Monthly plan + creation + scheduling.",
                                            "Branded templates (one-company look).",
                                            "Human captions (EN/ES).",
                                            "Monitor messages/comments.",
                                        ]}
                                    />
                                </Card>

                                <Card tone="mid">
                                    <Label>CONTENT PILLARS</Label>
                                    <BulletList
                                        reducedMotion={prefersReducedMotion}
                                        collapsibleMobile={false}
                                        collapsibleTablet={false}
                                        items={[
                                            "Before/after jobs (proof).",
                                            "Process + behind-the-scenes (trust).",
                                            "Reviews + reputation (credibility).",
                                            "Tips + common questions (authority).",
                                        ]}
                                        itemsMobile={[
                                            "Before/after (proof).",
                                            "Process (trust).",
                                            "Reviews (credibility).",
                                            "Tips (authority).",
                                        ]}
                                    />
                                </Card>
                            </div>
                        </div>

                        <div className="col-span-12 md:col-span-5">
                            <div className="space-y-8 max-md:space-y-6">
                                <Card tone="soft" className="h-full">
                                    <Label>IMPORTANT</Label>
                                    <BulletList
                                        reducedMotion={prefersReducedMotion}
                                        collapsibleMobile={false}
                                        collapsibleTablet={false}
                                        items={[
                                            "Social is the front-end. We don’t quote or book jobs inside Social.",
                                            "For booking + intake workflows, use Digital Secretary.",
                                            "We don’t chase “viral”—we build trust and consistency.",
                                        ]}
                                        itemsMobile={[
                                            "Social is front-end (no quoting/booking).",
                                            "For booking + intake: Digital Secretary.",
                                            "No “viral” chasing—trust + consistency.",
                                        ]}
                                    />
                                </Card>

                                <Card tone="soft" className="h-full">
                                    <Label>OUTCOMES</Label>
                                    <BulletList
                                        reducedMotion={prefersReducedMotion}
                                        collapsibleMobile={false}
                                        collapsibleTablet={false}
                                        items={[
                                            "Prospects see you’re active and real.",
                                            "Brand looks consistent across platforms.",
                                            "Messages get answered and routed faster.",
                                        ]}
                                        itemsMobile={[
                                            "Look active and real.",
                                            "Consistent brand everywhere.",
                                            "Faster message routing.",
                                        ]}
                                    />
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <div className="rounded-none border border-black/10 bg-white/30 p-7 sm:p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <p className="text-[11px] md:text-[12px] tracking-[0.28em] uppercase text-ollin-black/45 mb-3">
                                NEXT STEP
                            </p>

                            {/* Desktop (unchanged copy) */}
                            <div className="hidden md:block">
                                <p className="text-[18px] md:text-[22px] font-medium text-ollin-black/85 max-md:max-w-[28ch]">
                                    Want Foundation done fast and clean?
                                </p>
                                <p className="mt-2 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/65 max-w-[70ch] max-md:max-w-[50ch]">
                                    Tell us your trade + service areas and we’ll recommend the simplest Foundation stack that makes you look
                                    established before you spend hard on ads.
                                </p>
                            </div>

                            {/* Tablet */}
                            <div className="hidden sm:block md:hidden">
                                <p className="text-[18px] font-medium text-ollin-black/85 max-w-[44ch] leading-snug">
                                    Want Foundation done fast and clean?
                                </p>
                                <p className="mt-2 text-[14px] leading-relaxed text-ollin-black/65 max-w-[62ch] break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                                    Tell us your trade + service areas and we’ll recommend the simplest Foundation stack before you spend hard on ads.
                                </p>
                            </div>

                            {/* Mobile */}
                            <div className="sm:hidden">
                                <p className="text-[18px] font-medium text-ollin-black/85 max-w-[30ch] leading-snug">
                                    Want Foundation done fast?
                                </p>
                                <p className="mt-2 text-[14px] leading-relaxed text-ollin-black/65 max-w-[46ch] break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                                    Tell us your trade + areas. We’ll recommend the simplest Foundation stack before ads.
                                </p>
                            </div>
                        </div>

                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center bg-ollin-black text-white text-[13px] md:text-[14px] font-medium tracking-wide px-6 py-3 rounded-[14px] hover:translate-y-[-1px] hover:shadow-lg transition-all w-full sm:w-auto"
                        >
                            Get a Free Growth Plan
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
