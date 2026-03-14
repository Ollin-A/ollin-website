import { useEffect, useState } from "react";

interface DeviceCapability {
    isLowPower: boolean;
    isMobile: boolean;
    prefersReducedMotion: boolean;
    supportsWebGL: boolean;
}

const SSR_DEFAULTS: DeviceCapability = {
    isLowPower: true,
    isMobile: false,
    prefersReducedMotion: false,
    supportsWebGL: false,
};

export function useDeviceCapability(): DeviceCapability {
    const [cap, setCap] = useState<DeviceCapability>(SSR_DEFAULTS);

    useEffect(() => {
        const mobileMq = window.matchMedia("(hover: none) and (pointer: coarse)");
        const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");

        let webgl = false;
        try {
            const c = document.createElement("canvas");
            webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
        } catch {
            webgl = false;
        }

        const update = () => {
            const mobile = mobileMq.matches;
            const motion = motionMq.matches;
            setCap({
                isMobile: mobile,
                prefersReducedMotion: motion,
                supportsWebGL: webgl,
                isLowPower: mobile || motion || !webgl,
            });
        };

        update();
        mobileMq.addEventListener("change", update);
        motionMq.addEventListener("change", update);
        return () => {
            mobileMq.removeEventListener("change", update);
            motionMq.removeEventListener("change", update);
        };
    }, []);

    return cap;
}
