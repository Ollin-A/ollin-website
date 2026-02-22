import React, { useEffect, useRef, useState } from "react";
import {
    Plus,
    Minus,
    ArrowRight,
    MessageCircle,
    BarChart3,
    Settings,
    ShieldCheck,
    Zap,
    DollarSign,
} from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import { useLeadModal } from "./LeadModalContext";

// --- TYPES ---
type FaqItem = { id: string; question: string; answer: string };

type FaqCategory = {
    id: string;
    label: string;
    description: string;
    icon: React.ReactNode;
    faqs: FaqItem[];
};

// --- DATA ---
const faqCategories: FaqCategory[] = [
    {
        id: "fit",
        label: "Start & Strategy",
        description: "What we fix first (and why most agencies fail contractors).",
        icon: <ShieldCheck size={18} />,
        faqs: [
            {
                id: "fit-1",
                question: "I've been burned by marketing before. What do you do differently?",
                answer:
                    "We don’t start with promises—we start with diagnosis. We audit your website, Google profile, lead flow, and (most important) real conversations: calls, texts, and missed follow-ups. Then you get a clear 90-day plan focused on plugging leaks before we scale spend.",
            },
            {
                id: "fit-2",
                question: "Where do we start if my business feels messy?",
                answer:
                    "We start with the fastest bottleneck. Sometimes it’s traffic (you need Ads/Maps). Sometimes you already have leads—but you're losing them because nobody answers fast, the pipeline is unclear, or the offer is confusing. We fix the bottleneck first, then layer the rest.",
            },
            {
                id: "fit-3",
                question: "What if I already get leads, but they're low quality or price shoppers?",
                answer:
                    "That’s usually filtering + positioning. We tighten your message, set better qualification (job type, location, urgency), and upgrade the landing/website so you attract the right homeowner and repel the wrong one—before they waste your time.",
            },
            {
                id: "fit-4",
                question: "Do I need to be “good with tech” to work with you?",
                answer:
                    "No. We set it up, keep it simple, and run the system. You’ll have one clear inbox for leads, a clean dashboard for results, and short check-ins. Your job is to approve decisions and close jobs—not learn software.",
            },
            {
                id: "fit-5",
                question: "Can this run bilingual (English + Spanish)?",
                answer:
                    "Yes. We can run bilingual workflows for your customers and/or your crew—especially in chat, follow-up, and booking—so nobody gets lost in translation.",
            },
        ],
    },
    {
        id: "how-it-works",
        label: "Digital Secretary",
        description: "WhatsApp, SMS, web chat (and booking) handled automatically.",
        icon: <Zap size={18} />,
        faqs: [
            {
                id: "work-1",
                question: "What channels does the Digital Secretary cover?",
                answer:
                    "It can capture and handle leads from web chat, SMS, WhatsApp, and social DMs. The goal is simple: respond fast, qualify the lead, and route it correctly so you stop losing jobs while you’re in the field.",
            },
            {
                id: "work-2",
                question: "Will it book estimates on my calendar?",
                answer:
                    "Yes—when booking is enabled, it can schedule estimate appointments based on your rules and availability. If you want automated booking, we connect your calendar and keep the flow tight so it doesn’t create chaos.",
            },
            {
                id: "work-3",
                question: "Does it sound like a robot?",
                answer:
                    "No. We tune it to your style and your business rules, and it can run bilingual. Most homeowners just feel like they got a fast, professional response—and that’s the whole point.",
            },
            {
                id: "work-4",
                question: "Do you charge per message?",
                answer:
                    "No. Pricing is based on responsibility—how much decision-making the system handles (qualification, routing, booking, etc.). Carrier/message delivery fees (the real telecom costs) are always separate, based on usage.",
            },
            {
                id: "work-5",
                question: "What if the AI gets confused or a customer is angry?",
                answer:
                    "It stops and hands off. If the conversation becomes sensitive, complex, or heated, it alerts your team to jump in so nothing escalates.",
            },
            {
                id: "work-6",
                question: "Do I need a new phone number?",
                answer:
                    "Not necessarily. We can set up tracking and routing in a way that keeps your business clean and measurable, without forcing you to change how you operate day-to-day.",
            },
        ],
    },
    {
        id: "tech",
        label: "Websites & Setup",
        description: "High-converting sites, tune-ups, and ongoing care.",
        icon: <Settings size={18} />,
        faqs: [
            {
                id: "tech-1",
                question: "Do I need a full website, or just one page?",
                answer:
                    "Depends on your business. If you have 1–2 main services in one main area and you’re driving traffic with Ads, a single high-converting landing page often wins. If you have multiple services and/or multiple service areas and want to grow organically too, you’ll need a fuller site structure.",
            },
            {
                id: "tech-2",
                question: "Can you fix my current website instead of rebuilding?",
                answer:
                    "Yes—if the foundation is usable. If your site is on a workable platform and isn’t a total mess, a tune-up can be the fastest ROI. If it’s outdated, slow, or built in a way that fights every improvement, rebuilding is usually cheaper than patching forever.",
            },
            {
                id: "tech-3",
                question: "Will the site actually help me get more calls?",
                answer:
                    "That’s the only reason we build it. We focus on clarity, trust, and conversion: strong CTAs, click-to-call, estimate forms that work, proof (projects/reviews), and a clean flow that pushes homeowners to take action.",
            },
            {
                id: "tech-4",
                question: "Can you track form leads and calls from the website?",
                answer:
                    "Yes. We set up the basics so you can see what’s generating leads (forms, click-to-call, and other key actions). If you want deeper ROI (matching leads to closed jobs), that’s a higher-level tracking layer.",
            },
            {
                id: "tech-5",
                question: "Do you handle hosting, updates, and small changes?",
                answer:
                    "Yes. Ongoing care can cover hosting, SSL, backups, security, platform updates (when applicable), and small text/photo changes. If you want continuous improvement (conversion tweaks, small new sections, basic on-page SEO), that’s a higher care level.",
            },
        ],
    },
    {
        id: "results",
        label: "Leads: Ads + Maps",
        description: "New calls coming in—fast (Ads) and long-term (Maps).",
        icon: <DollarSign size={18} />,
        faqs: [
            {
                id: "res-1",
                question: "What’s better: Google Ads, Facebook/Instagram, or Google Maps?",
                answer:
                    "Google Ads is usually the fastest path to “phone ringing” for contractors. Meta can work well for awareness, retargeting, and certain services. Google Maps (Local SEO) is a longer game that compounds. Many contractors run Ads while Maps grows in the background.",
            },
            {
                id: "res-2",
                question: "How much should I spend on ads to start?",
                answer:
                    "Most contractors start with a manageable budget and scale once the system is converting. The right number depends on your trade, market, and service area competition—but you’ll always pay the ad platforms directly, so you control spend at all times.",
            },
            {
                id: "res-3",
                question: "How fast do ads start bringing leads?",
                answer:
                    "Once campaigns and tracking are set up, you can typically see initial lead flow quickly. The first few weeks are about dialing in keywords, targeting, budgets, and landing page performance so lead quality improves—not just volume.",
            },
            {
                id: "res-4",
                question: "How long does Google Maps / Local SEO take?",
                answer:
                    "Expect meaningful movement over weeks to months, depending on competition and how clean your Google Business Profile is. It’s not magic—it’s consistent signals: profile optimization, local credibility, and reviews.",
            },
            {
                id: "res-5",
                question: "Do I need a real address to show up on Maps?",
                answer:
                    "You can operate as a service-area business, but you have to follow Google’s rules or you risk suspension. We set up your profile correctly, clean up old/incorrect info, and build local signals so you rank without playing games.",
            },
        ],
    },
    {
        id: "pricing",
        label: "Tracking & ROI",
        description: "Proof you can understand: leads, calls, and real performance.",
        icon: <BarChart3 size={18} />,
        faqs: [
            {
                id: "price-1",
                question: "How do I know where leads are coming from?",
                answer:
                    "We track the core actions that matter: form submissions, click-to-call, and (when enabled) call sources. You get a live dashboard that shows what’s driving leads—without drowning you in vanity metrics.",
            },
            {
                id: "price-2",
                question: "Can you track phone calls and listen to them?",
                answer:
                    "Yes, especially for call-heavy contractors. Call tracking helps you see which campaigns and keywords drive calls. Listening to calls can also reveal the real leak: slow answers, missed follow-up, or weak closing.",
            },
            {
                id: "price-3",
                question: "Will I see real ROI, not just clicks and cost-per-lead?",
                answer:
                    "If you track outcomes (quotes won/lost, job values) in a CRM or even a simple workflow, we can match leads to closed jobs and report real ROI. Without outcome data, any “ROI” claim is just guessing.",
            },
            {
                id: "price-4",
                question: "Is tracking included with Ads?",
                answer:
                    "Ads require minimum tracking to operate correctly. Deeper attribution—like matching leads to revenue and optimizing campaigns toward closed jobs—is a separate, more advanced layer.",
            },
            {
                id: "price-5",
                question: "Do you send reports I’ll actually read?",
                answer:
                    "Yes. You’ll have a live dashboard, and we also send a short monthly recap (simple language): what worked, what didn’t, and what we’re changing next.",
            },
        ],
    },
    {
        id: "support",
        label: "Brand, Social & Reviews",
        description: "Trust builders: clean brand, consistent content, better reviews.",
        icon: <MessageCircle size={18} />,
        faqs: [
            {
                id: "sup-1",
                question: "Do I really need social media if I just want calls?",
                answer:
                    "Social isn’t about going viral for contractors—it’s about trust. Homeowners check you before they call. A consistent feed (projects, before/after, credentials, reviews) helps Ads and Maps convert better.",
            },
            {
                id: "sup-2",
                question: "I don’t have content. Do you come film videos?",
                answer:
                    "You don’t need a film crew. We give you a simple capture playbook (what to record, how, and how often). You send quick clips from jobs, and we turn them into clean posts/reels. If you want heavier production, that’s handled as an add-on.",
            },
            {
                id: "sup-3",
                question: "Can you clean up my logo without a full rebrand?",
                answer:
                    "Yes. Many contractors don’t need a “big rebrand”—they need a logo that looks professional, works on trucks/uniforms, and doesn’t pixelate online. If the brand is messy, we can also build a simple brand kit and templates.",
            },
            {
                id: "sup-4",
                question: "Can you help me get more 5-star reviews (and avoid getting crushed)?",
                answer:
                    "Yes. We set up a post-job review flow that asks satisfaction first. If the customer is happy, we send them straight to your review link. If they’re unhappy, it routes to a private alert so you can resolve it before it becomes public.",
            },
            {
                id: "sup-5",
                question: "Can you bring back past customers in slow season?",
                answer:
                    "Yes. We can run seasonal reactivation campaigns to past customers (SMS/WhatsApp/email), with basic segmentation so you don’t spam everyone and burn trust.",
            },
            {
                id: "sup-6",
                question: "Do you reply to comments and DMs?",
                answer:
                    "We can do light community triage (basic checks, routing, catching hot leads). For fast lead response and qualification, the Digital Secretary is the right tool—so you’re not stuck answering messages all day.",
            },
        ],
    },
];

