// App.tsx
import React, { useEffect, Suspense, lazy } from "react";
import { LeadModalProvider } from "./components/LeadModalContext";
import Navbar from "./components/Navbar";
import SiteOutro from "./components/SiteOutro";
import ScrollToTop from "./components/ScrollToTop";
import PageLoader from "./components/PageLoader";
import { Routes, Route, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Home = lazy(() => import("./pages/Home"));
const Services = lazy(() => import("./pages/Services"));
const Packages = lazy(() => import("./pages/Packages"));
const Contact = lazy(() => import("./pages/Contact"));
const PersonalizedPackage = lazy(() => import("./pages/PersonalizedPackage"));
const ServicesFoundation = lazy(() => import("./pages/ServicesFoundation"));
const ServicesDemand = lazy(() => import("./pages/ServicesDemand"));
const ServicesRetention = lazy(() => import("./pages/ServicesRetention"));
const ServicesAudit = lazy(() => import("./pages/ServicesAudit"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogIndex = lazy(() => import("./pages/BlogIndex"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Privacy = lazy(() => import("./pages/Privacy"));

const App: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const isContact = path.startsWith("/contact");
  const isHome = path === "/";
  const needsXClip = isHome;

  // 3) Safety net: re-apply the global title on any route changes
  useEffect(() => {
    document.title = "OLLIN - Design & Systems";
  }, [location.pathname]);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

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
    <LeadModalProvider>
      <Helmet>
        <title>OLLIN - Design & Systems</title>
        <meta
          name="description"
          content="More calls and estimates—then we turn them into booked jobs with a better website, faster replies, and automatic follow-ups."
        />
        <meta property="og:title" content="OLLIN - Design & Systems" />
        <meta name="twitter:title" content="OLLIN - Design & Systems" />
      </Helmet>
      <ScrollToTop />
      <Navbar />
      <main
        className={`w-full min-h-screen ${mainBgClass} text-ollin-black relative selection:bg-black selection:text-white`}
      >
        <div className={needsXClip ? "overflow-x-hidden" : ""}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/services" element={<Services />} />
              <Route
                path="/services/foundation"
                element={<ServicesFoundation />}
              />
              <Route path="/services/demand" element={<ServicesDemand />} />
              <Route path="/services/retention" element={<ServicesRetention />} />
              <Route path="/services/audit" element={<ServicesAudit />} />

              {/* BLOG (nested) */}
              <Route path="/blog" element={<Blog />}>
                <Route index element={<BlogIndex />} />
                <Route path=":slug" element={<BlogPost />} />
              </Route>

              <Route path="/packages" element={<Packages />} />
              <Route
                path="/packages/personalized"
                element={<PersonalizedPackage />}
              />

              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
            </Routes>
          </Suspense>
        </div>
      </main>

      {!isContact && <SiteOutro />}
    </LeadModalProvider>
  );
};

export default App;
