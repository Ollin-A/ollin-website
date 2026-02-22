// PersonalizedPackage_Modal.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Check, X } from "lucide-react";

type LeadForm = {
    name: string;
    email: string;
    phone: string;
    businessType: string;

    // legacy (kept for compatibility)
    cityState: string;
    website: string;
    notes: string;
};

type PresetLike =
    | {
        id: string;
        title: string;
        tagline: string;
    }
    | null;

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type Props = {
    isOpen: boolean;
    submitting: boolean;

    lead: LeadForm;
    setLead: React.Dispatch<React.SetStateAction<LeadForm>>;

    selectedServicesCount: number;
    preset: PresetLike;

    submitOk: null | boolean;
    submitMsg: string;

    onClose: () => void;
    onSubmit: () => void;
};

const LINE = "rgba(0,0,0,0.18)";
const TEXT = "rgba(0,0,0,0.90)";
const MUTED = "rgba(0,0,0,0.62)";

export default function PersonalizedPackageModal({
    isOpen,
    submitting,
    lead,
    setLead,
    selectedServicesCount,
    preset,
    submitOk,
    submitMsg,
    onClose,
    onSubmit,
}: Props) {
    const [localError, setLocalError] = useState<string | null>(null);
    const [isShort, setIsShort] = useState(false);

    const hasEmail = useMemo(() => lead.email.trim().length > 0, [lead.email]);
    const hasPhone = useMemo(() => lead.phone.trim().length > 0, [lead.phone]);

    const ctaLabel = useMemo(() => {
        if (hasEmail) return "REQUEST MY PLAN";
        if (hasPhone) return "SUBMIT REQUEST";
        return "REQUEST MY PLAN";
    }, [hasEmail, hasPhone]);

    // Body scroll lock + compact mode by viewport height
    useEffect(() => {
        if (!isOpen) return;

        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const measure = () => {
            // tweak threshold if you want: lower = less aggressive compacting
            setIsShort(window.innerHeight < 780);
        };

        measure();
        window.addEventListener("resize", measure);

        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("resize", measure);
        };
    }, [isOpen]);

    // ESC close
    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !submitting) onClose();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isOpen, submitting, onClose]);

    useEffect(() => {
        if (!isOpen) return;
        setLocalError(null);
    }, [isOpen]);

    if (!isOpen) return null;

    const closeIfAllowed = () => {
        if (!submitting) onClose();
    };

    const submit = () => {
        setLocalError(null);

        if (!lead.name.trim()) {
            setLocalError("Please add your name.");
            return;
        }
        if (!hasEmail && !hasPhone) {
            setLocalError("Add either a phone number or an email.");
            return;
        }

        onSubmit();
    };

    // textarea rows: smaller on short screens
    const contextRows = isShort ? 2 : 3;

    return (
        <div className="fixed inset-0 z-[999]">
            <style>{`
        .ollinGlassCard {
          border: 1px solid ${LINE};
          background: rgba(255,255,255,0.22);
          backdrop-filter: blur(16px) saturate(1.15);
          -webkit-backdrop-filter: blur(16px) saturate(1.15);
          box-shadow: 0 28px 80px rgba(0,0,0,0.18);
        }

        /* Scrim keeps legibility while staying "glass" */
        .ollinScrim {
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.72) 0%,
            rgba(255,255,255,0.62) 48%,
            rgba(255,255,255,0.70) 100%
          );
        }

        .ollinLabel {
          color: ${MUTED};
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-size: 12px;
        }

        .ollinInput,
        .ollinTextarea {
          width: 100%;
          background: transparent;
          border: 0;
          border-bottom: 1px solid rgba(0,0,0,0.22);
          padding: ${isShort ? "8px" : "10px"} 0;
          outline: none;
          border-radius: 0;
          color: ${TEXT};
          font-size: 14px;
        }

        .ollinInput::placeholder,
        .ollinTextarea::placeholder {
          opacity: 0.45;
        }

        .ollinInput:focus,
        .ollinTextarea:focus {
          border-bottom-color: rgba(0,0,0,0.55);
        }

        .ollinTextarea {
          resize: none;
          line-height: 1.6;
        }

        /* 2-column fields even on mobile to reduce height (fallback to 1-col on super narrow) */
        .ollinFields {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: ${isShort ? "16px 40px" : "20px 48px"};
          margin-top: ${isShort ? "20px" : "28px"};
        }
        .ollinSpan2 { grid-column: 1 / -1; }

        @media (max-width: 380px) {
          .ollinFields { grid-template-columns: 1fr; }
          .ollinSpan2 { grid-column: auto; }
        }

        .ollinScroll::-webkit-scrollbar {
          width: 0px;
          height: 0px;
        }

        @media (max-width: 768px) {
          .ollinInput,
          .ollinTextarea {
            font-size: 16px; /* Prevents iOS zoom */
          }
        }
      `}</style>

            {/* Backdrop */}
            <button
                type="button"
                className="absolute inset-0 w-full h-full"
                onClick={closeIfAllowed}
                aria-label="Close overlay"
                style={{
                    background: "rgba(0,0,0,0.22)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                }}
            />

            {/* Center wrapper (use 100dvh to behave on mobile browser UI) */}
            <div className="relative w-full h-[100dvh] flex items-center justify-center px-3 sm:px-4 py-3 sm:py-4">
                <div
                    className="relative w-full max-w-[900px] ollinGlassCard"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        // make sure it never exceeds viewport height; aim for zero scroll
                        maxHeight: "calc(100dvh - 24px)",
                    }}
                >
                    {/* Scrim */}
                    <div className="absolute inset-0 ollinScrim pointer-events-none" />

                    {/* Content */}
                    <div className="relative ollinScroll" style={{ maxHeight: "calc(100dvh - 24px)", overflow: "hidden" }}>
                        <div
                            className={cx("px-6 sm:px-8 md:px-10", isShort ? "pt-6 pb-6" : "pt-8 pb-7")}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between gap-6">
                                <div className="min-w-0">
                                    <div className="text-[11px] uppercase tracking-[0.28em]" style={{ color: MUTED }}>
                                        REQUEST SCOPE
                                    </div>

                                    <h2
                                        className={cx(
                                            "mt-3 font-[Montserrat] font-medium leading-[1.05]",
                                            isShort ? "text-[30px] sm:text-[34px] md:text-[38px]" : "text-[34px] sm:text-[38px] md:text-[44px]"
                                        )}
                                        style={{ color: TEXT }}
                                    >
                                        Let’s build your growth system.
                                    </h2>

                                    <p
                                        className={cx("mt-3 leading-relaxed", isShort ? "text-sm" : "text-sm sm:text-base")}
                                        style={{ color: MUTED }}
                                    >
                                        Share a few details — we’ll reply with a clean scope and your custom plan.
                                    </p>
                                </div>

                                {/* Close */}
                                <button
                                    type="button"
                                    onClick={closeIfAllowed}
                                    className="shrink-0 inline-flex items-center justify-center h-11 w-11 border transition-opacity duration-300 hover:opacity-80"
                                    style={{
                                        borderColor: LINE,
                                        background: "rgba(255,255,255,0.35)",
                                    }}
                                    aria-label="Close modal"
                                >
                                    <X size={18} style={{ color: "rgba(0,0,0,0.70)" }} />
                                </button>
                            </div>

                            <div
                                className={cx("border-t", isShort ? "mt-5" : "mt-6")}
                                style={{ borderColor: LINE, opacity: 0.85 }}
                            />

                            {/* Fields (2-column to reduce height) */}
                            <div className="ollinFields">
                                <Field
                                    label="NAME"
                                    required
                                    value={lead.name}
                                    onChange={(v) => {
                                        setLocalError(null);
                                        setLead((p) => ({ ...p, name: v }));
                                    }}
                                    placeholder="Juan Perez"
                                />

                                <Field
                                    label="BUSINESS TYPE"
                                    required
                                    value={lead.businessType}
                                    onChange={(v) => {
                                        setLocalError(null);
                                        setLead((p) => ({ ...p, businessType: v }));
                                    }}
                                    placeholder="Roofing"
                                />

                                <Field
                                    label="EMAIL"
                                    value={lead.email}
                                    onChange={(v) => {
                                        setLocalError(null);
                                        setLead((p) => ({ ...p, email: v }));
                                    }}
                                    placeholder="juan@company.com"
                                    inputMode="email"
                                />

                                <Field
                                    label="PHONE"
                                    value={lead.phone}
                                    onChange={(v) => {
                                        setLocalError(null);
                                        setLead((p) => ({ ...p, phone: v }));
                                    }}
                                    placeholder="(555) 123-4567"
                                    inputMode="tel"
                                />

                                <Field
                                    className="ollinSpan2"
                                    label="ANY CONTEXT (OPTIONAL)"
                                    value={lead.notes}
                                    onChange={(v) => setLead((p) => ({ ...p, notes: v }))}
                                    placeholder="Example: city/market, deadline, current site link, special constraints..."
                                    textarea
                                    rows={contextRows}
                                />
                            </div>

                            <div
                                className={cx("border-t", isShort ? "mt-5" : "mt-6")}
                                style={{ borderColor: LINE, opacity: 0.85 }}
                            />

                            {/* Bottom bar (config + CTA on same row to save height) */}
                            <div className={cx("flex items-center justify-between gap-4", isShort ? "mt-4" : "mt-5")}>
                                <div className="flex items-start gap-3 min-w-0">
                                    <div
                                        className="w-10 h-10 border flex items-center justify-center"
                                        style={{
                                            borderColor: LINE,
                                            background: "rgba(255,255,255,0.35)",
                                        }}
                                    >
                                        <Check size={18} style={{ color: "rgba(0,0,0,0.78)" }} />
                                    </div>

                                    <div className="min-w-0">
                                        <div className={cx(isShort ? "text-sm" : "text-sm sm:text-base")} style={{ color: "rgba(0,0,0,0.72)" }}>
                                            Including configuration for{" "}
                                            <span style={{ color: TEXT, fontWeight: 600 }}>
                                                {selectedServicesCount} services selected
                                            </span>
                                        </div>
                                        {preset ? (
                                            <div className="text-xs mt-1" style={{ color: "rgba(0,0,0,0.50)" }}>
                                                Starting level: {preset.title}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={submit}
                                    disabled={submitting}
                                    className={cx(
                                        "border px-6 py-3 text-xs uppercase tracking-[0.22em] transition-opacity duration-300 hover:opacity-85 shrink-0",
                                        submitting && "opacity-70 cursor-wait"
                                    )}
                                    style={{
                                        borderColor: LINE,
                                        background: "rgba(255,255,255,0.35)",
                                        color: "rgba(0,0,0,0.78)",
                                    }}
                                >
                                    {submitting ? "SUBMITTING…" : ctaLabel}
                                </button>
                            </div>

                            {/* Error (only appears when needed; keeps layout stable enough) */}
                            {localError ? (
                                <div className={cx(isShort ? "mt-3" : "mt-4", "text-sm")} style={{ color: "rgba(140,0,0,0.92)" }}>
                                    {localError}
                                </div>
                            ) : null}

                            {/* Footer microline (hide on short screens to avoid forcing scroll) */}
                            {!isShort ? (
                                <div className="mt-4 text-xs" style={{ color: "rgba(0,0,0,0.55)" }}>
                                    We’ll reach out shortly with next steps.
                                </div>
                            ) : null}

                            {/* Server message (only when present) */}
                            {submitOk !== null ? (
                                <div className="mt-3 text-sm" style={{ color: submitOk ? TEXT : MUTED }}>
                                    {submitMsg}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
    rows,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    required?: boolean;
    textarea?: boolean;
    className?: string;
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
    rows?: number;
}) {
    return (
        <label className={cx("block min-w-0", className)}>
            <div className="ollinLabel">
                {label} {required ? <span style={{ opacity: 0.55 }}>(REQUIRED)</span> : null}
            </div>

            {textarea ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={rows ?? 3}
                    className="ollinTextarea"
                />
            ) : (
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    inputMode={inputMode}
                    className="ollinInput"
                />
            )}
        </label>
    );
}
