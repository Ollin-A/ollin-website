import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Check, ChevronRight, X } from "lucide-react";
import type { CompareRow, PackageTier } from "./packages.types";
import { LINE, LINE_SOFT, PALETTE } from "./packages.constants";
import { cx } from "./packages.utils";

const CHECK_SIZE = 16;

function CheckCell({ on }: { on: boolean }) {
    return (
        <div className="flex items-center justify-center">
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

type Props = {
    packages: PackageTier[];
    rows: CompareRow[];
    activeId: string | null;
    onSelect: (id: string) => void; // kept for compatibility, not used here
};

type DrawerState = "closed" | "opening" | "open" | "closing";

export default function ComparisonSection({ packages, rows }: Props) {
    const [drawer, setDrawer] = useState<DrawerState>("closed");

    const isVisible = drawer !== "closed";
    const isOpen = drawer === "open";

    // Fit-to-viewport scaling (no scroll)
    const bodyRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [scale, setScale] = useState(1);

    const openDrawer = () => {
        if (drawer === "open" || drawer === "opening") return;
        setDrawer("opening");
        requestAnimationFrame(() => setDrawer("open"));
    };

    const closeDrawer = () => {
        if (!isVisible) return;
        setDrawer("closing");
    };

    // close after animation
    useEffect(() => {
        if (drawer !== "closing") return;
        const t = window.setTimeout(() => setDrawer("closed"), 520);
        return () => window.clearTimeout(t);
    }, [drawer]);

    // lock body scroll when visible
    useEffect(() => {
        if (!isVisible) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isVisible]);

    // ESC to close
    useEffect(() => {
        if (!isVisible) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeDrawer();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isVisible]);

    // Recalculate scale to fit content without scroll + keep breathing room
    useLayoutEffect(() => {
        if (!isVisible) return;

        const measure = () => {
            const body = bodyRef.current;
            const content = contentRef.current;
            if (!body || !content) return;

            // --- breathing room so table doesn't kiss edges
            const GUTTER_X = 0; // px (usually not needed since we center)
            const GUTTER_Y = 34; // px (prevents bottom edge kiss)

            const availW = Math.max(0, body.clientWidth - GUTTER_X);
            const availH = Math.max(0, body.clientHeight - GUTTER_Y);

            const naturalW = content.scrollWidth;
            const naturalH = content.scrollHeight;

            if (!naturalW || !naturalH) {
                setScale(1);
                return;
            }

            const s = Math.min(1, availW / naturalW, availH / naturalH);

            // tiny rounding to avoid constant reflow jitter
            const snapped = Math.floor(s * 1000) / 1000;
            setScale(Number.isFinite(snapped) ? snapped : 1);
        };

        // measure twice: once now, once after fonts/render settle
        measure();
        const raf = requestAnimationFrame(measure);

        const onResize = () => measure();
        window.addEventListener("resize", onResize);

        const ro = new ResizeObserver(() => measure());
        if (bodyRef.current) ro.observe(bodyRef.current);
        if (contentRef.current) ro.observe(contentRef.current);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", onResize);
            ro.disconnect();
        };
    }, [isVisible, packages.length, rows.length]);

    // --- glass / grayscale only
    const EASE = "cubic-bezier(0.16,1,0.3,1)";
    const cols = packages.length;

    const BACKDROP_BG = "rgba(0,0,0,0.22)";
    const PANEL_BG = "rgba(255,255,255,0.12)";
    const PANEL_SHADOW = "0 30px 120px rgba(0,0,0,0.22)";

    const TABLE_BG = "rgba(255,255,255,0.22)"; // no pure white slabs
    const textMain = "rgba(0,0,0,0.86)";
    const textSub = "rgba(0,0,0,0.55)";
    const textMicro = "rgba(0,0,0,0.46)";

    return (
        <div className="mt-16">
            {/* Trigger row */}
            <button
                type="button"
                onClick={openDrawer}
                className={cx(
                    "w-full flex items-center justify-between px-6 py-5",
                    "border-x border-y rounded-none",
                    "transition-colors duration-500 hover:bg-black/[0.02]"
                )}
                style={{ borderColor: LINE, background: "transparent" }}
            >
                <div className="text-left">
                    <div className="font-[Montserrat] font-medium text-xl" style={{ color: textMain }}>
                        What changes as you level up
                    </div>
                    <div className="mt-1 text-sm" style={{ color: textSub }}>
                        Quick glance. Open it if you want the details.
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em]" style={{ color: textMicro }}>
                    Details <ChevronRight size={16} />
                </div>
            </button>

            {/* Drawer */}
            {isVisible && (
                <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Comparison panel">
                    {/* Backdrop */}
                    <button
                        type="button"
                        onClick={closeDrawer}
                        className={cx(
                            "absolute inset-0 backdrop-blur-[14px]",
                            "transition-opacity duration-500",
                            isOpen ? "opacity-100" : "opacity-0"
                        )}
                        style={{ background: BACKDROP_BG }}
                        aria-label="Close"
                    />

                    {/* Sliding panel */}
                    <div
                        className={cx(
                            "absolute right-0 top-0 h-full",
                            "transition-transform duration-700",
                            isOpen ? "translate-x-0" : "translate-x-full"
                        )}
                        style={{
                            width: "min(980px, 92vw)",
                            transitionTimingFunction: EASE,
                        }}
                    >
                        {/* Panel shell */}
                        <div
                            className="h-full border-l relative backdrop-blur-[18px] flex flex-col"
                            style={{
                                borderColor: LINE,
                                background: PANEL_BG,
                                boxShadow: PANEL_SHADOW,
                            }}
                        >
                            {/* subtle grayscale sheen */}
                            <div
                                className="pointer-events-none absolute inset-0"
                                style={{
                                    background:
                                        "radial-gradient(900px 520px at 10% 0%, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.0) 60%)",
                                    opacity: 0.35,
                                }}
                            />

                            {/* Header */}
                            <div className="relative px-6 py-5 border-b" style={{ borderColor: LINE_SOFT }}>
                                <div className="flex items-start justify-between gap-6">
                                    <div>
                                        <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: textMicro }}>
                                            Comparison
                                        </div>
                                        <div className="mt-2 font-[Montserrat] font-medium text-lg" style={{ color: textMain }}>
                                            What changes as you level up
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={closeDrawer}
                                        className="shrink-0 inline-flex items-center justify-center w-11 h-11 border rounded-none transition-colors duration-300 hover:bg-black/[0.03]"
                                        style={{ borderColor: "rgba(0,0,0,0.10)", background: "rgba(255,255,255,0.06)" }}
                                        aria-label="Close comparison"
                                    >
                                        <X size={18} style={{ color: PALETTE.ink }} />
                                    </button>
                                </div>
                            </div>

                            {/* Body: NO SCROLL. Everything must fit here. */}
                            <div ref={bodyRef} className="relative flex-1 overflow-hidden px-6 pt-5 pb-9">
                                {/* center container */}
                                <div className="w-full h-full flex justify-center items-start" style={{ willChange: "transform" }}>
                                    {/* scale wrapper */}
                                    <div
                                        ref={contentRef}
                                        style={{
                                            transform: `scale(${scale})`,
                                            transformOrigin: "top center",
                                        }}
                                    >
                                        {/* DESKTOP matrix */}
                                        <div className="hidden sm:block">
                                            <div
                                                className="min-w-[920px] border rounded-none overflow-hidden backdrop-blur-[12px]"
                                                style={{ borderColor: LINE, background: TABLE_BG }}
                                            >
                                                {/* Header row: no special white background */}
                                                <div
                                                    className="grid"
                                                    style={{
                                                        gridTemplateColumns: `340px repeat(${cols}, 1fr)`,
                                                        borderBottom: `1px solid ${LINE_SOFT}`,
                                                        background: "transparent",
                                                    }}
                                                >
                                                    <div className="px-5 py-4 text-sm font-medium" style={{ color: textMain }}>
                                                        Feature
                                                    </div>

                                                    {packages.map((p) => (
                                                        <div
                                                            key={`col-${p.id}`}
                                                            className="px-5 py-4 text-left"
                                                            style={{ borderLeft: `1px solid ${LINE_SOFT}` }}
                                                        >
                                                            <div className="font-[Montserrat] font-medium" style={{ color: textMain }}>
                                                                {p.name}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Body rows */}
                                                {rows.map((row, idx) => (
                                                    <div
                                                        key={row.key}
                                                        className="grid"
                                                        style={{
                                                            gridTemplateColumns: `340px repeat(${cols}, 1fr)`,
                                                            borderBottom: idx === rows.length - 1 ? "none" : `1px solid ${LINE_SOFT}`,
                                                        }}
                                                    >
                                                        <div className="px-5 py-4">
                                                            <div className="font-medium" style={{ color: textMain }}>
                                                                {row.label}
                                                            </div>
                                                            {row.hint && (
                                                                <div className="mt-1 text-xs" style={{ color: textSub }}>
                                                                    {row.hint}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {packages.map((p) => (
                                                            <div
                                                                key={`${row.key}-${p.id}`}
                                                                className="px-5 py-4"
                                                                style={{ borderLeft: `1px solid ${LINE_SOFT}` }}
                                                            >
                                                                <CheckCell on={!!row.values[p.id]} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* MOBILE */}
                                        <div className="sm:hidden">
                                            <div
                                                className="border rounded-none overflow-hidden backdrop-blur-[12px]"
                                                style={{ borderColor: LINE, background: TABLE_BG }}
                                            >
                                                {rows.map((row, idx) => (
                                                    <div
                                                        key={`m-${row.key}`}
                                                        className="px-5 py-4"
                                                        style={{
                                                            borderBottom: idx === rows.length - 1 ? "none" : `1px solid ${LINE_SOFT}`,
                                                        }}
                                                    >
                                                        <div className="font-medium" style={{ color: textMain }}>
                                                            {row.label}
                                                        </div>
                                                        {row.hint && (
                                                            <div className="mt-1 text-xs" style={{ color: textSub }}>
                                                                {row.hint}
                                                            </div>
                                                        )}

                                                        <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                                                            {packages.map((p) => (
                                                                <div
                                                                    key={`mcell-${row.key}-${p.id}`}
                                                                    className="py-2 border rounded-none"
                                                                    style={{ borderColor: "rgba(0,0,0,0.08)", background: "rgba(255,255,255,0.10)" }}
                                                                >
                                                                    <CheckCell on={!!row.values[p.id]} />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* subtle edge */}
                            <div className="pointer-events-none absolute left-0 top-0 h-full w-px" style={{ background: "rgba(255,255,255,0.12)" }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
