import React, { useEffect, useState } from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  muted: string;
};

export default function PackagesHero({ muted }: Props) {
  const [introIn, setIntroIn] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setIntroIn(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <section className="relative w-full pt-4 md:pt-16 lg:pt-20 pb-10 md:pb-14">
      <div className="w-full max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-6 lg:px-10">
        <div
          className={cx(
            "min-h-[40vh] md:min-h-[70vh] lg:min-h-[78vh]",
            "flex flex-col justify-center",
            "lg:grid lg:grid-cols-12 lg:items-center"
          )}
        >
          {/* Copy block */}
          <div
            className={cx(
              "order-1",
              "max-w-[420px] mx-auto text-center mb-8",
              "lg:order-2 lg:mb-0 lg:mx-0 lg:text-left",
              "lg:col-start-8 lg:col-end-13",
              "lg:self-start lg:mt-[10vh]",
              "2xl:col-start-9 2xl:mt-[12vh]",
              "transition-all duration-[1000ms] delay-[120ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
              introIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            )}
            style={{ color: muted }}
          >
            <p className="text-[14px] leading-[1.7] 2xl:text-[15px]">
              <span className="block">Pick your starting point.</span>
              <span className="block">We’ll build the rest.</span>
            </p>
          </div>

          {/* Headline block */}
          <div
            className={cx(
              "order-2 w-full text-center",
              "lg:order-1 lg:text-left lg:col-start-1 lg:col-end-13",
              "lg:self-end lg:mb-[10vh]",
              "2xl:mb-[14vh]"
            )}
          >
            <h1
              className={cx(
                "font-[Montserrat] font-normal tracking-tight leading-[0.9]",
                "transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                introIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ letterSpacing: "-0.04em" }}
            >
              <span className="block text-[clamp(4.4rem,10.8vw,8.1rem)] 2xl:text-[clamp(6rem,7vw,10rem)]">
                Packages
              </span>
            </h1>

            <div className="mt-6 md:mt-10 lg:mt-14 flex justify-center lg:justify-end">
              <div
                className={cx(
                  "flex items-baseline justify-center lg:justify-end gap-4 md:gap-7",
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
                  Plans
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}