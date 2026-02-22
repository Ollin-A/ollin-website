import React, { useMemo, useState } from "react";
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
    subtitleMobile,
}: {
    kicker: string;
    title: string;
    subtitle: string;
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

            {/* Desktop copy (unchanged) */}
            <p
                className="hidden md:block text-[15px] md:text-[17px] leading-relaxed text-ollin-black/70 max-w-[70ch]"
                style={{ overflowWrap: "anywhere" }}
            >
                {subtitle}
            </p>

            {/* Mobile copy (shorter) */}
            <p
                className="md:hidden text-[14px] leading-relaxed text-ollin-black/70 max-w-[46ch] break-words hyphens-auto"
                style={{ overflowWrap: "anywhere" }}
            >
                {subtitleMobile ?? subtitle}
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
    const bg = tone === "glass" ? "bg-white/35" : tone === "soft" ? "bg-white/20" : "bg-white/30";
    return (
        <div
            className={cx(
                `rounded-none border border-black/10 ${bg} p-6 sm:p-7 md:p-9`,
                // MOBILE SAFETY: prevents “goes to infinity” horizontally
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

function Chevron({
    open,
    reducedMotion,
}: {
    open: boolean;
    reducedMotion: boolean;
}) {
    return (
        <span
            className={cx(
                "inline-flex items-center justify-center w-4 h-4",
                reducedMotion ? "" : "transition-transform duration-300 ease-out",
                open ? "rotate-180" : "rotate-0"
            )}
            aria-hidden="true"
        >
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
                <path d="M3.5 6.25L8 10.25L12.5 6.25" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </span>
    );
}

function BulletList({
    items,
    itemsMobile,
    collapsibleMobile = true,
    reducedMotion,
}: {
    items: string[];
    itemsMobile?: string[];
    collapsibleMobile?: boolean;
    reducedMotion: boolean;
}) {
    const mobile = itemsMobile ?? items;
    const canExpand = collapsibleMobile && items.length > mobile.length;

    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Desktop list (full) */}
            <div className="hidden md:block space-y-3 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/70">
                {items.map((t, i) => (
                    <p key={i} className="break-words" style={{ overflowWrap: "anywhere" }}>
                        • {t}
                    </p>
                ))}
            </div>

            {/* Mobile list (shorter + animated expand) */}
            <div className="md:hidden text-ollin-black/70">
                {/* Preview bullets */}
                <div className="space-y-3 text-[13.5px] leading-relaxed">
                    {mobile.map((t, i) => (
                        <p key={i} className="break-words hyphens-auto" style={{ overflowWrap: "anywhere" }}>
                            • {t}
                        </p>
                    ))}
                </div>

                {canExpand ? (
                    <div className="mt-4">
                        {/* Animated content (grid trick: 0fr -> 1fr) */}
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
                                        <p key={`full-${i}`} className="break-words hyphens-auto" style={{ overflowWrap: "anywhere" }}>
                                            • {t}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Toggle sits at the “footer” (doesn’t interrupt the reading flow) */}
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
                            <span className="inline-flex items-center gap-2">
                                <span className="opacity-80">{open ? "Hide full list" : "See full list"}</span>
                            </span>

                            <Chevron open={open} reducedMotion={reducedMotion} />
                        </button>
                    </div>
                ) : null}
            </div>
        </>
    );
}

export default function ServicesAudit() {
    const prefersReducedMotion = useMemo(() => {
        if (typeof window === "undefined" || !window.matchMedia) return false;
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }, []);

    const ctaText = "Get the Audit";

    return (
        <main
            className={cx(
                "w-full",
                // MOBILE FIX: kill any accidental horizontal overflow (does not touch desktop)
                "max-md:overflow-x-hidden"
            )}
        >
            {/* Landscape phone safety — avoids “content drops down” without touching desktop */}
            <style>{`
        @media (max-height: 520px){
          .auditHero{
            padding-top: 88px !important;
            padding-bottom: 40px !important;
          }
          .auditHeroTitle{
            font-size: clamp(50px, 8vw, 108px) !important;
          }
          .auditHeroSub{
            margin-top: 14px !important;
          }
          .auditHeroChips{
            margin-top: 18px !important;
          }
          .auditHeroTiles{
            margin-top: 18px !important;
          }
        }

        /* Hardening: avoid “infinite right” from any odd element in mobile */
        @media (max-width: 767px){
          .auditSafeX *{
            min-width: 0;
            max-width: 100%;
            box-sizing: border-box;
          }
        }

        /* CTA14-like */
        a[data-ollin-cta14="services-audit"]{
          --arrowLen: 18px;
          --arrowLenHover: 46px;
          --arrowOverlap: 7.5px;
          transition: color 280ms ease-out, opacity 280ms ease-out;
        }
        a[data-ollin-cta14="services-audit"]:hover{ --arrowLen: var(--arrowLenHover); }

        .auditCta14Text{ position: relative; line-height: 1; display: inline-block; }
        .auditCta14Text::after{
          content: attr(data-text);
          position: absolute; inset: 0;
          color: transparent;
          background-image: linear-gradient(90deg, transparent 0%, rgba(255, 248, 220, 0.92) 45%, transparent 62%);
          background-size: 220% 100%;
          background-position: 220% 0;
          -webkit-background-clip: text;
          background-clip: text;
          opacity: 0;
          pointer-events: none;
        }
        @keyframes ollinSheenOnceLR_Audit14{
          0%{ background-position: 220% 0; opacity: 0; }
          12%{ opacity: 0.70; }
          88%{ opacity: 0.70; }
          100%{ background-position: -220% 0; opacity: 0; }
        }
        a[data-ollin-cta14="services-audit"]:hover .auditCta14Text::after{
          animation: ollinSheenOnceLR_Audit14 720ms ease-out 1;
        }

        .auditCta14Arrow{
          position: relative; display: inline-block;
          width: 68px; height: 12px; margin-left: 8px;
          pointer-events: none; vertical-align: baseline;
        }
        .auditCta14ArrowLineSvg{
          position: absolute; left: 0; top: 50%;
          transform: translateY(-50%);
          width: var(--arrowLen); height: 12px;
          overflow: visible;
          transition: width 380ms cubic-bezier(0.2, 0.7, 0.2, 1);
          will-change: width;
        }
        .auditCta14ArrowHeadSvg{
          position: absolute; left: 0; top: 50%;
          width: 13px; height: 12px;
          transform: translate3d(calc(var(--arrowLen) - var(--arrowOverlap)), -50%, 0);
          transition: transform 380ms cubic-bezier(0.2, 0.7, 0.2, 1);
          will-change: transform;
        }

        @media (prefers-reduced-motion: reduce){
          a[data-ollin-cta14="services-audit"]{ transition: none !important; }
          .auditCta14ArrowLineSvg, .auditCta14ArrowHeadSvg{ transition: none !important; }
          a[data-ollin-cta14="services-audit"]:hover .auditCta14Text::after{ animation: none !important; }
        }

        @media (hover: none) and (pointer: coarse){
          a[data-ollin-cta14="services-audit"]{ --arrowLen: 32px; }
          a[data-ollin-cta14="services-audit"]:active{ --arrowLen: var(--arrowLenHover); }
          a[data-ollin-cta14="services-audit"]:active .auditCta14Text::after{
            animation: ollinSheenOnceLR_Audit14 720ms ease-out 1;
          }
        }
      `}</style>

            {/* HERO */}
            <section className="auditSafeX auditHero w-full max-w-[1500px] mx-auto px-[5vw] pt-28 md:pt-32 pb-10 md:pb-14">
                <Link
                    to="/services"
                    className="inline-flex items-center text-[12px] md:text-[13px] tracking-[0.14em] uppercase text-ollin-black/55 hover:text-ollin-black transition-colors max-md:py-2"
                >
                    ← Back to Services
                </Link>

                <div className="mt-10 md:mt-12 max-md:mt-9">
                    <p className="text-[11px] md:text-[12px] tracking-[0.28em] uppercase text-ollin-black/45 mb-4 max-md:mb-5">
                        360° REVENUE LEAK AUDIT
                    </p>

                    <h1 className="auditHeroTitle font-[Montserrat] font-normal tracking-tight leading-[0.85] text-[clamp(44px,12.6vw,92px)] md:text-[clamp(64px,9vw,140px)]">
                        AUDIT
                    </h1>

                    <p className="auditHeroSub mt-6 text-[18px] md:text-[22px] font-medium text-ollin-black/85 max-w-[60ch] max-md:mt-5 max-md:max-w-[32ch] leading-snug">
                        Find what’s leaking revenue—then fix the order of operations.
                    </p>

                    {/* Desktop paragraphs (unchanged) */}
                    <div className="hidden md:block mt-4 space-y-3 max-w-[82ch]">
                        <p className="text-[15px] md:text-[17px] leading-relaxed text-ollin-black/70">
                            Most contractors don’t have a “marketing problem.” They have an{" "}
                            <span className="text-ollin-black/90">order</span> problem: tracking is missing, follow-ups are slow,
                            pages don’t match intent, and spend gets blamed when the pipeline is leaking downstream.
                        </p>
                        <p className="text-[15px] md:text-[17px] leading-relaxed text-ollin-black/70">
                            This audit gives you a clear diagnosis, a prioritized action plan, and the fastest path to more booked
                            calls—without guessing or rebuilding everything at once.
                        </p>
                    </div>

                    {/* Mobile paragraphs (shorter) */}
                    <div className="md:hidden mt-4 space-y-3 max-w-[48ch]">
                        <p className="text-[14px] leading-relaxed text-ollin-black/70 break-words hyphens-auto" style={{ overflowWrap: "anywhere" }}>
                            This isn’t “do more marketing.” We find the leak in your pipeline.
                        </p>
                        <p className="text-[14px] leading-relaxed text-ollin-black/70 break-words hyphens-auto" style={{ overflowWrap: "anywhere" }}>
                            You get a prioritized fix list—so you stop wasting time and spend.
                        </p>
                    </div>

                    <div className="auditHeroChips mt-8 flex flex-wrap items-center gap-3 max-md:mt-7">
                        <Chip href="#review">What we review</Chip>
                        <Chip href="#deliver">What you get</Chip>
                        <Chip href="#leakmap">Leak map</Chip>
                        <Chip href="#options">Implementation</Chip>
                    </div>

                    <div className="mt-8 max-md:mt-7">
                        <Link
                            to="/contact"
                            data-ollin-cta14="services-audit"
                            className={cx("inline-block text-sm md:text-base font-medium", prefersReducedMotion ? "" : "hover:opacity-70")}
                            aria-label={ctaText}
                        >
                            <span className="auditCta14Text" data-text={ctaText}>
                                {ctaText}
                            </span>

                            <span className="auditCta14Arrow" aria-hidden="true">
                                <svg className="auditCta14ArrowLineSvg" viewBox="0 0 100 16" fill="none">
                                    <line x1="0" y1="8" x2="100" y2="8" stroke="currentColor" strokeWidth="1" strokeLinecap="butt" vectorEffect="non-scaling-stroke" />
                                </svg>

                                <svg className="auditCta14ArrowHeadSvg" viewBox="0 0 18 16" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M0 3 L12 8 L0 13" vectorEffect="non-scaling-stroke" />
                                </svg>
                            </span>
                        </Link>
                    </div>

                    {/* Proof tiles */}
                    <div className="auditHeroTiles mt-10 md:mt-12 grid grid-cols-12 gap-8 max-md:mt-9 max-md:gap-6">
                        <div className="col-span-12 md:col-span-4">
                            <Card tone="soft">
                                <Label>LEAK MAP</Label>
                                <p className="text-[16px] md:text-[18px] font-medium text-ollin-black/85 mb-4 max-md:mb-3">
                                    See where money escapes.
                                </p>
                                <BulletList
                                    reducedMotion={prefersReducedMotion}
                                    items={["Acquisition, conversion, and retention leaks.", "Fix the bottleneck—not the symptom."]}
                                    itemsMobile={["Find the bottleneck.", "Fix the right thing first."]}
                                />
                            </Card>
                        </div>

                        <div className="col-span-12 md:col-span-4">
                            <Card tone="soft">
                                <Label>ORDER OF OPS</Label>
                                <p className="text-[16px] md:text-[18px] font-medium text-ollin-black/85 mb-4 max-md:mb-3">
                                    Do the right fixes first.
                                </p>
                                <BulletList
                                    reducedMotion={prefersReducedMotion}
                                    items={["Stop spending while the pipeline leaks.", "Sequence > effort (it compounds)."]}
                                    itemsMobile={["Stop waste first.", "Sequence compounds."]}
                                />
                            </Card>
                        </div>

                        <div className="col-span-12 md:col-span-4">
                            <Card tone="soft">
                                <Label>FASTEST WINS</Label>
                                <p className="text-[16px] md:text-[18px] font-medium text-ollin-black/85 mb-4 max-md:mb-3">
                                    Get traction without a rebuild.
                                </p>
                                <BulletList
                                    reducedMotion={prefersReducedMotion}
                                    items={["Highest-impact changes, lowest disruption.", "Clear next steps your team can run."]}
                                    itemsMobile={["Fast wins, low disruption.", "Clear next steps."]}
                                />
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTENT */}
            <section className="auditSafeX w-full max-w-[1500px] mx-auto px-[5vw] pb-20 md:pb-28 space-y-16 md:space-y-20">
                {/* WHAT WE REVIEW + WHAT YOU GET */}
                <div className="grid grid-cols-12 gap-8 items-start max-md:gap-10">
                    <div id="review" className="col-span-12 md:col-span-6 scroll-mt-28">
                        <SectionTitle
                            kicker="Diagnosis"
                            title="What we review"
                            subtitle="We trace the full lead path—from the click to the booked job—so you can see exactly where revenue is leaking."
                            subtitleMobile="We trace the lead path end-to-end, and spot where it’s leaking."
                        />

                        <div className="mt-10 space-y-8 max-md:mt-8 max-md:space-y-6">
                            <Card tone="glass">
                                <Label>LEAD PATH & FOLLOW-UP SPEED</Label>
                                <BulletList
                                    reducedMotion={prefersReducedMotion}
                                    items={[
                                        "Missed calls, slow replies, and “dead leads” patterns.",
                                    ]}
                                    itemsMobile={["Where leads go (calls/forms/DMs).", "Response speed + handoffs."]}
                                />
                            </Card>

                            <Card tone="mid">
                                <Label>TRACKING & ATTRIBUTION</Label>
                                <BulletList
                                    reducedMotion={prefersReducedMotion}
                                    items={[
                                        "Whether decisions are being made blind.",
                                    ]}
                                    itemsMobile={["What’s visible vs invisible.", "Source truth (Ads/Maps/Organic)."]}
                                />
                            </Card>

                            <Card tone="soft">
                                <Label>WEBSITE & OFFER CLARITY</Label>
                                <BulletList
                                    reducedMotion={prefersReducedMotion}
                                    items={[
                                        "Message match (does the page match what people searched?).",
                                        "CTA clarity (what to do next, and how easy it is).",
                                    ]}
                                    itemsMobile={["Does the page match intent?", "Friction + trust blockers."]}
                                />
                            </Card>
                        </div>
                    </div>

                    <div id="deliver" className="col-span-12 md:col-span-6 scroll-mt-28">
                        <SectionTitle
                            kicker="Output"
                            title="What you get"
                            subtitle="Not a long report. A clear plan in the right order—so you can fix what matters without wasting time or spend."
                            subtitleMobile="A short, prioritized plan your team can actually execute."
                        />

                        <div className="mt-10 space-y-8 max-md:mt-8 max-md:space-y-6">
                            <Card tone="glass">
                                <Label>A PRIORITIZED ACTION PLAN</Label>
                                <BulletList
                                    reducedMotion={prefersReducedMotion}
                                    items={[
                                        "Short list your team can execute without chaos.",
                                    ]}
                                    itemsMobile={["Highest-impact fixes first.", "Clear next steps."]}
                                />
                            </Card>

                            <Card tone="mid">
                                <Label>THE LEAK MAP</Label>
                                <BulletList
                                    reducedMotion={prefersReducedMotion}
                                    items={[
                                        "A simple view of where revenue escapes across the pipeline.",
                                        "How changes compound when done in order.",
                                    ]}
                                    itemsMobile={["Where revenue escapes.", "Fix now vs later."]}
                                />
                            </Card>

                            <Card tone="soft">
                                <Label>IMPLEMENTATION OPTIONS</Label>
                                <BulletList
                                    reducedMotion={prefersReducedMotion}
                                    items={[
                                        "Execute with your team, with us, or mix both.",
                                        "If you want help, we can scope the smallest sprint that moves results.",
                                    ]}
                                    itemsMobile={["DIY, Done-with-you, or Done-for-you.", "No rebuild required."]}
                                />
                            </Card>
                        </div>
                    </div>
                </div>

                <Divider />

                {/* LEAK MAP */}
                <div id="leakmap" className="scroll-mt-28">
                    <SectionTitle
                        kicker="Clarity"
                        title="Leak map"
                        subtitle="We break leaks into three buckets so you stop guessing—and stop fixing the wrong thing."
                        subtitleMobile="Three leak buckets. No guessing."
                    />

                    <div className="mt-10 grid grid-cols-12 gap-8 max-md:mt-8 max-md:gap-6">
                        <div className="col-span-12 md:col-span-4">
                            <Card tone="glass">
                                <Label>ACQUISITION LEAKS</Label>
                                <BulletList
                                    reducedMotion={prefersReducedMotion}
                                    items={[
                                        "Ads/Maps sending clicks that can’t convert.",
                                        "Low trust at first glance (profile/site mismatch).",
                                    ]}
                                    itemsMobile={["Wrong traffic (intent/area/service).", "Low trust at first glance."]}
                                />
                            </Card>
                        </div>

                        <div className="col-span-12 md:col-span-4">
                            <Card tone="mid">
                                <Label>CONVERSION LEAKS</Label>
                                <BulletList
                                    reducedMotion={prefersReducedMotion}
                                    items={[
                                        "Forms/calls not reaching you or not being tracked.",
                                        "Friction that kills leads quietly (slow pages, confusion).",
                                    ]}
                                    itemsMobile={["Unclear offer + CTA.", "Lost calls/forms or no tracking."]}
                                />
                            </Card>
                        </div>

                        <div className="col-span-12 md:col-span-4">
                            <Card tone="soft">
                                <Label>RETENTION LEAKS</Label>
                                <BulletList
                                    reducedMotion={prefersReducedMotion}
                                    items={[
                                        "No review velocity / reputation protection.",
                                        "No reactivation (past customers go cold).",
                                    ]}
                                    itemsMobile={["Slow follow-up.", "No reviews / reactivation."]}
                                />
                            </Card>
                        </div>
                    </div>
                </div>

                <Divider />

                {/* IMPLEMENTATION OPTIONS */}
                <div id="options" className="scroll-mt-28">
                    <SectionTitle
                        kicker="Execution"
                        title="Implementation options"
                        subtitle="You can move fast without overcommitting. We help you choose the smallest option that produces momentum."
                        subtitleMobile="Pick the smallest option that creates momentum."
                    />

                    <div className="mt-10 grid grid-cols-12 gap-8 max-md:mt-8 max-md:gap-6">
                        <div className="col-span-12 md:col-span-4">
                            <Card tone="glass">
                                <Label>DIY</Label>
                                <BulletList
                                    reducedMotion={prefersReducedMotion}
                                    items={[
                                        "We provide the plan + priorities + guardrails.",
                                        "Best if you already have internal capacity.",
                                    ]}
                                    itemsMobile={["You execute.", "We provide the priorities."]}
                                />
                            </Card>
                        </div>

                        <div className="col-span-12 md:col-span-4">
                            <Card tone="mid">
                                <Label>DONE-WITH-YOU</Label>
                                <BulletList
                                    reducedMotion={prefersReducedMotion}
                                    items={[
                                        "We implement the highest-impact fixes together.",
                                        "Small sprint scope (no “forever project”).",
                                    ]}
                                    itemsMobile={["Implement together.", "Fast + accountable."]}
                                />
                            </Card>
                        </div>

                        <div className="col-span-12 md:col-span-4">
                            <Card tone="soft">
                                <Label>DONE-FOR-YOU</Label>
                                <BulletList
                                    reducedMotion={prefersReducedMotion}
                                    items={[
                                        "Best when you want leverage and speed.",
                                        "We keep scope tight and results-first.",
                                    ]}
                                    itemsMobile={["We implement end-to-end.", "Tight scope, results first."]}
                                />
                            </Card>
                        </div>
                    </div>

                    <div className="mt-8 max-md:mt-7">
                        <Card tone="soft">
                            <Label>WHAT THIS IS NOT</Label>
                            <BulletList
                                reducedMotion={prefersReducedMotion}
                                items={[
                                    "Not a generic audit that ends with “do better marketing.”",
                                    "Not a forced rebuild of your website/brand.",
                                    "Not a pile of metrics with no action attached.",
                                ]}
                                itemsMobile={["Not generic advice.", "Not a forced rebuild."]}
                                collapsibleMobile={false}
                            />
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

                            {/* Desktop headline (unchanged) */}
                            <p className="hidden md:block text-[18px] md:text-[22px] font-medium text-ollin-black/85">
                                Start with the 360° Revenue Leak Audit.
                            </p>

                            {/* Mobile headline (shorter) */}
                            <p className="md:hidden text-[18px] font-medium text-ollin-black/85 max-w-[28ch] leading-snug">
                                Start with the Revenue Leak Audit.
                            </p>

                            {/* Desktop body (unchanged) */}
                            <p className="hidden md:block mt-2 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/65 max-w-[70ch]">
                                Tell us your trade + service area and we’ll map the fastest order of fixes to get you more booked calls
                                without wasting spend.
                            </p>

                            {/* Mobile body (shorter) */}
                            <p className="md:hidden mt-2 text-[14px] leading-relaxed text-ollin-black/65 max-w-[46ch]">
                                Tell us your trade + service area. We’ll map the fastest fixes.
                            </p>
                        </div>

                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center bg-ollin-black text-white text-[13px] md:text-[14px] font-medium tracking-wide px-6 py-3 rounded-[14px] hover:translate-y-[-1px] hover:shadow-lg transition-all w-full sm:w-auto"
                        >
                            Get the Audit
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
