import React, { useRef } from "react";
import ConstructionCrowdInteractive from "./ConstructionCrowdInteractive";

const links = [
    { label: "Instagram", href: "https://www.instagram.com/ollinagency/" },
    { label: "X / Twitter", href: "https://x.com/" }, // placeholder
    { label: "Facebook", href: "https://www.facebook.com/ollin.agency" },
    { label: "Threads", href: "https://www.threads.net/" }, // placeholder
    { label: "LinkedIn", href: "https://www.linkedin.com/" }, // placeholder
    { label: "Privacy", href: "/privacy.html" }, // placeholder seguro sin router
];

export default function SiteOutro() {
    const sectionRef = useRef<HTMLElement>(null);
    const year = new Date().getFullYear();

    return (
        <section
            ref={sectionRef}
            className="relative w-full min-h-[100svh] bg-white text-black overflow-hidden"
        >
            {/* 3D: bottom-left, tocando abajo */}
            <div
                className="
          absolute left-0 bottom-0 z-0
          w-[360px] h-[270px]
          sm:w-[420px] sm:h-[310px]
          md:w-[480px] md:h-[360px]
          lg:w-[520px] lg:h-[390px]
          pointer-events-none select-none
        "
                aria-hidden="true"
            >
                <ConstructionCrowdInteractive interactionRef={sectionRef} />
            </div>

            {/* Content layer */}
            <div className="relative z-10 w-full min-h-[100svh] flex flex-col">
                {/* Top area */}
                <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-10 pt-20 sm:pt-24">
                    <div className="grid grid-cols-12 gap-10 lg:gap-12 items-start">
                        {/* Headline: 2 líneas SIEMPRE */}
                        <h2
                            className="
                col-span-12 lg:col-span-6
                font-normal
                text-[clamp(3.2rem,6.2vw,6.1rem)]
                leading-[0.92]
                tracking-[-0.04em]
              "
                        >
                            <span className="block whitespace-nowrap">Let’s make something</span>
                            <span className="block">worth building</span>
                        </h2>

                        {/* Email: más abajo en desktop */}
                        <div className="col-span-12 lg:col-span-6 lg:flex lg:justify-end">
                            <div className="w-full lg:pt-40 xl:pt-56 2xl:pt-72 lg:flex lg:justify-end">
                                <a
                                    href="mailto:contact@ollin.agency"
                                    className="
                    font-normal
                    text-black no-underline
                    text-[clamp(2.4rem,5.5vw,5.6rem)]
                    leading-[0.95]
                    tracking-[-0.04em]
                    hover:opacity-70 transition-opacity
                    lg:whitespace-nowrap
                  "
                                >
                                    contact@ollin.agency
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar pinned to bottom */}
                <div className="mt-auto">
                    <div className="relative mx-auto w-full max-w-[1400px] px-6 sm:px-10 pb-8 sm:pb-10">
                        {/* © fijo abajo-izquierda, visible (encima del 3D) */}
                        <div className="absolute left-6 sm:left-10 bottom-8 sm:bottom-10 z-20 text-[11px] sm:text-[12px] tracking-[0.22em] uppercase text-black/10 pointer-events-none select-none">
                            © {year} OLLIN
                        </div>

                        {/* Links abajo-derecha */}
                        <div className="flex items-end justify-end">
                            <nav className="flex flex-wrap justify-end gap-x-8 gap-y-3">
                                {links.map((l) => (
                                    <a
                                        key={l.label}
                                        href={l.href}
                                        className="text-[11px] sm:text-[12px] tracking-[0.22em] uppercase text-black/65 hover:text-black transition-colors"
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
            </div>
        </section>
    );
}
