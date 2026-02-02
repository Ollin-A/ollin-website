import React, { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { CompareRow, PackageTier } from "./packages.types";
import { PALETTE, LINE, LINE_SOFT } from "./packages.constants";
import { cx } from "./packages.utils";

const CHECK_SIZE = 16;

function CheckCell({ on }: { on: boolean }) {
    return (
        <div className="flex items-center justify-center">
            {on ? (
                <Check size={CHECK_SIZE} style={{ color: PALETTE.ink }} />
            ) : (
                <span style={{ color: PALETTE.muted }} className="text-sm">
                    —
                </span>
            )}
        </div>
    );
}

type Props = {
    packages: PackageTier[];
    rows: CompareRow[];
    activeId: string | null;
    onSelect: (id: string) => void;
};

export default function ComparisonSection({ packages, rows, activeId, onSelect }: Props) {
    const [comparisonOpen, setComparisonOpen] = useState(false);

    return (
        <div className="mt-16">
            <button
                type="button"
                onClick={() => setComparisonOpen((v) => !v)}
                className="w-full flex items-center justify-between border rounded-none px-6 py-5"
                style={{ borderColor: LINE, background: PALETTE.paper }}
            >
                <div className="text-left">
                    <div className="font-[Montserrat] font-semibold text-xl">What changes as you level up</div>
                    <div className="mt-1 text-sm" style={{ color: PALETTE.muted }}>
                        Quick glance. Open it if you want the details.
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em]" style={{ color: "rgba(0,0,0,0.65)" }}>
                    {comparisonOpen ? "Close" : "Open"}{" "}
                    <ChevronDown size={16} className={cx("transition-transform duration-500", comparisonOpen && "rotate-180")} />
                </div>
            </button>

            {comparisonOpen && (
                <div className="mt-5 overflow-x-auto">
                    <div className="min-w-[920px] border rounded-none" style={{ borderColor: LINE, background: PALETTE.paper }}>
                        <div className="grid" style={{ gridTemplateColumns: "340px repeat(4, 1fr)", borderBottom: `1px solid ${LINE_SOFT}` }}>
                            <div className="px-5 py-4 text-sm font-semibold" style={{ color: PALETTE.ink }}>
                                Feature
                            </div>

                            {packages.map((p) => {
                                const isActive = p.id === activeId;
                                return (
                                    <button
                                        key={`col-${p.id}`}
                                        type="button"
                                        onClick={() => onSelect(p.id)}
                                        className="px-5 py-4 text-left transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-black/[0.02]"
                                        style={{
                                            borderLeft: `1px solid ${LINE_SOFT}`,
                                            background: isActive ? "rgba(0,0,0,0.02)" : "transparent",
                                        }}
                                    >
                                        <div className="font-[Montserrat] font-semibold">{p.name}</div>
                                        <div className="mt-1 text-[11px] uppercase tracking-[0.22em]" style={{ color: isActive ? PALETTE.red : PALETTE.muted }}>
                                            {isActive ? "Active" : "Select"}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {rows.map((row, idx) => (
                            <div
                                key={row.key}
                                className="grid"
                                style={{
                                    gridTemplateColumns: "340px repeat(4, 1fr)",
                                    borderBottom: idx === rows.length - 1 ? "none" : `1px solid ${LINE_SOFT}`,
                                }}
                            >
                                <div className="px-5 py-4">
                                    <div className="font-semibold">{row.label}</div>
                                    {row.hint && (
                                        <div className="mt-1 text-xs" style={{ color: PALETTE.muted }}>
                                            {row.hint}
                                        </div>
                                    )}
                                </div>

                                {packages.map((p) => (
                                    <div key={`${row.key}-${p.id}`} className="px-5 py-4" style={{ borderLeft: `1px solid ${LINE_SOFT}` }}>
                                        <CheckCell on={!!row.values[p.id]} />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
