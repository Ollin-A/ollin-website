import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { SingleService } from "./packages.types";
import { PALETTE, LINE } from "./packages.constants";
import { cx } from "./packages.utils";
import SecondaryButton from "../components/SecondaryButton";

type Props = {
    services: SingleService[];
    onRequestScope: (serviceId: string) => void;
};

type LeadDraft = {
    serviceId: string;
    serviceName: string;
    name: string;
    phone: string;
    email: string;
    company: string;
    details: string;
};

type MenuItem = {
    key: string;
    serviceId: string;
    label: string;
    hint?: string;
};

const STORAGE_KEY = "ollin.scope_draft.v1";

function setBodyScrollLocked(locked: boolean) {
    if (typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    if (locked) document.body.style.overflow = "hidden";
    return () => {
        document.body.style.overflow = prev;
    };
}

const CORE_ITEMS: Array<{ id: string; label: string }> = [
    { id: "website", label: "Website build" },
    { id: "site-tune", label: "Website tune-up" },
    { id: "logo", label: "Logo cleanup" },
    { id: "social", label: "Social setup" },
    { id: "gbp", label: "GBP setup + cleanup" },
    { id: "reviews", label: "Review engine" },
    { id: "ads", label: "Ads management" },
    { id: "tracking", label: "Tracking + ROI" },
];

const EXTRA_ITEMS: string[] = [
    "360° Revenue Leak Audit",
    "Call review (30–50)",
    "Website audit (speed + SEO)",
    "Conversion audit (forms + offer)",
    "90-Day plan (PDF)",
    "Quick-wins sprint",

    "Landing page (long-form)",
    "Full website (5 pages)",
    "Multi-city website",
    "Bilingual EN/ES",
    "Website care (hosting + updates)",

    "Mini brand guide",
    "Brand templates (truck/uniform)",

    "Google Ads setup",
    "Meta Ads setup",
    "CRM pipeline setup",
    "NAP + citations cleanup",
    "Reviews flow (SMS/WhatsApp)",
    "Lead capture + booking",
    "Monthly content plan",

    "",
];

export default function SingleServicesSection({ services, onRequestScope }: Props) {
    const navigate = useNavigate();

    const [openKey, setOpenKey] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const menuItems: MenuItem[] = useMemo(() => {
        const byId = new Map(services.map((s) => [s.id, s] as const));

        const core: MenuItem[] = CORE_ITEMS.map((c) => {
            const s = byId.get(c.id);
            return {
                key: `core-${c.id}`,
                serviceId: c.id,
                label: c.label,
                hint: s?.hint ?? "We’ll reply with a clean scope (what’s included + timeline).",
            };
        });

        const extras: MenuItem[] = EXTRA_ITEMS.map((label, i) => ({
            key: `extra-${i}`,
            serviceId: "custom",
            label,
            hint: "We’ll reply with a clean scope (what’s included + timeline).",
        }));

        return [...core, ...extras];
    }, [services]);

    const selectedItem = useMemo(() => {
        if (!openKey) return null;
        return menuItems.find((m) => m.key === openKey) ?? null;
    }, [openKey, menuItems]);

    const openWithItem = (item: MenuItem) => {
        onRequestScope(item.serviceId);
    };

    const openCustomBlank = () => {
        onRequestScope("custom");
    };

    useEffect(() => {
        if (!openKey) return;

        const unlock = setBodyScrollLocked(true);
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpenKey(null);
        };

        window.addEventListener("keydown", onKeyDown);
        return () => {
            unlock?.();
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [openKey]);

    if (!menuItems.length) return null;

    return (
        <section className="mt-16">

            <div
                className="text-[11px] uppercase tracking-[0.28em]"
                style={{ color: "rgba(0,0,0,0.45)" }}
            >
                Single services
            </div>

            <div className="mt-2 max-w-3xl">
                <h2 className="font-[Montserrat] font-medium text-2xl md:text-3xl leading-tight">
                    Pick one. We’ll scope it cleanly.
                </h2>
                <p className="mt-1 text-sm md:text-base leading-relaxed" style={{ color: PALETTE.muted }}>
                    Click a service to request scope — quick, clear, no fluff.
                </p>
            </div>

            <div className="mt-6">
                <div className="border-t" style={{ borderColor: LINE, opacity: 0.7 }} />

                <div className="pt-5 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-3">
                    {menuItems.map((item) => (
                        <button
                            key={item.key}
                            type="button"
                            onClick={() => openWithItem(item)}
                            className={cx(
                                "text-left w-full",
                                "transition-opacity duration-200"
                            )}
                            style={{
                                fontFamily: "Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial",
                                fontWeight: 400,
                                fontSize: "14px",
                                lineHeight: 1.35,
                                color: "rgba(0,0,0,0.52)",
                            }}
                            onMouseEnter={(e) => {

                                (e.currentTarget.style.color = "rgba(0,0,0,0.70)");
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget.style.color = "rgba(0,0,0,0.52)");
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    <span style={{ color: PALETTE.muted }}>Not seeing what you need?</span>

                    <SecondaryButton onClick={openCustomBlank} label="Contact us" />

                    <span style={{ color: "rgba(0,0,0,0.35)" }}>or</span>

                    <SecondaryButton onClick={() => navigate("/services")} label="Browse all services" />
                </div>
            </div>

        </section>
    );
}

function Field({
    label,
    value,
    onChange,
    placeholder,
    required,
    textarea,
    className,
    inputMode,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    required?: boolean;
    textarea?: boolean;
    className?: string;
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
    return (
        <label className={cx("block", className)}>
            <div className="text-xs uppercase tracking-[0.22em]" style={{ color: "rgba(0,0,0,0.45)" }}>
                {label} {required ? <span style={{ color: "rgba(0,0,0,0.35)" }}>(required)</span> : null}
            </div>

            {textarea ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={4}
                    className={cx(
                        "mt-2 w-full bg-transparent",
                        "border-b outline-none rounded-none",
                        "text-sm leading-relaxed py-2",
                        "placeholder:opacity-60"
                    )}
                    style={{ borderColor: "rgba(0,0,0,0.22)", color: "rgba(0,0,0,0.82)" }}
                />
            ) : (
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    inputMode={inputMode}
                    className={cx(
                        "mt-2 w-full bg-transparent",
                        "border-b outline-none rounded-none",
                        "text-sm py-2",
                        "placeholder:opacity-60"
                    )}
                    style={{ borderColor: "rgba(0,0,0,0.22)", color: "rgba(0,0,0,0.82)" }}
                />
            )}
        </label>
    );
}
