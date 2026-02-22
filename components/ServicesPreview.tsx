import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLeadModal } from "./LeadModalContext";

type Headline = { muted: string; strong: string };

type ServiceGroup = {
    key: string;
    title: string; // SOLO texto (sin ">"), se anima
    subtitle: string; // línea corta (más chica)
    items: string[]; // lista larga (fade hacia abajo)
    ctaLabel: string;
    to: string;
};

function scrollToId(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * DecryptedText (misma lógica/feel del snippet que mandaste),
 * pero renderizando el texto como STRING (1 nodo) para NO romper tracking-widest / uppercase.
 *
 * - Hover: empieza
 * - Mouse leave: se resetea (se apaga) y queda normal
 * - Sequential + revealDirection start (por default) = “decrypt” real
 */
function DecryptedTitleText({
    text,
    isHovering,
    speed = 50,
    maxIterations = 10,
    sequential = true,
    revealDirection = "start",
    useOriginalCharsOnly = false,
    characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
    wrapperClassName = "inline-block whitespace-nowrap",
}: {
    text: string;
    isHovering: boolean;
    speed?: number;
    maxIterations?: number;
    sequential?: boolean;
    revealDirection?: "start" | "end" | "center";
    useOriginalCharsOnly?: boolean;
    characters?: string;
    wrapperClassName?: string;
}) {
    const [displayText, setDisplayText] = useState<string>(text);
    const [isScrambling, setIsScrambling] = useState<boolean>(false);
    const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());

    // Keep display in sync if text changes.
    useEffect(() => {
        if (!isHovering) setDisplayText(text);
    }, [text, isHovering]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        let currentIteration = 0;

        const getNextIndex = (revealedSet: Set<number>): number => {
            const textLength = text.length;

            switch (revealDirection) {
                case "start":
                    return revealedSet.size;

                case "end":
                    return textLength - 1 - revealedSet.size;

                case "center": {
                    const middle = Math.floor(textLength / 2);
                    const offset = Math.floor(revealedSet.size / 2);
                    const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;

                    if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) return nextIndex;

                    for (let i = 0; i < textLength; i++) {
                        if (!revealedSet.has(i)) return i;
                    }
                    return 0;
                }

                default:
                    return revealedSet.size;
            }
        };

        const availableChars = useOriginalCharsOnly
            ? Array.from(new Set(text.split(""))).filter((char) => char !== " ")
            : characters.split("");

        const shuffleText = (originalText: string, currentRevealed: Set<number>): string => {
            if (useOriginalCharsOnly) {
                const positions = originalText.split("").map((char, i) => ({
                    char,
                    isSpace: char === " ",
                    index: i,
                    isRevealed: currentRevealed.has(i),
                }));

                const nonSpaceChars = positions
                    .filter((p) => !p.isSpace && !p.isRevealed)
                    .map((p) => p.char);

                for (let i = nonSpaceChars.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [nonSpaceChars[i], nonSpaceChars[j]] = [nonSpaceChars[j], nonSpaceChars[i]];
                }

                let charIndex = 0;
                return positions
                    .map((p) => {
                        if (p.isSpace) return " ";
                        if (p.isRevealed) return originalText[p.index];
                        return nonSpaceChars[charIndex++] ?? "";
                    })
                    .join("");
            }

            return originalText
                .split("")
                .map((char, i) => {
                    if (char === " ") return " ";
                    if (currentRevealed.has(i)) return originalText[i];
                    return availableChars[Math.floor(Math.random() * availableChars.length)];
                })
                .join("");
        };

        // If not hovering: reset exactly like the snippet.
        if (!isHovering) {
            setDisplayText(text);
            setRevealedIndices(new Set());
            setIsScrambling(false);
            return () => {
                if (interval) clearInterval(interval);
            };
        }

        // Hovering: start scrambling exactly like the snippet.
        setIsScrambling(true);

        interval = setInterval(() => {
            setRevealedIndices((prevRevealed) => {
                if (sequential) {
                    if (prevRevealed.size < text.length) {
                        const nextIndex = getNextIndex(prevRevealed);
                        const newRevealed = new Set<number>(prevRevealed);
                        newRevealed.add(nextIndex);
                        setDisplayText(shuffleText(text, newRevealed));
                        return newRevealed;
                    } else {
                        if (interval) clearInterval(interval);
                        setIsScrambling(false);
                        setDisplayText(text);
                        return prevRevealed;
                    }
                } else {
                    setDisplayText(shuffleText(text, prevRevealed));
                    currentIteration += 1;

                    if (currentIteration >= maxIterations) {
                        if (interval) clearInterval(interval);
                        setIsScrambling(false);
                        setDisplayText(text);
                    }

                    return prevRevealed;
                }
            });
        }, speed);

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isHovering, text, speed, maxIterations, sequential, revealDirection, characters, useOriginalCharsOnly]);

    return (
        <span className={wrapperClassName}>
            <span className="sr-only">{text}</span>
            <span aria-hidden="true">{isScrambling ? displayText : text}</span>
        </span>
    );
}

