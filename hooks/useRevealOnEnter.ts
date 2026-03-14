import { useEffect, useRef, useState } from "react";

export function useRevealOnEnter(threshold = 0.35) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        if (revealed) return;

        const el = ref.current;
        if (!el || typeof IntersectionObserver === "undefined") {
            setRevealed(true);
            return;
        }

        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setRevealed(true);
                    io.disconnect();
                }
            },
            { threshold, rootMargin: "0px 0px -10% 0px" }
        );

        io.observe(el);
        return () => io.disconnect();
    }, [revealed, threshold]);

    return { ref, revealed } as const;
}
