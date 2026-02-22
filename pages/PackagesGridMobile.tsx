import React from "react";
import { Check } from "lucide-react";
import type { PackageTier } from "./packages.types";
import { PALETTE, LINE } from "./packages.constants";
import { cx } from "./packages.utils";

type Props = {
    packages: PackageTier[];
    onSelect: (id: string) => void;
};

const CHECK_SIZE = 16;

export default function PackagesGridMobile({ packages, onSelect }: Props) {
    return (
        <div className="mt-2 mb-8">
            {/* Scroll Container */}
            <div
                className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-6 pb-8 -mx-6 scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {packages.map((p) => (
                    <div
                        key={p.id}
                        className="flex-none w-[85vw] max-w-[320px] snap-center"
                    >
                        <button
                            type="button"
                            onClick={() => onSelect(p.id)}
                            className={cx(
                                "w-full text-left relative",
                                "border rounded-none",
                                "px-6 py-8 min-h-[380px] flex flex-col",
                                "transition-transform active:scale-[0.98]"
                            )}
                            style={{
                                borderColor: LINE,
                                background: PALETTE.paper,
                                boxShadow: "0 10px 35px rgba(0,0,0,0.06)",
                            }}
                        >
                            <div className="font-[Montserrat] font-semibold text-2xl leading-tight">
                                {p.name}
                            </div>

                            <p
                                className="mt-3 text-sm leading-relaxed"
                                style={{ color: PALETTE.muted }}
                            >
                                {p.oneLiner}
                            </p>

                            <ul className="mt-6 space-y-3 text-sm flex-1">
                                {p.bullets.slice(0, 4).map((b) => (
                                    <li key={b} className="flex items-start gap-3">
                                        <Check
                                            size={CHECK_SIZE}
                                            className="mt-[3px] shrink-0"
                                            style={{ color: "rgba(0,0,0,0.70)" }}
                                        />
                                        <span style={{ color: "rgba(0,0,0,0.78)" }}>
                                            {b}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8 pt-5 border-t w-full" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                                <div className="text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#111" }}>
                                    VIEW DETAILS →
                                </div>
                            </div>
                        </button>
                    </div>
                ))}

                {/* Spacer for right edge padding */}
                <div className="w-2 flex-none" />
            </div>
        </div>
    );
}