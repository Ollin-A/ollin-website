import React from "react";
import { Check } from "lucide-react";
import type { PackageTier } from "./packages.types";
import { PALETTE, LINE, LINE_SOFT } from "./packages.constants";
import { cx } from "./packages.utils";

type Props = {
  packages: PackageTier[];
  activeId: string | null;
  anySelected: boolean;
  onSelect: (id: string) => void;
};

const CHECK_SIZE = 16;
const DETAILS_CTA_CSS = `
  .packagesGridCtas .btnSecondary.btnSecondary14 {
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
  .packagesGridCtas .btnSecondary.btnSecondary14:hover {
    color: #111111;
    --arrowLen: var(--arrowLenHover);
  }

  /* sheen (igual que tu ejemplo) */
  .packagesGridCtas .btnSecondary14Text {
    position: relative;
    display: inline-block;
    line-height: 1;
  }
  .packagesGridCtas .btnSecondary14Text::after {
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
  .packagesGridCtas .btnSecondary.btnSecondary14:hover .btnSecondary14Text::after {
    animation: ollinSheenOnceLR 720ms ease-out 1;
  }

  /* arrow (igual que tu ejemplo) */
  .packagesGridCtas .btnSecondary14Arrow {
    position: relative;
    display: inline-block;
    width: 56px; /* compact */
    height: 11px;
    margin-left: 6px;
    pointer-events: none;
  }
  .packagesGridCtas .btnSecondary14ArrowLineSvg {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: var(--arrowLen);
    height: 11px;
    overflow: visible;
    transition: width 380ms cubic-bezier(0.2, 0.7, 0.2, 1);
    will-change: width;
  }
  .packagesGridCtas .btnSecondary14ArrowHeadSvg {
    position: absolute;
    left: 0;
    top: 50%;
    width: 12px;
    height: 11px;
    transform: translate3d(calc(var(--arrowLen) - var(--arrowOverlap)), -50%, 0);
    transition: transform 380ms cubic-bezier(0.2, 0.7, 0.2, 1);
    will-change: transform;
  }

  /* details variant (para que se vea como “View details”) */
  .packagesGridCtas .btnSecondary14--details {
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    font-weight: 600;
  }

  @media (prefers-reduced-motion: reduce) {
    .packagesGridCtas .btnSecondary.btnSecondary14 { transition: none !important; }
    .packagesGridCtas .btnSecondary14ArrowLineSvg,
    .packagesGridCtas .btnSecondary14ArrowHeadSvg { transition: none !important; }
    .packagesGridCtas .btnSecondary.btnSecondary14:hover .btnSecondary14Text::after { animation: none !important; }
  }
`;

export default function PackagesGrid({
  packages,
  activeId,
  anySelected,
  onSelect,
}: Props) {
  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 packagesGridCtas">
      <style>{DETAILS_CTA_CSS}</style>

      {packages.map((p) => {
        const isActive = p.id === activeId;
        const isDimmed = anySelected && !isActive;

        // 👇 esto hace que la flecha se quede “larga” cuando está activo
        const arrowLen = isActive ? "46px" : "18px";

        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p.id)}
            aria-pressed={isActive}
            className={cx(
              "group relative text-left",
              "border rounded-none",
              "px-7 py-8 min-h-[240px]",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20",
              "transition-[transform,opacity,box-shadow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
              "hover:-translate-y-1",
            )}
            style={{
              // ✅ NO cambia color por estar activo
              borderColor: LINE,
              background: PALETTE.paper,
              // ✅ “selección” solo por sombra (sin “wash”)
              boxShadow: isActive
                ? "0 18px 55px rgba(0,0,0,0.10)"
                : "0 10px 35px rgba(0,0,0,0.06)",
              opacity: isDimmed ? 0.72 : 1,
            }}
          >
            <div className="font-[Montserrat] font-semibold text-2xl leading-tight">
              {p.name}
            </div>

            <p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: isDimmed ? "rgba(0,0,0,0.50)" : PALETTE.muted }}
            >
              {p.oneLiner}
            </p>

            <ul className="mt-6 space-y-2 text-sm">
              {p.bullets.slice(0, 3).map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <Check
                    size={CHECK_SIZE}
                    className="mt-[3px] shrink-0"
                    style={{ color: "rgba(0,0,0,0.70)" }}
                  />
                  <span
                    style={{
                      color: isDimmed ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.78)",
                    }}
                  >
                    {b}
                  </span>
                </li>
              ))}
            </ul>

            <div
              className="mt-8 pt-5 border-t"
              style={{ borderColor: LINE_SOFT }}
            >
              {/* ✅ “View details” con flecha estilo tu botón */}
              <button
                type="button"
                className="btnSecondary btnSecondary14 btnSecondary14--details"
                // IMPORTANT: no cambia color al estar activo; solo fija la longitud del arrow
                style={{ ["--arrowLen" as any]: arrowLen }}
                tabIndex={-1}
                aria-hidden="true"
              >
                <span className="btnSecondary14Text" data-text="VIEW DETAILS">
                  VIEW DETAILS
                </span>

                <span className="btnSecondary14Arrow" aria-hidden="true">
                  <svg
                    className="btnSecondary14ArrowLineSvg"
                    viewBox="0 0 100 16"
                    fill="none"
                  >
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
          </button>
        );
      })}
    </div>
  );
}
