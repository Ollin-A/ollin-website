import React from "react";
import { useHead } from "@unhead/react";
import Hero from "../components/Hero";
import ServicesPreview from "../components/ServicesPreview";
import ReelPeekSection from "../components/ReelPeekSection";
import BookingSystemSection from "../components/BookingSystemSection";
import ApproachSection from "../components/ApproachSection";
import PricingSection from "../components/PricingSection";
import Faq from "../components/Faq";

const Home: React.FC = () => {
    useHead({
        title: "OLLIN — Design & Systems for Contractors",
        meta: [
            { name: "description", content: "More calls and estimates for contractors — turned into booked jobs with websites, ads, Google Maps, faster replies, and automatic follow-ups." },
            { property: "og:title", content: "OLLIN — Design & Systems for Contractors" },
            { property: "og:description", content: "More calls and estimates for contractors — turned into booked jobs with websites, ads, Google Maps, faster replies, and automatic follow-ups." },
        ],
        link: [{ rel: "canonical", href: "https://ollin.agency/" }],
    });

    return (
        <>
            <Hero />
            <ReelPeekSection />
            <ServicesPreview />
            <BookingSystemSection />
            <ApproachSection />
            <PricingSection />
            <Faq />

            <div id="results" className="h-0 w-0 overflow-hidden absolute top-[120vh]" />
            <div id="contact" className="h-0 w-0 overflow-hidden absolute top-[150vh]" />
        </>
    );
};

export default Home;
