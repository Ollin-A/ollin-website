import React from "react";
import { PALETTE } from "./packages.constants";

type Props = {
    onBuildYourOwnPlan: () => void;
};

export default function CustomPlanCTASection({ onBuildYourOwnPlan }: Props) {
    return (
        <div className="mt-16">
            <div>
                <h2 className="font-[Montserrat] font-semibold text-3xl">Need something custom?</h2>
                <p className="mt-2 max-w-2xl leading-relaxed" style={{ color: PALETTE.muted }}>
                    Build your own plan from the pieces you actually need — then we’ll scope it cleanly.
                </p>

                <div className="mt-6">
                    <button type="button" onClick={onBuildYourOwnPlan} className="btnSecondary btnSecondary14">
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
    );
}
