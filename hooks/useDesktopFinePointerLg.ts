import { useState, useEffect } from "react";

export function useDesktopFinePointerLg() {
  const [isDesktopFine, setIsDesktopFine] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsDesktopFine(e.matches);
    };

    handleChange(mq);

    if (mq.addEventListener) {
      mq.addEventListener("change", handleChange);
      return () => mq.removeEventListener("change", handleChange);
    } else {

      mq.addListener(handleChange);
      return () => mq.removeListener(handleChange);
    }
  }, []);

  return isDesktopFine;
}
