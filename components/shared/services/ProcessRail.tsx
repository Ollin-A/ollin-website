import { useRevealOnEnter } from "../../../hooks/useRevealOnEnter";

export function ProcessRail({
    steps,
    reducedMotion,
}: {
    steps: string[];
    reducedMotion: boolean;
}) {
    const { ref, revealed } = useRevealOnEnter(0.35);
    const showNow = reducedMotion ? true : revealed;

    const DURATION_MS = 2800;
    const DELAY_MS = 140;
    const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

    const curtainColorClass = "bg-ollin-bg";

    const DOT_SIZE = 12;
    const DOT_COLOR = "#7A7A7A";

    const RAIL_Y = 6;

    const TEXT_GAP_DESKTOP = 14;
    const TEXT_LINE_HEIGHT_DESKTOP = 1.15;

    const MOBILE_LABEL_PADLEFT = 36;
    const MOBILE_ROW_MINH = 26;

    const labelMaxCh = steps.length <= 3 ? 26 : 22;

    return (
        <div ref={ref} className="mt-5 md:mt-6">

            <div className="md:hidden relative">
                <div className="relative pl-8">

                    <div className="absolute left-[6px] top-[6px] bottom-[6px] w-px bg-black/20" />

                    <div className="space-y-6">
                        {steps.map((label) => (
                            <div key={label} className="relative" style={{ minHeight: `${MOBILE_ROW_MINH}px` }}>

                                <div
                                    className="absolute left-[0px] top-[2px] rounded-full"
                                    style={{
                                        width: `${DOT_SIZE}px`,
                                        height: `${DOT_SIZE}px`,
                                        backgroundColor: DOT_COLOR,
                                    }}
                                />

                                <div className="absolute left-[12px] top-[7px] h-px w-[16px] bg-black/15" />

                                <p
                                    className="text-[13.5px] font-medium text-ollin-black/80 max-w-[34ch]"
                                    style={{
                                        paddingLeft: `${MOBILE_LABEL_PADLEFT}px`,
                                        lineHeight: 1.25,
                                    }}
                                >
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>

                    {!reducedMotion && (
                        <div
                            aria-hidden
                            className={`pointer-events-none absolute inset-0 ${curtainColorClass}`}
                            style={{
                                zIndex: 30,
                                transformOrigin: "bottom",
                                transform: showNow ? "scaleY(0)" : "scaleY(1)",
                                transitionProperty: "transform",
                                transitionDuration: `${DURATION_MS}ms`,
                                transitionTimingFunction: EASE,
                                transitionDelay: `${DELAY_MS}ms`,
                                willChange: "transform",
                            }}
                        />
                    )}
                </div>
            </div>

            <div className="hidden md:block relative">
                <div className="relative">

                    <div className="absolute left-0 right-0" style={{ top: `${RAIL_Y}px` }}>
                        <div className="h-px w-full bg-black/20" />
                    </div>

                    <div className="grid" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
                        {steps.map((label) => (
                            <div key={label} className="relative flex flex-col items-center">

                                <div
                                    className="rounded-full"
                                    style={{
                                        width: `${DOT_SIZE}px`,
                                        height: `${DOT_SIZE}px`,
                                        backgroundColor: DOT_COLOR,
                                    }}
                                />

                                <div className="mt-3 h-7 w-px bg-black/15" />

                                <p
                                    className="text-center text-[14px] font-medium text-ollin-black/80"
                                    style={{
                                        marginTop: `${TEXT_GAP_DESKTOP}px`,
                                        lineHeight: TEXT_LINE_HEIGHT_DESKTOP,
                                        maxWidth: `${labelMaxCh}ch`,
                                    }}
                                >
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>

                    {!reducedMotion && (
                        <div
                            aria-hidden
                            className={`pointer-events-none absolute inset-0 ${curtainColorClass}`}
                            style={{
                                zIndex: 30,
                                transformOrigin: "right",
                                transform: showNow ? "scaleX(0)" : "scaleX(1)",
                                transitionProperty: "transform",
                                transitionDuration: `${DURATION_MS}ms`,
                                transitionTimingFunction: EASE,
                                transitionDelay: `${DELAY_MS}ms`,
                                willChange: "transform",
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
