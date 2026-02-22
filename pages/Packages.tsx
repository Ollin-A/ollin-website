import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PackagesHero from "./PackagesHero";
import PackagesHeroMobile from "./PackagesHeroMobile";

import type { PackageTier } from "./packages.types";
import { PALETTE } from "./packages.constants";
import { PACKAGES, SINGLE_SERVICES, COMPARISON } from "./packages.data";

import PackagesGrid from "./PackagesGrid";
import PackagesGridMobile from "./PackagesGridMobile";
import PackageDetailSheet from "./PackageDetailSheet";
import SingleServicesSection from "./SingleServicesSection";
import SingleServicesSectionMobile from "./SingleServicesSectionMobile";
import ComparisonSection from "./ComparisonSection";
import ComparisonSectionMobile from "./ComparisonSectionMobile";
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

    const handleBuildYourOwnPlan = () => {
        navigate("/packages/personalized");
        window.scrollTo(0, 0);
    };

    return (
        <div className="w-full" style={{ background: PALETTE.bg, color: PALETTE.ink }}>
            <div className="max-w-6xl mx-auto px-6 pt-14 pb-20 font-[Poppins]">
                {/* HERO */}
                <div className="hidden md:block">
                    <PackagesHero muted={PALETTE.muted} />
                </div>
                <div className="md:hidden">
                    <PackagesHeroMobile muted={PALETTE.muted} />
                </div>

                {/* PACKAGES GRID */}
                <div className="hidden md:block">
                    <PackagesGrid
                        packages={PACKAGES}
                        activeId={activeId}
                        anySelected={anySelected}
                        onSelect={togglePackage}
                    />
                </div>
                <div className="md:hidden">
                    <PackagesGridMobile
                        packages={PACKAGES}
                        onSelect={togglePackage}
                    />
                </div>

                {/* DETAIL SHEET */}
                <PackageDetailSheet
                    outerRef={panelOuterRef}
                    activeId={activeId}
                    panelPkg={panelPkg}
                    onRequestScope={(packageId) => goContactWith({ package: packageId })}
                    onBuildYourOwnPlan={handleBuildYourOwnPlan}
                />

                {/* COMPARISON (moved ABOVE single services) */}
                <div className="hidden md:block">
                    <ComparisonSection
                        packages={PACKAGES}
                        rows={COMPARISON}
                        activeId={activeId}
                        onSelect={togglePackage}
                    />
                </div>
                <div className="md:hidden">
                    <ComparisonSectionMobile
                        packages={PACKAGES}
                        rows={COMPARISON}
                    />
                </div>

                {/* SINGLE SERVICES (moved BELOW comparison) */}
                <div className="hidden md:block">
                    <SingleServicesSection
                        services={SINGLE_SERVICES}
                        onRequestScope={(serviceId) => goContactWith({ type: "single", service: serviceId })}
                    />
                </div>
                <div className="md:hidden">
                    <SingleServicesSectionMobile
                        services={SINGLE_SERVICES}
                        onRequestScope={(serviceId) => goContactWith({ type: "single", service: serviceId })}
                    />
                </div>

                {/* CUSTOM CTA */}
                <CustomPlanCTASection onBuildYourOwnPlan={handleBuildYourOwnPlan} />
            </div>
        </div>
    );
}