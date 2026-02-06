import React from "react";
import { Link } from "react-router-dom";

function Chip({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
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

export default function ServicesFoundation() {
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
                        LOOK LIKE THE REAL DEAL
                    </p>

                    <h1 className="font-[Montserrat] font-normal tracking-tight leading-[0.85] text-[clamp(64px,9vw,140px)]">
                        FOUNDATION
                    </h1>

                    <p className="mt-6 text-[18px] md:text-[22px] font-medium text-ollin-black/85 max-w-[60ch]">
                        Look established in 30 seconds.
                    </p>

                    <p className="mt-4 text-[15px] md:text-[17px] leading-relaxed text-ollin-black/70 max-w-[75ch]">
                        This is the stuff people judge fast: your logo/branding, your website, and your social pages.
                        When those look solid, you earn the first call.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Chip href="#brand">Brand & Creative</Chip>
                        <Chip href="#websites">Websites</Chip>
                        <Chip href="#social">Social Management</Chip>
                    </div>
                </div>
            </section>

            <section className="w-full max-w-[1500px] mx-auto px-[5vw] pb-20 md:pb-28 space-y-16 md:space-y-20">
                {/* BRAND */}
                <div id="brand" className="scroll-mt-28">
                    <SectionTitle
                        kicker="Consistency everywhere"
                        title="Brand & Creative"
                        subtitle="We clean up what you already have (or build it from scratch) so your website, trucks, yard signs, and profiles all match — and you look like one real company."
                    />

                    <div className="mt-10 grid grid-cols-12 gap-8">
                        <div className="col-span-12 md:col-span-7">
                            {/* Square corners (no rounding) */}
                            <div className="rounded-none border border-black/10 bg-white/35 p-7 md:p-9">
                                <p className="text-[13px] tracking-[0.2em] uppercase text-ollin-black/45 mb-4">
                                    What you get
                                </p>

                                <p className="text-[15px] md:text-[17px] leading-relaxed text-ollin-black/75">
                                    A simple brand kit you can actually use in the real world: a clean logo that stays readable
                                    on a truck door, a hat, and online — plus the exact files your printer/sign guy asks for.
                                </p>

                                <div className="mt-6 space-y-3 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/70">
                                    <p>
                                        <span className="font-medium text-ollin-black/80">Logo cleanup + versions:</span>{" "}
                                        main logo + alternate layouts + light/dark versions (so it works on any background).
                                    </p>
                                    <p>
                                        <span className="font-medium text-ollin-black/80">Real-world check:</span>{" "}
                                        tested at small sizes for truck/yard sign/shirt use — no “looks good only on a screen” stuff.
                                    </p>
                                    <p>
                                        <span className="font-medium text-ollin-black/80">Printer-ready handoff:</span>{" "}
                                        organized exports (PNG/SVG/PDF) so anyone can print it without back-and-forth.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-12 md:col-span-5">
                            {/* Square corners (no rounding) */}
                            <div className="rounded-none border border-black/10 bg-white/20 p-7 md:p-9 h-full">
                                <p className="text-[13px] tracking-[0.2em] uppercase text-ollin-black/45 mb-4">
                                    Good fit if…
                                </p>
                                <div className="space-y-3 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/70">
                                    <p>• Your logo looks different on your website vs your truck vs Facebook.</p>
                                    <p>• Your printer keeps asking for files you don’t have.</p>
                                    <p>• You’re about to run ads and you don’t want to look “new” or messy.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Divider />

                {/* WEBSITES */}
                <div id="websites" className="scroll-mt-28">
                    <SectionTitle
                        kicker="More calls, less leaks"
                        title="Websites"
                        subtitle="A website that turns visits into calls: clear services, strong proof, fast load times, and forms that actually reach you."
                    />

                    <div className="mt-10 grid grid-cols-12 gap-8">
                        <div className="col-span-12 md:col-span-7">
                            {/* Square corners (no rounding) */}
                            <div className="rounded-none border border-black/10 bg-white/35 p-7 md:p-9">
                                <p className="text-[13px] tracking-[0.2em] uppercase text-ollin-black/45 mb-4">
                                    Built to get you calls
                                </p>

                                <p className="text-[15px] md:text-[17px] leading-relaxed text-ollin-black/75">
                                    We build (or tune up) contractor sites with the basics done right: clear “call now” prompts,
                                    proof in the right places, and lead forms that don’t break.
                                </p>

                                <div className="mt-6 space-y-3 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/70">
                                    <p>
                                        <span className="font-medium text-ollin-black/80">Leads that actually come in:</span>{" "}
                                        call/text buttons + forms that send to email and a Google Sheet (with spam protection).
                                    </p>
                                    <p>
                                        <span className="font-medium text-ollin-black/80">Ad-ready tracking:</span>{" "}
                                        we set up Google/Meta tracking so your ads aren’t flying blind (calls + form submits).
                                    </p>
                                    <p>
                                        <span className="font-medium text-ollin-black/80">Ongoing care (optional):</span>{" "}
                                        hosting, updates, backups, and small edits — so your site doesn’t become the weak link.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-12 md:col-span-5">
                            {/* Square corners (no rounding) */}
                            <div className="rounded-none border border-black/10 bg-white/20 p-7 md:p-9 h-full">
                                <p className="text-[13px] tracking-[0.2em] uppercase text-ollin-black/45 mb-4">
                                    What we avoid
                                </p>
                                <div className="space-y-3 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/70">
                                    <p>• Slow, flashy stuff that hurts load speed.</p>
                                    <p>• “Pretty but unclear” pages that don’t tell people what to do.</p>
                                    <p>• Broken forms/tracking that ruin your ads later.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Divider />

                {/* SOCIAL */}
                <div id="social" className="scroll-mt-28">
                    <SectionTitle
                        kicker="Stay active + look legit"
                        title="Social Management"
                        subtitle="Consistent posts + quick replies so you don’t look inactive — and so people actually get a response."
                    />

                    <div className="mt-10 grid grid-cols-12 gap-8">
                        <div className="col-span-12 md:col-span-7">
                            {/* Square corners (no rounding) */}
                            <div className="rounded-none border border-black/10 bg-white/35 p-7 md:p-9">
                                <p className="text-[13px] tracking-[0.2em] uppercase text-ollin-black/45 mb-4">
                                    Your online “storefront”
                                </p>

                                <p className="text-[15px] md:text-[17px] leading-relaxed text-ollin-black/75">
                                    We keep your pages looking alive: steady posting, clean visuals, and message/comment monitoring
                                    so you don’t look abandoned.
                                </p>

                                <div className="mt-6 space-y-3 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/70">
                                    <p>
                                        <span className="font-medium text-ollin-black/80">Posting (done for you):</span>{" "}
                                        monthly plan + content creation + scheduling (before/after, reviews, jobs, tips).
                                    </p>
                                    <p>
                                        <span className="font-medium text-ollin-black/80">Clean, consistent look:</span>{" "}
                                        branded templates + captions that sound human (EN/ES available).
                                    </p>
                                    <p>
                                        <span className="font-medium text-ollin-black/80">Important:</span>{" "}
                                        we don’t quote or book jobs inside Social — that’s handled by Digital Secretary.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-12 md:col-span-5">
                            {/* Square corners (no rounding) */}
                            <div className="rounded-none border border-black/10 bg-white/20 p-7 md:p-9 h-full">
                                <p className="text-[13px] tracking-[0.2em] uppercase text-ollin-black/45 mb-4">
                                    Outcomes
                                </p>
                                <div className="space-y-3 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/70">
                                    <p>• Prospects see you’re active and real.</p>
                                    <p>• Your brand looks consistent across platforms.</p>
                                    <p>• Messages get answered and routed fast (no more missed easy leads).</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="pt-4">
                    {/* Square corners (no rounding) */}
                    <div className="rounded-none border border-black/10 bg-white/30 p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <p className="text-[11px] md:text-[12px] tracking-[0.28em] uppercase text-ollin-black/45 mb-3">
                                Next step
                            </p>
                            <p className="text-[18px] md:text-[22px] font-medium text-ollin-black/85">
                                Want Foundation done fast and clean?
                            </p>
                            <p className="mt-2 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/65 max-w-[70ch]">
                                Tell us your trade + service areas and we’ll recommend the simplest Foundation setup to make you
                                look established before you spend hard on ads.
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
