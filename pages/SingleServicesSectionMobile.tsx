import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, X, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { SingleService } from "./packages.types";
import { PALETTE, LINE } from "./packages.constants";
import { cx } from "./packages.utils";

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

// DUPLICATED CONSTANTS to avoid touching Desktop file
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
];

export default function SingleServicesSectionMobile({ services, onRequestScope }: Props) {
    const navigate = useNavigate();
    const [openKey, setOpenKey] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showAll, setShowAll] = useState(false);

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

    const coreItems = menuItems.slice(0, CORE_ITEMS.length);
    const extraItems = menuItems.slice(CORE_ITEMS.length);

    const selectedItem = useMemo(() => {
        if (!openKey) return null;
        return menuItems.find((m) => m.key === openKey) ?? null;
    }, [openKey, menuItems]);

    const [draft, setDraft] = useState<LeadDraft>(() => ({
        serviceId: "",
        serviceName: "",
        name: "",
        phone: "",
        email: "",
        company: "",
        details: "",
    }));

    const isCustom = draft.serviceId === "custom";

    const openWithItem = (item: MenuItem) => {
        setOpenKey(item.key);
        setError(null);
        setDraft((d) => ({
            ...d,
            serviceId: item.serviceId,
            serviceName: item.label,
        }));
    };

    const openCustomBlank = () => {
        setOpenKey("__custom__");
        setError(null);
        setDraft((d) => ({
            ...d,
            serviceId: "custom",
            serviceName: "Custom single service",
        }));
    };

    const closeModal = () => {
        setOpenKey(null);
        setError(null);
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

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const hasEmail = draft.email.trim().length > 0;
        const hasPhone = draft.phone.trim().length > 0;

        if (!draft.name.trim()) {
            setError("Please add your name.");
            return;
        }
        if (!hasEmail && !hasPhone) {
            setError("Add either a phone number or an email.");
            return;
        }

        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
        } catch {
            /* ignore */
        }

        onRequestScope(draft.serviceId);
    };

    return (
        <section className="mt-14 mb-10">
            {/* Header */}
            <div className="text-center px-4">
                <div className="text-[10px] uppercase tracking-[0.25em]" style={{ color: "rgba(0,0,0,0.45)" }}>
                    Single services
                </div>
                <h2 className="mt-3 font-[Montserrat] font-medium text-2xl leading-tight">
                    Pick one.
                    <br />
                    We’ll scope it cleanly.
                </h2>
                <p className="mt-2 text-sm leading-relaxed max-w-[280px] mx-auto" style={{ color: PALETTE.muted }}>
                    Tap a service to request scope. Quick, clear, no fluff.
                </p>
            </div>

            <div className="mt-8 px-4">
                <div className="border-t" style={{ borderColor: LINE, opacity: 0.7 }} />

                {/* Core Items - Always Visible */}
                <div className="py-6 grid grid-cols-2 gap-x-4 gap-y-3">
                    {coreItems.map((item) => (
                        <button
                            key={item.key}
                            type="button"
                            onClick={() => openWithItem(item)}
                            className="bg-white/50 border border-transparent active:border-black/5 active:bg-white text-center py-3 px-2 rounded is-touch-target"
                            style={{
                                fontFamily: "Montserrat",
                                fontWeight: 400,
                                fontSize: "13px",
                                lineHeight: 1.3,
                                color: "rgba(0,0,0,0.65)",
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Extra Items - Collapsible */}
                {showAll && (
                    <div className="pb-6 grid grid-cols-2 gap-x-4 gap-y-3 animate-in fade-in slide-in-from-top-2">
                        {extraItems.map((item) => (
                            <button
                                key={item.key}
                                type="button"
                                onClick={() => openWithItem(item)}
                                className="bg-white/30 border border-transparent active:border-black/5 active:bg-white text-center py-3 px-2 rounded"
                                style={{
                                    fontFamily: "Montserrat",
                                    fontWeight: 400,
                                    fontSize: "13px",
                                    lineHeight: 1.3,
                                    color: "rgba(0,0,0,0.55)",
                                }}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Toggle Button */}
                <div className="flex justify-center -mt-2 mb-6">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider py-2 px-4 rounded-full"
                        style={{ color: "#111", background: "rgba(0,0,0,0.04)" }}
                    >
                        {showAll ? (
                            <>
                                Show Less <ChevronUp size={14} />
                            </>
                        ) : (
                            <>
                                View More Services <ChevronDown size={14} />
                            </>
                        )}
                    </button>
                </div>

                {/* Footer Links - Stacked for mobile */}
                <div className="flex flex-col items-center gap-3 text-sm mt-8 border-t pt-8" style={{ borderColor: LINE }}>
                    <span style={{ color: PALETTE.muted }}>Not seeing what you need?</span>

                    <button
                        type="button"
                        onClick={openCustomBlank}
                        className="font-medium text-black/80 hover:text-black active:opacity-70 transition-colors"
                    >
                        Contact us directly
                    </button>

                    {/* centered "or" without dashes */}
                    <div className="flex items-center justify-center gap-3 w-full">
                        <span className="h-px w-10 bg-black/10" />
                        <span className="text-xs" style={{ color: "rgba(0,0,0,0.35)" }}>
                            or
                        </span>
                        <span className="h-px w-10 bg-black/10" />
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/services")}
                        className="font-medium text-black/80 hover:text-black active:opacity-70 transition-colors"
                    >
                        Browse all services
                    </button>
                </div>
            </div>

            {/* Overlay Form (Same logic/UI as Desktop but accessible on mobile) */}
            {openKey && (
                <div className="fixed inset-0 z-[90]">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={closeModal} />
                    <div className="absolute inset-x-0 bottom-0 top-[10%] bg-[#fafafa] rounded-t-2xl shadow-2xl flex flex-col">
                        {/* Mobile handle */}
                        <div className="w-full flex justify-center pt-3 pb-1" onClick={closeModal}>
                            <div className="w-12 h-1.5 rounded-full bg-black/10" />
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div
                                        className="text-[10px] uppercase tracking-[0.25em]"
                                        style={{ color: "rgba(0,0,0,0.45)" }}
                                    >
                                        Request scope
                                    </div>
                                    <div className="mt-2 font-[Montserrat] font-medium text-xl leading-snug">
                                        {draft.serviceName || selectedItem?.label || "Service"}
                                    </div>
                                </div>
                                <button onClick={closeModal} className="p-2 -mr-2 text-black/40">
                                    <X size={20} />
                                </button>
                            </div>

                            <p className="text-sm leading-relaxed mb-8" style={{ color: PALETTE.muted }}>
                                {isCustom
                                    ? "Describe what you need — we’ll reply with a clean scope."
                                    : selectedItem?.hint ?? "We’ll reply with a clean scope (what’s included + timeline)."}
                            </p>

                            <form onSubmit={submit} className="flex flex-col gap-5">
                                <Field
                                    label="Name"
                                    value={draft.name}
                                    onChange={(v) => setDraft((d) => ({ ...d, name: v }))}
                                    required
                                />
                                <Field
                                    label="Company"
                                    value={draft.company}
                                    onChange={(v) => setDraft((d) => ({ ...d, company: v }))}
                                />
                                <Field
                                    label="Phone"
                                    value={draft.phone}
                                    onChange={(v) => setDraft((d) => ({ ...d, phone: v }))}
                                    inputMode="tel"
                                />
                                <Field
                                    label="Email"
                                    value={draft.email}
                                    onChange={(v) => setDraft((d) => ({ ...d, email: v }))}
                                    inputMode="email"
                                />
                                <Field
                                    label={isCustom ? "What do you need?" : "Context (optional)"}
                                    value={draft.details}
                                    onChange={(v) => setDraft((d) => ({ ...d, details: v }))}
                                    textarea
                                    placeholder={isCustom ? "Example: ‘Need a landing page...’" : "Deadline, link, etc."}
                                />

                                {error && <div className="text-sm text-red-800/80 bg-red-50 p-3 rounded">{error}</div>}

                                <button
                                    type="submit"
                                    className="mt-4 w-full bg-[#111] text-[#fff] text-xs font-medium uppercase tracking-[0.2em] py-4 rounded-none flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                                >
                                    Request scope <ArrowRight size={14} />
                                </button>
                            </form>

                            <div className="h-10" /> {/* Spacer */}
                        </div>
                    </div>
                </div>
            )}
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
    inputMode,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    required?: boolean;
    textarea?: boolean;
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
    return (
        <label className="block">
            <div className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: "rgba(0,0,0,0.45)" }}>
                {label} {required ? "*" : null}
            </div>

            {textarea ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={3}
                    className="mt-1 w-full bg-transparent border-b border-black/20 text-sm py-2 outline-none rounded-none placeholder:text-black/30 focus:border-black/60 focus:bg-black/[0.02] transition-colors"
                />
            ) : (
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    inputMode={inputMode}
                    className="mt-1 w-full bg-transparent border-b border-black/20 text-sm py-2 outline-none rounded-none placeholder:text-black/30 focus:border-black/60 focus:bg-black/[0.02] transition-colors"
                />
            )}
        </label>
    );
}
