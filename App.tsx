import React from "react";
import Navbar from "./components/Navbar";
import SiteOutro from "./components/SiteOutro";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import Packages from "./pages/Packages";
import Contact from "./pages/Contact";

const App: React.FC = () => {
  return (
    <>
      <Navbar />

      <main className="w-full min-h-screen bg-ollin-bg text-ollin-black overflow-x-hidden relative selection:bg-black selection:text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      {/* Final Outro Section (white background) */}
      <SiteOutro />
    </>
  );
};

export default App;
