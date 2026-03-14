import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useHead } from "@unhead/react";
import StructuredData from "../components/StructuredData";
import {
    cx, Chip, SectionTitle, Divider, Card, Label,
    BulletList, StepList, ProcessRail,
} from "../components/shared/services";

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

                    <div className="hidden md:block mt-4 space-y-3 max-w-[78ch]">
                        <p className="text-[15px] md:text-[17px] leading-relaxed text-ollin-black/70">
                            People decide fast: your logo, website, and social pages either feel legit—or “new.”
                        </p>
                        <p className="text-[15px] md:text-[17px] leading-relaxed text-ollin-black/70">
                            Foundation makes everything match, look clean, and convert the first visit into the first call.
                        </p>
                    </div>

                    <div className="hidden sm:block md:hidden mt-4 space-y-3 max-w-[60ch]">
                        <p className="text-[14px] leading-relaxed text-ollin-black/70 break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                            People decide fast: your brand either feels legit—or “new.”
                        </p>
                        <p className="text-[14px] leading-relaxed text-ollin-black/70 break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                            We make everything match and convert the first visit into a call.
                        </p>
                    </div>

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

                            <p className="hidden md:block text-[14px] md:text-[15px] leading-relaxed text-ollin-black/70 max-w-[90ch] max-md:max-w-[52ch]">
                                We test your logo at tiny sizes (profile icon), mid sizes (website header), and real sizes (truck/yard sign)
                                so it stays readable.
                            </p>

                            <p className="hidden sm:block md:hidden text-[14px] leading-relaxed text-ollin-black/70 max-w-[64ch] break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                                We test your logo at real sizes (profile, website header, truck/sign) so it stays readable.
                            </p>

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

                        <ProcessRail steps={leadSteps} reducedMotion={prefersReducedMotion} />
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

                            <div className="hidden md:block">
                                <p className="text-[18px] md:text-[22px] font-medium text-ollin-black/85 max-md:max-w-[28ch]">
                                    Want Foundation done fast and clean?
                                </p>
                                <p className="mt-2 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/65 max-w-[70ch] max-md:max-w-[50ch]">
                                    Tell us your trade + service areas and we’ll recommend the simplest Foundation stack that makes you look
                                    established before you spend hard on ads.
                                </p>
                            </div>

                            <div className="hidden sm:block md:hidden">
                                <p className="text-[18px] font-medium text-ollin-black/85 max-w-[44ch] leading-snug">
                                    Want Foundation done fast and clean?
                                </p>
                                <p className="mt-2 text-[14px] leading-relaxed text-ollin-black/65 max-w-[62ch] break-words hyphens-auto max-md:[overflow-wrap:anywhere]">
                                    Tell us your trade + service areas and we’ll recommend the simplest Foundation stack before you spend hard on ads.
                                </p>
                            </div>

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
