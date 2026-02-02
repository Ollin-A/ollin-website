import React, { useLayoutEffect, useRef, useState } from "react";
import type { PackageTier } from "./packages.types";
import { PALETTE, LINE, LINE_SOFT } from "./packages.constants";
import { cx } from "./packages.utils";

type Props = {
    activeId: string | null;
    panelPkg: PackageTier;
    outerRef: React.RefObject<HTMLDivElement | null>;
    onRequestScope: (packageId: string) => void;
    onBuildYourOwnPlan: () => void;
};

export default function PackageDetailSheet({
    activeId,
    panelPkg,
    outerRef,
    onRequestScope,
    onBuildYourOwnPlan,
}: Props) {
    const innerRef = useRef<HTMLDivElement | null>(null);
    const [panelHeight, setPanelHeight] = useState<number>(0);

    useLayoutEffect(() => {
        if (!innerRef.current) return;
        if (activeId) setPanelHeight(innerRef.current.scrollHeight);
        else setPanelHeight(0);
    }, [activeId, panelPkg]);

    return (
        <div ref={outerRef} className="mt-6">
            <div
                className="overflow-hidden transition-[height] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ height: panelHeight }}
            >
                <div
                    ref={innerRef}
                    className="border rounded-none px-7 py-8"
                    style={{
                        borderColor: LINE,
                        background: PALETTE.paper,
                        color: PALETTE.ink,
                        opacity: activeId ? 1 : 0,
                        transform: activeId ? "translateY(0px)" : "translateY(-8px)",
                        transition:
                            "opacity 700ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1)",
                    }}
                    aria-hidden={!activeId}
                >
                    <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: PALETTE.muted }}>
                        Details
                    </div>

                    <div className="mt-3 flex flex-col lg:flex-row gap-10">
                        {/* LEFT */}
                        <div className="min-w-[280px] max-w-[360px]">
                            <div className="font-[Montserrat] font-semibold text-3xl leading-tight">
                                {panelPkg.name}
                            </div>

                            <div className="mt-3 text-sm leading-relaxed" style={{ color: PALETTE.muted }}>
                                What we’ll build — scoped to your market and goals.
                            </div>

                            <div className="mt-7 border-t pt-6" style={{ borderColor: LINE_SOFT }}>
                                <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: PALETTE.muted }}>
                                    Who it’s for
                                </div>
                                <div className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(0,0,0,0.78)" }}>
                                    {panelPkg.bestFor}
                                </div>
                            </div>

                            <div className="mt-6 border-t pt-6" style={{ borderColor: LINE_SOFT }}>
                                <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: PALETTE.muted }}>
                                    Typical timeline
                                </div>
                                <div className="mt-2 text-sm" style={{ color: "rgba(0,0,0,0.78)" }}>
                                    <span style={{ color: PALETTE.sage, fontWeight: 600 }}>Timeline:</span>{" "}
                                    {panelPkg.timeline}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="flex-1">
                            <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: PALETTE.muted }}>
                                What you get
                            </div>

                            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-8">
                                {panelPkg.includes.map((block) => (
                                    <div key={block.title} className="border-t pt-5" style={{ borderColor: LINE_SOFT }}>
                                        <div className="font-[Montserrat] font-semibold text-sm">{block.title}</div>
                                        <ul className="mt-3 space-y-2 text-sm leading-relaxed" style={{ color: "rgba(0,0,0,0.76)" }}>
                                            {block.items.map((it) => (
                                                <li key={it} className="flex gap-2">
                                                    <span style={{ color: PALETTE.red, lineHeight: "1.1" }}>•</span>
                                                    <span>{it}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            {/* CTAs */}
                            <div className="mt-10 flex flex-col md:flex-row gap-4 md:items-center">
                                <button
                                    type="button"
                                    onClick={() => onRequestScope(panelPkg.id)}
                                    className={cx(
                                        "px-6 py-3 border rounded-none font-semibold text-sm",
                                        "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                                        "hover:-translate-y-[2px]"
                                    )}
                                    style={{
                                        borderColor: PALETTE.red,
                                        background: PALETTE.red,
                                        color: "white",
                                        boxShadow: "0 14px 40px rgba(239,62,54,0.20)",
                                    }}
                                >
                                    Request scope →
                                </button>

                                <button
                                    type="button"
                                    onClick={onBuildYourOwnPlan}
                                    className="btnSecondary btnSecondary14"
                                >
                                    <span className="btnSecondary14Text" data-text="BUILD YOUR OWN PLAN">
                                        BUILD YOUR OWN PLAN
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
                    </div>
                </div>
            </div>
        </div>
    );
}
