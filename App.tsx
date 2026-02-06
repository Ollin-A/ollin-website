import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import SiteOutro from "./components/SiteOutro";
import ScrollToTop from "./components/ScrollToTop";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import Packages from "./pages/Packages";
import Contact from "./pages/Contact";
import PersonalizedPackage from "./pages/PersonalizedPackage";

import ServicesFoundation from "./pages/ServicesFoundation";
import ServicesDemand from "./pages/ServicesDemand";
import ServicesRetention from "./pages/ServicesRetention";

const App: React.FC = () => {
  const location = useLocation();
  const isContact = location.pathname.startsWith("/contact");
  const isHome = location.pathname === "/";

  // Recommended: prevent browser from restoring scroll position (helps with back/forward quirks)
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Ensure Home background is #F2F2F2 even outside the <main> paint (html/body)
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const prevHtmlBg = html.style.backgroundColor;
    const prevBodyBg = body.style.backgroundColor;

    if (isHome) {
      html.style.backgroundColor = "#F2F2F2";
      body.style.backgroundColor = "#F2F2F2";
    }

    return () => {
      html.style.backgroundColor = prevHtmlBg;
      body.style.backgroundColor = prevBodyBg;
    };
  }, [isHome]);

  const mainBgClass = isHome ? "bg-[#F2F2F2]" : "bg-ollin-bg";

  return (
    <>
      {/* Global scroll-to-top on route change */}
      <ScrollToTop />

      <Navbar />

      <main
        className={`w-full min-h-screen ${mainBgClass} text-ollin-black overflow-x-hidden relative selection:bg-black selection:text-white`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/foundation" element={<ServicesFoundation />} />
          <Route path="/services/demand" element={<ServicesDemand />} />
          <Route path="/services/retention" element={<ServicesRetention />} />

          <Route path="/blog" element={<Blog />} />

          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/personalized" element={<PersonalizedPackage />} />

          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      {/* Final Outro Section - Hidden on Contact page */}
      {!isContact && <SiteOutro />}
    </>
  );
};

export default App;
