import React from "react";
import { useHead } from "@unhead/react";
import ServicesHero from "./ServicesHero";
import ServicesChapters from "../components/ServicesChapters";
import SiteOutro from "../components/SiteOutro";

export default function Services() {
    useHead({
        title: "Services & Systems — OLLIN",
        meta: [
            { name: "description", content: "Three systems to grow your contracting business: Foundation (brand + website), Demand (ads + Maps), and Retention (follow-ups + reviews)." },
            { property: "og:title", content: "Services & Systems — OLLIN" },
            { property: "og:description", content: "Three systems to grow your contracting business: Foundation (brand + website), Demand (ads + Maps), and Retention (follow-ups + reviews)." },
        ],
        link: [{ rel: "canonical", href: "https://ollin.agency/services" }],
    });

    return (
        <>
            <ServicesHero />
            <ServicesChapters />
        </>
    );
}
