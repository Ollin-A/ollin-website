import React, { useState, useEffect, useRef, CSSProperties } from 'react';

const Navbar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Smart Hide/Show Logic
      if (currentScrollY < 40) {
        setIsVisible(true);
      } else {
        // Hide if scrolling down significantly (>80px total) and moving down
        if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
          setIsVisible(false);
        }
        // Show if scrolling up
        else if (currentScrollY < lastScrollY.current) {
          setIsVisible(true);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileOpen]);

  const scrollToSection = (id: string) => {
    setIsMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'Services', id: 'services' },
    { name: 'Results', id: 'results' },
    { name: 'Pricing', id: 'pricing' },
  ];

  // Wrapper style for black text
  const navTextStyle: React.CSSProperties = {
    color: '#000000',
  };

  // Hover effect
  const navHoverClass = "hover:opacity-80 transition-opacity duration-300";

  return (
    <>
      <header
        // Using 'top' for show/hide avoids transform on the parent, which preserves blending context.
        className="fixed left-0 w-full z-50 transition-[top] duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          top: isVisible ? '0' : '-6rem', // Hide by moving up
          backgroundColor: 'transparent',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          border: 'none',
          boxShadow: 'none',
        } as React.CSSProperties}
      >
        <div
          className="w-full max-w-[1500px] mx-auto px-[5vw] h-16 md:h-16 grid grid-cols-2 md:grid-cols-[1fr_auto_1fr] items-center"
          style={navTextStyle}
        >

          {/* LEFT: Logo */}
          <div className="flex justify-start">
            <button
              onClick={() => scrollToSection('top')}
              className={`font-montserrat font-semibold text-lg md:text-xl tracking-tight focus:outline-none text-current ${navHoverClass}`}
              aria-label="OLLIN Home"
            >
              OLLIN
            </button>
          </div>

          {/* CENTER: Nav Links */}
          <nav className="hidden md:flex justify-center items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.id)}
                className={`text-[13px] font-medium tracking-[0.15em] uppercase relative group text-current ${navHoverClass}`}
              >
                {link.name}
                {/* Underline */}
                <span
                  className="absolute -bottom-1 left-0 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full"
                />
              </button>
            ))}
          </nav>

          {/* RIGHT: Actions & Mobile Toggle */}
          <div className="flex justify-end items-center">

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-6">
              {/* Contact Link */}
              <button
                onClick={() => scrollToSection('contact')}
                className={`text-[13px] font-medium tracking-[0.15em] uppercase text-current ${navHoverClass}`}
              >
                Contact
              </button>

              {/* CTA Button - NOT Blended (Solid) */}
              <button
                className="bg-ollin-black text-white text-[13px] font-medium tracking-wide px-5 py-2.5 rounded-[12px] hover:translate-y-[-1px] hover:shadow-lg transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]"
              >
                Get a Free Growth Plan
              </button>
            </div>

            {/* Mobile Toggle */}
            <button
              className={`md:hidden p-2 -mr-2 focus:outline-none text-current`}
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Toggle Menu"
            >
              <div className="w-6 flex flex-col items-end gap-[5px]">
                <span
                  className={`h-[2px] bg-current w-6 transition-transform duration-300 ${isMobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`}
                />
                <span
                  className={`h-[2px] bg-current w-4 transition-opacity duration-300 ${isMobileOpen ? 'opacity-0' : ''}`}
                />
                <span
                  className={`h-[2px] bg-current w-6 transition-transform duration-300 ${isMobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}
                />
              </div>
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-[#f2efe9] z-40 flex flex-col justify-center items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
      >
        <div className="flex flex-col items-center gap-8 text-center">
          {navLinks.map((link, idx) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.id)}
              className={`text-3xl font-light text-ollin-black tracking-tight transition-all duration-500 delay-[${idx * 50}ms] ${isMobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
            >
              {link.name}
            </button>
          ))}
          <button
            onClick={() => scrollToSection('contact')}
            className={`text-3xl font-light text-ollin-black tracking-tight transition-all duration-500 delay-150 ${isMobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
          >
            Contact
          </button>

          <div className={`mt-8 transition-all duration-500 delay-200 ${isMobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <button className="bg-ollin-black text-white text-base font-medium px-8 py-4 rounded-[12px] w-full max-w-xs">
              Get a Free Growth Plan
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;