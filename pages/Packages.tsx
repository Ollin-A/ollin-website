import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PackagesHero from "./PackagesHero";

import type { PackageTier } from "./packages.types";
import { PALETTE } from "./packages.constants";
import { PACKAGES, SINGLE_SERVICES, COMPARISON } from "./packages.data";

import PackagesGrid from "./PackagesGrid";
import PackageDetailSheet from "./PackageDetailSheet";
import SingleServicesSection from "./SingleServicesSection";
import ComparisonSection from "./ComparisonSection";
import CustomPlanCTASection from "./CustomPlanCTASection";

export default function PackagesPage() {
    const navigate = useNavigate();

    // arranca cerrado
    const [activeId, setActiveId] = useState<string | null>(null);
    const [panelPkg, setPanelPkg] = useState<PackageTier>(() => PACKAGES[0]);

    const panelOuterRef = useRef<HTMLDivElement | null>(null);

    const togglePackage = (id: string) => {
        setActiveId((prev) => {
            const next = prev === id ? null : id;
            if (next) {
                const nextPkg = PACKAGES.find((p) => p.id === next);
                if (nextPkg) setPanelPkg(nextPkg);
            }
            return next;
        });

        requestAnimationFrame(() => {
            const willOpen = activeId !== id;
            if (willOpen) panelOuterRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    };

    const goContactWith = (params: Record<string, string>) => {
        const qs = new URLSearchParams(params).toString();
        navigate(`/contact?${qs}`);
    };

    const anySelected = !!activeId;

    return (
        <div className="w-full" style={{ background: PALETTE.bg, color: PALETTE.ink }}>
            <div className="max-w-6xl mx-auto px-6 pt-14 pb-20 font-[Poppins]">
                {/* HERO */}
                <PackagesHero muted={PALETTE.muted} />

                {/* PACKAGES GRID */}
                <PackagesGrid
                    packages={PACKAGES}
                    activeId={activeId}
                    anySelected={anySelected}
                    onSelect={togglePackage}
                />

                {/* DETAIL SHEET */}
                <PackageDetailSheet
                    outerRef={panelOuterRef}
                    activeId={activeId}
                    panelPkg={panelPkg}
                    onRequestScope={(packageId) => goContactWith({ package: packageId })}
                    onBuildYourOwnPlan={() => navigate("/packages/personalized")}
                />

                {/* SINGLE SERVICES */}
                <SingleServicesSection
                    services={SINGLE_SERVICES}
                    onRequestScope={(serviceId) => goContactWith({ type: "single", service: serviceId })}
                />

                {/* COMPARISON */}
                <ComparisonSection
                    packages={PACKAGES}
                    rows={COMPARISON}
                    activeId={activeId}
                    onSelect={togglePackage}
                />

                {/* CUSTOM CTA */}
                <CustomPlanCTASection onBuildYourOwnPlan={() => navigate("/packages/personalized")} />
            </div>
        </div>
    );
}
