import React from "react";

export function Label({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-[13px] tracking-[0.2em] uppercase text-ollin-black/45 mb-3 md:mb-4">
            {children}
        </p>
    );
}
