import React, { useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";

type Props = {
  row1: string[];
  row2: string[];
  velocity?: number;
  className?: string;
};

function useElementWidth<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
): number {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const update = () => {
      if (ref.current) setWidth(ref.current.offsetWidth);
    };
    update();

    const t = window.setTimeout(update, 50);

    window.addEventListener("resize", update);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", update);
    };
  }, [ref]);

  return width;
}

function wrap(min: number, max: number, v: number): number {
  const range = max - min;
  const mod = (((v - min) % range) + range) % range;
  return mod + min;
}

const VelocityLine: React.FC<{
  items: string[];
  baseVelocity: number;
  reverse?: boolean;
}> = ({ items, baseVelocity, reverse = false }) => {
  const baseX = useMotionValue(0);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  const velocityFactor = useTransform(smoothVelocity, [0, 1200], [0, 3.5], {
    clamp: false,
  });

  const copyRef = useRef<HTMLSpanElement>(null);
  const copyWidth = useElementWidth(copyRef);

  const x = useTransform(baseX, (v) => {
    if (!copyWidth) return "0px";
    return `${wrap(-copyWidth, 0, v)}px`;
  });

  const directionFactor = useRef<number>(reverse ? -1 : 1);

  useAnimationFrame((_t, delta) => {

    const dt = delta / 1000;

    let moveBy = directionFactor.current * baseVelocity * dt;

    if (velocityFactor.get() < 0) directionFactor.current = reverse ? 1 : -1;
    if (velocityFactor.get() > 0) directionFactor.current = reverse ? -1 : 1;

    moveBy += directionFactor.current * Math.abs(moveBy) * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  const numCopies = 7;

  const Copy = ({ isFirst }: { isFirst?: boolean }) => (
    <span className="hvCopy" ref={isFirst ? copyRef : null}>
      {items.map((txt, idx) => (
        <span className="hvItem" key={`${txt}-${idx}`}>
          {txt}
        </span>
      ))}
    </span>
  );

  return (
    <div className="hvLine">
      <motion.div className="hvScroller" style={{ x }}>
        {Array.from({ length: numCopies }).map((_, i) => (
          <Copy key={i} isFirst={i === 0} />
        ))}
      </motion.div>
    </div>
  );
};

const HeroScrollVelocity: React.FC<Props> = ({
  row1,
  row2,
  velocity = 62,
  className = "",
}) => {
  return (
    <div className={`hvWrap ${className}`}>
      <style>{`
        .hvWrap{
          position: relative;
          width: 100%;
          margin-top: 22px; 
        }

        .hvBand{
          position: relative;
          overflow: hidden;
          padding: 10px 0;
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
        }

        .hvLine{
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 6px 0;
        }

        .hvScroller{
          display: flex;
          align-items: center;
          white-space: nowrap;
          will-change: transform;
        }

        .hvCopy{
          display: inline-flex;
          align-items: center;
          flex: 0 0 auto;
          gap: 56px;
          padding-right: 56px; 
        }

        .hvItem{
          flex: 0 0 auto;
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.26);
        }

        .hvRow2 .hvItem{
          color: rgba(0,0,0,0.20);
        }

        @media (max-width: 1024px){
          .hvCopy{ gap: 44px; padding-right: 44px; }
          .hvItem{ font-size: 11.5px; letter-spacing: 0.17em; }
        }
        @media (max-width: 640px){
          .hvWrap{ margin-top: 16px; }
          .hvCopy{ gap: 34px; padding-right: 34px; }
          .hvItem{ font-size: 11px; letter-spacing: 0.16em; }
          .hvBand{ padding: 8px 0; }
        }

        @media (prefers-reduced-motion: reduce){
          .hvScroller{ transform: none !important; }
        }
      `}</style>

      <div className="hvBand" aria-label="Scrolling services">

        <VelocityLine items={row1} baseVelocity={velocity} reverse={false} />

        <div className="hvRow2">
          <VelocityLine
            items={row2}
            baseVelocity={velocity * 0.9}
            reverse={true}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroScrollVelocity;
