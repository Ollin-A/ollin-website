import React, { useMemo } from "react";
import BookingSystemTrades from "./BookingSystemTrades";

type Step = {
    title: string;
    desc: string;
    detail: string;
};

const BookingSystemSection: React.FC = () => {
    const steps: Step[] = useMemo(
        () => [
            {
                title: "Get found locally",
                desc: "Show up when people search near you.",
                detail: "We tune Maps + local signals so you appear where it counts.",
            },
            {
                title: "Bring in real calls",
                desc: "Ads that bring serious leads, not time-wasters.",
                detail: "Targeting, offers, and weekly tuning focused on booked jobs.",
            },
            {
                title: "Look legit fast",
                desc: "A website that builds trust in seconds.",
                detail: "Clear services, proof, and a simple path to request an estimate.",
            },
            {
                title: "Reply in minutes",
                desc: "Missed call → instant text-back.",
                detail: "Fast replies that stop leads from going to competitors.",
            },
            {
                title: "Keep the loop running.",
                desc: "More 5-stars. More booked work.",
                detail: "Follow-ups, review requests, and rebook nudges that run in the background.",
            },
        ],
        []
    );

    const goContact = () => {
        const el = document.getElementById("contact");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <section id="system" className="relative w-full bg-[#F2F2F2] text-ollin-black py-20 md:py-28">
            <style>{`
        /* =========================
           Secondary Button v14 (same as Hero / PricingSection)
           ========================= */
        .btnSecondary.btnSecondary14 {
          color: #6b6b6b;
          background: transparent;
          border: 0;
          padding: 0;
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          transition: color 280ms ease-out;

          /* single source of truth */
          --arrowLen: 18px;
          --arrowLenHover: 46px;
          --arrowOverlap: 7.5px;
        }
        .btnSecondary.btnSecondary14:hover {
          color: #111111;
          --arrowLen: var(--arrowLenHover);
        }

        /* ===== SHEEN ===== */
        .btnSecondary14Text {
          position: relative;
          display: inline-block;
          line-height: 1;
        }
        .btnSecondary14Text::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          color: transparent;
          background-image: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 248, 220, 0.92) 45%,
            transparent 62%
          );
          background-size: 220% 100%;
          background-position: 220% 0;
          -webkit-background-clip: text;
          background-clip: text;
          opacity: 0;
          pointer-events: none;
        }
        @keyframes ollinSheenOnceLR {
          0%   { background-position: 220% 0; opacity: 0; }
          12%  { opacity: 0.70; }
          88%  { opacity: 0.70; }
          100% { background-position: -220% 0; opacity: 0; }
        }
        .btnSecondary.btnSecondary14:hover .btnSecondary14Text::after {
          animation: ollinSheenOnceLR 720ms ease-out 1;
        }

        /* ===== ARROW ===== */
        .btnSecondary14Arrow {
          position: relative;
          display: inline-block;
          width: 68px;
          height: 12px;
          margin-left: 6px;
          pointer-events: none;
        }

        .btnSecondary14ArrowLineSvg {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: var(--arrowLen);
          height: 12px;
          overflow: visible;
          transition: width 380ms cubic-bezier(0.2, 0.7, 0.2, 1);
          will-change: width;
        }

        .btnSecondary14ArrowHeadSvg {
          position: absolute;
          left: 0;
          top: 50%;
          width: 13px;
          height: 12px;
          transform: translate3d(calc(var(--arrowLen) - var(--arrowOverlap)), -50%, 0);
          transition: transform 380ms cubic-bezier(0.2, 0.7, 0.2, 1);
          will-change: transform;
        }

        @media (prefers-reduced-motion: reduce) {
          .btnSecondary.btnSecondary14 { transition: none !important; }
          .btnSecondary14ArrowLineSvg,
          .btnSecondary14ArrowHeadSvg { transition: none !important; }
          .btnSecondary.btnSecondary14:hover .btnSecondary14Text::after { animation: none !important; }
        }
      `}</style>

            <div className="max-w-[1500px] mx-auto px-[5vw] w-full">
                {/* ===== TOP: Pipeline ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-12 items-start">
                    {/* Left copy */}
                    <div>
                        <h3 className="text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.02] font-medium">
                            How jobs get booked.
                        </h3>
                        <p className="mt-4 text-base md:text-lg leading-snug text-ollin-black/70 max-w-[520px]">
                            A clear system that turns demand into booked work.
                        </p>

                        {/* ✅ Get a quick breakdown (same button style) */}
                        <button
                            type="button"
                            onClick={goContact}
                            className="mt-8 text-sm font-semibold tracking-tight btnSecondary btnSecondary14"
                        >
                            <span className="btnSecondary14Text" data-text="Get a quick breakdown">
                                Get a quick breakdown
                            </span>

                            <span className="btnSecondary14Arrow" aria-hidden="true">
                                <svg className="btnSecondary14ArrowLineSvg" viewBox="0 0 100 16" fill="none">
                                    <line
                                        x1="0"
                                        y1="8"
                                        x2="100"
                                        y2="8"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        strokeLinecap="butt"
                                        vectorEffect="non-scaling-stroke"
                                    />
                                </svg>

                                <svg
                                    className="btnSecondary14ArrowHeadSvg"
                                    viewBox="0 0 18 16"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M0 3 L12 8 L0 13" vectorEffect="non-scaling-stroke" />
                                </svg>
                            </span>
                        </button>
                    </div>

                    {/* Right: steps list */}
                    <div className="relative">
                        {/* rail line */}
                        <div className="pointer-events-none absolute left-[14px] top-0 bottom-0 w-px bg-black/10" />

                        <div className="space-y-6">
                            {steps.map((s) => (
                                <div
                                    key={s.title}
                                    className={["group relative pl-10 pr-4 py-4", "transition-colors duration-200"].join(" ")}
                                >
                                    {/* Node */}
                                    <span
                                        className={[
                                            "absolute left-[9px] top-[26px]",
                                            "h-[10px] w-[10px] rounded-full",
                                            "bg-[#9D9B97]",
                                            "transition-colors duration-200",
                                            "group-hover:bg-[#61605D]",
                                        ].join(" ")}
                                    />

                                    <div className="relative">
                                        <div className="text-lg md:text-xl font-medium tracking-tight">{s.title}</div>
                                        <div className="mt-1 text-sm md:text-[15px] leading-snug text-ollin-black/65">{s.desc}</div>

                                        <div className="mt-2 text-xs md:text-sm text-ollin-black/55 opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                                            {s.detail}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Separador “invisible” (mismo color del fondo) */}
                <div className="my-16 md:my-20 h-px w-full bg-[#F2F2F2]" />

                {/* ===== BOTTOM: Trades (migrado) ===== */}
                <BookingSystemTrades onCta={goContact} />
            </div>
        </section>
    );
};

export default BookingSystemSection;
