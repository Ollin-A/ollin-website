// PersonalizedPackage_Presets.tsx
import React from "react";
import { Check } from "lucide-react";

type ServiceDef = {
    id: string;
    title: string;
};

type PresetDef = {
    id: string;
    title: string;
    tagline: string;
    icon: React.ReactNode;
    services: string[];
    defaults: Record<string, Record<string, any>>;
};

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type Props = {
    SERVICES: ServiceDef[];
    PRESETS: PresetDef[];

    presetId: string;

    onApplyPreset: (p: PresetDef) => void;
    onStartFromScratch: () => void;
};

const PersonalizedPackagePresets: React.FC<Props> = ({
    PRESETS,
    presetId,
    onApplyPreset,
    onStartFromScratch,
}) => {
    return (
        <section className="mt-10" aria-label="Package presets">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                {PRESETS.map((p) => {
                    const active = presetId === p.id;

                    return (
                        <button
                            key={p.id}
                            type="button"
                            onClick={() => (active ? onStartFromScratch() : onApplyPreset(p))}
                            aria-pressed={active}
                            className={cx(
                                "group relative rounded-3xl border px-3 py-5 md:px-5 md:py-7 transition select-none",
                                "flex flex-col items-center justify-center text-center gap-3",
                                active
                                    ? "border-black bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
                                    : "border-black/10 bg-white/50 hover:bg-white hover:border-black/20"
                            )}
                        >
                            {/* Icon */}
                            <span
                                className={cx(
                                    "w-10 h-10 rounded-2xl border flex items-center justify-center transition",
                                    active
                                        ? "border-black bg-black text-white"
                                        : "border-black/10 bg-white text-black"
                                )}
                            >
                                {p.icon}
                            </span>

                            {/* Title */}
                            <span className="text-[11px] md:text-[13px] tracking-[0.14em] text-black/70 uppercase font-medium">
                                {p.title}
                            </span>

                            {/* Selected indicator (no text) */}
                            {active && (
                                <span className="absolute top-3 right-3 inline-flex items-center justify-center w-6 h-6 rounded-full border border-black bg-white text-black">
                                    <Check size={14} />
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </section>
    );
};

export default PersonalizedPackagePresets;
