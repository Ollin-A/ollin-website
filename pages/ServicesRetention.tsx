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

export default function ServicesRetention() {
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
                        FOLLOW-UPS + 5-STARS
                    </p>

                    <h1 className="font-[Montserrat] font-normal tracking-tight leading-[0.85] text-[clamp(64px,9vw,140px)]">
                        RETENTION
                    </h1>

                    <p className="mt-6 text-[18px] md:text-[22px] font-medium text-ollin-black/85 max-w-[60ch]">
                        Make revenue compound.
                    </p>

                    <p className="mt-4 text-[15px] md:text-[17px] leading-relaxed text-ollin-black/70 max-w-[75ch]">
                        Retention is where growth becomes durable: leads don’t get wasted, jobs turn into reviews,
                        and past customers come back when seasonality hits.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Chip href="#secretary">Digital Secretary</Chip>
                        <Chip href="#reviews">Reviews & Repeat Jobs Engine</Chip>
                    </div>
                </div>
            </section>

            <section className="w-full max-w-[1500px] mx-auto px-[5vw] pb-20 md:pb-28 space-y-16 md:space-y-20">
                {/* DIGITAL SECRETARY */}
                <div id="secretary" className="scroll-mt-28">
                    <SectionTitle
                        kicker="Speed wins deals"
                        title="Digital Secretary"
                        subtitle="The backend that converts conversations into booked estimates — so leads don’t die in your inbox."
                    />

                    <div className="mt-10 grid grid-cols-12 gap-8">
                        <div className="col-span-12 md:col-span-7">
                            <div className="rounded-[22px] border border-black/10 bg-white/35 p-7 md:p-9">
                                <p className="text-[13px] tracking-[0.2em] uppercase text-ollin-black/45 mb-4">
                                    What it does
                                </p>

                                <p className="text-[15px] md:text-[17px] leading-relaxed text-ollin-black/75">
                                    Digital Secretary exists to stop the classic leak: slow replies, missed calls,
                                    and “I’ll get back to you” leads that vanish.
                                </p>

                                <div className="mt-6 space-y-3 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/70">
                                    <p>
                                        <span className="font-medium text-ollin-black/80">Capture + qualify:</span>{" "}
                                        asks the right questions and routes leads to the right next step.
                                    </p>
                                    <p>
                                        <span className="font-medium text-ollin-black/80">Book estimates:</span>{" "}
                                        helps move from “DM” to a scheduled call/visit when the workflow allows.
                                    </p>
                                    <p>
                                        <span className="font-medium text-ollin-black/80">Works with your front-end:</span>{" "}
                                        Social is the front-end; Digital Secretary is the backend for booking/quotes.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-12 md:col-span-5">
                            <div className="rounded-[22px] border border-black/10 bg-white/20 p-7 md:p-9 h-full">
                                <p className="text-[13px] tracking-[0.2em] uppercase text-ollin-black/45 mb-4">
                                    Best for
                                </p>
                                <div className="space-y-3 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/70">
                                    <p>• Businesses that miss calls or reply late.</p>
                                    <p>• High lead volume from Ads/Maps/Social.</p>
                                    <p>• Teams that want a consistent intake process.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Divider />

                {/* REVIEWS + REPEAT */}
                <div id="reviews" className="scroll-mt-28">
                    <SectionTitle
                        kicker="Reputation + reactivation"
                        title="Reviews & Repeat Jobs Engine"
                        subtitle="A done-for-you system that turns jobs into 5-star reviews, referrals, and repeat work — while preventing reputation damage."
                    />

                    <div className="mt-10 grid grid-cols-12 gap-8">
                        <div className="col-span-12 md:col-span-7">
                            <div className="rounded-[22px] border border-black/10 bg-white/35 p-7 md:p-9">
                                <p className="text-[13px] tracking-[0.2em] uppercase text-ollin-black/45 mb-4">
                                    The engine (not just “messages”)
                                </p>

                                <p className="text-[15px] md:text-[17px] leading-relaxed text-ollin-black/75">
                                    This isn’t a spammy follow-up tool. It’s a reputation + reactivation engine we operate:
                                    it asks for reviews at the right moment, filters unhappy clients privately,
                                    and runs reactivation when seasonality hits.
                                </p>

                                <div className="mt-6 space-y-3 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/70">
                                    <p>
                                        <span className="font-medium text-ollin-black/80">Post-job review flow:</span>{" "}
                                        happy → direct to Google/Facebook; unhappy → private alert first.
                                    </p>
                                    <p>
                                        <span className="font-medium text-ollin-black/80">Referral flow:</span>{" "}
                                        ask for referrals when the customer is happiest (timing matters).
                                    </p>
                                    <p>
                                        <span className="font-medium text-ollin-black/80">Reactivation campaigns:</span>{" "}
                                        seasonal outreach to past customers to generate repeat jobs.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-12 md:col-span-5">
                            <div className="rounded-[22px] border border-black/10 bg-white/20 p-7 md:p-9 h-full">
                                <p className="text-[13px] tracking-[0.2em] uppercase text-ollin-black/45 mb-4">
                                    Outcomes
                                </p>
                                <div className="space-y-3 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/70">
                                    <p>• More 5-star reviews (without review-begging vibes).</p>
                                    <p>• Less reputation damage from unhappy customers.</p>
                                    <p>• More referrals + repeat work during slow periods.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="pt-4">
                    <div className="rounded-[26px] border border-black/10 bg-white/30 p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <p className="text-[11px] md:text-[12px] tracking-[0.28em] uppercase text-ollin-black/45 mb-3">
                                Next step
                            </p>
                            <p className="text-[18px] md:text-[22px] font-medium text-ollin-black/85">
                                Want leads to stop leaking?
                            </p>
                            <p className="mt-2 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/65 max-w-[70ch]">
                                We’ll map your intake + follow-up flow and recommend the smallest Retention stack
                                that increases close rate and review velocity.
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
