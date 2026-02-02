import React, { useEffect, useRef, useState } from "react";

type RevealProps = {
    children: React.ReactNode;
    className?: string;
    delay?: number; // seconds
};

const Reveal: React.FC<RevealProps> = ({ children, className = "", delay = 0 }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const reduce =
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

        if (reduce) {
            setShown(true);
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    setShown(true);
                    io.disconnect();
                }
            },
            { threshold: 0.12 }
        );

        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: shown ? 1 : 0,
                transform: shown ? "translateY(0px)" : "translateY(12px)",
                transitionProperty: "opacity, transform",
                transitionDuration: "700ms",
                transitionTimingFunction: "cubic-bezier(0.2, 0.8, 0.2, 1)",
                transitionDelay: `${delay}s`,
                willChange: "opacity, transform",
            }}
        >
            {children}
        </div>
    );
};

export default Reveal;
