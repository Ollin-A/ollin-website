import React from "react";

const footerLinks = [
    { label: "Instagram", href: "https://www.instagram.com/ollinagency/" },
    { label: "X / Twitter", href: "https://x.com/" },
    { label: "Facebook", href: "https://www.facebook.com/ollin.agency" },
    { label: "Threads", href: "https://www.threads.net/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "Privacy", href: "/privacy.html" },
];

const Contact: React.FC = () => {
    const year = new Date().getFullYear();

    return (
        <div className="w-full min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            <div className="w-full min-h-screen flex flex-col justify-between px-6 sm:px-10 pt-32 pb-10 max-w-[1400px] mx-auto">
                <div className="flex-grow flex flex-col justify-center">
                    {/* Header */}
                    <div className="mb-16 md:mb-24">
                        <h1 className="font-normal text-[clamp(3.5rem,7vw,7rem)] leading-[0.9] tracking-[-0.04em]">
                            Want to talk?
                        </h1>
                    </div>

                    {/* Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-[1.35fr_0.65fr] gap-12 lg:gap-20">
                        {/* Left: Email + Phone */}
                        <div className="flex flex-col gap-12 min-w-0">
                            <a
                                href="mailto:contact@ollin.agency"
                                className="
                  font-normal
                  text-[clamp(2rem,4.2vw,4.3rem)]
                  leading-[0.9]
                  tracking-[-0.04em]
                  hover:opacity-70
                  transition-opacity
                  min-w-0
                  md:whitespace-nowrap
                "
                            >
                                {/* Prevent ugly breaks like ".agency" or lonely letters */}
                                <span className="inline-block">contact@ollin.</span>
                                <span className="inline-block">agency</span>
                            </a>

                            <div className="flex flex-col gap-2">
                                <span className="text-xs uppercase tracking-widest opacity-60">
                                    Call
                                </span>
                                <a
                                    href="tel:+526692740503"
                                    className="text-2xl sm:text-3xl tracking-tight hover:opacity-70 transition-opacity"
                                >
                                    +52 669 274 0503
                                </a>
                            </div>
                        </div>

                        {/* Right: Text us */}
                        <div className="flex flex-col gap-2 md:pl-20">
                            <span className="text-xs uppercase tracking-widest opacity-60">
                                Text us
                            </span>

                            <div className="flex flex-col gap-4 items-start">
                                <a
                                    href="https://wa.me/526692740503"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-2xl sm:text-3xl tracking-tight hover:opacity-70 transition-opacity flex items-center gap-2"
                                >
                                    WhatsApp{" "}
                                    <span className="text-lg opacity-60" aria-hidden="true">
                                        {"\u2197\uFE0E"}
                                    </span>
                                </a>

                                <a
                                    href="sms:+526692740503"
                                    className="text-2xl sm:text-3xl tracking-tight hover:opacity-70 transition-opacity"
                                >
                                    SMS
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col-reverse md:flex-row md:items-end justify-between gap-8 mt-20">
                    <div className="text-[11px] sm:text-[12px] tracking-[0.22em] uppercase opacity-30 pointer-events-none select-none">
                        © {year} OLLIN
                    </div>

                    <nav className="flex flex-wrap gap-x-8 gap-y-3">
                        {footerLinks.map((l) => (
                            <a
                                key={l.label}
                                href={l.href}
                                className="text-[11px] sm:text-[12px] tracking-[0.22em] uppercase opacity-60 hover:opacity-100 transition-opacity"
                                target={l.href.startsWith("http") ? "_blank" : undefined}
                                rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                            >
                                {l.label}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Contact;
