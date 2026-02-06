import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import BackgroundShape from './BackgroundShape';

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame
} from 'motion/react';

function useElementWidth<T extends HTMLElement>(ref: React.RefObject<T | null>): number {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      setWidth(el.getBoundingClientRect().width);
    };

    update();

    // ResizeObserver (mejor que solo window resize)
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(update);
      ro.observe(el);
    }

    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
      ro?.disconnect();
    };
  }, [ref]);

  return width;
}

function wrap(min: number, max: number, v: number): number {
  const range = max - min;
  const mod = (((v - min) % range) + range) % range;
  return mod + min;
}

type VelocityRowProps = {
  items: string[];
  baseVelocity: number;
  className?: string;
};

const VelocityRow: React.FC<VelocityRowProps> = ({ items, baseVelocity, className = '' }) => {
  const baseX = useMotionValue(0);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });

  // ✅ Suave (no se vuelve loco)
  const velocityFactor = useTransform(smoothVelocity, [0, 1200], [0, 2.4], { clamp: false });

  const copyRef = useRef<HTMLSpanElement>(null);
  const copyWidth = useElementWidth(copyRef);

  const x = useTransform(baseX, (v) => {
    if (copyWidth === 0) return '0px';
    return `${wrap(-copyWidth, 0, v)}px`;
  });

  const directionFactor = useRef<number>(1);

  useAnimationFrame((_t, delta) => {
    // base movement
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    // direction responds to scroll velocity sign
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;

    // add velocity factor
    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  const numCopies = 7;

  return (
    <motion.div className={`marqueeTrack ${className}`} style={{ x }}>
      {Array.from({ length: numCopies }).map((_, i) => (
        <span className="marqueeCopy" key={i} ref={i === 0 ? copyRef : null}>
          {items.map((txt, idx) => (
            <span className="marqueeItem" key={`${txt}-${idx}`}>
              {txt}
            </span>
          ))}
        </span>
      ))}
    </motion.div>
  );
};

const Hero: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Fila 1 (tu set original)
  const row1Items = [
    "REVIEW BOOST",
    "SOCIAL MEDIA",
    "BOOKED JOBS",
    "MORE CALLS",
    "BETTER WEBSITE",
    "FASTER REPLIES"
  ];

  // ✅ Fila 2 (mismo count = 6, pero “más servicios”)
  const row2Items = [
    "PROFESSIONAL LOGO",
    "BETTER IMAGE",
    "GET FOUND EASILY",
    "ORGANIC GROWTH",
    "BRANDING",
    "AUTOMATIC FOLLOW-UPS"
  ];

  return (
    <section className="hero">
      <style>{`
        /* =========================================================
           ✅ BOTÓN SECONDARY + FLECHA (tu versión)
           ========================================================= */
        .btnSecondary.btnSecondary14 {
          color: #6b6b6b;
          background: transparent;
          border: 0;
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          transition: color 280ms ease-out;

          --arrowLen: 18px;
          --arrowLenHover: 46px;
          --arrowOverlap: 7.5px;
        }
        .btnSecondary.btnSecondary14:hover {
          color: #111111;
          --arrowLen: var(--arrowLenHover);
        }

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

        .btnSecondary14Arrow {
          position: relative;
          display: inline-block;
          width: 68px;
          height: 12px;
          margin-left: 6px;
          pointer-events: none;
          flex: 0 0 auto;
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

        /* =========================================================
           ✅ NUEVO “ENGINE” DEL MARQUEE (SIN MOVER EL HERO)
           - Reusa tus clases: marquee / marqueeViewport / marqueeTrack / marqueeItem
           - 2 líneas
           - Sin "/" (solo aire)
           - Fade en bordes (mask)
           ========================================================= */

        .hero .marqueeViewport{
          /* mantiene lo tuyo pero aseguramos el fade sí o sí */
          overflow: hidden;
          width: 100%;

          /* ✅ fade edges como el que te gustó */
          -webkit-mask-image: linear-gradient(
            90deg,
            transparent 0%,
            rgba(0,0,0,1) 14%,
            rgba(0,0,0,1) 86%,
            transparent 100%
          );
          mask-image: linear-gradient(
            90deg,
            transparent 0%,
            rgba(0,0,0,1) 14%,
            rgba(0,0,0,1) 86%,
            transparent 100%
          );
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
        }

        .hero .marqueeLines{
          display: flex;
          flex-direction: column;
          gap: 8px; /* ✅ banda “más gruesa” pero sin inflar tamaño */
        }

        /* 🔥 Importantísimo: si tu CSS anterior animaba marqueeTrack, lo apagamos */
        .hero .marqueeTrack{
          animation: none !important;
          display: flex;
          align-items: center;
          white-space: nowrap;
          will-change: transform;
        }

        /* ✅ Mucho espacio entre items (sin /) */
        .hero .marqueeCopy{
          display: inline-flex;
          align-items: center;
          flex: 0 0 auto;
          gap: var(--mqGap, 56px);
          padding-right: var(--mqGap, 56px);
        }

        /* Mantén el tamaño/posición que ya te gustaba */
        .hero .marqueeItem{
          flex: 0 0 auto;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.22);
          line-height: 1.05;
        }

        /* Fila 2 un toque más suave */
        .hero .marqueeRow2 .marqueeItem{
          color: rgba(0,0,0,0.18);
        }

        /* =========================================================
           ✅ RESPONSIVE OVERRIDES (TU CÓDIGO, ajustado al nuevo gap)
           ========================================================= */

        @media (max-width: 1024px) {
          .hero .heroInner {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 20px !important;

            padding-left: 28px !important;
            padding-right: 28px !important;

            padding-top: 84px !important;
            padding-bottom: 56px !important;
          }

          .hero .heroLeft,
          .hero .heroRight {
            width: 100% !important;
            max-width: none !important;
            min-width: 0 !important;
          }

          .hero .heroTitleStrong {
            display: block !important;
            font-size: clamp(56px, 8.2vw, 78px) !important;
            line-height: 0.92 !important;
          }
          .hero .heroTitleSoft {
            display: block !important;
            margin-top: 10px !important;
            font-size: clamp(42px, 6.4vw, 60px) !important;
            line-height: 1.02 !important;
          }

          .hero .heroRightCopy {
            font-size: 18px !important;
            line-height: 1.6 !important;
            max-width: 60ch !important;
          }

          .hero .heroCtas {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 12px !important;
            margin-top: 18px !important;
            align-items: center !important;
          }

          .hero .marquee {
            position: relative !important;
            inset: auto !important;
            top: auto !important;
            right: auto !important;
            bottom: auto !important;
            left: auto !important;
            transform: none !important;
            margin-top: 18px !important;
            width: 100% !important;
          }

          /* ✅ gap ajustado en tablet */
          .hero { --mqGap: 44px; }
          .hero .marqueeItem {
            font-size: 12px !important;
            letter-spacing: 0.08em !important;
          }
        }

        @media (max-width: 640px) {
          .hero .heroInner {
            padding-left: 18px !important;
            padding-right: 18px !important;
            padding-top: 76px !important;
            padding-bottom: 44px !important;
            gap: 16px !important;
          }

          .hero .heroTitleStrong {
            font-size: clamp(44px, 11.2vw, 58px) !important;
            line-height: 0.94 !important;
          }
          .hero .heroTitleSoft {
            font-size: clamp(34px, 9.2vw, 46px) !important;
            line-height: 1.04 !important;
          }

          .hero .heroRightCopy {
            font-size: 16px !important;
            line-height: 1.65 !important;
            max-width: 46ch !important;
          }

          .hero .heroRight .heroCtas {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 12px !important;
          }
          .hero .heroRight .heroCtas .btnPrimary,
          .hero .heroRight .heroCtas .btnSecondary {
            width: 100% !important;
            justify-content: center !important;
          }

          .hero .btnSecondary14Arrow {
            width: 58px !important;
          }

          .hero .marquee {
            margin-top: 16px !important;
          }

          /* ✅ gap ajustado en mobile */
          .hero { --mqGap: 34px; }
        }

        @media (hover: none) and (pointer: coarse) {
          .btnSecondary.btnSecondary14 {
            --arrowLen: 32px;
          }
          .btnSecondary.btnSecondary14:active {
            color: #111111;
            --arrowLen: var(--arrowLenHover);
          }
          .btnSecondary.btnSecondary14:active .btnSecondary14Text::after {
            animation: ollinSheenOnceLR 720ms ease-out 1;
          }
        }
      `}</style>

      <div className="textureOverlay" />
      <div className="vignetteOverlay" />

      <BackgroundShape />

      <div className="heroInner">
        <div className="heroLeft">
          <span className={`eyebrow heroIntro ${mounted ? '' : 'opacity-0'}`}>
            FOR U.S. CONTRACTORS
          </span>

          <h1 className={`heroTitle heroIntro heroIntroDelay1 ${mounted ? '' : 'opacity-0'}`}>
            <span className="heroTitleStrong">Booked jobs.</span>
            <span className="heroTitleSoft">Built with Design & Technology.</span>
          </h1>
        </div>

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
                  <path
                    d="M0 3 L12 8 L0 13"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </span>
            </button>
          </div>

          {/* ✅ MISMO BLOQUE, MISMA POSICIÓN. Solo cambia el motor interno. */}
          <div
            className={`marquee heroIntro heroIntroDelay4 ${mounted ? '' : 'opacity-0'}`}
            aria-label="Services list"
            role="marquee"
          >
            <div className="marqueeViewport">
              <div className="marqueeLines">
                <VelocityRow items={row1Items} baseVelocity={60} className="marqueeRow1" />
                <VelocityRow items={row2Items} baseVelocity={-54} className="marqueeRow2" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
