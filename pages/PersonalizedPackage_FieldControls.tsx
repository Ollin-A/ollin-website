// PersonalizedPackage_FieldControls.tsx
import React from "react";

export type Option = { value: string; label: string; hint?: string };
export type FieldType = "single" | "multi" | "toggle" | "number" | "text";

export type Field = {
    id: string;
    label: string;
    type: FieldType;
    helper?: string;
    optional?: boolean;
    options?: Option[];
    min?: number;
    max?: number;
    placeholder?: string;
    defaultValue?: any;
};

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

const Chip: React.FC<{
    selected?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
    hint?: string;
}> = ({ selected: isOn, onClick, children, hint }) => (
    <button
        type="button"
        onClick={onClick}
        className={cx(
            "px-3.5 py-3 md:px-5 md:py-2.5 rounded-full border text-[13px] md:text-sm transition",
            "select-none active:scale-[0.98] leading-none",
            isOn
                ? "border-black bg-black text-white"
                : "border-black/15 bg-white text-black hover:border-black/30"
        )}
        title={hint}
    >
        {children}
    </button>
);

const Toggle: React.FC<{
    value: boolean;
    onChange: (v: boolean) => void;
}> = ({ value, onChange }) => (
    <button
        type="button"
        onClick={() => onChange(!value)}
        className={cx(
            "w-11 h-6 rounded-full border transition relative",
            value ? "bg-black border-black" : "bg-white border-black/20"
        )}
        aria-pressed={value}
    >
        <span
            className={cx(
                "absolute top-0.5 w-5 h-5 rounded-full transition",
                value ? "left-5 bg-white" : "left-0.5 bg-black"
            )}
        />
    </button>
);

type FieldControlProps = {
    serviceId: string;
    field: Field;
    value: any;
    onChange: (serviceId: string, fieldId: string, value: any) => void;
};

export const FieldControl: React.FC<FieldControlProps> = ({
    serviceId,
    field,
    value,
    onChange,
}) => {
    // single
    if (field.type === "single" && field.options) {
        return (
            <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                    {field.options.map((opt) => (
                        <Chip
                            key={opt.value}
                            selected={value === opt.value}
                            hint={opt.hint}
                            onClick={() => onChange(serviceId, field.id, opt.value)}
                        >
                            {opt.label}
                        </Chip>
                    ))}
                </div>
            </div>
        );
    }

    // multi
    if (field.type === "multi" && field.options) {
        const arr = Array.isArray(value) ? value : [];
        return (
            <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                    {field.options.map((opt) => {
                        const on = arr.includes(opt.value);
                        return (
                            <Chip
                                key={opt.value}
                                selected={on}
                                hint={opt.hint}
                                onClick={() => {
                                    const next = on
                                        ? arr.filter((x) => x !== opt.value)
                                        : [...arr, opt.value];
                                    onChange(serviceId, field.id, next);
                                }}
                            >
                                {opt.label}
                            </Chip>
                        );
                    })}
                </div>
            </div>
        );
    }

    // toggle
    if (field.type === "toggle") {
        const bool = Boolean(value);
        return (
            <div className="flex items-center gap-3">
                <Toggle value={bool} onChange={(nv) => onChange(serviceId, field.id, nv)} />
                <div className="text-sm text-black/70">{bool ? "Yes" : "No"}</div>
            </div>
        );
    }

    // number
    if (field.type === "number") {
        const min = field.min ?? 0;
        const max = field.max ?? 99;
        const num =
            typeof value === "number"
                ? value
                : field.defaultValue ?? field.min ?? 0;

        return (
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    className="w-12 h-12 rounded-full border border-black/15 hover:border-black/30 bg-white flex items-center justify-center text-xl transition active:scale-[0.92]"
                    onClick={() => onChange(serviceId, field.id, clamp(num - 1, min, max))}
                >
                    −
                </button>

                <div className="min-w-[40px] text-center text-base font-medium">{num}</div>

                <button
                    type="button"
                    className="w-12 h-12 rounded-full border border-black/15 hover:border-black/30 bg-white flex items-center justify-center text-xl transition active:scale-[0.92]"
                    onClick={() => onChange(serviceId, field.id, clamp(num + 1, min, max))}
                >
                    +
                </button>
            </div>
        );
    }

    // text (default)
    return (
        <input
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(serviceId, field.id, e.target.value)}
            placeholder={field.placeholder || ""}
            className="w-full px-4 py-3 rounded-2xl border border-black/15 bg-white outline-none focus:border-black/30"
        />
    );
};
