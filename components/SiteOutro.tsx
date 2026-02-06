import React, { useEffect, useRef, useState } from "react";
import ConstructionCrowdInteractive from "./ConstructionCrowdInteractive";

const links = [
    { label: "Instagram", href: "https://www.instagram.com/ollinagency/" },
    { label: "X / Twitter", href: "https://x.com/" }, // placeholder
    { label: "Facebook", href: "https://www.facebook.com/ollin.agency" },
    { label: "Threads", href: "https://www.threads.net/" }, // placeholder
    { label: "LinkedIn", href: "https://www.linkedin.com/" }, // placeholder
    { label: "Privacy", href: "/privacy.html" }, // placeholder seguro sin router
];

// Solo muestra el 3D si hay mouse/trackpad (evita touch/tablets/híbridos)
function useFinePointerHover(): boolean {
    const [ok, setOk] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
        const update = () => setOk(mq.matches);
        update();

        if (typeof mq.addEventListener === "function") {
            mq.addEventListener("change", update);
            return () => mq.removeEventListener("change", update);
        } else {
            // Safari viejo
            // @ts-expect-error legacy
            mq.addListener(update);
            // @ts-expect-error legacy
            return () => mq.removeListener(update);
        }
    }, []);

    return ok;
}

export default function SiteOutro() {
    const sectionRef = useRef<HTMLElement>(null);
    const year = new Date().getFullYear();
    const show3D = useFinePointerHover();

    return (
        <section
            ref={sectionRef}
            className="relative w-full min-h-[100svh] bg-white text-black overflow-hidden"
        >
            {/* 3D: SOLO desktop real (mouse/trackpad). En touch NO aparece. */}
            {show3D && (
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
            )}

            {/* Content layer */}
            <div className="relative z-10 w-full min-h-[100svh] flex flex-col">
                {/* ========================= */}
                {/* MOBILE + TABLET (<= md)    */}
                {/* Vertical PERFECTA: NO se toca.
            Landscape: solo ajustes via @media(orientation:landscape) */}
                {/* ========================= */}
                <div className="lg:hidden flex flex-col min-h-[100svh]">
                    {/* Top: Headline */}
                    <div
                        className="
              mx-auto w-full max-w-[1400px]
              px-6 sm:px-10
              pt-16 sm:pt-20

              /* LANDSCAPE ONLY: menos padding top para que quepa todo */
              [@media(orientation:landscape)]:pt-10
            "
                    >
                        <h2
                            className="
                font-normal tracking-[-0.04em] leading-[0.98]
                text-[clamp(2.3rem,8.4vw,3.6rem)]

                /* LANDSCAPE ONLY: baja el tamaño para que no domine */
                [@media(orientation:landscape)]:text-[clamp(2.0rem,5.4vw,2.9rem)]
                [@media(orientation:landscape)]:leading-[0.97]
              "
                        >
                            <span className="block">Let’s make something</span>
                            <span className="block">worth building</span>
                        </h2>
                    </div>

                    {/* Middle: Email centered */}
                    <div
                        className="
              flex-1 flex items-center justify-center
              px-6 sm:px-10

              /* LANDSCAPE ONLY: en vez de centrar verticalmente (que aprieta),
                 lo subimos un poco para abrir espacio a los links */
              [@media(orientation:landscape)]:items-start
              [@media(orientation:landscape)]:pt-7
            "
                    >
                        <a
                            href="mailto:contact@ollin.agency"
                            className="
                font-normal text-black no-underline
                tracking-[-0.04em] leading-[0.98]
                text-center
                hover:opacity-70 transition-opacity
                text-[clamp(1.85rem,7.4vw,2.9rem)]
                whitespace-nowrap
                max-w-[92vw]

                /* LANDSCAPE ONLY: un pelín más chico para que no tape links */
                [@media(orientation:landscape)]:text-[clamp(1.6rem,4.6vw,2.25rem)]
              "
                        >
                            contact@ollin.agency
                        </a>
                    </div>

                    {/* Bottom: Links + divider + copyright */}
                    <div
                        className="
              mx-auto w-full
              px-6 sm:px-10
              pb-10 sm:pb-12

              /* LANDSCAPE ONLY: menos padding bottom */
              [@media(orientation:landscape)]:pb-8
            "
                    >
                        {/* Links */}
                        <div className="flex justify-center">
                            <nav
                                className="
                  w-full max-w-[520px]
                  grid grid-cols-2
                  gap-x-14 sm:gap-x-20
                  gap-y-6 sm:gap-y-7
                  justify-items-start

                  /* LANDSCAPE ONLY: compacta verticalmente el grid */
                  [@media(orientation:landscape)]:max-w-[560px]
                  [@media(orientation:landscape)]:gap-y-5
                "
                            >
                                {links.map((l) => (
                                    <a
                                        key={l.label}
                                        href={l.href}
                                        className="
                      text-[12px] sm:text-[13px]
                      tracking-[0.22em] uppercase
                      text-black/70 hover:text-black
                      transition-colors

                      /* LANDSCAPE ONLY: links un poquito más chicos */
                      [@media(orientation:landscape)]:text-[11px]
                    "
                                        target={l.href.startsWith("http") ? "_blank" : undefined}
                                        rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                                    >
                                        {l.label}
                                    </a>
                                ))}
                            </nav>
                        </div>

                        {/* Divider */}
                        <div
                            className="
                mt-10 sm:mt-12 h-px bg-black/10

                /* LANDSCAPE ONLY: menos margen */
                [@media(orientation:landscape)]:mt-8
              "
                        />

                        {/* Copyright */}
                        <div
                            className="
                mt-6 sm:mt-8 flex justify-center

                /* LANDSCAPE ONLY: menos margen */
                [@media(orientation:landscape)]:mt-5
              "
                        >
                            <div className="text-[12px] tracking-[0.22em] uppercase text-black/25 select-none">
                                © {year} OLLIN
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================= */}
                {/* DESKTOP (lg+)              */}
                {/* EXACTAMENTE tu layout original, sin tocarlo */}
                {/* ========================= */}
                <div className="hidden lg:flex lg:flex-col lg:min-h-[100svh]">
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
            </div>
        </section>
    );
}
