import React from "react";

export function SectionTitle({
    kicker,
    title,
    subtitle,
    subtitleTablet,
    subtitleMobile,
}: {
    kicker: string;
    title: string;
    subtitle: string;
    subtitleTablet?: string;
    subtitleMobile?: string;
}) {
    return (
        <div className="max-w-[1100px]">
            <p className="text-[11px] md:text-[12px] tracking-[0.28em] uppercase text-ollin-black/45 mb-4 max-md:mb-5">
                {kicker}
            </p>

            <h2 className="font-[Montserrat] font-normal tracking-tight leading-[0.95] text-[clamp(34px,4.4vw,56px)] mb-4">
                {title}
            </h2>

            <p
                className="hidden md:block text-[15px] md:text-[17px] leading-relaxed text-ollin-black/70 max-w-[70ch] max-md:max-w-[46ch]"
                style={{ overflowWrap: "anywhere" }}
            >
                {subtitle}
            </p>

            <p
                className="hidden sm:block md:hidden text-[14px] leading-relaxed text-ollin-black/70 max-w-[58ch] break-words hyphens-auto max-md:[overflow-wrap:anywhere]"
                style={{ overflowWrap: "anywhere" }}
            >
                {subtitleTablet ?? subtitle}
            </p>

            <p
                className="sm:hidden text-[14px] leading-relaxed text-ollin-black/70 max-w-[46ch] break-words hyphens-auto max-md:[overflow-wrap:anywhere]"
                style={{ overflowWrap: "anywhere" }}
            >
                {subtitleMobile ?? subtitleTablet ?? subtitle}
            </p>
        </div>
    );
}
