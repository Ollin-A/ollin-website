import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, X } from "lucide-react";
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

const STORAGE_KEY = "ollin.scope_draft.v1";

function setBodyScrollLocked(locked: boolean) {
    if (typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    if (locked) document.body.style.overflow = "hidden";
    return () => {
        document.body.style.overflow = prev;
    };
}

export default function SingleServicesSection({ services, onRequestScope }: Props) {
    const navigate = useNavigate();

    const [openId, setOpenId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const selected = useMemo(() => {
        if (!openId) return null;
        return services.find((s) => s.id === openId) ?? null;
    }, [openId, services]);

    const [draft, setDraft] = useState<LeadDraft>(() => ({
        serviceId: "",
        serviceName: "",
        name: "",
        phone: "",
        email: "",
        company: "",
        details: "",
    }));

    // Keep draft synced with selected service
    useEffect(() => {
        if (!selected) return;
        setDraft((d) => ({
            ...d,
            serviceId: selected.id,
            serviceName: selected.name,
        }));
        setError(null);
    }, [selected]);

    // Lock scroll + ESC close
    useEffect(() => {
        if (!openId) return;

        const unlock = setBodyScrollLocked(true);

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpenId(null);
        };

        window.addEventListener("keydown", onKeyDown);
        return () => {
            unlock?.();
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [openId]);

    if (!services?.length) return null;

    const openModal = (id: string) => setOpenId(id);

    const openCustom = () => {
        // “Custom” service request (for people who didn’t find what they need)
        setOpenId("custom");
        setDraft((d) => ({
            ...d,
            serviceId: "custom",
            serviceName: "Custom single service",
        }));
    };

    const closeModal = () => {
        setOpenId(null);
        setError(null);
    };

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

        // Store draft so /contact can prefill later if you want.
        // (Optional but useful: you can read this in Contact page.)
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
        } catch {
            // ignore
        }

        // Keep your existing flow (Packages.tsx already routes to /contact with service id)
        onRequestScope(draft.serviceId);

        // If you ever want to keep users on this page instead of navigating,
        // replace the line above with your own API call and show a success state.
    };

    const isCustomOpen = openId === "custom";

    // Visual rhythm: subtle “landing-like” spotlight behind the section
    const spotlightBg =
        "radial-gradient(900px 420px at 20% 0%, rgba(0,0,0,0.06), transparent 60%)," +
        "radial-gradient(700px 380px at 85% 10%, rgba(0,0,0,0.04), transparent 60%)";

    return (
        <section className="mt-20 relative">
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: spotlightBg }}
                aria-hidden="true"
            />

            {/* Minimal header (subchapter vibe, not a whole new section) */}
            <div className="relative">
                <div
                    className="text-xs uppercase tracking-[0.28em]"
                    style={{ color: "rgba(0,0,0,0.45)" }}
                >
                    Single services
                </div>

                <div className="mt-3 max-w-3xl">
                    <h2 className="font-[Montserrat] font-medium text-3xl leading-tight">
                        Pick one. We’ll scope it cleanly.
                    </h2>
                    <p className="mt-2 text-base leading-relaxed" style={{ color: PALETTE.muted }}>
                        Click a service to request scope — quick, clear, no fluff.
                    </p>
                </div>

                {/* Services list: 3 columns, names only */}
                <div className="mt-10">
                    <div
                        className="border-t"
                        style={{ borderColor: LINE, opacity: 0.7 }}
                    />
                    <div className="pt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-14 gap-y-5">
                        {services.map((s) => {
                            const active = openId === s.id;
                            return (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => openModal(s.id)}
                                    className={cx(
                                        "group text-left w-full",
                                        "transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                                        active ? "opacity-100" : "opacity-75 hover:opacity-100 hover:-translate-y-[1px]"
                                    )}
                                >
                                    <div className="flex items-baseline justify-between gap-6">
                                        <span
                                            className={cx(
                                                "font-[Montserrat] font-medium",
                                                "text-[22px] md:text-[24px] leading-snug"
                                            )}
                                            style={{ color: PALETTE.ink }}
                                        >
                                            {s.name}
                                        </span>

                                        <span
                                            className={cx(
                                                "inline-flex items-center gap-2",
                                                "text-xs uppercase tracking-[0.22em]",
                                                "transition-opacity duration-300",
                                                active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                            )}
                                            style={{ color: "rgba(0,0,0,0.55)" }}
                                        >
                                            <span className="hidden md:inline">Open</span>
                                            <ArrowRight size={14} />
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Bottom line: contact + /services */}
                    <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                        <span style={{ color: PALETTE.muted }}>
                            Not seeing what you need?
                        </span>

                        <button
                            type="button"
                            onClick={openCustom}
                            className={cx(
                                "inline-flex items-center gap-2",
                                "underline underline-offset-4",
                                "transition-opacity duration-300 hover:opacity-80"
                            )}
                            style={{ textDecorationColor: "rgba(0,0,0,0.25)", color: "rgba(0,0,0,0.75)" }}
                        >
                            Contact us
                            <ArrowRight size={16} />
                        </button>

                        <span style={{ color: "rgba(0,0,0,0.35)" }}>or</span>

                        <button
                            type="button"
                            onClick={() => navigate("/services")}
                            className={cx(
                                "inline-flex items-center gap-2",
                                "underline underline-offset-4",
                                "transition-opacity duration-300 hover:opacity-80"
                            )}
                            style={{ textDecorationColor: "rgba(0,0,0,0.25)", color: "rgba(0,0,0,0.75)" }}
                        >
                            Browse all services
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlay Form */}
            {openId && (
                <div className="fixed inset-0 z-[80]">
                    {/* Backdrop */}
                    <button
                        type="button"
                        className="absolute inset-0 w-full h-full"
                        onClick={closeModal}
                        aria-label="Close"
                        style={{
                            background: "rgba(0,0,0,0.25)",
                            backdropFilter: "blur(8px)",
                        }}
                    />

                    {/* Modal */}
                    <div className="relative w-full h-full flex items-center justify-center px-5 py-10">
                        <div
                            className={cx(
                                "w-full max-w-2xl border rounded-none",
                                "transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                            )}
                            style={{
                                borderColor: LINE,
                                // Not pure white — tinted “paper”
                                background: "rgba(255,255,255,0.55)",
                                boxShadow: "0 28px 80px rgba(0,0,0,0.18)",
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="px-8 pt-8 pb-6">
                                <div className="flex items-start justify-between gap-6">
                                    <div className="min-w-0">
                                        <div
                                            className="text-xs uppercase tracking-[0.28em]"
                                            style={{ color: "rgba(0,0,0,0.45)" }}
                                        >
                                            Request scope
                                        </div>

                                        <div className="mt-3 font-[Montserrat] font-medium text-2xl leading-snug">
                                            {isCustomOpen ? "Tell us what you need" : selected?.name}
                                        </div>

                                        <div className="mt-2 text-sm leading-relaxed" style={{ color: PALETTE.muted }}>
                                            {isCustomOpen
                                                ? "Describe the exact single service you want — we’ll reply with a clean scope."
                                                : selected?.hint}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className={cx(
                                            "shrink-0 inline-flex items-center justify-center",
                                            "h-10 w-10 border rounded-none",
                                            "transition-opacity duration-300 hover:opacity-80"
                                        )}
                                        style={{ borderColor: LINE, color: "rgba(0,0,0,0.75)" }}
                                        aria-label="Close modal"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="mt-7 border-t" style={{ borderColor: LINE, opacity: 0.7 }} />

                                <form className="mt-6" onSubmit={submit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
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
                                            label={isCustomOpen ? "What do you need?" : "Any context (optional)"}
                                            value={draft.details}
                                            onChange={(v) => setDraft((d) => ({ ...d, details: v }))}
                                            textarea
                                            className="md:col-span-2"
                                            placeholder={
                                                isCustomOpen
                                                    ? "Example: ‘Need a landing page for roofing + call tracking.’"
                                                    : "Example: market/city, deadline, current site link, etc."
                                            }
                                        />
                                    </div>

                                    {error && (
                                        <div className="mt-4 text-sm" style={{ color: "rgba(140,0,0,0.85)" }}>
                                            {error}
                                        </div>
                                    )}

                                    <div className="mt-7 flex items-center justify-between gap-4">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className={cx(
                                                "text-xs uppercase tracking-[0.22em]",
                                                "transition-opacity duration-300 hover:opacity-80"
                                            )}
                                            style={{ color: "rgba(0,0,0,0.55)" }}
                                        >
                                            Close
                                        </button>

                                        <button
                                            type="submit"
                                            className={cx(
                                                "inline-flex items-center gap-2",
                                                "text-xs uppercase tracking-[0.22em]",
                                                "transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                                                "hover:translate-x-[2px]"
                                            )}
                                            style={{ color: "rgba(0,0,0,0.78)" }}
                                        >
                                            Request scope <ArrowRight size={14} />
                                        </button>
                                    </div>

                                    <div className="mt-3 text-xs leading-relaxed" style={{ color: PALETTE.muted }}>
                                        We’ll reply with a clean scope before anything starts.
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

/** Minimal “landing-like” fields: no boxes, just hairline + label */
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
