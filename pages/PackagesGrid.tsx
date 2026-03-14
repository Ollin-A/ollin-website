import React from "react";
import { Check } from "lucide-react";
import type { PackageTier } from "./packages.types";
import { PALETTE, LINE, LINE_SOFT } from "./packages.constants";
import { cx } from "./packages.utils";
import SecondaryButton from "../components/SecondaryButton";

type Props = {
  packages: PackageTier[];
  activeId: string | null;
  anySelected: boolean;
  onSelect: (id: string) => void;
};

const CHECK_SIZE = 16;

export default function PackagesGrid({
  packages,
  activeId,
  anySelected,
  onSelect,
}: Props) {
  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

      {packages.map((p) => {
        const isActive = p.id === activeId;
        const isDimmed = anySelected && !isActive;
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
              borderColor: LINE,
              background: PALETTE.paper,
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
              <SecondaryButton
                label="VIEW DETAILS"
                variant="details"
                style={{ ["--arrowLen" as any]: arrowLen }}
                ariaHidden
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}