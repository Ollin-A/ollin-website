import { useState } from "react";
import { cx } from "./cx";
import { Chevron } from "./Chevron";

export type ExpandLabels = { more: string; less: string };

export function BulletList({
    items,
    itemsTablet,
    itemsMobile,
    collapsibleMobile = true,
    collapsibleTablet = true,
    labels,
    reducedMotion,
}: {
    items: string[];
    itemsTablet?: string[];
    itemsMobile?: string[];
    collapsibleMobile?: boolean;
    collapsibleTablet?: boolean;
    labels?: ExpandLabels;
    reducedMotion: boolean;
}) {
    const tablet = itemsTablet ?? items;
    const mobile = itemsMobile ?? tablet;

    const canExpandMobile = collapsibleMobile && items.length > mobile.length;
    const canExpandTablet = collapsibleTablet && items.length > tablet.length;

    const [open, setOpen] = useState(false);

    const moreLabel = labels?.more ?? "See details";
    const lessLabel = labels?.less ?? "Hide details";

    return (
        <>

            <div className="hidden md:block space-y-3 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/70 max-md:text-[13.5px]">
                {items.map((t, i) => (
                    <p key={i} className="break-words" style={{ overflowWrap: "anywhere" }}>• {t}</p>
                ))}
            </div>

            <div className="hidden sm:block md:hidden text-ollin-black/70">
                <div className="space-y-3 text-[13.5px] leading-relaxed">
                    {tablet.map((t, i) => (
                        <p
                            key={`t-${i}`}
                            className="break-words hyphens-auto max-md:[overflow-wrap:anywhere]"
                        >
                            • {t}
                        </p>
                    ))}
                </div>

                {canExpandTablet ? (
                    <div className="mt-4">
                        <div
                            className={cx(
                                "grid",
                                reducedMotion ? "" : "transition-[grid-template-rows,opacity,transform] duration-350 ease-out",
                                open ? "grid-rows-[1fr] opacity-100 translate-y-0" : "grid-rows-[0fr] opacity-0 -translate-y-1"
                            )}
                            style={{
                                transitionProperty: reducedMotion ? undefined : "grid-template-rows, opacity, transform",
                            }}
                            aria-hidden={!open}
                        >
                            <div className="overflow-hidden">
                                <div className="mt-3 space-y-3 text-[13.5px] leading-relaxed">
                                    {items.map((t, i) => (
                                        <p
                                            key={`t-full-${i}`}
                                            className="break-words hyphens-auto max-md:[overflow-wrap:anywhere]"
                                        >
                                            • {t}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setOpen((v) => !v)}
                            className={cx(
                                "mt-4 w-full flex items-center justify-between",
                                "cursor-pointer select-none",
                                "text-[12px] tracking-[0.14em] uppercase text-ollin-black/55 hover:text-ollin-black",
                                reducedMotion ? "" : "transition-colors"
                            )}
                            aria-expanded={open}
                        >
                            <span className="opacity-80">{open ? lessLabel : moreLabel}</span>
                            <Chevron open={open} reducedMotion={reducedMotion} />
                        </button>
                    </div>
                ) : null}
            </div>

            <div className="sm:hidden text-ollin-black/70">
                <div className="space-y-3 text-[13.5px] leading-relaxed">
                    {mobile.map((t, i) => (
                        <p
                            key={`m-${i}`}
                            className="break-words hyphens-auto max-md:[overflow-wrap:anywhere]"
                        >
                            • {t}
                        </p>
                    ))}
                </div>

                {canExpandMobile ? (
                    <div className="mt-4">
                        <div
                            className={cx(
                                "grid",
                                reducedMotion ? "" : "transition-[grid-template-rows,opacity,transform] duration-350 ease-out",
                                open ? "grid-rows-[1fr] opacity-100 translate-y-0" : "grid-rows-[0fr] opacity-0 -translate-y-1"
                            )}
                            style={{
                                transitionProperty: reducedMotion ? undefined : "grid-template-rows, opacity, transform",
                            }}
                            aria-hidden={!open}
                        >
                            <div className="overflow-hidden">
                                <div className="mt-3 space-y-3 text-[13.5px] leading-relaxed">
                                    {items.map((t, i) => (
                                        <p
                                            key={`m-full-${i}`}
                                            className="break-words hyphens-auto max-md:[overflow-wrap:anywhere]"
                                        >
                                            • {t}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setOpen((v) => !v)}
                            className={cx(
                                "mt-4 w-full flex items-center justify-between",
                                "cursor-pointer select-none",
                                "text-[12px] tracking-[0.14em] uppercase text-ollin-black/55 hover:text-ollin-black",
                                reducedMotion ? "" : "transition-colors"
                            )}
                            aria-expanded={open}
                        >
                            <span className="opacity-80">{open ? lessLabel : moreLabel}</span>
                            <Chevron open={open} reducedMotion={reducedMotion} />
                        </button>
                    </div>
                ) : null}
            </div>
        </>
    );
}
