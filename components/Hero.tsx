import React, { useEffect, useState } from 'react';
import BackgroundShape from './BackgroundShape';

const Hero: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Exact items as requested
  const marqueeItems = [
    "REVIEW BOOST",
    "SOCIAL MEDIA",
    "BOOKED JOBS",
    "MORE CALLS",
    "BETTER WEBSITE",
    "FASTER REPLIES"
  ];

  // Create a doubled list for seamless loop
  const seamlessMarquee = [...marqueeItems, ...marqueeItems];

  return (
    <section className="hero">
      <style>{`
        .btnSecondary.btnSecondary14 {
          color: #6b6b6b;
          background: transparent;
          border: 0;
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          transition: color 280ms ease-out;

          /* ✅ UNA sola fuente de verdad para flecha */
          --arrowLen: 18px;         /* ⬅️ antes 20px (más corto) */
          --arrowLenHover: 46px;    /* ⬅️ antes 52px (más corto) */
          --arrowOverlap: 7.5px;      /* ⬅️ antes 6px (más soldada) */
        }
        .btnSecondary.btnSecondary14:hover {
          color: #111111;
          --arrowLen: var(--arrowLenHover);
        }

        /* =========================
           SHEEN (NO TOCAR) ✅
           ========================= */
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

        /* =========================
           FLECHA ✅ (más mini + más pegada + más soldada)
           ========================= */
        .btnSecondary14Arrow {
          position: relative;
          display: inline-block;
          width: 68px;
          height: 12px;
          margin-left: 6px;
          pointer-events: none;
        }

        /* Guion SVG: ancho controlado por --arrowLen */
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

        /* Punta SVG: se mueve EXACTAMENTE con el mismo --arrowLen */
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

      <div className="textureOverlay" />
      <div className="vignetteOverlay" />

      <BackgroundShape />

      <div className="heroInner">
        {/* Left Column: Premium Headline */}
        <div className="heroLeft">
          <span className={`eyebrow heroIntro ${mounted ? '' : 'opacity-0'}`}>
            FOR U.S. CONTRACTORS
          </span>
          <h1 className={`heroTitle heroIntro heroIntroDelay1 ${mounted ? '' : 'opacity-0'}`}>
            <span className="heroTitleStrong">Booked jobs.</span>
            <span className="heroTitleSoft">Built with Design & Technology.</span>
          </h1>
        </div>

        {/* Right Column: Editorial Copy & Subtle Features */}
        <div className="heroRight">
          <div className={`eyebrow heroIntro heroIntroDelay2 ${mounted ? '' : 'opacity-0'}`}>
            CONTRACTOR MARKETING
          </div>

          <p className={`heroRightCopy heroIntro heroIntroDelay2 ${mounted ? '' : 'opacity-0'}`}>
            More calls and estimates—then we turn them into booked jobs with a better website, faster replies, and automatic follow-ups.
          </p>

          <div className={`bilingualLine heroIntro heroIntroDelay3 ${mounted ? '' : 'opacity-0'}`}>
            English & Spanish. Same team.
          </div>

          <div className={`heroCtas heroIntro heroIntroDelay3 ${mounted ? '' : 'opacity-0'}`}>
            <button className="btnPrimary">
              Get a Free Growth Plan
            </button>

            <button className="btnSecondary btnSecondary14">
              <span className="btnSecondary14Text" data-text="View Our Work">
                View Our Work
              </span>

              {/* Flecha: línea + punta (ambas sincronizadas por --arrowLen) */}
              <span className="btnSecondary14Arrow" aria-hidden="true">
                {/* Línea (cap “butt” para que termine plano, sin gap) */}
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

                {/* Punta (empieza en x=0 para soldarse al final del guion) */}
                <svg
                  className="btnSecondary14ArrowHeadSvg"
                  viewBox="0 0 18 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M0 3 L12 8 L0 13"
                    vectorEffect="non-scaling-stroke" /* ✅ clave: igualar grosor con la línea */
                  />
                </svg>
              </span>
            </button>
          </div>

          {/* Marquee: A whisper, aligned under content, seamlessly looping */}
          <div className={`marquee heroIntro heroIntroDelay4 ${mounted ? '' : 'opacity-0'}`} aria-label="Services list" role="marquee">
            <div className="marqueeViewport">
              <div className="marqueeTrack">
                {seamlessMarquee.map((text, i) => (
                  <span key={`mq-${i}`} className="marqueeItem">
                    {text}
                    <span className="sepMark" aria-hidden="true">/</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
