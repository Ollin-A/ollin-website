import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ServicesPreview from "./components/ServicesPreview";
import ReelPeekSection from "./components/ReelPeekSection";
import BookingSystemSection from "./components/BookingSystemSection";
import ApproachSection from "./components/ApproachSection";

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="w-full min-h-screen bg-ollin-bg text-ollin-black overflow-x-hidden relative selection:bg-black selection:text-white">
        <Hero />
        <ReelPeekSection />
        <ServicesPreview />
        <BookingSystemSection />
        <ApproachSection />

        {/* Spacer (puedes quitarlo cuando tengas más secciones reales) */}
        <div className="w-full h-[50vh] bg-ollin-bg flex items-start justify-center pt-20">
          <p className="opacity-30 text-xs tracking-widest uppercase">Continuing Content...</p>
        </div>

        {/* Placeholder Anchors */}
        <div id="results" className="h-0 w-0 overflow-hidden absolute top-[120vh]" />
        <div id="pricing" className="h-0 w-0 overflow-hidden absolute top-[140vh]" />
        <div id="contact" className="h-0 w-0 overflow-hidden absolute top-[150vh]" />
      </main>
    </>
  );
};

export default App;

