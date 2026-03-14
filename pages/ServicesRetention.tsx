import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useHead } from "@unhead/react";
import StructuredData from "../components/StructuredData";
import {
    cx, Chip, SectionTitle, Divider, Card, Label,
    BulletList, StepList, ProcessRail,
} from "../components/shared/services";

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

                    <h1 className="retentionHeroTitle font-[Montserrat] font-normal tracking-tight leading-[0.85] text-[clamp(44px,12.6vw,92px)] md:text-[clamp(64px,9vw,140px)]">
                        RETENTION
                    </h1>

                    <p className="retentionHeroSub mt-6 text-[18px] md:text-[22px] font-medium text-ollin-black/85 max-w-[60ch] max-md:mt-5 max-md:max-w-[30ch] leading-snug">
                        Make revenue compound.
                    </p>

                    <div className="hidden md:block mt-4 space-y-3 max-w-[82ch] max-md:max-w-[48ch]">
                        <p className="text-[15px] md:text-[17px] leading-relaxed text-ollin-black/70">
                            Retention is where growth becomes durable: leads don’t get wasted, jobs turn into reviews, and past customers
                            come back when seasonality hits.
                        </p>
                        <p className="text-[15px] md:text-[17px] leading-relaxed text-ollin-black/70">
                            The goal: faster follow-up, cleaner handoffs, and a system that keeps your reputation and repeat work moving.
                        </p>
                    </div>

                    <div className="hidden sm:block md:hidden mt-4 space-y-3 max-w-[60ch]">
                        <p className="text-[14px] leading-relaxed text-ollin-black/70 break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                            Retention makes growth durable: faster follow-up, more reviews, and repeat work when seasonality hits.
                        </p>
                        <p className="text-[14px] leading-relaxed text-ollin-black/70 break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                            The system keeps leads moving, handoffs clean, and reputation protected.
                        </p>
                    </div>

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

                <div id="secretary" className="scroll-mt-28">
                    <SectionTitle
                        kicker="Speed wins deals"
                        title="Digital Secretary"
                        subtitle="An intake + follow-up system that converts conversations into booked estimates—so leads don’t die in your inbox."
                        subtitleTablet="An intake + follow-up system that turns conversations into booked estimates—so leads don’t die in the inbox."
                        subtitleMobile="Intake + follow-up that turns conversations into booked estimates."
                    />

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

                <div id="reviews" className="scroll-mt-28">
                    <SectionTitle
                        kicker="Reputation + reactivation"
                        title="Reviews & Repeat Jobs Engine"
                        subtitle="A system we operate that turns jobs into 5-star reviews, referrals, and repeat work—while preventing reputation damage."
                        subtitleTablet="A system we operate to turn jobs into reviews, referrals, and repeat work—while preventing reputation damage."
                        subtitleMobile="Turn jobs into reviews + repeat work—without reputation damage."
                    />

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

                    <div className="mt-8 max-md:mt-7">
                        <Card tone="soft">
                            <Label>REPUTATION PROTECTION</Label>

                            <p className="hidden md:block text-[14px] md:text-[15px] leading-relaxed text-ollin-black/70 max-w-[95ch] max-md:max-w-[52ch]">
                                The system routes unhappy customers to a private resolution path first—so issues get handled before they
                                turn into public 1-star damage.
                            </p>

                            <p className="hidden sm:block md:hidden text-[14px] leading-relaxed text-ollin-black/70 max-w-[64ch] break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                                Unhappy customers route to a private resolution path first—so issues get handled before public damage.
                            </p>

                            <p className="sm:hidden text-[14px] leading-relaxed text-ollin-black/70 max-w-[46ch] break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                                Fix issues privately before they become public damage.
                            </p>
                        </Card>
                    </div>
                </div>

                <div className="pt-4">
                    <div className="rounded-none border border-black/10 bg-white/30 p-7 sm:p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <p className="text-[11px] md:text-[12px] tracking-[0.28em] uppercase text-ollin-black/45 mb-3">
                                NEXT STEP
                            </p>

                            <div className="hidden md:block">
                                <p className="text-[18px] md:text-[22px] font-medium text-ollin-black/85 max-md:max-w-[30ch]">
                                    Want leads to stop leaking?
                                </p>
                                <p className="mt-2 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/65 max-w-[70ch] max-md:max-w-[52ch]">
                                    We’ll map your intake + follow-up flow and recommend the smallest Retention stack that improves close rate,
                                    review velocity, and repeat work—without overcomplicating your operations.
                                </p>
                            </div>

                            <div className="hidden sm:block md:hidden">
                                <p className="text-[18px] font-medium text-ollin-black/85 max-w-[44ch] leading-snug">
                                    Want leads to stop leaking?
                                </p>
                                <p className="mt-2 text-[14px] leading-relaxed text-ollin-black/65 max-w-[62ch] break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                                    We’ll map your intake + follow-up flow and recommend the smallest Retention stack to improve close rate,
                                    reviews, and repeat work.
                                </p>
                            </div>

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
