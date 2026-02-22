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
    serviceId: string; // real id (website/gbp/etc) OR "custom"
    serviceName: string;
    name: string;
    phone: string;
    email: string;
    company: string;
    details: string;
};

type MenuItem = {
    key: string;
    serviceId: string; // what we send to /contact
    label: string;     // what user sees in the list + modal title
    hint?: string;     // optional modal subcopy
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

/**
 * These map to your existing SINGLE_SERVICES ids (so /contact receives a known service id)
 * Display labels are shortened so the whole list can fit in one viewport.
 */
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

/**
 * Extra services (from your list). These open the same overlay,
 * but submit as serviceId="custom" while preserving the selected label in sessionStorage.
 *
 * Keep these short so mobile can stay 2 columns without making the list tall.
 */
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

    // Lock scroll + ESC close
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
            // ignore
        }

        onRequestScope(draft.serviceId);
    };

    return (
        <section className="mt-16">
            {/* ✅ CSS del botón (igual al Hero) + override para que NO “brinque” el texto */}
            <style>{`
        .btnSecondary.btnSecondary14 {
          color: #6b6b6b;
          background: transparent;
          border: 0;
          padding: 0;              /* ✅ evita layout shift por estilos default */
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          transition: color 280ms ease-out;

          transform: none !important; /* ✅ por si tu .btnSecondary global mete translate */
          will-change: auto;

          --arrowLen: 18px;
          --arrowLenHover: 46px;
          --arrowOverlap: 7.5px;
        }
        .btnSecondary.btnSecondary14:hover {
          color: #111111;
          --arrowLen: var(--arrowLenHover);
          transform: none !important; /* ✅ no queremos “brinco” */
        }

        .btnSecondary14Text {
          position: relative;
          display: inline-block;
          line-height: 1;
        }
        .btnSecondary14Text::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          color: transparent;
          background-image: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 248, 220, 0.92) 45%,
            transparent 62%
          );
          background-size: 220% 100%;
          background-position: 220% 0;
          -webkit-background-clip: text;
          background-clip: text;
          opacity: 0;
          pointer-events: none;
        }
        @keyframes ollinSheenOnceLR {
          0%   { background-position: 220% 0; opacity: 0; }
          12%  { opacity: 0.70; }
          88%  { opacity: 0.70; }
          100% { background-position: -220% 0; opacity: 0; }
        }
        .btnSecondary.btnSecondary14:hover .btnSecondary14Text::after {
          animation: ollinSheenOnceLR 720ms ease-out 1;
        }

        .btnSecondary14Arrow {
          position: relative;
          display: inline-block;
          width: 68px;
          height: 12px;
          margin-left: 6px;
          pointer-events: none;
        }

        .btnSecondary14ArrowLineSvg {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: var(--arrowLen);
          height: 12px;
          overflow: visible;
          transition: width 380ms cubic-bezier(0.2, 0.7, 0.2, 1);
          will-change: width;
        }

        .btnSecondary14ArrowHeadSvg {
          position: absolute;
          left: 0;
          top: 50%;
          width: 13px;
          height: 12px;
          transform: translate3d(calc(var(--arrowLen) - var(--arrowOverlap)), -50%, 0);
          transition: transform 380ms cubic-bezier(0.2, 0.7, 0.2, 1);
          will-change: transform;
        }

        @media (prefers-reduced-motion: reduce) {
          .btnSecondary.btnSecondary14 { transition: none !important; }
          .btnSecondary14ArrowLineSvg,
          .btnSecondary14ArrowHeadSvg { transition: none !important; }
          .btnSecondary.btnSecondary14:hover .btnSecondary14Text::after { animation: none !important; }
        }
      `}</style>

            {/* header (kept compact so the list can fit without scroll) */}
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

                {/* Compact list (landing-like): small, gray, no bold, no hover “OPEN” */}
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
                                fontWeight: 400, // <- no bold
                                fontSize: "14px", // <- smaller
                                lineHeight: 1.35,
                                color: "rgba(0,0,0,0.52)", // <- gray like your landing
                            }}
                            onMouseEnter={(e) => {
                                // subtle hover: just a tiny opacity lift
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

                {/* Bottom line */}
                <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    <span style={{ color: PALETTE.muted }}>Not seeing what you need?</span>

                    {/* ✅ Contact us -> botón v14 (sheen + arrow) */}
                    <button
                        type="button"
                        onClick={openCustomBlank}
                        className={cx("btnSecondary btnSecondary14")}
                    >
                        <span className="btnSecondary14Text" data-text="Contact us">
                            Contact us
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

                    <span style={{ color: "rgba(0,0,0,0.35)" }}>or</span>

                    {/* ✅ Browse all services -> botón v14 (sheen + arrow) */}
                    <button
                        type="button"
                        onClick={() => navigate("/services")}
                        className={cx("btnSecondary btnSecondary14")}
                    >
                        <span className="btnSecondary14Text" data-text="Browse all services">
                            Browse all services
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

            {/* Overlay Form */}
            {openKey && (
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
                            className={cx("w-full max-w-2xl border rounded-none")}
                            style={{
                                borderColor: LINE,
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
                                            {draft.serviceName || selectedItem?.label || "Service"}
                                        </div>

                                        <div className="mt-2 text-sm leading-relaxed" style={{ color: PALETTE.muted }}>
                                            {isCustom
                                                ? "Describe what you need — we’ll reply with a clean scope."
                                                : selectedItem?.hint ?? "We’ll reply with a clean scope (what’s included + timeline)."}
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
                                            label={isCustom ? "What do you need?" : "Any context (optional)"}
                                            value={draft.details}
                                            onChange={(v) => setDraft((d) => ({ ...d, details: v }))}
                                            textarea
                                            className="md:col-span-2"
                                            placeholder={
                                                isCustom
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
