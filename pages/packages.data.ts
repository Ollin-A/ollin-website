import type { PackageTier, SingleService, CompareRow } from "./packages.types";

export const PACKAGES: PackageTier[] = [
    {
        id: "presence-starter",
        name: "The Foundation",
        oneLiner: "Look legit. Get found.",
        bullets: [
            "Simple website (mobile-first)",
            "Google profile setup / cleanup",
            "Social profiles setup (FB/IG)",
        ],
        bestFor:
            "Newer contractors or small crews who want the basics done right — fast, clean, professional.",
        timeline: "Typical launch: 5–10 business days (after assets + approvals).",
        includes: [
            {
                title: "What we build",
                items: [
                    "Simple, fast website (mobile-first)",
                    "Core pages + clarity cleanup",
                    "Google Business Profile setup/cleanup (maps-ready foundation)",
                    "Social profile setup (FB/IG) + consistent naming/branding",
                ],
            },
            {
                title: "Optional add-ons",
                items: [
                    "Logo cleanup + mini brand kit",
                    "Review request templates",
                    "Website tune-up (if you already have a site)",
                ],
            },
        ],
    },
    {
        id: "lead-engine",
        name: "The Build",
        oneLiner: "Turn visitors into calls.",
        bullets: [
            "Conversion-focused site structure",
            "Local foundation (maps-ready)",
            "Review engine setup",
        ],
        bestFor:
            "Crews already getting work — and want more calls without reinventing everything.",
        timeline: "Typical launch: 7–14 business days (scope-dependent).",
        includes: [
            {
                title: "Conversion & trust",
                items: [
                    "Website tuned for calls + form leads",
                    "Service pages structure that converts",
                    "Trust layer: reviews placement + credibility blocks",
                ],
            },
            {
                title: "Local growth foundation",
                items: [
                    "Local SEO baseline (maps foundation)",
                    "Review request system (simple + repeatable)",
                    "Optional: ads-ready landing page structure",
                ],
            },
            {
                title: "Tracking (basic)",
                items: ["Calls + forms tracked (simple)", "Monthly snapshot: what’s working"],
            },
        ],
    },
    {
        id: "ops-growth",
        name: "The System",
        oneLiner: "Fewer missed leads. Clearer ROI.",
        bullets: [
            "Lead routing rules",
            "Follow-up assist (SMS/WhatsApp/web)",
            "Tracking + reporting clarity",
        ],
        bestFor:
            "Busy operators missing calls/leads or letting follow-up slip because the day gets chaotic.",
        timeline: "Typical launch: 10–21 days (routing + tracking setup).",
        includes: [
            {
                title: "Acquisition (scaled)",
                items: [
                    "Ads management OR advanced local push (based on your market)",
                    "Offer testing + landing variants",
                    "Review engine + trust compounding",
                ],
            },
            {
                title: "Ops layer",
                items: [
                    "Lead routing rules (who gets what, when)",
                    "Fast follow-up assist (SMS/WhatsApp/web) so leads don’t die",
                    "Booking/estimate requests handled (optional)",
                ],
            },
            {
                title: "Tracking & ROI",
                items: [
                    "Calls + forms tracked into simple reporting",
                    "Channel clarity: which source brings real jobs",
                    "Lightweight dashboard (no fluff)",
                ],
            },
        ],
    },
    {
        id: "market-dominator",
        name: "The Expansion",
        oneLiner: "A full system for multi-crew growth.",
        bullets: [
            "Multi-location structure",
            "Custom workflows + integrations",
            "Dedicated ops cadence",
        ],
        bestFor:
            "Teams scaling hard across crews/locations — needs structure, routing, and accountability.",
        timeline: "Scope-based. We map it first, then build in phases.",
        includes: [
            {
                title: "System build",
                items: [
                    "Multi-location routing + tracking architecture",
                    "Custom workflows across channels/tools",
                    "Advanced reporting + performance cadence",
                ],
            },
            {
                title: "Scale support",
                items: [
                    "Expansion strategy + offer testing",
                    "Ops playbooks (if needed)",
                    "Integrations based on your stack",
                ],
            },
        ],
    },
];

export const SINGLE_SERVICES: SingleService[] = [
    { id: "website", name: "Website (new or rebuild)", hint: "Fast, clean, conversion-first." },
    { id: "site-tune", name: "Fix / tune my current site", hint: "Speed + clarity cleanup." },
    { id: "logo", name: "Logo + brand cleanup", hint: "Simple kit for consistency." },
    { id: "social", name: "Social profiles setup", hint: "FB/IG setup + naming." },
    { id: "gbp", name: "Google Business Profile setup", hint: "Maps-ready foundation." },
    { id: "reviews", name: "Review engine", hint: "More reviews, repeatable." },
    { id: "ads", name: "Ads management", hint: "Google/Meta, done properly." },
    { id: "tracking", name: "Tracking + ROI clarity", hint: "Calls/forms tracked + reporting." },
];

export const COMPARISON: CompareRow[] = [
    {
        key: "website",
        label: "Website",
        hint: "Build or rebuild with clarity + speed.",
        values: {
            "presence-starter": true,
            "lead-engine": true,
            "ops-growth": true,
            "market-dominator": true,
        },
    },
    {
        key: "gbp",
        label: "Google Business Profile setup",
        hint: "Maps foundation + cleanup.",
        values: {
            "presence-starter": true,
            "lead-engine": true,
            "ops-growth": true,
            "market-dominator": true,
        },
    },
    {
        key: "local",
        label: "Local foundation (SEO baseline)",
        hint: "Structure for local discovery.",
        values: {
            "presence-starter": false,
            "lead-engine": true,
            "ops-growth": true,
            "market-dominator": true,
        },
    },
    {
        key: "reviews",
        label: "Review engine",
        hint: "Simple, repeatable review workflow.",
        values: {
            "presence-starter": false,
            "lead-engine": true,
            "ops-growth": true,
            "market-dominator": true,
        },
    },
    {
        key: "ads",
        label: "Ads management",
        hint: "Optional in mid, core in higher tiers.",
        values: {
            "presence-starter": false,
            "lead-engine": false,
            "ops-growth": true,
            "market-dominator": true,
        },
    },
    {
        key: "routing",
        label: "Lead routing + follow-up",
        hint: "Faster response so leads don’t die.",
        values: {
            "presence-starter": false,
            "lead-engine": false,
            "ops-growth": true,
            "market-dominator": true,
        },
    },
    {
        key: "roi",
        label: "Reporting & ROI clarity",
        hint: "Calls/forms tracked + simple reporting.",
        values: {
            "presence-starter": false,
            "lead-engine": true,
            "ops-growth": true,
            "market-dominator": true,
        },
    },
];
