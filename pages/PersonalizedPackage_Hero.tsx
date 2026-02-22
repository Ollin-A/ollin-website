import React, { useEffect, useState } from "react";

const WORDS = ["OWN", "CUSTOM", "PERSONALIZED", "BUILT-TO-FIT"] as const;

const PersonalizedPackageHero: React.FC = () => {
    const [index, setIndex] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [reduceMotion, setReduceMotion] = useState(false);

    const current = WORDS[index];
    const next = WORDS[(index + 1) % WORDS.length];

    // Respect prefers-reduced-motion
    useEffect(() => {
        const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
        if (!mq) return;
        const onChange = () => setReduceMotion(mq.matches);
        onChange();
        mq.addEventListener?.("change", onChange);
        return () => mq.removeEventListener?.("change", onChange);
    }, []);

    useEffect(() => {
        if (reduceMotion) return;

        const DURATION = 320; // animation duration (ms)
        const INTERVAL = 1600; // faster cycle (ms)

        const tick = () => {
            setAnimating(true);
            window.setTimeout(() => {
                setIndex((v) => (v + 1) % WORDS.length);
                setAnimating(false);
            }, DURATION);
        };

        const id = window.setInterval(tick, INTERVAL);
        return () => window.clearInterval(id);
    }, [reduceMotion]);

    return (
        <section className="bg-transparent">
            <div className="mx-auto max-w-[1100px] px-6 pt-6 md:pt-12 pb-2 md:pb-3">
                <h1 className="text-center font-medium tracking-[-0.06em] text-black select-none">
                    {/* Line 1 */}
                    <span className="block leading-[0.95] text-[clamp(40px,11vw,86px)] md:text-[clamp(44px,6vw,86px)]">
                        Build your
                    </span>

                    {/* Line 2 (rotating word) */}
                    <span className="block mt-2 md:mt-3 leading-[0.85]">
                        <span className="inline-grid place-items-center min-w-[13ch]">
                            {/* current */}
                            <span
                                className={animating ? "word-out" : "word-still"}
                                aria-hidden={false}
                            >
                                {current}
                            </span>

                            {/* next */}
                            {!reduceMotion && (
                                <span className={animating ? "word-in" : "word-hidden"}>
                                    {next}
                                </span>
                            )}
                        </span>
                    </span>

                    {/* Line 3 */}
                    <span className="block mt-2 md:mt-3 leading-[0.95] text-[clamp(40px,11vw,86px)] md:text-[clamp(44px,6vw,86px)]">
                        plan
                    </span>
                </h1>
            </div>

            <style>{`
        /* Prevent any interaction (selection) from "catching" the word */
        h1, h1 * {
          -webkit-user-select: none;
          user-select: none;
        }

        /* Shared typography for the middle word */
        .word-hidden,
        .word-still,
        .word-out,
        .word-in {
          grid-area: 1 / 1;
          /* Mobile: larger relative size to fill width, Desktop: original clamp */
          font-size: clamp(48px, 13vw, 112px);
        }
        @media (min-width: 768px) {
            .word-hidden,
            .word-still,
            .word-out,
            .word-in {
                font-size: clamp(56px, 7.2vw, 112px);
            }
        }

        .word-hidden,
        .word-still,
        .word-out,
        .word-in {
          line-height: 0.85;
          letter-spacing: -0.06em;
          color: rgba(0,0,0,0.45); /* solid gray */
          pointer-events: none;    /* no hover/selection events */
        }

        .word-hidden { opacity: 0; transform: translateY(10px); }
        .word-still  { opacity: 1; transform: translateY(0); }

        @keyframes wordOut {
          0%   { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        @keyframes wordIn {
          0%   { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .word-out { animation: wordOut 320ms cubic-bezier(.2,.8,.2,1) both; }
        .word-in  { animation: wordIn  320ms cubic-bezier(.2,.8,.2,1) both; }
      `}</style>
        </section>
    );
};

export default PersonalizedPackageHero;
