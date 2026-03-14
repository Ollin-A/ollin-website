import React from "react";
import { PALETTE } from "./packages.constants";
import SecondaryButton from "../components/SecondaryButton";

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
                    <SecondaryButton onClick={onBuildYourOwnPlan} label="Build your own plan" dataText="BUILD YOUR OWN PLAN" />
                </div>
            </div>
        </div>
    );
}