function RotatingHeadline({
    phrases,
    intervalMs = 2600,
}: {
    phrases: Headline[];
    intervalMs?: number;
}) {
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        const t = window.setInterval(() => {
            setIdx((p) => (p + 1) % phrases.length);
        }, intervalMs);
        return () => window.clearInterval(t);
    }, [phrases.length, intervalMs]);

    // Altura fija para que NO cambie el layout al cambiar texto.
    return (
        <div className="relative w-full">
            <div className="h-[180px] sm:h-[210px] md:h-[240px] lg:h-[270px]">
                {phrases.map((p, i) => {
                    const active = i === idx;
                    return (
                        <div
                            key={`${p.muted}-${p.strong}-${i}`}
                            className={[
                                "absolute inset-0",
                                "transition-all duration-500 ease-out",
                                active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none",
                            ].join(" ")}
                        >
                            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[0.92] font-medium">
                                <span className="block text-ollin-black/35">{p.muted}</span>
                                <span className="block text-ollin-black">{p.strong}</span>
                            </h2>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/**
 * Botón estilo Made-in-Evolve:
 * - Base: limpio, opaco, sin ver nada de atrás
 * - Punto rojo (círculo) a la izquierda
 * - Hover: el MISMO círculo se expande y llena todo el botón de rojo
 */
function BlobCTA({
    label,
    onClick,
    className = "",
}: {
    label: string;
    onClick: () => void;
    className?: string;
}) {
    const RED = "#E11D2E";

    return (
        <button
            onClick={onClick}
            className={[
                "group/cta relative isolate overflow-hidden",
                "rounded-full",
                "bg-[#F2F2F2]", // ✅ antes: bg-ollin-bg
                "border border-black/15",
                "text-ollin-black",
                "flex items-center justify-center",
                "font-semibold",
                "transition-colors duration-200",
                className,
            ].join(" ")}
        >
            {/* Un solo círculo (dot + fill) */}
            <span
                className={[
                    "absolute left-6 top-1/2 -translate-y-1/2",
                    "h-3 w-3 rounded-full",
                    "transform-gpu",
                    "transition-transform duration-300 ease-out",
                    "group-hover/cta:scale-[260]",
                    "z-0",
                ].join(" ")}
                style={{ backgroundColor: RED }}
            />

            <span className="relative z-10 px-10 text-center whitespace-nowrap transition-colors duration-200 group-hover/cta:text-white">
                {label}
            </span>
        </button>
    );
}

function ServiceCardContent({ group, openModal }: { group: ServiceGroup; openModal: () => void }) {
    const [isHovering, setIsHovering] = useState(false);
    const navigate = useNavigate();

    return (
        <div
            className="w-full h-full"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Header */}
            <div className="mb-4">
                <div className="flex items-start gap-2">
                    <span className="text-[14px] md:text-sm font-bold tracking-widest uppercase text-ollin-black/60 leading-none mt-[2px]">
                        &gt;
                    </span>

                    <div className="text-[14px] md:text-sm font-bold tracking-widest uppercase text-ollin-black/60 leading-none">
                        <DecryptedTitleText
                            text={group.title}
                            isHovering={isHovering}
                            speed={50}
                            sequential
                            revealDirection="start"
                            useOriginalCharsOnly={false}
                            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+"
                        />
                    </div>
                </div>

                <div className="mt-3 text-xs md:text-sm text-ollin-black/70">{group.subtitle}</div>
            </div>

            {/* Long list */}
            <div
                className={[
                    "mt-6",
                    "text-[13px] md:text-[14px]",
                    "leading-[1.85]",
                    "text-ollin-black/65",
                    "overflow-hidden",
                    "h-[200px] md:h-[245px]",
                    "mask-[linear-gradient(to_bottom,black_75%,transparent)]",
                    "pointer-events-none select-none",
                ].join(" ")}
            >
                <ul className="space-y-1.5">
                    {group.items.map((it) => (
                        <li key={it} className="whitespace-nowrap">
                            {it}
                        </li>
                    ))}
                </ul>
            </div>

            {/* ✅ CTA SUBIDO (más aire) */}
            <BlobCTA
                label={group.ctaLabel}
                onClick={() => navigate(group.to)}
                className={[
                    "absolute left-7 md:left-8",
                    "bottom-10 md:bottom-11", // 👈 antes: bottom-7 (muy pegado)
                    "w-[260px] max-w-[calc(100%-3.5rem)]",
                    "h-[52px]",
                    "opacity-0 translate-y-2",
                    "transition-all duration-250",
                    "group-hover:opacity-100 group-hover:translate-y-0",
                ].join(" ")}
            />
        </div>
    );
}

const ServicesPreview: React.FC = () => {
    const { openModal } = useLeadModal();
    const navigate = useNavigate();

    const headlines: Headline[] = useMemo(
        () => [
            { muted: "Brand + website + ads.", strong: "More calls. More booked jobs." },
            { muted: "Get found on Google Maps.", strong: "Calls from people ready to hire." },
            { muted: "A website that actually converts.", strong: "So visitors turn into estimates." },
            { muted: "Social media that brings calls.", strong: "Consistent posts, weekly." },
            { muted: "Custom website that sells.", strong: "Built for your service area." },
            { muted: "More estimates. Better close rate.", strong: "A pipeline that doesn’t leak." },
            { muted: "Reviews on autopilot.", strong: "More 5-stars. More trust." },
            { muted: "Look premium in your market.", strong: "So customers choose you first." },
            { muted: "Better photos. Better copy.", strong: "Make your work sell itself." },
            { muted: "Ads that bring the right jobs.", strong: "Not random calls. Real leads." },
            { muted: "Google + Meta, managed weekly.", strong: "Spend smarter. Book more." },
            { muted: "Clear pricing. Clear process.", strong: "Less back-and-forth. More wins." },
            { muted: "Your best work deserves visibility.", strong: "We make people notice you." },
            { muted: "One team. All-in.", strong: "Everything to book more jobs." },
            { muted: "More calls from your service area.", strong: "Not outside your radius." },
            { muted: "Missed calls cost money.", strong: "We help you catch them." },
            { muted: "English + Spanish support.", strong: "Same team. Faster execution." },
            { muted: "Your competitors look the same.", strong: "We make you stand out." },
            { muted: "Turn “maybe” into “booked.”", strong: "Follow-ups that close." },
            { muted: "Make your phone ring again.", strong: "Consistent leads, every week." },
        ],
        []
    );

    const groups: ServiceGroup[] = useMemo(
        () => [
            {
                key: "foundation",
                title: "LOOK PRO + TRUST",
                subtitle: "Brand + assets that look premium.",
                items: [
                    "Logo + brand refresh",
                    "Before/after portfolio layout",
                    "Project photo direction",
                    "Copy that sounds like you",
                    "Service pages that sell",
                    "Landing pages",
                    "Offer structure",
                    "Premium-looking design system",
                    "Trust signals (licenses, badges)",
                    "Testimonials formatting",
                    "Crew / about section",
                    "Neighborhood / city pages",
                    "Seasonal promos",
                    "Commercial vs residential positioning",
                    "Warranty / guarantees messaging",
                    "Estimate request flow",
                    "FAQ that reduces objections",
                    "Competitor differentiation",
                    "Brand guidelines (simple)",
                    "Reusable templates",
                    "Print-ready assets",
                    "Yard sign / truck copy ideas",
                    "Jobsite photo checklist",
                    "Social proof packaging",
                    "Case study formatting",
                    "Reputation positioning",
                ],
                ctaLabel: "Explore Foundation",
                to: "/services/foundation",
            },
            {
                key: "demand",
                title: "MORE CALLS + ESTIMATES",
                subtitle: "Traffic you can actually convert.",
                items: [
                    "Google Ads setup",
                    "Meta Ads setup",
                    "Local service area targeting",
                    "Call-focused campaigns",
                    "Lead forms that qualify",
                    "Budget optimization",
                    "Negative keyword cleanup",
                    "Ad copy testing",
                    "Creative testing (simple)",
                    "Landing page iteration",
                    "Offer testing",
                    "Call tracking setup",
                    "Lead quality filters",
                    "Retargeting",
                    "Seasonal campaigns",
                    "Service area expansion",
                    "Google Business Profile boosts",
                    "Local SEO & Maps",
                    "Map pack ranking plan",
                    "Citations & NAP consistency",
                    "Reviews velocity strategy",
                    "Photo posting strategy",
                    "Category optimization",
                    "Keyword + service mapping",
                    "Competitor conquest (careful)",
                    "Weekly tuning",
                ],
                ctaLabel: "Explore Demand",
                to: "/services/demand",
            },
            {
                key: "conversion",
                title: "FOLLOW-UPS + 5-STARS",
                subtitle: "Follow-ups, reviews, repeat jobs.",
                items: [
                    "Digital Secretary",
                    "Call + SMS handling",
                    "Fast replies system",
                    "Quote follow-ups",
                    "No-show protection",
                    "Estimate reminders",
                    "Missed call text-back",
                    "Review requests on autopilot",
                    "Review boost engine",
                    "Reputation monitoring",
                    "Repeat jobs engine",
                    "Referral loops",
                    "Upsell sequences",
                    "Seasonal check-ins",
                    "Reactivation campaigns",
                    "Appointment confirmations",
                    "Simple CRM hygiene",
                    "Lead pipeline labeling",
                    "Inbox routing",
                    "DM + comment routing",
                    "Social management",
                    "Content calendar support",
                    "Jobsite post templates",
                    "Before/after posting system",
                    "Customer follow-up scripts",
                    "English/Spanish responses",
                ],
                ctaLabel: "Explore Retention",
                to: "/services/retention",
            },
        ],
        []
    );

    // ✅ hover state SOLO para el callout (para no tocar nada más)
    const [isAuditHovering, setIsAuditHovering] = useState(false);

    return (
        <section id="services" className="relative w-full bg-[#F2F2F2] text-ollin-black py-20 md:py-28">
            {/* ✅ Botón 14islands (versión compacta para "Explore services") */}
            <style>{`
        .btnSecondary.btnSecondary14 {
          color: #6b6b6b;
          background: transparent;
          border: 0;
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          transition: color 280ms ease-out;

          /* misma lógica que el "código ganador" */
          --arrowLen: 18px;
          --arrowLenHover: 46px;
          --arrowOverlap: 7.5px;
        }
        .btnSecondary.btnSecondary14:hover {
          color: #111111;
          --arrowLen: var(--arrowLenHover);
        }

        /* SHEEN (igual que ganador) */
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

        /* Flecha (igual que ganador) */
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

        /* ✅ Compacto SOLO para este CTA */
        .btnSecondary14--sm {
          font-size: 14px;         /* parecido a tu text-sm */
          font-weight: 600;
          border-bottom: 1px solid rgba(17,17,17,0.9); /* igual a tu border-b */
          padding-bottom: 2px;     /* pb-0.5-ish */
        }
        .btnSecondary14--sm .btnSecondary14Arrow {
          width: 56px;             /* menos espacio reservado */
          height: 11px;
          margin-left: 6px;
        }
        .btnSecondary14--sm .btnSecondary14ArrowLineSvg {
          height: 11px;
        }
        .btnSecondary14--sm .btnSecondary14ArrowHeadSvg {
          width: 12px;
          height: 11px;
        }
        .btnSecondary14--sm line,
        .btnSecondary14--sm path {
          stroke-width: 1;         /* igual que ganador */
        }

        @media (prefers-reduced-motion: reduce) {
          .btnSecondary.btnSecondary14 { transition: none !important; }
          .btnSecondary14ArrowLineSvg,
          .btnSecondary14ArrowHeadSvg { transition: none !important; }
          .btnSecondary.btnSecondary14:hover .btnSecondary14Text::after { animation: none !important; }
        }
      `}</style>

            <div className="max-w-[1500px] mx-auto px-[5vw] w-full">
                {/* TOP ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start mb-12 md:mb-16">
                    <RotatingHeadline phrases={headlines} intervalMs={2600} />

                    <div className="lg:pt-3">
                        <p className="text-base md:text-lg leading-snug opacity-80 max-w-[520px]">
                            Everything contractors need: brand, demand generation, and follow-up systems—built to turn clicks into booked jobs.
                        </p>

                        <button
                            onClick={() => scrollToId("contact")}
                            className="mt-7 btnSecondary btnSecondary14 btnSecondary14--sm"
                        >
                            <span className="btnSecondary14Text" data-text="Explore services">
                                Explore services
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

                {/* CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {groups.map((g) => (
                        <div
                            key={g.key}
                            className={[
                                "group relative",
                                "rounded-none",
                                "border border-black/10",
                                "bg-[#F2F2F2]", // ✅ antes: bg-ollin-bg
                                "text-ollin-black",
                                "overflow-hidden",
                                "h-[330px] md:h-[380px]",
                                "p-7 md:p-8",
                                "transition-all duration-300",
                                "hover:border-black/20",
                            ].join(" ")}
                            onMouseEnter={() => {}} 
                            onMouseLeave={() => {}}
                        >
                            <ServiceCardContent group={g} openModal={openModal} />
                        </div>
                    ))}
                </div>

                {/* CALLOUT */}
                <div
                    className={[
                        "group relative",
                        "mt-10 md:mt-12 w-full",
                        "border border-black/10",
                        "rounded-none",
                        "py-7 px-6 md:px-10",
                        "flex flex-col md:flex-row items-center justify-between gap-6",
                        "bg-white/0",
                    ].join(" ")}
                    onMouseEnter={() => setIsAuditHovering(true)}
                    onMouseLeave={() => setIsAuditHovering(false)}
                >
                    <span className="text-lg md:text-2xl font-medium tracking-tight">
                        <DecryptedTitleText
                            text="Start with the 360° Revenue Leak Audit."
                            isHovering={isAuditHovering}
                            speed={50}
                            sequential
                            revealDirection="start"
                            useOriginalCharsOnly={false}
                            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+"
                            wrapperClassName="inline-block whitespace-normal"
                        />
                    </span>

                    <BlobCTA
                        label="Get the Audit"
                        onClick={() => navigate("/services/audit")}
                        className={[
                            "w-[220px] h-[52px]",
                            "opacity-0 translate-y-2",
                            "transition-all duration-250",
                            "group-hover:opacity-100 group-hover:translate-y-0",
                        ].join(" ")}
                    />
                </div>
            </div>
        </section>
    );
};

export default ServicesPreview;
