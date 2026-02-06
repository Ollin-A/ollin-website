import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import SiteOutro from "./components/SiteOutro";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import BlogIndex from "./pages/BlogIndex";
import BlogPost from "./pages/BlogPost";
import Packages from "./pages/Packages";
import Contact from "./pages/Contact";
import PersonalizedPackage from "./pages/PersonalizedPackage";
import ServicesFoundation from "./pages/ServicesFoundation";
import ServicesDemand from "./pages/ServicesDemand";
import ServicesRetention from "./pages/ServicesRetention";

const App: React.FC = () => {
  const location = useLocation();
  const isContact = location.pathname.startsWith("/contact");

  return (
    <>
      <Navbar />
      <ScrollToTop />

      <main className="w-full min-h-screen bg-ollin-bg text-ollin-black overflow-x-hidden relative selection:bg-black selection:text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />

          {/* BLOG ROUTES */}
          <Route path="/blog" element={<Blog />}>
            <Route index element={<BlogIndex />} />
            <Route path=":slug" element={<BlogPost />} />
          </Route>

          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/personalized" element={<PersonalizedPackage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services/foundation" element={<ServicesFoundation />} />
          <Route path="/services/demand" element={<ServicesDemand />} />
          <Route path="/services/retention" element={<ServicesRetention />} />
        </Routes>
      </main>

      {/* Final Outro Section (hidden on Contact page) */}
      {!isContact && <SiteOutro />}
    </>
  );
};

export default App;
