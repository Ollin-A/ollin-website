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

            {/* Desktop copy (INTACT) */}
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
                // mobile safety (does not touch desktop)
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
            {/* Desktop list (INTACT look) */}
            <div className="hidden md:block space-y-3 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/70 max-md:text-[13.5px]">
                {items.map((t, i) => (
                    <p key={i}>• {t}</p>
                ))}
            </div>

            {/* Tablet list (sm.. <md) */}
            <div className="hidden sm:block md:hidden text-ollin-black/70">
                <div className="space-y-3 text-[13.5px] leading-relaxed">
                    {tablet.map((t, i) => (
                        <p
                            key={`t-${i}`}
                            className="break-words hyphens-auto max-md:[overflow-wrap:anywhere]"
                        >
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
                        <p
                            key={`m-${i}`}
                            className="break-words hyphens-auto max-md:[overflow-wrap:anywhere]"
                        >
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

/* -----------------------------
   Process Stepper Rail (same as Demand/Foundation)
   - Mobile: vertical
   - Desktop/Tablet: horizontal
   - No background box
-------------------------------- */

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

function ProcessRail({
    steps,
    reducedMotion,
}: {
    steps: string[];
    reducedMotion: boolean;
}) {
    const { ref, revealed } = useRevealOnEnter(0.35);
    const showNow = reducedMotion ? true : revealed;

    // Slower, appreciable
    const DURATION_MS = 2800;
    const DELAY_MS = 140;
    const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

    // Background must match page
    const curtainColorClass = "bg-ollin-bg";

    // Dots
    const DOT_SIZE = 12;
    const DOT_COLOR = "#7A7A7A";

    // Geometry
    const RAIL_Y = 6;

    // Label spacing under tick (desktop/tablet)
    const TEXT_GAP_DESKTOP = 14;
    const TEXT_LINE_HEIGHT_DESKTOP = 1.15;

    // Mobile layout
    const MOBILE_LABEL_PADLEFT = 36;
    const MOBILE_ROW_MINH = 26;

    const labelMaxCh = steps.length <= 3 ? 26 : 22;

    return (
        <div ref={ref} className="mt-5 md:mt-6">
            {/* MOBILE: vertical stepper */}
            <div className="md:hidden relative">
                <div className="relative pl-8">
                    {/* main vertical rail */}
                    <div className="absolute left-[6px] top-[6px] bottom-[6px] w-px bg-black/20" />

                    <div className="space-y-6">
                        {steps.map((label) => (
                            <div key={label} className="relative" style={{ minHeight: `${MOBILE_ROW_MINH}px` }}>
                                {/* Dot */}
                                <div
                                    className="absolute left-[0px] top-[2px] rounded-full"
                                    style={{
                                        width: `${DOT_SIZE}px`,
                                        height: `${DOT_SIZE}px`,
                                        backgroundColor: DOT_COLOR,
                                    }}
                                />

                                {/* Tick */}
                                <div className="absolute left-[12px] top-[7px] h-px w-[16px] bg-black/15" />

                                {/* Label */}
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

                    {/* Curtain wipe */}
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

            {/* DESKTOP/TABLET: horizontal stepper */}
            <div className="hidden md:block relative">
                <div className="relative">
                    {/* rail */}
                    <div className="absolute left-0 right-0" style={{ top: `${RAIL_Y}px` }}>
                        <div className="h-px w-full bg-black/20" />
                    </div>

                    <div className="grid" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
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

                                {/* Tick */}
                                <div className="mt-3 h-7 w-px bg-black/15" />

                                {/* Label */}
                                <p
                                    className="text-center text-[14px] font-medium text-ollin-black/80"
                                    style={{
                                        marginTop: `${TEXT_GAP_DESKTOP}px`,
                                        lineHeight: TEXT_LINE_HEIGHT_DESKTOP,
                                        maxWidth: `${labelMaxCh}ch`,
                                    }}
                                >
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Curtain wipe */}
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

export default function ServicesRetention() {
    const prefersReducedMotion = useMemo(() => {
        if (typeof window === "undefined" || !window.matchMedia) return false;
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }, []);

    const intakeSteps = useMemo(
        () => ["Capture", "Qualify", "Route", "Book / Handoff"],
        []
    );

    const threeFlowSteps = useMemo(
        () => ["Reviews", "Referrals", "Reactivation"],
        []
    );

    return (
        <main className="w-full max-md:overflow-x-hidden">
            {/* ✅ Landscape phone (wide but short) safety — fixes “everything drops down” without altering desktop */}
            <style>{`
        @media (max-height: 520px){
          .retentionHero{
            padding-top: 88px !important;
            padding-bottom: 40px !important;
          }
          .retentionHeroTitle{
            font-size: clamp(52px, 8vw, 108px) !important;
          }
          .retentionHeroSub{
            margin-top: 14px !important;
          }
          .retentionHeroChips{
            margin-top: 18px !important;
          }
          .retentionHeroTiles{
            margin-top: 18px !important;
          }
        }

        /* Hardening: avoid “infinite right” from any odd element in mobile */
        @media (max-width: 767px){
          .retentionSafeX *{
            min-width: 0;
            max-width: 100%;
            box-sizing: border-box;
          }
        }
      `}</style>

            {/* HERO */}
            <section className="retentionSafeX retentionHero w-full max-w-[1500px] mx-auto px-[5vw] pt-28 md:pt-32 pb-10 md:pb-14">
                <Link
                    to="/services"
                    className="inline-flex items-center text-[12px] md:text-[13px] tracking-[0.14em] uppercase text-ollin-black/55 hover:text-ollin-black transition-colors max-md:py-2"
                >
                    ← Back to Services
                </Link>

                <div className="mt-10 md:mt-12 max-md:mt-9">
                    <p className="text-[11px] md:text-[12px] tracking-[0.28em] uppercase text-ollin-black/45 mb-4 max-md:mb-5">
                        FOLLOW-UPS + 5-STARS
                    </p>

                    {/* ✅ Mobile clamp reduced to prevent cropping; md (desktop/tablet) stays identical */}
                    <h1 className="retentionHeroTitle font-[Montserrat] font-normal tracking-tight leading-[0.85] text-[clamp(44px,12.6vw,92px)] md:text-[clamp(64px,9vw,140px)]">
                        RETENTION
                    </h1>

                    <p className="retentionHeroSub mt-6 text-[18px] md:text-[22px] font-medium text-ollin-black/85 max-w-[60ch] max-md:mt-5 max-md:max-w-[30ch] leading-snug">
                        Make revenue compound.
                    </p>

                    {/* Desktop paragraphs (INTACT) */}
                    <div className="hidden md:block mt-4 space-y-3 max-w-[82ch] max-md:max-w-[48ch]">
                        <p className="text-[15px] md:text-[17px] leading-relaxed text-ollin-black/70">
                            Retention is where growth becomes durable: leads don’t get wasted, jobs turn into reviews, and past customers
                            come back when seasonality hits.
                        </p>
                        <p className="text-[15px] md:text-[17px] leading-relaxed text-ollin-black/70">
                            The goal: faster follow-up, cleaner handoffs, and a system that keeps your reputation and repeat work moving.
                        </p>
                    </div>

                    {/* Tablet paragraphs (sm.. <md) */}
                    <div className="hidden sm:block md:hidden mt-4 space-y-3 max-w-[60ch]">
                        <p className="text-[14px] leading-relaxed text-ollin-black/70 break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                            Retention makes growth durable: faster follow-up, more reviews, and repeat work when seasonality hits.
                        </p>
                        <p className="text-[14px] leading-relaxed text-ollin-black/70 break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                            The system keeps leads moving, handoffs clean, and reputation protected.
                        </p>
                    </div>

                    {/* Mobile paragraphs (<sm) */}
                    <div className="sm:hidden mt-4 space-y-3 max-w-[46ch]">
                        <p className="text-[14px] leading-relaxed text-ollin-black/70 break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                            Stop losing leads after the click.
                        </p>
                        <p className="text-[14px] leading-relaxed text-ollin-black/70 break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                            Follow up fast, earn reviews, and bring customers back.
                        </p>
                    </div>

                    <div className="retentionHeroChips mt-8 flex flex-wrap gap-3 max-md:mt-7">
                        <Chip href="#secretary">Digital Secretary</Chip>
                        <Chip href="#reviews">Reviews &amp; Repeat Jobs Engine</Chip>
                    </div>

                    {/* 3 Proof Tiles */}
                    <div className="retentionHeroTiles mt-10 md:mt-12 grid grid-cols-12 gap-8 max-md:mt-9 max-md:gap-6">
                        <div className="col-span-12 md:col-span-4">
                            <Card tone="soft">
                                <Label>SPEED-TO-LEAD</Label>
                                <p className="text-[16px] md:text-[18px] font-medium text-ollin-black/85 mb-4 max-md:mb-3">
                                    Fast replies win deals.
                                </p>
                                <BulletList
                                    reducedMotion={prefersReducedMotion}
                                    collapsibleMobile={false}
                                    collapsibleTablet={false}
                                    items={[
                                        "Less “I’ll get back to you” loss.",
                                        "More booked estimates from the same lead flow.",
                                    ]}
                                    itemsTablet={[
                                        "Less “I’ll get back to you” loss.",
                                        "More booked estimates from the same lead flow.",
                                    ]}
                                    itemsMobile={[
                                        "Less follow-up loss.",
                                        "More booked estimates.",
                                    ]}
                                />
                            </Card>
                        </div>

                        <div className="col-span-12 md:col-span-4">
                            <Card tone="soft">
                                <Label>REPUTATION</Label>
                                <p className="text-[16px] md:text-[18px] font-medium text-ollin-black/85 mb-4 max-md:mb-3">
                                    Turn jobs into 5-stars.
                                </p>
                                <BulletList
                                    reducedMotion={prefersReducedMotion}
                                    collapsibleMobile={false}
                                    collapsibleTablet={false}
                                    items={[
                                        "Ask at the right moment (timing matters).",
                                        "Protect your rating by handling problems privately first.",
                                    ]}
                                    itemsTablet={[
                                        "Ask at the right moment (timing matters).",
                                        "Handle issues privately before public damage.",
                                    ]}
                                    itemsMobile={[
                                        "Ask at the right moment.",
                                        "Handle issues privately first.",
                                    ]}
                                />
                            </Card>
                        </div>

                        <div className="col-span-12 md:col-span-4">
                            <Card tone="soft">
                                <Label>REPEAT WORK</Label>
                                <p className="text-[16px] md:text-[18px] font-medium text-ollin-black/85 mb-4 max-md:mb-3">
                                    Reactivate past customers.
                                </p>
                                <BulletList
                                    reducedMotion={prefersReducedMotion}
                                    collapsibleMobile={false}
                                    collapsibleTablet={false}
                                    items={[
                                        "Seasonal outreach that brings work back.",
                                        "Referrals that don’t feel spammy.",
                                    ]}
                                    itemsTablet={[
                                        "Seasonal outreach that brings work back.",
                                        "Referrals that don’t feel spammy.",
                                    ]}
                                    itemsMobile={[
                                        "Seasonal reactivation.",
                                        "Referrals without spam.",
                                    ]}
                                />
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            <section className="retentionSafeX w-full max-w-[1500px] mx-auto px-[5vw] pb-20 md:pb-28 space-y-16 md:space-y-20">
                {/* DIGITAL SECRETARY */}
                <div id="secretary" className="scroll-mt-28">
                    <SectionTitle
                        kicker="Speed wins deals"
                        title="Digital Secretary"
                        subtitle="An intake + follow-up system that converts conversations into booked estimates—so leads don’t die in your inbox."
                        subtitleTablet="An intake + follow-up system that turns conversations into booked estimates—so leads don’t die in the inbox."
                        subtitleMobile="Intake + follow-up that turns conversations into booked estimates."
                    />

                    {/* ✅ Stepper (NO BOX) */}
                    <div className="mt-10 max-md:mt-8">
                        <Label>THE INTAKE PATH</Label>
                        <ProcessRail steps={intakeSteps} reducedMotion={prefersReducedMotion} />
                    </div>

                    <div className="mt-8 grid grid-cols-12 gap-8 max-md:gap-6">
                        <div className="col-span-12 md:col-span-7">
                            <div className="space-y-8 max-md:space-y-6">
                                <Card tone="glass">
                                    <Label>WHAT YOU GET</Label>
                                    <p className="text-[15px] md:text-[17px] leading-relaxed text-ollin-black/75 mb-6 max-md:mb-5 max-md:break-words max-md:hyphens-auto max-md:[overflow-wrap:anywhere]">
                                        A consistent lead-handling machine—so you stop losing revenue to slow follow-up.
                                    </p>

                                    <BulletList
                                        reducedMotion={prefersReducedMotion}
                                        labels={{ more: "See what the Secretary includes", less: "Hide Secretary details" }}
                                        items={[
                                            "Capture + qualify: asks the right questions to reduce back-and-forth.",
                                            "Routing: sends the lead to the right person/step based on service + location + urgency.",
                                            "Booking (when workflows allow): moves from “DM” to scheduled call/visit.",
                                            "Handoff: keeps context so you don’t restart the conversation.",
                                            "Alerts + escalation rules for hot leads or edge cases.",
                                        ]}
                                        itemsTablet={[
                                            "Capture + qualify: asks the right questions to reduce back-and-forth.",
                                            "Routing: sends the lead to the right person based on service + location + urgency.",
                                            "Handoff: keeps context so you don’t restart the conversation.",
                                        ]}
                                        itemsMobile={[
                                            "Capture + qualify (less back-and-forth).",
                                            "Route the lead to the right person fast.",
                                        ]}
                                    />
                                </Card>

                                <Card tone="mid">
                                    <Label>HOW IT WORKS</Label>
                                    <StepList
                                        steps={[
                                            "We map your intake rules (services, areas, hours, what you do/don’t take).",
                                            "We build the conversation flow and handoff points (with escalation rules).",
                                            "We monitor early performance and tighten the flow based on real conversations.",
                                        ]}
                                    />
                                </Card>
                            </div>
                        </div>

                        <div className="col-span-12 md:col-span-5">
                            <div className="space-y-8 max-md:space-y-6">
                                <Card tone="soft" className="h-full">
                                    <Label>BEST FOR</Label>
                                    <BulletList
                                        reducedMotion={prefersReducedMotion}
                                        collapsibleMobile={false}
                                        collapsibleTablet={false}
                                        items={[
                                            "Businesses that miss calls or reply late.",
                                            "Higher lead volume from Ads/Maps/Social.",
                                            "Teams that want a consistent intake process.",
                                        ]}
                                        itemsTablet={[
                                            "Businesses that miss calls or reply late.",
                                            "Higher lead volume from Ads/Maps/Social.",
                                            "Teams that want consistent intake.",
                                        ]}
                                        itemsMobile={[
                                            "Missed calls / late replies.",
                                            "Higher lead volume.",
                                            "Consistent intake process.",
                                        ]}
                                    />
                                </Card>

                                <Card tone="soft" className="h-full">
                                    <Label>BOUNDARIES</Label>
                                    <BulletList
                                        reducedMotion={prefersReducedMotion}
                                        collapsibleMobile={false}
                                        collapsibleTablet={false}
                                        items={[
                                            "Not a magic close tool—speed + process are the advantage.",
                                            "Edge cases still need a human (we escalate those).",
                                            "Works best when someone can take the booked call/visit fast.",
                                        ]}
                                        itemsTablet={[
                                            "Not a magic close tool—speed + process are the advantage.",
                                            "Edge cases still need a human (we escalate those).",
                                            "Works best when someone can take the booked call/visit fast.",
                                        ]}
                                        itemsMobile={[
                                            "Speed + process win (not “magic”).",
                                            "Edge cases escalate to a human.",
                                            "Best when calls/visits happen fast.",
                                        ]}
                                    />
                                </Card>
                            </div>
                        </div>
                    </div>

                    {/* Pairs with strip */}
                    <div className="mt-8 max-md:mt-7">
                        <Card tone="soft">
                            <Label>PAIRS WITH</Label>
                            <BulletList
                                reducedMotion={prefersReducedMotion}
                                collapsibleMobile={false}
                                collapsibleTablet={false}
                                items={[
                                    "Performance Marketing (paid leads need fast handling).",
                                    "Social Management (Social is the front-end—Secretary turns it into booked work).",
                                ]}
                                itemsTablet={[
                                    "Performance Marketing (paid leads need fast handling).",
                                    "Social Management (Social is the front-end—Secretary turns it into booked work).",
                                ]}
                                itemsMobile={[
                                    "Performance Marketing (handle paid leads fast).",
                                    "Social Management (turn DMs into booked work).",
                                ]}
                            />
                        </Card>
                    </div>
                </div>

                <Divider />

                {/* REVIEWS + REPEAT */}
                <div id="reviews" className="scroll-mt-28">
                    <SectionTitle
                        kicker="Reputation + reactivation"
                        title="Reviews & Repeat Jobs Engine"
                        subtitle="A system we operate that turns jobs into 5-star reviews, referrals, and repeat work—while preventing reputation damage."
                        subtitleTablet="A system we operate to turn jobs into reviews, referrals, and repeat work—while preventing reputation damage."
                        subtitleMobile="Turn jobs into reviews + repeat work—without reputation damage."
                    />

                    {/* ✅ Stepper (NO BOX) */}
                    <div className="mt-10 max-md:mt-8">
                        <Label>THE THREE FLOWS</Label>
                        <ProcessRail steps={threeFlowSteps} reducedMotion={prefersReducedMotion} />
                    </div>

                    <div className="mt-8 grid grid-cols-12 gap-8 max-md:gap-6">
                        <div className="col-span-12 md:col-span-7">
                            <div className="space-y-8 max-md:space-y-6">
                                <Card tone="glass">
                                    <Label>WHAT YOU GET</Label>
                                    <p className="text-[15px] md:text-[17px] leading-relaxed text-ollin-black/75 mb-6 max-md:mb-5 max-md:break-words max-md:hyphens-auto max-md:[overflow-wrap:anywhere]">
                                        Not a spammy follow-up tool. A reputation + reactivation engine built for contractors.
                                    </p>

                                    <BulletList
                                        reducedMotion={prefersReducedMotion}
                                        labels={{ more: "See what the Engine includes", less: "Hide Engine details" }}
                                        items={[
                                            "Post-job review flow: ask at the right moment (timing matters).",
                                            "Reputation protection: unhappy customers are routed privately first.",
                                            "Referral flow: ask when customers are happiest (low friction).",
                                            "Reactivation campaigns: seasonal outreach to past customers to generate repeat jobs.",
                                            "Simple replies and templates that keep it human—not robotic.",
                                        ]}
                                        itemsTablet={[
                                            "Post-job review flow: ask at the right moment (timing matters).",
                                            "Reputation protection: unhappy customers route privately first.",
                                            "Reactivation: seasonal outreach to past customers for repeat jobs.",
                                        ]}
                                        itemsMobile={[
                                            "Ask for reviews at the right moment.",
                                            "Route unhappy customers privately first.",
                                        ]}
                                    />
                                </Card>

                                <Card tone="mid">
                                    <Label>HOW IT WORKS</Label>
                                    <StepList
                                        steps={[
                                            "We set the rules: when to ask, who to ask, and how to handle negatives.",
                                            "We run the flows consistently (reviews + referrals + reactivation).",
                                            "We adjust based on response rate and seasonality patterns.",
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
                                            "More 5-star reviews without “review begging” vibes.",
                                            "Less reputation damage from unhappy customers.",
                                            "More referrals + repeat work during slow periods.",
                                        ]}
                                        itemsTablet={[
                                            "More 5-star reviews without “review begging” vibes.",
                                            "Less reputation damage from unhappy customers.",
                                            "More referrals + repeat work during slow periods.",
                                        ]}
                                        itemsMobile={[
                                            "More 5-star reviews (no cringe).",
                                            "Less reputation damage.",
                                            "More referrals + repeat work.",
                                        ]}
                                    />
                                </Card>

                                <Card tone="soft" className="h-full">
                                    <Label>BOUNDARIES</Label>
                                    <BulletList
                                        reducedMotion={prefersReducedMotion}
                                        collapsibleMobile={false}
                                        collapsibleTablet={false}
                                        items={[
                                            "Not for businesses that don’t complete jobs consistently (you need a finished-job trigger).",
                                            "We keep outreach reasonable—no daily spam blasts.",
                                            "If you want deep CRM rebuilds, that’s a separate scope.",
                                        ]}
                                        itemsTablet={[
                                            "Needs a finished-job trigger (completed jobs consistently).",
                                            "Outreach stays reasonable—no daily spam blasts.",
                                            "Deep CRM rebuilds are separate scope.",
                                        ]}
                                        itemsMobile={[
                                            "Needs a finished-job trigger.",
                                            "No daily spam blasts.",
                                            "Deep CRM rebuilds = separate scope.",
                                        ]}
                                    />
                                </Card>
                            </div>
                        </div>
                    </div>

                    {/* Micro callout */}
                    <div className="mt-8 max-md:mt-7">
                        <Card tone="soft">
                            <Label>REPUTATION PROTECTION</Label>

                            {/* Desktop (INTACT) */}
                            <p className="hidden md:block text-[14px] md:text-[15px] leading-relaxed text-ollin-black/70 max-w-[95ch] max-md:max-w-[52ch]">
                                The system routes unhappy customers to a private resolution path first—so issues get handled before they
                                turn into public 1-star damage.
                            </p>

                            {/* Tablet */}
                            <p className="hidden sm:block md:hidden text-[14px] leading-relaxed text-ollin-black/70 max-w-[64ch] break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                                Unhappy customers route to a private resolution path first—so issues get handled before public damage.
                            </p>

                            {/* Mobile */}
                            <p className="sm:hidden text-[14px] leading-relaxed text-ollin-black/70 max-w-[46ch] break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                                Fix issues privately before they become public damage.
                            </p>
                        </Card>
                    </div>
                </div>

                {/* CTA */}
                <div className="pt-4">
                    <div className="rounded-none border border-black/10 bg-white/30 p-7 sm:p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <p className="text-[11px] md:text-[12px] tracking-[0.28em] uppercase text-ollin-black/45 mb-3">
                                NEXT STEP
                            </p>

                            {/* Desktop headline/body (INTACT) */}
                            <div className="hidden md:block">
                                <p className="text-[18px] md:text-[22px] font-medium text-ollin-black/85 max-md:max-w-[30ch]">
                                    Want leads to stop leaking?
                                </p>
                                <p className="mt-2 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/65 max-w-[70ch] max-md:max-w-[52ch]">
                                    We’ll map your intake + follow-up flow and recommend the smallest Retention stack that improves close rate,
                                    review velocity, and repeat work—without overcomplicating your operations.
                                </p>
                            </div>

                            {/* Tablet headline/body (sm.. <md) */}
                            <div className="hidden sm:block md:hidden">
                                <p className="text-[18px] font-medium text-ollin-black/85 max-w-[44ch] leading-snug">
                                    Want leads to stop leaking?
                                </p>
                                <p className="mt-2 text-[14px] leading-relaxed text-ollin-black/65 max-w-[62ch] break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                                    We’ll map your intake + follow-up flow and recommend the smallest Retention stack to improve close rate,
                                    reviews, and repeat work.
                                </p>
                            </div>

                            {/* Mobile headline/body (<sm) */}
                            <div className="sm:hidden">
                                <p className="text-[18px] font-medium text-ollin-black/85 max-w-[30ch] leading-snug">
                                    Want leaks to stop?
                                </p>
                                <p className="mt-2 text-[14px] leading-relaxed text-ollin-black/65 max-w-[46ch] break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                                    We’ll map your follow-up flow and recommend the smallest Retention stack that compounds.
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
