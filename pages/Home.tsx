import React from "react";
import Hero from "../components/Hero";
import ServicesPreview from "../components/ServicesPreview";
import ReelPeekSection from "../components/ReelPeekSection";
import BookingSystemSection from "../components/BookingSystemSection";
import ApproachSection from "../components/ApproachSection";
import PricingSection from "../components/PricingSection";
import Faq from "../components/Faq";

const Home: React.FC = () => {
    return (
        <>
            <Hero />
            <ReelPeekSection />
            <ServicesPreview />
            <BookingSystemSection />
            <ApproachSection />
            <PricingSection />
            <Faq />

            {/* Placeholder Anchors */}
            <div id="results" className="h-0 w-0 overflow-hidden absolute top-[120vh]" />
            <div id="contact" className="h-0 w-0 overflow-hidden absolute top-[150vh]" />
        </>
    );
};

export default Home;
