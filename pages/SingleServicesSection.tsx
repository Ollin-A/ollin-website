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

            <style>{`
        .btnSecondary.btnSecondary14 {
          color: #6b6b6b;
          background: transparent;
          border: 0;
          padding: 0;              
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          transition: color 280ms ease-out;

          transform: none !important; 
          will-change: auto;

          --arrowLen: 18px;
          --arrowLenHover: 46px;
          --arrowOverlap: 7.5px;
        }
        .btnSecondary.btnSecondary14:hover {
          color: #111111;
          --arrowLen: var(--arrowLenHover);
          transform: none !important; 
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
