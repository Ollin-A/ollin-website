import React from "react";
import { Link } from "react-router-dom";

function Chip({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a
            href={href}
            className="inline-flex items-center rounded-full border border-black/15 px-4 py-2 text-[12px] md:text-[13px] tracking-[0.14em] uppercase text-ollin-black/80 hover:bg-black/5 transition-colors"
        >
            {children}
        </a>
    );
}

function SectionTitle({
    kicker,
    title,
    subtitle,
}: {
    kicker: string;
    title: string;
    subtitle: string;
}) {
    return (
        <div className="max-w-[1100px]">
            <p className="text-[11px] md:text-[12px] tracking-[0.28em] uppercase text-ollin-black/45 mb-4">
                {kicker}
            </p>
            <h2 className="font-[Montserrat] font-normal tracking-tight leading-[0.95] text-[clamp(34px,4.4vw,56px)] mb-4">
                {title}
            </h2>
            <p className="text-[15px] md:text-[17px] leading-relaxed text-ollin-black/70 max-w-[70ch]">
                {subtitle}
            </p>
        </div>
    );
}

function Divider() {
    return <div className="h-px w-full bg-black/10" />;
}

export default function ServicesDemand() {
    return (
        <main className="w-full">
            {/* HERO */}
            <section className="w-full max-w-[1500px] mx-auto px-[5vw] pt-28 md:pt-32 pb-10 md:pb-14">
                <Link
                    to="/services"
                    className="inline-flex items-center text-[12px] md:text-[13px] tracking-[0.14em] uppercase text-ollin-black/55 hover:text-ollin-black transition-colors"
                >
                    ← Back to Services
                </Link>

                <div className="mt-10 md:mt-12">
                    <p className="text-[11px] md:text-[12px] tracking-[0.28em] uppercase text-ollin-black/45 mb-4">
                        MORE CALLS + ESTIMATES
                    </p>

                    <h1 className="font-[Montserrat] font-normal tracking-tight leading-[0.85] text-[clamp(64px,9vw,140px)]">
                        DEMAND
                    </h1>

                    <p className="mt-6 text-[18px] md:text-[22px] font-medium text-ollin-black/85 max-w-[60ch]">
                        Turn searches into booked calls.
                    </p>

                    <p className="mt-4 text-[15px] md:text-[17px] leading-relaxed text-ollin-black/70 max-w-[75ch]">
                        Demand is how you get steady opportunities: ads, Google Maps visibility, and tracking that shows
                        what’s actually bringing real jobs — not just “likes” or pretty reports.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Chip href="#ads">Ads (Calls & Estimates)</Chip>
                        <Chip href="#localseo">Google Maps</Chip>
                        <Chip href="#analytics">Tracking (What’s Working)</Chip>
                    </div>
                </div>
            </section>

            <section className="w-full max-w-[1500px] mx-auto px-[5vw] pb-20 md:pb-28 space-y-16 md:space-y-20">
                {/* ADS */}
                <div id="ads" className="scroll-mt-28">
                    <SectionTitle
                        kicker="Pay for attention, with control"
                        title="Performance Marketing"
                        subtitle="We run ad campaigns built for calls and estimates — and we watch them every week so they don’t drift."
                    />

                    <div className="mt-10 grid grid-cols-12 gap-8">
                        <div className="col-span-12 md:col-span-7">
                            {/* Square corners */}
                            <div className="rounded-none border border-black/10 bg-white/35 p-7 md:p-9">
                                <p className="text-[13px] tracking-[0.2em] uppercase text-ollin-black/45 mb-4">
                                    What we do each month
                                </p>

                                <p className="text-[15px] md:text-[17px] leading-relaxed text-ollin-black/75">
                                    This isn’t “turn it on and hope.” We set the plan, launch the ads, check results weekly,
                                    tighten targeting, refresh copy/creative, and protect your budget from junk leads.
                                </p>

                                <div className="mt-6 space-y-3 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/70">
                                    <p>
                                        <span className="font-medium text-ollin-black/80">Management:</span>{" "}
                                        strategy → build campaigns → weekly tune-ups → results review → adjustments.
                                    </p>
                                    <p>
                                        <span className="font-medium text-ollin-black/80">Basic tracking included:</span>{" "}
                                        we track calls + form leads so we’re not guessing.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-12 md:col-span-5">
                            {/* Square corners */}
                            <div className="rounded-none border border-black/10 bg-white/20 p-7 md:p-9 h-full">
                                <p className="text-[13px] tracking-[0.2em] uppercase text-ollin-black/45 mb-4">
                                    Best for
                                </p>
                                <div className="space-y-3 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/70">
                                    <p>• Contractors who want steady lead flow — not “viral” luck.</p>
                                    <p>• Service areas where people are actively searching and ready to hire.</p>
                                    <p>• Teams that can answer the phone fast (speed wins).</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Divider />

                {/* LOCAL SEO */}
                <div id="localseo" className="scroll-mt-28">
                    <SectionTitle
                        kicker="Show up on “near me”"
                        title="Local SEO & Maps"
                        subtitle="We clean up your Google Business Profile so you show up more often — and look trustworthy when they click."
                    />

                    <div className="mt-10 grid grid-cols-12 gap-8">
                        <div className="col-span-12 md:col-span-7">
                            {/* Square corners */}
                            <div className="rounded-none border border-black/10 bg-white/35 p-7 md:p-9">
                                <p className="text-[13px] tracking-[0.2em] uppercase text-ollin-black/45 mb-4">
                                    The basics that move the needle
                                </p>

                                <p className="text-[15px] md:text-[17px] leading-relaxed text-ollin-black/75">
                                    We tighten up your Google profile, make sure your info matches everywhere, and keep it active
                                    so it doesn’t look like you stopped working.
                                </p>

                                <div className="mt-6 space-y-3 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/70">
                                    <p>
                                        <span className="font-medium text-ollin-black/80">Setup:</span>{" "}
                                        profile cleanup, service list, description, hours, and a solid photo set.
                                    </p>
                                    <p>
                                        <span className="font-medium text-ollin-black/80">Reviews:</span>{" "}
                                        simple review-request templates + reasonable replies (so it looks cared for).
                                    </p>
                                    <p>
                                        <span className="font-medium text-ollin-black/80">Monthly:</span>{" "}
                                        1–2 posts + quick metric check to keep it active.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-12 md:col-span-5">
                            {/* Square corners */}
                            <div className="rounded-none border border-black/10 bg-white/20 p-7 md:p-9 h-full">
                                <p className="text-[13px] tracking-[0.2em] uppercase text-ollin-black/45 mb-4">
                                    Reality check
                                </p>
                                <div className="space-y-3 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/70">
                                    <p>• Going hard in multiple cities is basically a multi-location effort.</p>
                                    <p>• Maps builds momentum — but only if the profile stays clean and active.</p>
                                    <p>• Reviews matter a lot (Retention helps you keep them coming).</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Divider />

                {/* ANALYTICS */}
                <div id="analytics" className="scroll-mt-28">
                    <SectionTitle
                        kicker="No guessing"
                        title="Analytics + Tracking"
                        subtitle="Not a “pretty dashboard.” A simple truth system: where leads came from, which ones are real, and what turns into jobs."
                    />

                    <div className="mt-10 grid grid-cols-12 gap-8">
                        <div className="col-span-12 md:col-span-7">
                            {/* Square corners */}
                            <div className="rounded-none border border-black/10 bg-white/35 p-7 md:p-9">
                                <p className="text-[13px] tracking-[0.2em] uppercase text-ollin-black/45 mb-4">
                                    What this answers
                                </p>

                                <p className="text-[15px] md:text-[17px] leading-relaxed text-ollin-black/75">
                                    We set up tracking to answer the only questions that matter: where leads came from, which
                                    ones were junk, and what actually turned into booked work.
                                </p>

                                <div className="mt-6 space-y-3 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/70">
                                    <p>
                                        <span className="font-medium text-ollin-black/80">Where leads come from:</span>{" "}
                                        ads, Google/Maps, referrals, organic, LSA — with proof.
                                    </p>
                                    <p>
                                        <span className="font-medium text-ollin-black/80">Lead quality:</span>{" "}
                                        answered calls, real intent, and what people asked for.
                                    </p>
                                    <p>
                                        <span className="font-medium text-ollin-black/80">ROI (when possible):</span>{" "}
                                        if you track “won jobs,” we can tie marketing to revenue. If not, we keep it at lead truth.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-12 md:col-span-5">
                            {/* Square corners */}
                            <div className="rounded-none border border-black/10 bg-white/20 p-7 md:p-9 h-full">
                                <p className="text-[13px] tracking-[0.2em] uppercase text-ollin-black/45 mb-4">
                                    How it pairs with Ads
                                </p>
                                <div className="space-y-3 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/70">
                                    <p>• Ads include the minimum tracking to run safely.</p>
                                    <p>• This is the upgraded layer if you want real clarity.</p>
                                    <p>• You stop chasing “cheap leads” and start chasing closed jobs.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="pt-4">
                    {/* Square corners */}
                    <div className="rounded-none border border-black/10 bg-white/30 p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <p className="text-[11px] md:text-[12px] tracking-[0.28em] uppercase text-ollin-black/45 mb-3">
                                Next step
                            </p>
                            <p className="text-[18px] md:text-[22px] font-medium text-ollin-black/85">
                                Want demand that doesn’t fall apart?
                            </p>
                            <p className="mt-2 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/65 max-w-[70ch]">
                                Tell us your trade + service area, and how fast you answer leads. We’ll recommend the right mix
                                (Ads / Maps / Tracking) to get you more calls without wasting spend.
                            </p>
                        </div>

                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center bg-ollin-black text-white text-[13px] md:text-[14px] font-medium tracking-wide px-6 py-3 rounded-[14px] hover:translate-y-[-1px] hover:shadow-lg transition-all"
                        >
                            Get a Free Growth Plan
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
