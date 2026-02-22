import { useState, useEffect } from "react";

export function useDesktopFinePointerLg() {
  const [isDesktopFine, setIsDesktopFine] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Media query: min-width: 1024px AND hover: hover AND pointer: fine
    const mq = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsDesktopFine(e.matches);
    };

    // Initial check
    handleChange(mq);

    // Listen for changes
    if (mq.addEventListener) {
      mq.addEventListener("change", handleChange);
      return () => mq.removeEventListener("change", handleChange);
    } else {
      // Fallback for older browsers
      mq.addListener(handleChange);
      return () => mq.removeListener(handleChange);
    }
  }, []);

  return isDesktopFine;
}
