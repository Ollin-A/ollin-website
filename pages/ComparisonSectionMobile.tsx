import React, { useEffect, useState } from "react";
import { Check, ChevronRight, X } from "lucide-react";
import type { CompareRow, PackageTier } from "./packages.types";
import { LINE, LINE_SOFT, PALETTE } from "./packages.constants";
import { cx } from "./packages.utils";

type Props = {
    packages: PackageTier[];
    rows: CompareRow[];
};

const CHECK_SIZE = 16;

function CheckCell({ on }: { on: boolean }) {
    return (
        <div className="flex items-center justify-center w-full h-full">
            {on ? (
                <Check size={CHECK_SIZE} style={{ color: PALETTE.ink }} />
            ) : (
                <span style={{ color: "rgba(0,0,0,0.42)" }} className="text-sm leading-none">
                    —
                </span>
            )}
        </div>
    );
}

export default function ComparisonSectionMobile({ packages, rows }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    // Text colors
    const textMain = "rgba(0,0,0,0.86)";
    const textSub = "rgba(0,0,0,0.55)";
    const textMicro = "rgba(0,0,0,0.46)";

    // Lock body scroll
    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isOpen]);

    return (
        <div className="mt-8 mb-8">
            {/* Trigger (Same style as Desktop) */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={cx(
                    "w-full flex items-center justify-between px-6 py-5",
                    "border-x border-y rounded-none",
                    "transition-colors duration-200 active:bg-black/[0.04]"
                )}
                style={{ borderColor: LINE, background: "transparent" }}
            >
                <div className="text-left">
                    <div className="font-[Montserrat] font-medium text-xl leading-tight" style={{ color: textMain }}>
                        Compare all features
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em]" style={{ color: textMicro }}>
                    View <ChevronRight size={16} />
                </div>
            </button>

            {/* Mobile Fullscreen Drawer */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] bg-[#fdfdfd] flex flex-col">
                    {/* Header */}
                    <div className="flex-none px-5 py-4 border-b flex items-start justify-between gap-4 sticky top-0 bg-[#fdfdfd] z-20" style={{ borderColor: LINE_SOFT }}>
                        <div>
                            <div className="text-[10px] uppercase tracking-[0.22em]" style={{ color: textMicro }}>
                                Comparison
                            </div>
                            <div className="mt-1 font-[Montserrat] font-medium text-xl" style={{ color: textMain }}>
                                Comparison Table
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 -mr-2 text-black/40 active:text-black/80"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Scrollable Table Area */}
                    <div className="flex-1 overflow-auto relative bg-[#fdfdfd]">
                        <div className="min-w-fit pb-10">
                            {/* Table Header */}
                            <div className="flex sticky top-0 bg-[#fdfdfd] z-10 border-b" style={{ borderColor: LINE_SOFT }}>
                                {/* Sticky Col Header */}
                                <div className="sticky left-0 w-[140px] bg-[#fdfdfd] p-3 text-xs uppercase tracking-wider font-semibold border-r border-[#f0f0f0] shadow-[2px_0_10px_rgba(0,0,0,0.03)] z-20 flex items-end pb-3 text-black/40">
                                    Feature
                                </div>
                                {/* Package Headers */}
                                {packages.map((p) => (
                                    <div
                                        key={p.id}
                                        className="w-[100px] shrink-0 p-3 text-center flex items-end justify-center pb-3"
                                    >
                                        <div className="font-[Montserrat] font-semibold text-sm leading-tight text-[#111]">
                                            {p.name}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Table Body */}
                            <div className="divide-y" style={{ borderColor: LINE_SOFT }}>
                                {rows.map((row) => (
                                    <div key={row.key} className="flex">
                                        {/* Sticky Label */}
                                        <div className="sticky left-0 w-[140px] bg-[#fdfdfd] p-3 border-r border-[#f0f0f0] shadow-[2px_0_10px_rgba(0,0,0,0.03)] z-10 flex flex-col justify-center shrink-0">
                                            <span className="text-xs font-medium leading-snug text-[#111]">
                                                {row.label}
                                            </span>
                                            {row.hint && (
                                                <span className="text-[10px] leading-tight text-black/40 mt-0.5">
                                                    {row.hint}
                                                </span>
                                            )}
                                        </div>

                                        {/* Cells */}
                                        {packages.map((p) => (
                                            <div
                                                key={`${row.key}-${p.id}`}
                                                className="w-[100px] shrink-0 p-2 flex items-center justify-center bg-transparent"
                                            >
                                                <CheckCell on={!!row.values[p.id]} />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
