import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type Tile = {
  id: string;
  tag: "BASELINE" | "GROWTH";
  title: string;
  desc: string;
  bullets: readonly string[];
  imageSrc: string;
  imageAlt: string;

  mobPos?: string; 
};

const PricingSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement | null>(null);
    const navigate = useNavigate();

  const didIntroRef = useRef(false);

  const reduceMotionRef = useRef(false);

  const handleCTA = () => {
    navigate("/packages/personalized");
  };

  const tiles = useMemo<Tile[]>(
    () => [
      {
        id: "website",
        tag: "BASELINE",
        title: "Start with a Website",
        desc: "Look legit fast and make it easy to request an estimate.",
        bullets: ["Clear services + photos", "Proof that builds trust", "Simple call / request flow"],
        imageSrc: "https://i.imgur.com/2MqLbtm.jpeg",
        imageAlt: "A laptop showing a website",
        mobPos: "50% 50%",
      },
      {
        id: "social",
        tag: "BASELINE",
        title: "Start with Social",
        desc: "Stay visible so people remember you when they need the job done.",
        bullets: ["Consistent posts that look professional", "Simple plan: what to post + when", "Turn DMs into inquiries"],
        imageSrc: "https://i.imgur.com/8xpnHT8.jpeg",
        imageAlt: "A phone showing social content",
        mobPos: "50% 20%",
      },
      {
        id: "pipeline",
        tag: "GROWTH",
        title: "Install the Full Pipeline",
        desc: "More calls, fewer missed leads, more booked work.",
        bullets: ["Show up on Maps + run call ads", "Fast replies + follow-ups", "Weekly improvements based on results"],
        imageSrc: "https://i.imgur.com/4TypqoM.jpeg",
        imageAlt: "A map/location concept",
        mobPos: "50% 45%",
      },
    ],
    []
  );

  const [openId, setOpenId] = useState<string | null>(null);
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  const [teaseOn, setTeaseOn] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isTouchLike, setIsTouchLike] = useState(false);
  const [canHoverFine, setCanHoverFine] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    reduceMotionRef.current = reduceMotion;
  }, [reduceMotion]);

  const flipTile = (id: string) => {
    setAnimatingId(id);
    setOpenId((prev) => (prev === id ? null : id));

    window.setTimeout(() => {
      setAnimatingId((curr) => (curr === id ? null : curr));
    }, 820);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mqHoverFine = window.matchMedia?.("(hover: hover) and (pointer: fine)");
    const mqNoHover = window.matchMedia?.("(hover: none)");
    const mqReduce = window.matchMedia?.("(prefers-reduced-motion: reduce)");

    const update = () => {
      setCanHoverFine(!!mqHoverFine?.matches);
      setIsTouchLike(!!mqNoHover?.matches || (navigator?.maxTouchPoints ?? 0) > 0);
      setReduceMotion(!!mqReduce?.matches);
    };

    update();
    mqHoverFine?.addEventListener?.("change", update);
    mqNoHover?.addEventListener?.("change", update);
    mqReduce?.addEventListener?.("change", update);

    return () => {
      mqHoverFine?.removeEventListener?.("change", update);
      mqNoHover?.removeEventListener?.("change", update);
      mqReduce?.removeEventListener?.("change", update);
    };
  }, []);

  // ✅ Tease + Hint cuando la sección entra al viewport (esto arregla mobile)
  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec || typeof window === "undefined") return;

    const runIntro = () => {
      if (didIntroRef.current) return;
      didIntroRef.current = true;

      // hint SIEMPRE
      setShowHint(true);
      window.setTimeout(() => setShowHint(false), 2600);

      // micro-tease SOLO si no reduce motion
      if (!reduceMotionRef.current) {
        setTeaseOn(true);
        window.setTimeout(() => setTeaseOn(false), 900);
      }
    };

    // Si ya está visible de entrada (desktop), corre inmediato
    const r = sec.getBoundingClientRect();
    const vh = window.innerHeight || 0;
    const initiallyVisible = r.top < vh * 0.85 && r.bottom > vh * 0.15;
    if (initiallyVisible) {
      // pequeño delay para evitar “flicker” al montar
      const t = window.setTimeout(runIntro, 250);
      return () => window.clearTimeout(t);
    }

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          runIntro();
          obs.disconnect();
        }
      },
      {
        // entra “antes” para que en mobile lo alcances a ver
        rootMargin: "-10% 0px -25% 0px",
        threshold: [0, 0.1, 0.2],
      }
    );

    obs.observe(sec);
    return () => obs.disconnect();
  }, []);

  // ESC closes
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenId(null);
        setAnimatingId(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Auto-close when leaving section
  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec || typeof window === "undefined") return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.intersectionRatio < 0.2) {
          setOpenId(null);
          setAnimatingId(null);
        }
      },
      { threshold: [0, 0.2, 0.35, 0.5, 1] }
    );

    obs.observe(sec);
    return () => obs.disconnect();
  }, []);

  // Tilt vars set on TILE; actual transform happens inside (more stable)
  const onMoveTilt = (e: React.MouseEvent<HTMLElement>) => {
    if (!canHoverFine || reduceMotion) return;
    const tile = e.currentTarget as HTMLElement;
    if (tile.getAttribute("data-open") === "true") return;

    const rr = tile.getBoundingClientRect();
    const px = (e.clientX - rr.left) / rr.width;
    const py = (e.clientY - rr.top) / rr.height;
    const ry = (px - 0.5) * 6;
    const rx = (0.5 - py) * 6;

    tile.style.setProperty("--rx", `${rx}deg`);
    tile.style.setProperty("--ry", `${ry}deg`);
  };

  const onLeaveTilt = (e: React.MouseEvent<HTMLElement>) => {
    const tile = e.currentTarget as HTMLElement;
    tile.style.setProperty("--rx", `0deg`);
    tile.style.setProperty("--ry", `0deg`);
  };

  const onClickTile = (e: React.MouseEvent<HTMLElement>, id: string) => {
    const tile = e.currentTarget as HTMLElement;
    tile.style.setProperty("--rx", `0deg`);
    tile.style.setProperty("--ry", `0deg`);
    flipTile(id);
  };

  return (
    <section
      id="pricing-preview"
      ref={sectionRef}
      className="relative w-full bg-[#F2F2F2] text-ollin-black py-20 md:py-28"
    >
      <div className="max-w-[1500px] mx-auto px-[5vw] w-full">
        {/* Top copy */}
        <div className="max-w-[980px]">
          <h3 className="text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.02] font-medium">
            Pick your starting point. We’ll build the rest when you’re ready.
          </h3>

          <p className="mt-5 text-base md:text-lg leading-snug text-ollin-black/70 max-w-[760px]">
            Most contractors start with a website or social. That’s fine. When you want more calls and booked jobs, we add the growth
            pieces—step by step.
          </p>
        </div>

        {/* Flip Tiles */}
        <div className="mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiles.map((t, idx) => {
            const isOpen = openId === t.id;
            const isAnim = animatingId === t.id;

            return (
              <article
                key={t.id}
                data-open={isOpen ? "true" : "false"}
                data-anim={isAnim ? "true" : "false"}
                className={["ollinFlipTile", "relative", "min-h-[250px]", "outline-none"].join(" ")}
                style={{
                  ["--delay" as any]: `${idx * 140}ms`,
                  ["--mobPos" as any]: t.mobPos ?? "50% 50%",
                }}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onClick={(e) => onClickTile(e, t.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    const tile = e.currentTarget as HTMLElement;
                    tile.style.setProperty("--rx", `0deg`);
                    tile.style.setProperty("--ry", `0deg`);
                    flipTile(t.id);
                  }
                }}
                onMouseMove={onMoveTilt}
                onMouseLeave={onLeaveTilt}
              >
                <div className="ollinClip">
                  <div className="ollinStage">
                    <div className="ollinTilt">
                      <div className={["ollinTease", teaseOn ? "isTeasing" : ""].join(" ")}>
                        <div className={["ollinFlipCore", isOpen ? "isFlipped" : ""].join(" ")}>
                          <div className="ollinEdgeR" aria-hidden="true" />
                          <div className="ollinEdgeL" aria-hidden="true" />

                          {/* FRONT */}
                          <div className="ollinFace ollinFront">
                            <img
                              src={t.imageSrc}
                              alt={t.imageAlt}
                              loading="lazy"
                              decoding="async"
                              className="ollinFrontImg absolute inset-0 h-full w-full object-cover"
                            />

                            <div className="absolute inset-x-0 bottom-0 p-5 bg-linear-to-t from-black/60 via-black/25 to-transparent">
                              <div className={["ollinHint", showHint ? "isShow" : ""].join(" ")}>
                                {isTouchLike ? "Tap to flip" : "Click for details"}
                              </div>
                            </div>
                          </div>

                          {/* BACK */}
                          <div className="ollinFace ollinBack">
                            <div className="inline-flex items-center gap-2">
                              <span
                                className={[
                                  "text-[11px] font-semibold tracking-[0.18em] uppercase",
                                  "px-3 py-2",
                                  "border border-black/10",
                                  "text-ollin-black/55",
                                  "bg-black/2",
                                ].join(" ")}
                              >
                                {t.tag}
                              </span>
                            </div>

                            <div className="mt-4 text-[17px] md:text-[18px] font-medium tracking-tight text-ollin-black/90">
                              {t.title}
                            </div>

                            <div className="mt-1.5 text-[13px] md:text-[14px] leading-snug text-ollin-black/65 max-w-[56ch]">
                              {t.desc}
                            </div>

                            <ul className="mt-4 space-y-1.5 text-[13px] md:text-[14px] text-ollin-black/70">
                              {t.bullets.map((b) => (
                                <li key={b} className="flex gap-2">
                                  <span className="mt-[9px] h-[5px] w-[5px] rounded-none bg-black/20 shrink-0" />
                                  <span className="leading-snug">{b}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom line + CTA */}
        <div className={["mt-10 md:mt-12", "flex flex-col", "lg:flex-row lg:items-center lg:justify-between", "gap-6"].join(" ")}>
          <div className="text-sm md:text-[15px] text-ollin-black/65">
            <span className="text-ollin-black/80 font-medium">Everything is modular.</span> Start Baseline. Add Growth when you want
            faster results.
          </div>

          <button type="button" onClick={handleCTA} className="btnSecondary btnSecondary14 self-center lg:self-auto">
            <span className="btnSecondary14Text" data-text="Build your plan">
              Build your plan
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
      </div>

      <style>{`
        :root{
          --ollin-paper: #f2efe9;
          --ollin-thickness: 12px;
        }

        /* ✅ Mobile/tablet: usa el focal point por tile
           ✅ Desktop (lg+): vuelve a center (NO cambia tu estética desktop) */
        .ollinFrontImg{
          object-position: var(--mobPos, 50% 50%);
        }
        @media (min-width: 1024px){
          .ollinFrontImg{
            object-position: 50% 50%;
          }
        }

        /* =========================
           Secondary Button v14
           ========================= */
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

        /* =========================
           Pricing Flip Tiles
           ========================= */
        .ollinFlipTile{
          --rx: 0deg;
          --ry: 0deg;

          border: none !important;
          border-radius: 0 !important;
          outline: none;

          background: transparent;
          box-shadow: 0 8px 22px rgba(0,0,0,.06);
          transition: box-shadow 180ms ease;

          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        @media (hover:hover) and (pointer:fine){
          .ollinFlipTile:hover{
            box-shadow: 0 14px 36px rgba(0,0,0,.10);
          }
        }

        .ollinClip{
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: 0 !important;
          background: transparent;
        }

        .ollinStage{
          position: absolute;
          inset: 0;
          perspective: 1200px;
          perspective-origin: 50% 50%;
          background: transparent;
        }

        .ollinTilt{
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          transform: rotateX(var(--rx)) rotateY(var(--ry));
          transition: transform 180ms ease;
          will-change: transform;
        }

        .ollinTease{
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
        }
        .ollinTease.isTeasing{
          animation: ollinTease 520ms ease-in-out var(--delay) 1;
        }
        @keyframes ollinTease{
          0%{ transform: rotateY(0deg); }
          45%{ transform: rotateY(16deg); }
          100%{ transform: rotateY(0deg); }
        }

        .ollinFlipCore{
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          transition: transform 760ms cubic-bezier(.18,.9,.22,1);
          will-change: transform;
        }
        .ollinFlipCore.isFlipped{
          transform: rotateY(180deg);
        }

        .ollinFace,
        .ollinFace *{
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .ollinFace{
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          border-radius: 0 !important;
        }

        .ollinFront{
          transform: rotateY(0deg) translateZ(calc(var(--ollin-thickness) / 2));
          background: #fff;
        }

        .ollinBack{
          transform: rotateY(180deg) translateZ(calc(var(--ollin-thickness) / 2));
          background: #fff;
          padding: 24px 24px;
        }

        .ollinEdgeR,
        .ollinEdgeL{
          position: absolute;
          top: 0;
          width: var(--ollin-thickness);
          height: 100%;
          pointer-events: none;
          transform-style: preserve-3d;

          background: linear-gradient(
            to right,
            rgba(0,0,0,.18),
            rgba(0,0,0,.06),
            rgba(0,0,0,.18)
          );

          opacity: 0;
          transition: opacity 120ms linear;

          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .ollinEdgeR{
          right: 0;
          transform-origin: right center;
          transform: rotateY(90deg) translateZ(calc(var(--ollin-thickness) / 2));
        }

        .ollinEdgeL{
          left: 0;
          transform-origin: left center;
          transform: rotateY(-90deg) translateZ(calc(var(--ollin-thickness) / 2));
        }

        .ollinFlipTile[data-anim="true"] .ollinEdgeR,
        .ollinFlipTile[data-anim="true"] .ollinEdgeL{
          opacity: .95;
        }

        .ollinHint{
          display: inline-flex;
          margin-top: 10px;
          font-size: 12px;
          padding: 6px 10px;
          border-radius: 0;
          border: 1px solid rgba(255,255,255,.22);
          background: rgba(0,0,0,.18);
          color: rgba(255,255,255,.84);
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 240ms ease, transform 240ms ease;
        }
        .ollinHint.isShow{
          opacity: 1;
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce){
          .ollinTilt,
          .ollinFlipCore,
          .ollinHint{
            transition: none !important;
          }
          .ollinTease.isTeasing{
            animation: none !important;
          }
          .ollinEdgeR,
          .ollinEdgeL{
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default PricingSection;