const OPEN_SCROLL_DELAY_MS = 340; // coincide con duration-300 + un colchón

const Faq: React.FC = () => {
    const { openModal } = useLeadModal();
    const [activeCategoryId, setActiveCategoryId] = useState<string>(faqCategories[0].id);

    // ✅ por default ninguna pregunta abierta
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    // ✅ por default el panel completo colapsado
    const [accordionOpen, setAccordionOpen] = useState<boolean>(false);

    const accordionRef = useRef<HTMLDivElement>(null);

    // ✅ si abrimos desde “todo cerrado”, scrolleamos DESPUÉS de la animación
    const pendingScrollRef = useRef(false);
    const scrollTimerRef = useRef<number | null>(null);

    const activeCategory = faqCategories.find((c) => c.id === activeCategoryId) || faqCategories[0];

    const scrollToAccordion = () => {
        if (typeof window === "undefined" || !accordionRef.current) return;

        const yOffset = -96;
        const y = accordionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y, behavior: "smooth" });
    };

    // ✅ scroll “post-open” (soluciona el scroll incompleto del primer click)
    useEffect(() => {
        if (!accordionOpen) return;
        if (!pendingScrollRef.current) return;

        pendingScrollRef.current = false;

        if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);

        scrollTimerRef.current = window.setTimeout(() => {
            scrollToAccordion();
        }, OPEN_SCROLL_DELAY_MS);

        return () => {
            if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);
        };
    }, [accordionOpen, activeCategoryId]);

    const handleCategoryClick = (id: string) => {
        const isSame = id === activeCategoryId;

        // click al mismo card => toggle del panel (abre/cierra)
        if (isSame) {
            if (accordionOpen) {
                setAccordionOpen(false);
                setOpenIndex(null);
                return;
            }

            setAccordionOpen(true);
            setOpenIndex(null);
            pendingScrollRef.current = true; // ✅ scroll después de abrir
            return;
        }

        // cambiar de categoría
        setActiveCategoryId(id);
        setOpenIndex(null);

        if (accordionOpen) {
            // si ya estaba abierto, scroll normal (rápido)
            requestAnimationFrame(() => scrollToAccordion());
            return;
        }

        // si estaba cerrado: abrir + scroll post-open
        setAccordionOpen(true);
        pendingScrollRef.current = true;
    };

    const toggleAccordionQuestion = (idx: number) => {
        setOpenIndex((prev) => (prev === idx ? null : idx));
    };

    return (
        <section id="faq" className="relative w-full bg-[#F2F2F2] text-ollin-black py-12 md:py-28">
            <div className="max-w-[1500px] mx-auto px-[5vw] w-full">
                {/* Top copy */}
                <Reveal>
                    <div className="max-w-[980px]">
                        <h3 className="text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.02] font-medium">
                            FAQ. Straight answers for busy contractors.
                        </h3>
                        <p className="mt-4 md:mt-5 text-base md:text-lg leading-snug text-ollin-black/70 max-w-[760px]">
                            No jargon. No fluff. Just clear explanations of how websites, Ads,
                            Maps, automation, tracking, reviews, and content actually work—
                            so you can pick the right next step with confidence.
                        </p>
                    </div>
                </Reveal>

                {/* Categories */}
                <div className="mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {faqCategories.map((cat, idx) => {
                        const isActive = activeCategoryId === cat.id;

                        return (
                            <Reveal key={cat.id} delay={idx * 0.05}>
                                <button
                                    onClick={() => handleCategoryClick(cat.id)}
                                    className={[
                                        "relative group w-full h-full text-left p-5 md:p-6 border transition-all duration-200",
                                        "bg-white",
                                        "border-black/10",
                                        "shadow-[0_8px_22px_rgba(0,0,0,0.06)]",
                                        "hover:shadow-[0_14px_36px_rgba(0,0,0,0.10)]",
                                        "rounded-none",
                                        "flex flex-col",
                                        isActive ? "border-black/20" : "",
                                    ].join(" ")}
                                >
                                    {/* Active indicator line */}
                                    <div
                                        className={[
                                            "absolute left-0 right-0 top-0 h-[2px] bg-black transition-opacity",
                                            isActive ? "opacity-100" : "opacity-0",
                                        ].join(" ")}
                                        aria-hidden="true"
                                    />

                                    <div className="mb-3 md:mb-4 w-10 h-10 border border-black/10 bg-black/2 flex items-center justify-center">
                                        {cat.icon}
                                    </div>

                                    <h4 className="text-[18px] md:text-[19px] font-medium tracking-tight text-ollin-black/90">
                                        {cat.label}
                                    </h4>

                                    <p className="mt-2 text-sm leading-relaxed text-ollin-black/60 flex-1 max-w-[44ch]">
                                        {cat.description}
                                    </p>

                                    <div className="mt-6 flex items-center justify-between">
                                        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ollin-black/45">
                                            {cat.faqs.length} Questions
                                        </span>

                                        <ArrowRight
                                            size={16}
                                            className={[
                                                "transition-all duration-200",
                                                isActive
                                                    ? "text-ollin-black translate-x-0 opacity-100"
                                                    : "text-ollin-black/35 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0",
                                            ].join(" ")}
                                        />
                                    </div>
                                </button>
                            </Reveal>
                        );
                    })}
                </div>

                {/* Accordion wrapper (collapsible) */}
                <div
                    ref={accordionRef}
                    className={[
                        accordionOpen ? "mt-10 md:mt-12" : "mt-0",
                        "max-w-[980px] scroll-mt-32",
                    ].join(" ")}
                >
                    <div
                        className={[
                            "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
                            accordionOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                        ].join(" ")}
                        aria-hidden={!accordionOpen}
                    >
                        <div
                            className={[
                                "overflow-hidden",
                                accordionOpen ? "pointer-events-auto" : "pointer-events-none",
                            ].join(" ")}
                        >
                            <Reveal
                                key={activeCategory.id}
                                className="bg-white border border-black/10 shadow-[0_8px_22px_rgba(0,0,0,0.06)] p-5 md:p-10 rounded-none"
                            >
                                <div className="pb-5 border-b border-black/10 flex items-center gap-3">
                                    <div className="w-9 h-9 border border-black/10 bg-black/2 flex items-center justify-center">
                                        {activeCategory.icon}
                                    </div>

                                    <div>
                                        <div className="text-[16px] md:text-[17px] font-medium text-ollin-black/90">
                                            {activeCategory.label}
                                        </div>
                                        <div className="text-xs text-ollin-black/55 mt-1">
                                            {activeCategory.description}
                                        </div>
                                    </div>

                                    <span className="ml-auto text-[11px] font-semibold uppercase tracking-[0.18em] text-ollin-black/45 hidden sm:block">
                                        {activeCategory.faqs.length} questions
                                    </span>
                                </div>

                                <div className="mt-2">
                                    {activeCategory.faqs.map((item, idx) => {
                                        const isOpen = openIndex === idx;

                                        return (
                                            <div key={item.id} className="border-b border-black/10 last:border-0">
                                                <button
                                                    onClick={() => toggleAccordionQuestion(idx)}
                                                    className="w-full flex items-start justify-between py-4 md:py-5 text-left focus:outline-none"
                                                    aria-expanded={isOpen}
                                                >
                                                    <span
                                                        className={[
                                                            "text-[16px] md:text-[17px] font-medium pr-8 transition-colors",
                                                            isOpen ? "text-ollin-black" : "text-ollin-black/80",
                                                        ].join(" ")}
                                                    >
                                                        {item.question}
                                                    </span>

                                                    <span
                                                        className={[
                                                            "shrink-0 mt-0.5 w-8 h-8 border flex items-center justify-center transition-colors",
                                                            isOpen
                                                                ? "border-black/20 bg-black/2 text-ollin-black"
                                                                : "border-black/10 bg-transparent text-ollin-black/55",
                                                        ].join(" ")}
                                                        aria-hidden="true"
                                                    >
                                                        {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                                                    </span>
                                                </button>

                                                <div
                                                    className={[
                                                        "grid transition-[grid-template-rows,opacity,margin] duration-300 ease-in-out",
                                                        isOpen ? "grid-rows-[1fr] opacity-100 mb-6" : "grid-rows-[0fr] opacity-0 mb-0",
                                                    ].join(" ")}
                                                >
                                                    <div className="overflow-hidden">
                                                        <p className="text-ollin-black/65 leading-relaxed text-[14px] md:text-[15px] pr-8">
                                                            {item.answer}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* tiny CTA row */}
                                <div className="pt-5 md:pt-6 border-t border-black/10 mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="text-sm md:text-[15px] text-ollin-black/65">
                                        Still unsure? We’ll tell you the simplest next step—based on your
                                        business, not generic advice.
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={openModal}
                                            className="inline-flex items-center justify-center px-4 py-3 border border-black/10 bg-black text-ollin-bg text-sm font-medium hover:opacity-90 transition"
                                        >
                                            Get a quick plan
                                        </button>

                                        {/* ✅ UPDATED: packages CTA */}
                                        <Link
                                            to="/packages"
                                            className="inline-flex items-center justify-center px-4 py-3 border border-black/10 bg-transparent text-ollin-black/70 text-sm font-medium hover:text-ollin-black transition"
                                        >
                                            See packages
                                        </Link>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Faq;
