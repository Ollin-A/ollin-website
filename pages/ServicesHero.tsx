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
        <section className="relative pt-14 md:pt-16 lg:pt-20 pb-10 md:pb-14">
            {/* This wrapper creates the “hero canvas” */}
            <div className="relative min-h-[64vh] md:min-h-[70vh] lg:min-h-[78vh]">
                {/* MICROCOPY BLOCK */}
                <div
                    className={cx(
                        // mobile: centered
                        "max-w-[380px] mx-auto text-center",
                        "mt-6 md:mt-10",
                        // desktop: absolute positioning
                        "lg:mx-0 lg:text-left lg:absolute",
                        "lg:top-[18%] lg:left-[56%]",
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

                {/* DISPLAY TYPE */}
                <div
                    className={cx(
                        "absolute inset-x-0",
                        "bottom-6 md:bottom-10 lg:bottom-14"
                    )}
                >
                    {/* LINE 1: Services */}
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

                    {/* LINE 2: & Systems */}
                    <div
                        className={cx(
                            "mt-8 md:mt-10 lg:mt-12",
                            "flex justify-end"
                        )}
                    >
                        <div
                            className={cx(
                                "flex items-baseline justify-end",
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
