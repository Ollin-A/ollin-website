import React from "react";
import { cx } from "./cx";

export function Card({
    tone = "glass",
    className = "",
    children,
}: {
    tone?: "glass" | "soft" | "mid";
    className?: string;
    children: React.ReactNode;
}) {
    const bg =
        tone === "glass" ? "bg-white/35" : tone === "soft" ? "bg-white/20" : "bg-white/30";
    return (
        <div
            className={cx(
                `rounded-none border border-black/10 ${bg} p-6 sm:p-7 md:p-9`,
                "max-md:max-w-full max-md:box-border max-md:overflow-hidden",
                className
            )}
        >
            {children}
        </div>
    );
}
