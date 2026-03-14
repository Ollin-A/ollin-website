
import React, { useEffect, Suspense, lazy } from "react";
import { LeadModalProvider } from "./components/LeadModalContext";
import AIAssistant from "./components/AIAssistant";
import Navbar from "./components/Navbar";
import SiteOutro from "./components/SiteOutro";
import ScrollToTop from "./components/ScrollToTop";
import PageLoader from "./components/PageLoader";
import StructuredData from "./components/StructuredData";
import { Routes, Route, useLocation } from "react-router-dom";
import { useHead } from "@unhead/react";

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
const Terms = lazy(() => import("./pages/Terms"));
const DataDeletion = lazy(() => import("./pages/DataDeletion"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const isContact = path.startsWith("/contact");
  const isHome = path === "/";
  const isChat = path === "/chat";
  const needsXClip = isHome;

  useHead({
    title: "OLLIN - Design & Systems",
    meta: [
      {
        name: "description",
        content:
          "More calls and estimates—then we turn them into booked jobs with a better website, faster replies, and automatic follow-ups.",
      },
      { property: "og:title", content: "OLLIN - Design & Systems" },
      { name: "twitter:title", content: "OLLIN - Design & Systems" },
    ],
  });

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
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "OLLIN Agency",
          url: "https://ollin.agency",
          logo: "https://ollin.agency/favicon-32.png",
          description:
            "Marketing agency for U.S. contractors — websites, ads, Google Maps, follow-up systems, and AI-powered lead handling. English and Spanish.",
          email: "contact@ollin.agency",
          telephone: "+526692740503",
          address: {
            "@type": "PostalAddress",
            addressCountry: "MX",
            addressLocality: "Mazatlán",
            addressRegion: "Sinaloa",
          },
          sameAs: [
            "https://www.instagram.com/ollinagency/",
            "https://x.com/OLLINAGENCY",
            "https://www.facebook.com/ollin.agency",
            "https://www.threads.com/@ollinagency",
            "https://www.linkedin.com/company/ollinagency/",
          ],
          knowsLanguage: ["en", "es"],
        }}
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "OLLIN Agency",
          url: "https://ollin.agency",
        }}
      />
      <ScrollToTop />
      <Navbar theme={isChat ? 'dark' : 'light'} />
      <main
        className={`w-full min-h-screen ${mainBgClass} text-ollin-black relative selection:bg-black selection:text-white`}
      >
        <div className={needsXClip ? "overflow-x-hidden" : ""}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<AIAssistant />} />

              <Route path="/services" element={<Services />} />
              <Route
                path="/services/foundation"
                element={<ServicesFoundation />}
              />
              <Route path="/services/demand" element={<ServicesDemand />} />
              <Route path="/services/retention" element={<ServicesRetention />} />
              <Route path="/services/audit" element={<ServicesAudit />} />

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
              <Route path="/terms" element={<Terms />} />
              <Route path="/data-deletion" element={<DataDeletion />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </main>

      {!isContact && !isChat && <SiteOutro />}
    </LeadModalProvider>
  );
};

export default App;
