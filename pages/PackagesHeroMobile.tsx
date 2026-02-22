import React, { useEffect, useState } from "react";

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type Props = {
    muted: string;
};

export default function PackagesHeroMobile({ muted }: Props) {
    const [introIn, setIntroIn] = useState(false);

    useEffect(() => {
        const t = requestAnimationFrame(() => setIntroIn(true));
        return () => cancelAnimationFrame(t);
    }, []);

    return (
        <section className="relative pt-6 pb-4">
            <div className="relative flex flex-col justify-end px-4">
                
                {/* MICROCOPY */}
                <div
                    className={cx(
                        "text-center mb-6", 
                        "transition-all duration-[1000ms] delay-[120ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                        introIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                    )}
                    style={{ color: muted }}
                >
                    <p className="text-[13px] leading-[1.6]">
                        Pick your starting point.
                        <br />
                        We’ll build the rest.
                    </p>
                </div>

                {/* DISPLAY TYPE */}
                <div className="text-center">
                    <h1
                        className={cx(
                            "font-[Montserrat] font-normal tracking-tight",
                            "leading-[0.9]",
                            "transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                            introIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}
                        style={{ letterSpacing: "-0.04em" }}
                    >
                        <span className="block text-[15vw]">
                            Packages
                        </span>
                    </h1>

                    <div
                        className={cx(
                            "mt-1 flex items-baseline justify-center gap-3", 
                            "transition-all duration-[1100ms] delay-[90ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                            introIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}
                    >
                        <span
                            className="font-[Montserrat] font-normal text-[15vw]"
                            style={{
                                color: "rgba(0,0,0,0.22)",
                                letterSpacing: "-0.04em",
                                lineHeight: 0.9,
                            }}
                            aria-hidden="true"
                        >
                            &
                        </span>

                        <span
                            className="font-[Montserrat] font-normal tracking-tight leading-[0.9] text-[15vw]"
                            style={{
                                letterSpacing: "-0.04em",
                            }}
                        >
                            Plans
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}