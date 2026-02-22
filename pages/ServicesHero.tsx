import React, { useEffect, useState } from "react";

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type Props = {
    muted?: string;
};

export default function ServicesHero({ muted = "rgba(0,0,0,0.4)" }: Props) {
    const [introIn, setIntroIn] = useState(false);

    useEffect(() => {
        const t = requestAnimationFrame(() => setIntroIn(true));
        return () => cancelAnimationFrame(t);
    }, []);

    return (
        <section className="relative pt-14 md:pt-16 lg:pt-20 pb-10 md:pb-14 flex justify-center w-full">
            {/* 1. Agregamos flex-col y justify-center para centrar verticalmente en móvil */}
            <div className="relative min-h-[64vh] md:min-h-[70vh] lg:min-h-[78vh] w-full max-w-7xl mx-auto flex flex-col justify-center lg:block">
                
                <div
                    className={cx(
                        "max-w-[380px] mx-auto text-center",
                        "mb-10 lg:mb-0", // Separación natural en móvil
                        "lg:mx-0 lg:text-left lg:absolute",
                        "lg:top-[25%] lg:left-[56%]",
                        "transition-all duration-[1000ms] delay-[120ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                        introIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                    )}
                    style={{ color: muted }}
                >
                    <p className="text-[14px] leading-[1.7]">
                        <span className="block">Three systems.</span>
                        <span className="block">One pipeline.</span>
                        <span className="block">Start where you’re at.</span>
                    </p>
                </div>

                <div
                    className={cx(
                        "relative w-full text-center", // 2. Centramos el texto y usamos flujo relativo en móvil
                        "lg:absolute lg:inset-x-0 lg:text-left", // Volvemos a absolute en desktop
                        "lg:bottom-[25%]",
                        "px-5 sm:px-6 lg:px-10"
                    )}
                >
                    <h1
                        className={cx(
                            "font-[Montserrat] font-normal tracking-tight",
                            "leading-[0.9]",
                            "transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                            introIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}
                        style={{ letterSpacing: "-0.04em" }}
                    >
                        <span className="block text-[clamp(4.4rem,10.8vw,8.1rem)]">
                            Services
                        </span>
                    </h1>

                    {/* 3. Cambiamos a justify-center en móvil y reducimos el gap vertical (mt-4) */}
                    <div className={cx("mt-4 md:mt-8 lg:mt-12", "flex justify-center lg:justify-end")}>
                        <div
                            className={cx(
                                "flex items-baseline justify-center lg:justify-end",
                                "gap-4 md:gap-7",
                                "transition-all duration-[1100ms] delay-[90ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                                introIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                            )}
                        >
                            <span
                                className="font-[Montserrat] font-normal"
                                style={{
                                    fontSize: "clamp(4.8rem, 11.2vw, 8.3rem)",
                                    color: "rgba(0,0,0,0.22)",
                                    letterSpacing: "-0.04em",
                                    lineHeight: 0.9,
                                }}
                                aria-hidden="true"
                            >
                                &
                            </span>

                            <span
                                className="font-[Montserrat] font-normal tracking-tight leading-[0.9]"
                                style={{
                                    fontSize: "clamp(4.4rem, 10.8vw, 8.1rem)",
                                    letterSpacing: "-0.04em",
                                }}
                            >
                                Systems
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}