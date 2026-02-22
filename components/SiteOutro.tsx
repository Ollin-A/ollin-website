// SiteOutro.tsx
import React, { useRef } from "react";
import { useInView } from "framer-motion";
import SplashCursor from "./SplashCursor";
import { useDesktopFinePointerLg } from "../hooks/useDesktopFinePointerLg";

const links = [
  { label: "Instagram", href: "https://www.instagram.com/ollinagency/" },
  { label: "X / Twitter", href: "https://x.com/OLLINAGENCY" },
  { label: "Facebook", href: "https://www.facebook.com/ollin.agency" },
  { label: "Threads", href: "https://www.threads.com/@ollinagency" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/ollinagency/" },
  { label: "Privacy", href: "/privacy" },
];

export default function SiteOutro() {
  const sectionRef = useRef<HTMLElement>(null);

  const isInView = useInView(sectionRef, { amount: 0.55 });
  const isDesktopFine = useDesktopFinePointerLg();
  const year = new Date().getFullYear();

  const enabled = isDesktopFine && isInView;

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[100svh] bg-white text-black overflow-hidden"
    >
      {enabled && (
        <SplashCursor
          className="absolute inset-0 w-full h-full z-0"
          enabled={true}
          SPLAT_RADIUS={0.07}
          SPLAT_FORCE={1400}
          DENSITY_DISSIPATION={3.9}
          VELOCITY_DISSIPATION={2.2}
          PRESSURE={0.18}
          PRESSURE_ITERATIONS={18}
          CURL={3.0}
          TRANSPARENT={true}
        />
      )}

      <div className="relative z-10 w-full min-h-[100svh] flex flex-col pointer-events-none">
        
        {/* MOBILE + TABLET */}
        <div className="lg:hidden flex flex-col min-h-[100svh] pointer-events-auto">
          <div className="px-6 sm:px-10 pt-20 sm:pt-24 pb-6">
            <h2 className="font-normal tracking-[-0.04em] leading-[0.98] text-[clamp(2.3rem,8.4vw,3.6rem)]">
              <span className="block">Let’s make something</span>
              <span className="block">worth building</span>
            </h2>
          </div>

          <div className="px-6 sm:px-10">
            <a
              href="mailto:contact@ollin.agency"
              className="inline-flex font-normal text-black no-underline
                         text-[clamp(1.35rem,5.2vw,2.25rem)]
                         leading-[1] tracking-[-0.04em]
                         hover:opacity-70 transition-opacity
                         whitespace-nowrap"
            >
              contact@ollin.agency
            </a>
          </div>

          <div className="flex-1" />

          <div className="px-6 sm:px-10 pb-10 sm:pb-12">
            <div className="grid grid-cols-2 gap-x-14 gap-y-6 justify-items-center sm:justify-items-start mb-10">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-[12px] sm:text-[13px] tracking-[0.22em] uppercase text-black/70 hover:text-black transition-colors"
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                >
                  {l.label}
                </a>
              ))}
            </div>

            <div className="h-px bg-black/10 w-full mb-6" />

            <div className="text-center text-[12px] tracking-[0.22em] uppercase text-black/25">
              © {year} OLLIN
            </div>
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden lg:flex lg:flex-col lg:min-h-[100svh] pointer-events-auto">
          
          <div className="flex-1 w-full max-w-[1400px] mx-auto px-10 pt-24 flex flex-col">
            
            {/* Hero limitado */}
            <div className="max-w-[980px]">
              <h2 className="font-normal text-[clamp(3.2rem,6.2vw,6.1rem)] leading-[0.92] tracking-[-0.04em]">
                <span className="block">Let’s make something</span>
                <span className="block">worth building</span>
              </h2>
            </div>

            {/* Email alineado totalmente a la derecha */}
            <div className="mt-24 w-full flex justify-end">
              <a
                href="mailto:contact@ollin.agency"
                className="font-normal text-black no-underline
                           text-[clamp(2.2rem,4.6vw,4rem)]
                           leading-[1] tracking-[-0.04em]
                           hover:opacity-70 transition-opacity
                           whitespace-nowrap text-right"
              >
                contact@ollin.agency
              </a>
            </div>

          </div>

          {/* Footer inferior */}
          <div className="w-full max-w-[1400px] mx-auto px-10 pb-10 relative">
            <div className="absolute left-10 bottom-10 text-[12px] tracking-[0.22em] uppercase text-black/10 select-none">
              © {year} OLLIN
            </div>

            <div className="flex justify-end gap-x-8">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-[12px] tracking-[0.22em] uppercase text-black/65 hover:text-black transition-colors"
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                >
                  {l.label}
                </a>
              ))}
            </div>

            <div className="absolute bottom-20 left-10 right-10 h-px bg-black/5" />
          </div>

        </div>
      </div>
    </section>
  );
}
