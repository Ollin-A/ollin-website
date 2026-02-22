// PersonalizedPackage_Builder.tsx
import React from "react";
import { ChevronDown, ChevronUp, X, Check, Trash2 } from "lucide-react";
import { FieldControl, type Field } from "./PersonalizedPackage_FieldControls";

type ServiceDef = {
  id: string;
  title: string;
  blurb: string;
  fields: Field[];
};

type PresetLike = {
  id: string;
  title: string;
  tagline: string;
} | null;

type Completeness = {
  missing: number;
  required: number;
  pct: number;
  label: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  SERVICES: ServiceDef[];
  selectedServices: ServiceDef[];

  selected: Record<string, boolean>;
  expanded: Record<string, boolean>;
  answers: Record<string, Record<string, any>>;

  preset: PresetLike;
  completeness: Completeness;

  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;

  toggleService: (serviceId: string, on?: boolean) => void;
  setFieldValue: (serviceId: string, fieldId: string, value: any) => void;

  summarizeService: (service: ServiceDef) => string[];

  onOpenModal: () => void;
  onSetCustom: () => void;
};

const PersonalizedPackageBuilder: React.FC<Props> = ({
  SERVICES,
  selectedServices,
  selected,
  expanded,
  answers,
  preset: _preset,
  completeness: _completeness,
  setExpanded,
  toggleService,
  setFieldValue,
  summarizeService,
  onOpenModal,
  onSetCustom,
}) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const canRequest = selectedServices.length > 0;

  return (
    <>
      <section className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:items-start">
        {/* Left: Services */}
        <div className="space-y-3 pb-24 lg:pb-0">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-sm text-black/60">Modules</div>
              <div className="text-xl font-semibold tracking-tight mt-1">
                Select services
              </div>
            </div>
          </div>

          {SERVICES.map((service) => {
            const isOn = !!selected[service.id];
            const isOpen = !!expanded[service.id];

            return (
              <div
                key={service.id}
                className={cx(
                  "rounded-3xl border bg-white transition",
                  isOn
                    ? "border-black/25 shadow-[0_18px_60px_rgba(0,0,0,0.06)]"
                    : "border-black/10 hover:border-black/20",
                )}
              >
                <div className="p-4 md:p-5">
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => {
                        toggleService(service.id);
                        onSetCustom();
                      }}
                      className={cx(
                        "mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition",
                        isOn
                          ? "bg-black border-black text-white"
                          : "bg-white border-black/15",
                      )}
                      aria-pressed={isOn}
                    >
                      {isOn ? <Check size={16} /> : null}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-[15px] md:text-[16px] font-semibold leading-tight">
                            {/* Mobile/Tablet (< lg): Always clean title, no parentheses */}
                            <span className="lg:hidden">
                              {service.title
                                .replace(/\s*\([^)]*\)\s*/g, "")
                                .trim()}
                            </span>
                            {/* Desktop (>= lg): Always full title */}
                            <span className="hidden lg:inline">
                              {service.title}
                            </span>
                          </h3>

                          <p className="mt-2 text-sm text-black/65 leading-relaxed max-w-[720px] hidden lg:block">
                            {service.blurb}
                          </p>
                        </div>

                        {/* Expand */}
                        <button
                          type="button"
                          onClick={() => {
                            if (!isOn) {
                              toggleService(service.id, true);
                              onSetCustom();
                              setExpanded((prev) => ({
                                ...prev,
                                [service.id]: true,
                              }));
                              return;
                            }
                            setExpanded((prev) => ({
                              ...prev,
                              [service.id]: !prev[service.id],
                            }));
                          }}
                          className="mt-1 w-10 h-10 rounded-2xl border border-black/10 bg-white hover:border-black/20 transition flex items-center justify-center"
                          aria-label={isOpen ? "Collapse" : "Expand"}
                        >
                          {isOpen ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </button>
                      </div>

                      {/* Expanded body */}
                      <div
                        className={cx(
                          "grid transition-all duration-300 ease-out",
                          isOn && isOpen
                            ? "grid-rows-[1fr] opacity-100 mt-4"
                            : "grid-rows-[0fr] opacity-0 mt-0",
                        )}
                      >
                        <div className="overflow-hidden">
                          <div className="pt-2 border-t border-black/10">
                            <div className="mt-4 space-y-5">
                              {/* Mobile/Tablet: Description moves here */}
                              <div className="lg:hidden text-sm text-black/65 leading-relaxed">
                                {service.blurb}
                              </div>
                              {service.fields.map((f) => (
                                <div key={f.id}>
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <div className="text-sm font-semibold">
                                        {f.label}
                                        {f.optional && (
                                          <span className="ml-2 text-xs text-black/45">
                                            (optional)
                                          </span>
                                        )}
                                      </div>

                                      {f.helper && (
                                        <div className="mt-1 text-sm text-black/55">
                                          {f.helper}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="mt-3">
                                    <FieldControl
                                      serviceId={service.id}
                                      field={f}
                                      value={(answers[service.id] || {})[f.id]}
                                      onChange={setFieldValue}
                                    />
                                  </div>
                                </div>
                              ))}

                              <div className="flex items-center justify-end pt-2">
                                {/* Mobile: Trash Icon */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    toggleService(service.id, false);
                                    onSetCustom();
                                  }}
                                  className="md:hidden w-12 h-12 flex items-center justify-center text-black/40 hover:text-red-600 transition active:scale-90"
                                  aria-label="Remove service"
                                >
                                  <Trash2 size={22} />
                                </button>

                                {/* Desktop: Text Link */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    toggleService(service.id, false);
                                    onSetCustom();
                                  }}
                                  className="hidden md:block text-sm text-black/55 hover:text-black transition"
                                >
                                  Remove service
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* end expanded body */}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Summary Panel (Desktop) */}
        <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start lg:z-20">
          <div className="rounded-3xl border border-black/10 bg-black text-white overflow-hidden h-[calc(100vh-6rem)]">
            <div className="p-5 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="text-[12px] tracking-[0.22em] uppercase text-white/70">
                  Your Plan
                </div>
                <div className="text-sm text-white/70">
                  {selectedServices.length} services
                </div>
              </div>

              {/* Scroll area (only this scrolls) */}
              <div className="relative flex-1 min-h-0 mt-5">
                {/* Fades */}
                <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-black to-transparent z-10" />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black to-transparent z-10" />
                <div className="ollinScrollbar relative z-0 h-full overflow-auto pr-2 pt-2 pb-3 space-y-3">
                  {selectedServices.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/70 text-sm">
                      Select services to begin.
                    </div>
                  ) : (
                    selectedServices.map((s) => {
                      const bullets = summarizeService(s);
                      return (
                        <div
                          key={s.id}
                          className="rounded-2xl border border-white/10 bg-white/5 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="font-semibold text-white">
                              {s.title}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                toggleService(s.id, false);
                                onSetCustom();
                              }}
                              className="w-8 h-8 rounded-xl border border-white/10 hover:border-white/25 bg-white/5 transition flex items-center justify-center text-white/80"
                              aria-label="Remove"
                            >
                              <X size={16} />
                            </button>
                          </div>

                          <div className="mt-2 space-y-1">
                            {bullets.length === 0 ? (
                              <div className="text-sm text-white/60">
                                (details not provided yet)
                              </div>
                            ) : (
                              bullets.map((b, idx) => (
                                <div
                                  key={idx}
                                  className="text-sm text-white/70"
                                >
                                  • {b}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Footer pinned */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={onOpenModal}
                  className={cx(
                    "w-full rounded-2xl px-4 py-4 text-base font-semibold transition",
                    !canRequest
                      ? "bg-white/10 text-white/40 cursor-not-allowed"
                      : "bg-white text-black hover:bg-white/90",
                  )}
                  disabled={!canRequest}
                >
                  Request Quote
                </button>

                <div className="mt-3 text-xs text-white/60">
                  We’ll review your plan and reply by email.
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>

      {/* Mobile */}
      <div className="lg:hidden">
        {/* Backdrop */}
        {mobileOpen && (
          <button
            type="button"
            className="fixed inset-0 z-20 bg-black/35"
            aria-label="Close plan drawer"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Collapsed bar */}
        {!mobileOpen && (
          <div className="fixed bottom-6 left-4 right-4 z-30 pb-[env(safe-area-inset-bottom)] transition-transform duration-300">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="w-full rounded-3xl border border-black/10 bg-black text-white px-5 py-4 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
              aria-expanded={false}
            >
              <div className="text-left">
                <div className="text-[11px] tracking-[0.22em] uppercase text-white/70">
                  Your plan
                </div>
                <div className="mt-1 text-sm text-white/90 font-medium">
                  {selectedServices.length === 0
                    ? "Empty"
                    : `${selectedServices.length} service${selectedServices.length === 1 ? "" : "s"}`}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-white/50 uppercase tracking-wider">
                  View
                </span>
                <ChevronUp size={18} className="text-white/80" />
              </div>
            </button>
          </div>
        )}

        {/* Drawer */}
        {mobileOpen && (
          <div className="fixed bottom-0 left-0 right-0 z-30">
            <div className="rounded-t-[32px] border-t border-white/10 bg-black text-white px-5 pt-5 pb-6 shadow-[0_-20px_60px_rgba(0,0,0,0.35)] h-[85vh] flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] tracking-[0.22em] uppercase text-white/70">
                    Your plan
                  </div>
                  <div className="mt-1 text-sm text-white/80">
                    {selectedServices.length === 0
                      ? "Empty"
                      : `${selectedServices.length} services`}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="w-10 h-10 rounded-2xl border border-white/10 bg-white/5 hover:border-white/25 transition flex items-center justify-center"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scroll area */}
              <div className="relative flex-1 min-h-0 mt-4">
                <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-black to-transparent z-10" />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black to-transparent z-10" />
                <div className="ollinScrollbar relative z-0 h-full overflow-auto pr-2 pt-2 pb-3 space-y-3">
                  {selectedServices.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/70 text-sm">
                      Select services to begin.
                    </div>
                  ) : (
                    selectedServices.map((s) => {
                      const bullets = summarizeService(s);
                      return (
                        <div
                          key={s.id}
                          className="rounded-2xl border border-white/10 bg-white/5 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="font-semibold text-white">
                              {s.title}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                toggleService(s.id, false);
                                onSetCustom();
                              }}
                              className="w-8 h-8 rounded-xl border border-white/10 hover:border-white/25 bg-white/5 transition flex items-center justify-center text-white/80"
                              aria-label="Remove"
                            >
                              <X size={16} />
                            </button>
                          </div>

                          <div className="mt-2 space-y-1">
                            {bullets.length === 0 ? (
                              <div className="text-sm text-white/60">
                                (details not provided yet)
                              </div>
                            ) : (
                              bullets.map((b, idx) => (
                                <div
                                  key={idx}
                                  className="text-sm text-white/70"
                                >
                                  • {b}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Footer pinned */}
              <div className="mt-4 pt-4 border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
                <button
                  type="button"
                  onClick={onOpenModal}
                  className={cx(
                    "w-full rounded-2xl px-4 py-4 text-base font-semibold transition",
                    !canRequest
                      ? "bg-white/10 text-white/40 cursor-not-allowed"
                      : "bg-white text-black hover:bg-white/90",
                  )}
                  disabled={!canRequest}
                >
                  Request Quote
                </button>

                <div className="mt-3 text-xs text-white/60 mb-2">
                  We’ll review your plan and reply by email.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scrollbar styling */}
      <style>{`
                .ollinScrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255,255,255,0.22) rgba(255,255,255,0.06);
                }
                .ollinScrollbar::-webkit-scrollbar {
                    width: 10px;
                }
                .ollinScrollbar::-webkit-scrollbar-track {
                    background: rgba(255,255,255,0.06);
                    border-radius: 9999px;
                }
                .ollinScrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.18);
                    border-radius: 9999px;
                    border: 2px solid rgba(0,0,0,0.35);
                }
                .ollinScrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255,255,255,0.28);
                }
            `}</style>
    </>
  );
};

export default PersonalizedPackageBuilder;
