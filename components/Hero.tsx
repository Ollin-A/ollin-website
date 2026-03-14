import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import BackgroundShape from "./BackgroundShape";
import SecondaryButton from "./SecondaryButton";
import { useLeadModal } from "./LeadModalContext";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";

function useElementWidth<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
): number {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => setWidth(el.getBoundingClientRect().width);

    update();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(update);
      ro.observe(el);
    }

    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
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

const VelocityRow: React.FC<VelocityRowProps> = ({
  items,
  baseVelocity,
  className = "",
}) => {
  const baseX = useMotionValue(0);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  const velocityFactor = useTransform(smoothVelocity, [0, 1200], [0, 2.4], {
    clamp: false,
  });

  const copyRef = useRef<HTMLSpanElement>(null);
  const copyWidth = useElementWidth(copyRef);

  const x = useTransform(baseX, (v) => {
    if (copyWidth === 0) return "0px";
    return `${wrap(-copyWidth, 0, v)}px`;
  });

  const directionFactor = useRef<number>(1);

  useAnimationFrame((_t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;

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
  const { openModal } = useLeadModal();

  useEffect(() => setMounted(true), []);

  const row1Items = [
    "REVIEW BOOST",
    "SOCIAL MEDIA",
    "BOOKED JOBS",
    "MORE CALLS",
    "BETTER WEBSITE",
    "FASTER REPLIES",
  ];
  const row2Items = [
    "PROFESSIONAL LOGO",
    "BETTER IMAGE",
    "GET FOUND EASILY",
    "ORGANIC GROWTH",
    "BRANDING",
    "AUTOMATIC FOLLOW-UPS",
  ];

  return (
    <section className="hero heroOLLIN" style={{ backgroundColor: "#F2F2F2" }}>
      <style>{`
        .heroOLLIN{
          min-height: 100svh;
          min-height: 100dvh;
          min-height: 100vh;
          position: relative;
          --heroMobileTighten: 78px;
        }

        .heroOLLIN{
          padding-top: env(safe-area-inset-top, 0px);
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }

        @media (min-width: 768px){
          .heroOLLIN{
            --heroDesktopPeek: clamp(72px, 8vh, 120px);
            --heroDesktopReserve: clamp(170px, 16vh, 260px);

            padding-bottom: var(--heroDesktopReserve) !important;
            margin-bottom: calc(-1 * var(--heroDesktopPeek)) !important;
          }

          .heroDesktop .heroInner{
            padding-top: clamp(130px, 12vh, 200px) !important;
          }
        }

        @media (min-width: 768px) and (max-height: 760px){
          .heroDesktop .heroInner{
            padding-top: clamp(96px, 9vh, 140px) !important;
          }
          .heroOLLIN{
            --heroDesktopPeek: clamp(64px, 8vh, 100px);
            --heroDesktopReserve: clamp(150px, 14vh, 220px);
          }
        }

        .hero .marqueeViewport{
          overflow: hidden;
          width: 100%;
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
          gap: 8px;
        }

        .hero .marqueeTrack{
          animation: none !important;
          display: flex;
          align-items: center;
          white-space: nowrap;
          will-change: transform;
        }

        .hero .marqueeCopy{
          display: inline-flex;
          align-items: center;
          flex: 0 0 auto;
          gap: var(--mqGap, 56px);
          padding-right: var(--mqGap, 56px);
        }

        .hero .marqueeItem{
          flex: 0 0 auto;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.22);
          line-height: 1.05;
        }

        .hero .marqueeRow2 .marqueeItem{
          color: rgba(0,0,0,0.18);
        }

        .heroMobile{ display:none; }
        @media (max-width: 767px){
          .heroDesktop{ display:none !important; }
          .heroMobile{ display:block !important; height: 100%; }

          .heroOLLIN{
            --heroMobilePeek: clamp(40px, 8vh, 80px);
            --heroMobileReserve: clamp(20px, 4vh, 40px);

            padding-bottom: var(--heroMobileReserve) !important;
            margin-bottom: calc(-1 * var(--heroMobilePeek)) !important;
          }

          .heroMobileInner{
            position: relative;
            z-index: 20;
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100%;
            min-height: calc(100vh - var(--heroMobileReserve) - var(--heroMobilePeek));
            padding-left: 18px;
            padding-right: 18px;
            padding-bottom: 24px;
          }

          .heroMobileBlurb{
            max-width: 300px;
            margin-left: auto;
            margin-right: 12px;
            margin-top: 20px;
            margin-bottom: 40px;
          }

          .heroMobileKicker{
            font-size: 11px;
            letter-spacing: 0.26em;
            text-transform: uppercase;
            color: rgba(0,0,0,0.28);
            margin-bottom: 10px;
          }
          .heroMobileCopy{
            font-size: 15px;
            line-height: 1.5;
            letter-spacing: 0.02em;
            color: rgba(0,0,0,0.80);
          }

          .heroMobileTitle{
            margin-top: 0;
            padding-right: 6px;
          }

          .heroMobileTitleGrid{
            position: relative;
            display: grid;
            grid-template-columns: 1fr;
            row-gap: 4px;
          }

          .heroMobileWord1{
            font-family: Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
            font-weight: 600;
            letter-spacing: -0.02em;
            font-size: clamp(58px, 13vw, 84px);
            line-height: 0.9;
            color: #111;
          }

          .heroMobileAmp{
            opacity: 0;
            font-family: Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
            font-weight: 600;
            letter-spacing: -0.02em;
            font-size: clamp(62px, 14vw, 92px);
            line-height: 0.8;
            height: 0.95em;
          }

          .heroMobileTitleGrid::after{
            content: "&";
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);

            font-family: Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
            font-weight: 600;
            letter-spacing: -0.02em;
            font-size: clamp(62px, 14vw, 92px);
            line-height: 0.8;
            color: rgba(0,0,0,0.18);

            pointer-events: none;
          }

          .heroMobileWord2{
            font-family: Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
            font-weight: 600;
            letter-spacing: -0.02em;
            font-size: clamp(58px, 13vw, 84px);
            line-height: 0.9;
            color: #111;
            justify-self: end;

            transform: translateY(-2px);
          }
        }

      `}</style>

      <div className="textureOverlay" />
      <div className="vignetteOverlay" />
      <BackgroundShape />

      <div className={`heroMobile ${mounted ? "" : "opacity-0"}`}>
        <div className="heroMobileInner">
          <div className="heroMobileBlurb">
            <div className="heroMobileKicker">CONTRACTOR MARKETING</div>
            <div className="heroMobileCopy">
              More calls + estimates—turned into booked jobs.
            </div>
          </div>

          <div className="heroMobileTitle" aria-label="Hero headline">
            <div className="heroMobileTitleGrid">
              <div className="heroMobileWord1">Design</div>
              <div className="heroMobileAmp">&amp;</div>
              <div className="heroMobileWord2">Systems</div>
            </div>
          </div>
        </div>
      </div>

      <div className="heroDesktop">
        <div className="heroInner">
          <div className="heroLeft">
            <span className={`eyebrow heroIntro ${mounted ? "" : "opacity-0"}`}>
              FOR U.S. CONTRACTORS
            </span>

            <h1
              className={`heroTitle heroIntro heroIntroDelay1 ${mounted ? "" : "opacity-0"}`}
            >
              <span className="heroTitleStrong">Booked jobs.</span>
              <span className="heroTitleSoft">
                Built with Design &amp; Systems.
              </span>
            </h1>
          </div>

          <div className="heroRight">
            <div
              className={`eyebrow heroIntro heroIntroDelay2 ${mounted ? "" : "opacity-0"}`}
            >
              CONTRACTOR MARKETING
            </div>

            <p
              className={`heroRightCopy heroIntro heroIntroDelay2 ${mounted ? "" : "opacity-0"}`}
            >
              More calls and estimates—then we turn them into booked jobs with a
              better website, faster replies, and automatic follow-ups.
            </p>

            <div
              className={`bilingualLine heroIntro heroIntroDelay3 ${mounted ? "" : "opacity-0"}`}
            >
              English &amp; Spanish. Same team.
            </div>

            <div
              className={`heroCtas heroIntro heroIntroDelay3 ${mounted ? "" : "opacity-0"}`}
            >
              <button onClick={openModal} className="btnPrimary">Get a Free Growth Plan</button>

              <SecondaryButton to="/packages" label="View Our Plans" />
            </div>

            <div
              className={`marquee heroIntro heroIntroDelay4 ${mounted ? "" : "opacity-0"}`}
              aria-label="Services list"
              role="marquee"
            >
              <div className="marqueeViewport">
                <div className="marqueeLines">
                  <VelocityRow
                    items={row1Items}
                    baseVelocity={60}
                    className="marqueeRow1"
                  />
                  <VelocityRow
                    items={row2Items}
                    baseVelocity={-54}
                    className="marqueeRow2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;