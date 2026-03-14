import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useHead } from "@unhead/react";
import StructuredData from "../components/StructuredData";
import {
    cx, Chip, SectionTitle, Divider, Card, Label,
    BulletList, StepList, ProcessRail,
} from "../components/shared/services";

export default function ServicesDemand() {
    const prefersReducedMotion = useMemo(() => {
        if (typeof window === "undefined" || !window.matchMedia) return false;
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }, []);

    const weeklyOperatingLoopSteps = useMemo(
        () => ["Review", "Fix waste", "Refresh creatives", "Reallocate"],
        []
    );
    const momentumSystemSteps = useMemo(
        () => ["Cleanup", "Activity", "Reviews", "Visibility"],
        []
    );

    return (
        <main className="w-full max-md:overflow-x-hidden">

            <style>{`
        @media (max-height: 520px){
          .demandHero{
            padding-top: 88px !important;
            padding-bottom: 40px !important;
          }
          .demandHeroTitle{
            font-size: clamp(52px, 8vw, 108px) !important;
          }
          .demandHeroSub{
            margin-top: 14px !important;
          }
          .demandHeroChips{
            margin-top: 18px !important;
          }
          .demandHeroTiles{
            margin-top: 18px !important;
          }
        }

        /* Hardening: avoid “infinite right” from any odd element in mobile */
        @media (max-width: 767px){
          .demandSafeX *{
            min-width: 0;
            max-width: 100%;
            box-sizing: border-box;
          }
        }
      `}</style>

            <section className="demandSafeX demandHero w-full max-w-[1500px] mx-auto px-[5vw] pt-28 md:pt-32 pb-10 md:pb-14">
                <Link
                    to="/services"
                    className="inline-flex items-center text-[12px] md:text-[13px] tracking-[0.14em] uppercase text-ollin-black/55 hover:text-ollin-black transition-colors max-md:py-2"
                >
                    ← Back to Services
                </Link>

                <div className="mt-10 md:mt-12 max-md:mt-9">
                    <p className="text-[11px] md:text-[12px] tracking-[0.28em] uppercase text-ollin-black/45 mb-4 max-md:mb-5">
                        MORE CALLS + ESTIMATES
                    </p>

                    <h1 className="demandHeroTitle font-[Montserrat] font-normal tracking-tight leading-[0.85] text-[clamp(44px,12.6vw,92px)] md:text-[clamp(64px,9vw,140px)]">
                        DEMAND
                    </h1>

                    <p className="demandHeroSub mt-6 text-[18px] md:text-[22px] font-medium text-ollin-black/85 max-w-[60ch] max-md:mt-5 max-md:max-w-[30ch] leading-snug">
                        Turn searches into booked calls.
                    </p>

                    <div className="hidden md:block mt-4 space-y-3 max-w-[80ch] max-md:max-w-[48ch]">
                        <p className="text-[15px] md:text-[17px] leading-relaxed text-ollin-black/70">
                            Demand is how you get steady opportunities: ads, Google Maps visibility, and tracking that shows what’s
                            bringing real jobs—not vanity metrics.
                        </p>
                        <p className="text-[15px] md:text-[17px] leading-relaxed text-ollin-black/70">
                            The goal is simple: show up when intent is high, convert the click into a call, and measure what actually
                            turns into work.
                        </p>
                    </div>

                    <div className="hidden sm:block md:hidden mt-4 space-y-3 max-w-[60ch]">
                        <p className="text-[14px] leading-relaxed text-ollin-black/70 break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                            Demand means showing up when intent is high—Ads, Google Maps, and clean tracking.
                        </p>
                        <p className="text-[14px] leading-relaxed text-ollin-black/70 break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                            Convert the click into a call, then measure what turns into real work.
                        </p>
                    </div>

                    <div className="sm:hidden mt-4 space-y-3 max-w-[46ch]">
                        <p className="text-[14px] leading-relaxed text-ollin-black/70 break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                            Show up when intent is high.
                        </p>
                        <p className="text-[14px] leading-relaxed text-ollin-black/70 break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                            Convert the click into a call—then track what becomes work.
                        </p>
                    </div>

                    <div className="demandHeroChips mt-8 flex flex-wrap gap-3 max-md:mt-7">
                        <Chip href="#ads">Ads That Drive Calls</Chip>
                        <Chip href="#localseo">Maps That Show Up</Chip>
                        <Chip href="#analytics">Tracking That Proves It</Chip>
                    </div>

                    <div className="demandHeroTiles mt-10 md:mt-12 grid grid-cols-12 gap-8 max-md:mt-9 max-md:gap-6">
                        <div className="col-span-12 md:col-span-4">
                            <Card tone="soft">
                                <Label>INTENT CAPTURE</Label>
                                <p className="text-[16px] md:text-[18px] font-medium text-ollin-black/85 mb-4 max-md:mb-3">
                                    Pay for attention, with control.
                                </p>
                                <BulletList
                                    reducedMotion={prefersReducedMotion}
                                    collapsibleMobile={false}
                                    collapsibleTablet={false}
                                    items={["Show up when people are ready to hire.", "Filter out junk leads and protect spend."]}
                                    itemsTablet={["Show up when intent is high.", "Filter junk and protect spend."]}
                                    itemsMobile={["Show up at high intent.", "Protect spend from junk."]}
                                />
                            </Card>
                        </div>

                        <div className="col-span-12 md:col-span-4">
                            <Card tone="soft">
                                <Label>LOCAL VISIBILITY</Label>
                                <p className="text-[16px] md:text-[18px] font-medium text-ollin-black/85 mb-4 max-md:mb-3">
                                    Win the “near me” click.
                                </p>
                                <BulletList
                                    reducedMotion={prefersReducedMotion}
                                    collapsibleMobile={false}
                                    collapsibleTablet={false}
                                    items={[
                                        "A clean, active profile that looks trustworthy.",
                                        "Momentum that builds over time with consistency.",
                                    ]}
                                    itemsTablet={[
                                        "A clean, active profile that looks trustworthy.",
                                        "Momentum that compounds with consistency.",
                                    ]}
                                    itemsMobile={["Look trustworthy on Maps.", "Build momentum over time."]}
                                />
                            </Card>
                        </div>

                        <div className="col-span-12 md:col-span-4">
                            <Card tone="soft">
                                <Label>TRUTH LAYER</Label>
                                <p className="text-[16px] md:text-[18px] font-medium text-ollin-black/85 mb-4 max-md:mb-3">
                                    Stop guessing.
                                </p>
                                <BulletList
                                    reducedMotion={prefersReducedMotion}
                                    collapsibleMobile={false}
                                    collapsibleTablet={false}
                                    items={[
                                        "Know where leads came from (with proof).",
                                        "Optimize based on what closes—not what looks good.",
                                    ]}
                                    itemsTablet={["Know where leads came from (with proof).", "Optimize for what closes."]}
                                    itemsMobile={["Know what drove the lead.", "Optimize for closes."]}
                                />
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            <section className="demandSafeX w-full max-w-[1500px] mx-auto px-[5vw] pb-20 md:pb-28 space-y-16 md:space-y-20">

                <div id="ads" className="scroll-mt-28">
                    <SectionTitle
                        kicker="Pay for attention, with control"
                        title="Performance Marketing"
                        subtitle="We run campaigns built for calls and estimates—then operate them weekly so they don’t drift or waste spend."
                        subtitleTablet="Campaigns built for calls and estimates—operated weekly so spend doesn’t drift."
                        subtitleMobile="Campaigns for calls—operated weekly to cut waste."
                    />

                    <div className="mt-10 max-md:mt-8">
                        <Label>THE WEEKLY OPERATING LOOP</Label>
                        <ProcessRail steps={weeklyOperatingLoopSteps} reducedMotion={prefersReducedMotion} />
                    </div>

                    <div className="mt-8 grid grid-cols-12 gap-8 max-md:gap-6">
                        <div className="col-span-12 md:col-span-7">
                            <div className="space-y-8 max-md:space-y-6">
                                <Card tone="glass">
                                    <Label>WHAT YOU GET</Label>
                                    <p className="text-[15px] md:text-[17px] leading-relaxed text-ollin-black/75 mb-6 max-md:mb-5 max-md:break-words max-md:hyphens-auto max-md:[overflow-wrap:anywhere]">
                                        Not “turn it on and hope.” A controlled system built around lead quality.
                                    </p>

                                    <BulletList
                                        reducedMotion={prefersReducedMotion}
                                        labels={{ more: "See what’s included", less: "Hide inclusions" }}
                                        items={[
                                            "Weekly tune-ups: targeting, exclusions, and budget control.",
                                            "Lead quality safeguards (reduce spam/junk as much as possible).",
                                            "Call + form tracking so we’re not flying blind.",
                                            "Landing page alignment guidance so clicks don’t die on the page.",
                                        ]}
                                        itemsTablet={[
                                            "Weekly tune-ups: targeting, exclusions, and budget control.",
                                            "Call + form tracking so we’re not flying blind.",
                                        ]}
                                        itemsMobile={[
                                            "Campaign build by service + location + intent.",
                                            "Copy + creative that matches the search.",
                                        ]}
                                    />
                                </Card>

                                <Card tone="mid">
                                    <Label>HOW IT WORKS</Label>
                                    <StepList
                                        steps={[
                                            "We map your offers, service area, and lead handling (speed matters).",
                                            "We launch with clean structure + tracking + baseline signals.",
                                            "We operate weekly: cut waste, expand what works, and improve quality.",
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
                                            "Contractors who want steady lead flow—not “viral” luck.",
                                            "Service areas where people are actively searching and ready to hire.",
                                            "Teams that answer leads fast (speed wins).",
                                        ]}
                                        itemsTablet={[
                                            "Contractors who want steady lead flow—not “viral” luck.",
                                            "Service areas with active search demand.",
                                            "Teams that answer leads fast (speed wins).",
                                        ]}
                                        itemsMobile={[
                                            "Steady lead flow (not “viral” luck).",
                                            "Areas with high-intent searches.",
                                            "Fast lead response teams.",
                                        ]}
                                    />
                                </Card>

                                <Card tone="soft" className="h-full">
                                    <Label>WHAT WE AVOID</Label>
                                    <BulletList
                                        reducedMotion={prefersReducedMotion}
                                        collapsibleMobile={false}
                                        collapsibleTablet={false}
                                        items={[
                                            "Set-and-forget campaigns that slowly rot.",
                                            "Reporting without action (pretty charts, no fixes).",
                                            "Sending paid clicks to unclear pages that can’t convert.",
                                        ]}
                                        itemsTablet={[
                                            "Set-and-forget campaigns that slowly rot.",
                                            "Reporting without action (pretty charts, no fixes).",
                                            "Paid clicks to unclear pages that can’t convert.",
                                        ]}
                                        itemsMobile={[
                                            "Set-and-forget campaigns.",
                                            "Pretty reports, no action.",
                                            "Clicks to unclear pages.",
                                        ]}
                                    />
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

                <Divider />

                <div id="localseo" className="scroll-mt-28">
                    <SectionTitle
                        kicker="Show up on “near me”"
                        title="Local SEO & Maps"
                        subtitle="We clean up and maintain your Google Business Profile so you show up more often—and look trustworthy when they click."
                        subtitleTablet="We clean and maintain your Google Business Profile so you show up more—and look trustworthy."
                        subtitleMobile="A clean, active profile that shows up—and looks legit."
                    />

                    <div className="mt-10 max-md:mt-8">
                        <Label>MOMENTUM SYSTEM</Label>
                        <ProcessRail steps={momentumSystemSteps} reducedMotion={prefersReducedMotion} />
                    </div>

                    <div className="mt-8 grid grid-cols-12 gap-8 max-md:gap-6">
                        <div className="col-span-12 md:col-span-7">
                            <div className="space-y-8 max-md:space-y-6">
                                <Card tone="glass">
                                    <Label>WHAT YOU GET</Label>
                                    <p className="text-[15px] md:text-[17px] leading-relaxed text-ollin-black/75 mb-6 max-md:mb-5 max-md:break-words max-md:hyphens-auto max-md:[overflow-wrap:anywhere]">
                                        The basics that move the needle—done clean and kept active.
                                    </p>

                                    <BulletList
                                        reducedMotion={prefersReducedMotion}
                                        labels={{ more: "See what’s included", less: "Hide inclusions" }}
                                        items={[
                                            "Photo guidance + organization so the profile looks cared for.",
                                            "Review reply system (simple, human replies—not robotic).",
                                            "Light posting cadence to keep the profile active.",
                                            "Quick metric check to spot drops early.",
                                        ]}
                                        itemsTablet={[
                                            "Consistency check (your info matches where it matters).",
                                            "Photo guidance + organization so the profile looks cared for.",
                                            "Review reply system (simple, human replies—not robotic).",
                                        ]}
                                        itemsMobile={[
                                            "Profile cleanup (categories, services, trust).",
                                            "Consistency + photos that look cared for.",
                                        ]}
                                    />
                                </Card>

                                <Card tone="mid">
                                    <Label>HOW IT WORKS</Label>
                                    <StepList
                                        steps={[
                                            "We fix the profile fundamentals and remove confusion.",
                                            "We set a simple maintenance cadence (posts + reviews + quick checks).",
                                            "We improve what’s weak (photos, services, consistency) over time.",
                                        ]}
                                    />
                                </Card>
                            </div>
                        </div>

                        <div className="col-span-12 md:col-span-5">
                            <div className="space-y-8 max-md:space-y-6">
                                <Card tone="soft" className="h-full">
                                    <Label>REALITY CHECK</Label>
                                    <BulletList
                                        reducedMotion={prefersReducedMotion}
                                        collapsibleMobile={false}
                                        collapsibleTablet={false}
                                        items={[
                                            "Going hard in multiple cities is basically a multi-location effort.",
                                            "Maps builds momentum—but only if the profile stays clean and active.",
                                            "Reviews matter a lot (Retention helps you keep them coming).",
                                        ]}
                                        itemsTablet={[
                                            "Multiple cities behaves like multi-location.",
                                            "Maps builds momentum if the profile stays clean and active.",
                                            "Reviews matter a lot (Retention helps you keep them coming).",
                                        ]}
                                        itemsMobile={[
                                            "Multiple cities = multi-location effort.",
                                            "Momentum needs a clean, active profile.",
                                            "Reviews matter a lot.",
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
                                            "More visibility for high-intent local searches.",
                                            "A profile that looks legit when prospects compare options.",
                                            "Less “we used to show up… now we don’t” volatility.",
                                        ]}
                                        itemsTablet={[
                                            "More visibility for high-intent local searches.",
                                            "A profile that looks legit when prospects compare options.",
                                            "Less “we used to show up… now we don’t” volatility.",
                                        ]}
                                        itemsMobile={["More high-intent visibility.", "A profile that looks legit.", "Less volatility over time."]}
                                    />
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

                <Divider />

                <div id="analytics" className="scroll-mt-28">
                    <SectionTitle
                        kicker="No guessing"
                        title="Analytics + Tracking"
                        subtitle='Not a “pretty dashboard.” A truth system: where leads came from, which ones were real, and what turns into jobs.'
                        subtitleTablet="A truth system: where leads came from, which were real, and what turns into work."
                        subtitleMobile="Know where leads came from—and which ones were real."
                    />

                    <div className="mt-10 max-md:mt-8">
                        <Card tone="soft">
                            <Label>TWO LEVELS OF CLARITY</Label>
                            <div className="grid grid-cols-12 gap-6 max-md:gap-5">
                                <div className="col-span-12 md:col-span-6">
                                    <p className="text-[16px] md:text-[18px] font-medium text-ollin-black/85 mb-2">Lead Truth</p>
                                    <p className="text-[14px] md:text-[15px] leading-relaxed text-ollin-black/70 max-md:text-[13.5px] max-md:max-w-[52ch] max-md:break-words max-md:hyphens-auto max-md:[overflow-wrap:anywhere]">
                                        Source + calls/forms + quality signals—so you stop buying “cheap” leads that never close.
                                    </p>
                                </div>
                                <div className="col-span-12 md:col-span-6">
                                    <p className="text-[16px] md:text-[18px] font-medium text-ollin-black/85 mb-2">Revenue Truth</p>
                                    <p className="text-[14px] md:text-[15px] leading-relaxed text-ollin-black/70 max-md:text-[13.5px] max-md:max-w-[52ch] max-md:break-words max-md:hyphens-auto max-md:[overflow-wrap:anywhere]">
                                        When “won jobs” are tracked, we can tie marketing to revenue. If not, we keep it honest at Lead Truth.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="mt-8 grid grid-cols-12 gap-8 max-md:gap-6">
                        <div className="col-span-12 md:col-span-7">
                            <div className="space-y-8 max-md:space-y-6">
                                <Card tone="glass">
                                    <Label>WHAT THIS ANSWERS</Label>
                                    <p className="text-[15px] md:text-[17px] leading-relaxed text-ollin-black/75 mb-6 max-md:mb-5 max-md:break-words max-md:hyphens-auto max-md:[overflow-wrap:anywhere]">
                                        The only questions that matter—answered with proof.
                                    </p>

                                    <BulletList
                                        reducedMotion={prefersReducedMotion}
                                        labels={{ more: "See all answers", less: "Hide answers" }}
                                        items={[
                                            "What services/areas are driving actual opportunities.",
                                            "What’s working right now—and what is quietly leaking money.",
                                        ]}
                                        itemsTablet={[
                                            "What services/areas are driving actual opportunities.",
                                        ]}
                                        itemsMobile={["Where leads came from (Ads/Maps/Organic/Referrals).", "Which leads were real vs junk."]}
                                    />
                                </Card>

                                <Card tone="mid">
                                    <Label>HOW IT WORKS</Label>
                                    <StepList
                                        steps={[
                                            "We set up clean tracking (calls + forms) and consistent source labeling.",
                                            "We build a simple reporting view you can actually use weekly.",
                                            "We use the truth layer to improve Ads/Maps decisions over time.",
                                        ]}
                                    />
                                </Card>
                            </div>
                        </div>

                        <div className="col-span-12 md:col-span-5">
                            <div className="space-y-8 max-md:space-y-6">
                                <Card tone="soft" className="h-full">
                                    <Label>BOUNDARIES</Label>
                                    <BulletList
                                        reducedMotion={prefersReducedMotion}
                                        collapsibleMobile={false}
                                        collapsibleTablet={false}
                                        items={[
                                            "If “won jobs” aren’t tracked, we won’t pretend ROI is perfect.",
                                            "Tracking improves decisions—it doesn’t replace lead handling speed.",
                                            "We keep it simple and usable (no 40-metric vanity dashboards).",
                                        ]}
                                        itemsTablet={[
                                            "If “won jobs” aren’t tracked, we won’t pretend ROI is perfect.",
                                            "Tracking improves decisions—it doesn’t replace lead handling speed.",
                                            "We keep it simple and usable (no 40-metric vanity dashboards).",
                                        ]}
                                        itemsMobile={["No “won jobs” = no fake ROI.", "Tracking ≠ lead handling speed.", "Simple, usable reporting."]}
                                    />
                                </Card>

                                <Card tone="soft" className="h-full">
                                    <Label>PAIRS WITH</Label>
                                    <BulletList
                                        reducedMotion={prefersReducedMotion}
                                        collapsibleMobile={false}
                                        collapsibleTablet={false}
                                        items={[
                                            "Performance Marketing (use truth to cut waste and scale winners).",
                                            "Digital Secretary (so lead handling doesn’t sabotage results).",
                                        ]}
                                        itemsTablet={[
                                            "Performance Marketing (use truth to cut waste and scale winners).",
                                            "Digital Secretary (so lead handling doesn’t sabotage results).",
                                        ]}
                                        itemsMobile={[
                                            "Performance Marketing (cut waste, scale winners).",
                                            "Digital Secretary (fix lead handling speed).",
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
                            <p className="text-[11px] md:text-[12px] tracking-[0.28em] uppercase text-ollin-black/45 mb-3">NEXT STEP</p>

                            <div className="hidden md:block">
                                <p className="text-[18px] md:text-[22px] font-medium text-ollin-black/85 max-md:max-w-[30ch]">
                                    Want demand that doesn’t fall apart?
                                </p>
                                <p className="mt-2 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/65 max-w-[70ch] max-md:max-w-[52ch]">
                                    Tell us your trade + service area, and how fast you answer leads. We’ll recommend the right mix (Ads /
                                    Maps / Tracking) to get you more booked estimates without wasting spend.
                                </p>
                            </div>

                            <div className="hidden sm:block md:hidden">
                                <p className="text-[18px] font-medium text-ollin-black/85 max-w-[44ch] leading-snug">
                                    Want demand that doesn’t fall apart?
                                </p>
                                <p className="mt-2 text-[14px] leading-relaxed text-ollin-black/65 max-w-[62ch] max-md:break-words max-md:hyphens-auto max-md:[overflow-wrap:anywhere]">
                                    Tell us your trade + service area and how fast you answer. We’ll recommend the right mix (Ads / Maps /
                                    Tracking).
                                </p>
                            </div>

                            <div className="sm:hidden">
                                <p className="text-[18px] font-medium text-ollin-black/85 max-w-[30ch] leading-snug">
                                    Want demand that holds up?
                                </p>
                                <p className="mt-2 text-[14px] leading-relaxed text-ollin-black/65 max-w-[46ch] max-md:break-words max-md:hyphens-auto max-md:[overflow-wrap:anywhere]">
                                    Tell us your trade + area + response speed. We’ll recommend the right mix.
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
