// PersonalizedPackage.tsx
import React, { useMemo, useState } from "react";
import { Layers, Zap, Rocket, Crown } from "lucide-react";

import type { Field } from "./PersonalizedPackage_FieldControls";
import PersonalizedPackageHero from "./PersonalizedPackage_Hero";
import PersonalizedPackagePresets from "./PersonalizedPackage_Presets";
import PersonalizedPackageBuilder from "./PersonalizedPackage_Builder";
import PersonalizedPackageModal from "./PersonalizedPackage_Modal";

type ServiceDef = {
  id: string;
  title: string;
  blurb: string;
  fields: Field[];
};

type PresetDef = {
  id: string;
  title: string;
  tagline: string;
  icon: React.ReactNode;
  services: string[]; // service ids
  defaults: Record<string, Record<string, any>>; // serviceId -> fieldId -> value
};

type LeadForm = {
  name: string;
  email: string;
  phone: string;
  businessType: string;
  cityState: string;
  website: string;
  notes: string;
};

const EMAIL_TO = "contact@ollin.agency";

function safeJson(value: any) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

const PersonalizedPackage: React.FC = () => {
  const SERVICES: ServiceDef[] = useMemo(
    () => [
      {
        id: "digital_secretary",
        title: "Digital Secretary (Messaging OS)",
        blurb:
          "Captures leads, qualifies them, routes requests, and can assist with booking.",
        fields: [
          {
            id: "handles",
            label: "What should it handle?",
            type: "multi",
            options: [
              { value: "qualify", label: "Lead qualification" },
              { value: "faqs", label: "FAQs & basic info" },
              { value: "routing", label: "Lead routing rules" },
              { value: "booking", label: "Booking / appointments" },
            ],
            helper: "Pick what you want automated. You can keep it simple.",
            defaultValue: ["qualify", "faqs"],
          },
          {
            id: "services_count",
            label: "How many services do you offer?",
            type: "single",
            options: [
              { value: "1-3", label: "Up to 3 services" },
              { value: "4+", label: "4+ services" },
              { value: "unsure", label: "Not sure yet" },
            ],
            defaultValue: "1-3",
          },
          {
            id: "zones",
            label: "Service areas / zones",
            type: "single",
            options: [
              { value: "1-2", label: "1–2 zones" },
              { value: "3+", label: "3+ zones" },
              { value: "unsure", label: "Not sure yet" },
            ],
            defaultValue: "1-2",
          },
          {
            id: "calendars",
            label: "Calendars",
            type: "single",
            options: [
              { value: "one", label: "One calendar" },
              { value: "multi", label: "Multiple calendars" },
              { value: "unsure", label: "Not sure yet" },
            ],
            defaultValue: "one",
          },
          {
            id: "routing_complexity",
            label: "Routing complexity",
            type: "single",
            options: [
              { value: "simple", label: "Simple (one inbox)" },
              {
                value: "advanced",
                label: "Advanced (by city/service/urgency)",
              },
              { value: "unsure", label: "Not sure yet" },
            ],
            defaultValue: "simple",
          },
        ],
      },
      {
        id: "reviews_engine",
        title: "Reviews & Repeat Jobs Engine",
        blurb:
          "Build trust fast, collect reviews consistently, and reactivate past customers.",
        fields: [
          {
            id: "goal",
            label: "Primary goal",
            type: "single",
            options: [
              { value: "reviews", label: "More 5-star reviews" },
              { value: "both", label: "Reviews + reactivation/referrals" },
              { value: "unsure", label: "Not sure yet" },
            ],
            defaultValue: "reviews",
          },
          {
            id: "list_source",
            label: "Customer list source",
            type: "single",
            options: [
              { value: "crm", label: "CRM (Jobber/HCP/etc.)" },
              { value: "csv", label: "Spreadsheet / CSV" },
              { value: "messy", label: "Messy / not sure" },
            ],
            defaultValue: "messy",
          },
          {
            id: "language",
            label: "Language",
            type: "single",
            options: [
              { value: "en", label: "English" },
              { value: "en_es", label: "English + Spanish" },
            ],
            defaultValue: "en",
          },
          {
            id: "channels",
            label: "Outreach channels",
            type: "multi",
            options: [
              { value: "sms", label: "SMS" },
              { value: "email", label: "Email" },
            ],
            defaultValue: ["sms"],
          },
          {
            id: "jobs_per_month",
            label: "Jobs completed per month",
            type: "single",
            options: [
              { value: "0-10", label: "0–10" },
              { value: "11-30", label: "11–30" },
              { value: "31-75", label: "31–75" },
              { value: "75+", label: "75+" },
              { value: "unsure", label: "Not sure yet" },
            ],
            defaultValue: "11-30",
          },
        ],
      },
      {
        id: "local_seo_maps",
        title: "Local SEO & Maps (Google Business Profile)",
        blurb:
          "Maps foundation and visibility improvements so homeowners find you locally.",
        fields: [
          {
            id: "locations",
            label: "How many locations (GBP profiles)?",
            type: "single",
            options: [
              { value: "1", label: "1 location" },
              { value: "2-3", label: "2–3 locations" },
              { value: "4+", label: "4+ locations" },
              { value: "unsure", label: "Not sure yet" },
            ],
            defaultValue: "1",
          },
          {
            id: "zones",
            label: "Main focus zones",
            type: "single",
            options: [
              { value: "1-2", label: "1–2 zones" },
              { value: "3+", label: "3+ zones" },
              { value: "unsure", label: "Not sure yet" },
            ],
            defaultValue: "1-2",
          },
          {
            id: "gbp_status",
            label: "GBP status",
            type: "single",
            options: [
              { value: "clean", label: "Clean & active" },
              { value: "messy", label: "Old / messy / inconsistent" },
              { value: "new", label: "New / empty / not set up" },
              { value: "unsure", label: "Not sure yet" },
            ],
            defaultValue: "messy",
          },
          {
            id: "reporting_by_location",
            label: "Need separate reporting by location?",
            type: "toggle",
            defaultValue: false,
            optional: true,
          },
        ],
      },
      {
        id: "websites",
        title: "Websites",
        blurb:
          "Fast, clean, mobile-first pages built to convert visitors into calls and leads.",
        fields: [
          {
            id: "existing_site",
            label: "Do you already have a website?",
            type: "single",
            options: [
              { value: "no", label: "No" },
              { value: "yes_ok", label: "Yes (needs tune-up)" },
              { value: "yes_bad", label: "Yes (needs rebuild)" },
              { value: "unsure", label: "Not sure yet" },
            ],
            defaultValue: "unsure",
          },
          {
            id: "goal",
            label: "Primary goal",
            type: "single",
            options: [
              { value: "legit", label: "Look legit + clarity" },
              { value: "calls", label: "Turn visitors into calls" },
              { value: "ads_ready", label: "Ads-ready landing structure" },
              { value: "unsure", label: "Not sure yet" },
            ],
            defaultValue: "calls",
          },
          {
            id: "services_featured",
            label: "How many services to feature?",
            type: "single",
            options: [
              { value: "1", label: "1 core service" },
              { value: "2-4", label: "2–4 services" },
              { value: "5+", label: "5+ services" },
              { value: "unsure", label: "Not sure yet" },
            ],
            defaultValue: "2-4",
          },
          {
            id: "areas",
            label: "Service areas",
            type: "single",
            options: [
              { value: "1", label: "One area" },
              { value: "2+", label: "Multiple areas" },
              { value: "unsure", label: "Not sure yet" },
            ],
            defaultValue: "1",
          },
          {
            id: "must_haves",
            label: "Must-have elements",
            type: "multi",
            options: [
              { value: "call_first", label: "Call-first layout" },
              { value: "quote_form", label: "Quote form" },
              { value: "booking_request", label: "Booking request" },
              { value: "gallery", label: "Project gallery" },
              { value: "reviews", label: "Reviews section" },
            ],
            defaultValue: ["call_first", "quote_form", "reviews"],
            optional: true,
          },
          {
            id: "ongoing_care",
            label: "Ongoing care preference",
            type: "single",
            options: [
              { value: "diy", label: "DIY (I’ll manage updates)" },
              { value: "essential", label: "Essential care" },
              { value: "growth", label: "Growth care" },
              { value: "unsure", label: "Not sure yet" },
            ],
            defaultValue: "essential",
            optional: true,
          },
        ],
      },
      {
        id: "performance_marketing",
        title: "Performance Marketing (Google + Meta Ads)",
        blurb:
          "Ads focused on booked jobs—built with clean tracking and weekly optimization.",
        fields: [
          {
            id: "platforms",
            label: "Primary platform",
            type: "single",
            options: [
              { value: "google", label: "Google Ads" },
              { value: "meta", label: "Meta Ads" },
              { value: "both", label: "Both" },
              { value: "unsure", label: "Not sure yet" },
            ],
            defaultValue: "both",
          },
          {
            id: "ad_budget",
            label: "Monthly ad spend range (paid to platforms)",
            type: "single",
            options: [
              { value: "light", label: "Light" },
              { value: "standard", label: "Standard" },
              { value: "growth", label: "Growth" },
              { value: "aggressive", label: "Aggressive" },
              { value: "unsure", label: "Not sure yet" },
            ],
            helper:
              "This is NOT our fee. It’s the media budget that goes to Google/Meta.",
            defaultValue: "standard",
          },
          {
            id: "service_focus",
            label: "Service focus",
            type: "single",
            options: [
              { value: "one", label: "One core service" },
              { value: "multi", label: "Multiple services" },
              { value: "unsure", label: "Not sure yet" },
            ],
            defaultValue: "multi",
          },
          {
            id: "coverage",
            label: "Market coverage",
            type: "single",
            options: [
              { value: "one_area", label: "One city / area" },
              { value: "multi_area", label: "Multiple cities" },
              { value: "unsure", label: "Not sure yet" },
            ],
            defaultValue: "one_area",
          },
          {
            id: "tracking_ready",
            label: "Tracking readiness",
            type: "single",
            options: [
              { value: "ready", label: "We already track calls/forms" },
              { value: "need", label: "Need tracking setup" },
              { value: "unsure", label: "Not sure yet" },
            ],
            defaultValue: "need",
          },
        ],
      },
      {
        id: "social_management",
        title: "Social Management",
        blurb:
          "Consistent posting + trust-building. Simple, clean, and professional presence.",
        fields: [
          {
            id: "profiles_setup",
            label: "Profiles status",
            type: "single",
            options: [
              { value: "ready", label: "Already set up" },
              { value: "cleanup", label: "Clean up / set up" },
              { value: "unsure", label: "Not sure yet" },
            ],
            defaultValue: "cleanup",
          },
          {
            id: "plan",
            label: "Monthly plan",
            type: "single",
            options: [
              { value: "steady", label: "Steady Presence" },
              { value: "lead", label: "Lead Support" },
              { value: "authority", label: "Local Authority" },
              { value: "unsure", label: "Not sure yet" },
            ],
            defaultValue: "steady",
          },
          {
            id: "content_source",
            label: "Content source",
            type: "single",
            options: [
              { value: "have", label: "We have job photos/videos" },
              { value: "need", label: "We need help producing content" },
              { value: "unsure", label: "Not sure yet" },
            ],
            defaultValue: "have",
            optional: true,
          },
          {
            id: "language",
            label: "Language",
            type: "single",
            options: [
              { value: "en", label: "English" },
              { value: "en_es", label: "English + Spanish" },
            ],
            defaultValue: "en",
            optional: true,
          },
          {
            id: "addons",
            label: "Add-ons",
            type: "multi",
            options: [
              { value: "reels", label: "Reels / short-form" },
              { value: "gbp_posts", label: "Google Business Profile posts" },
              { value: "community", label: "Heavy community replies" },
            ],
            defaultValue: [],
            optional: true,
          },
        ],
      },
      {
        id: "analytics_tracking",
        title: "Analytics, Tracking & ROI",
        blurb:
          "See what’s working—calls, forms, and (optionally) ROI attribution from closed jobs.",
        fields: [
          {
            id: "goal",
            label: "What do you want?",
            type: "single",
            options: [
              { value: "pulse", label: "Basic tracking + monthly pulse" },
              { value: "roi", label: "ROI attribution (closed-won)" },
              { value: "unsure", label: "Not sure yet" },
            ],
            defaultValue: "pulse",
          },
          {
            id: "locations",
            label: "Locations",
            type: "single",
            options: [
              { value: "1", label: "1 location" },
              { value: "2+", label: "2+ locations" },
              { value: "unsure", label: "Not sure yet" },
            ],
            defaultValue: "1",
          },
          {
            id: "paid_channels",
            label: "Paid channels to track",
            type: "multi",
            options: [
              { value: "google", label: "Google Ads" },
              { value: "meta", label: "Meta" },
              { value: "lsa", label: "Local Services Ads (LSA)" },
              { value: "other", label: "Other" },
            ],
            defaultValue: ["google", "meta"],
            optional: true,
          },
          {
            id: "data_quality",
            label: "Tracking setup health",
            type: "single",
            options: [
              { value: "clean", label: "Clean setup" },
              { value: "messy", label: "Messy / multiple old tags" },
              { value: "unsure", label: "Not sure yet" },
            ],
            defaultValue: "unsure",
          },
          {
            id: "crm_closed_won",
            label: "Do you track closed-won revenue in a CRM?",
            type: "toggle",
            defaultValue: false,
            optional: true,
          },
        ],
      },
      {
        id: "audit_strategy",
        title: "Marketing Audit & Strategy",
        blurb:
          "A clear diagnosis + 90-day plan. Optional quick-win fixes after the audit.",
        fields: [
          {
            id: "why",
            label: "Why are you here today?",
            type: "single",
            options: [
              { value: "no_leads", label: "Not getting leads" },
              { value: "not_closing", label: "Getting leads but not closing" },
              { value: "unsure", label: "Not sure" },
            ],
            defaultValue: "unsure",
          },
          {
            id: "call_recordings",
            label: "Do you have call recordings?",
            type: "single",
            options: [
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
              { value: "unsure", label: "Not sure" },
            ],
            defaultValue: "unsure",
            optional: true,
          },
          {
            id: "audit_scope",
            label: "What should we audit?",
            type: "multi",
            options: [
              { value: "website", label: "Website (speed/structure/forms)" },
              { value: "ads", label: "Ads funnel" },
              { value: "lead_handling", label: "Lead handling / missed calls" },
              { value: "maps", label: "Local Maps foundation" },
            ],
            defaultValue: ["website", "lead_handling"],
          },
          {
            id: "quick_wins",
            label: "Do you want Quick Wins implementation after the audit?",
            type: "toggle",
            defaultValue: true,
            optional: true,
          },
        ],
      },
      {
        id: "brand_creative",
        title: "Brand & Creative",
        blurb:
          "Clean up your look and trust layer—logo, templates, and polished visuals.",
        fields: [
          {
            id: "starting_point",
            label: "Starting point",
            type: "single",
            options: [
              { value: "logo_refresh", label: "Logo refresh" },
              {
                value: "brand_kit",
                label: "Brand kit (mini guidelines + templates)",
              },
              { value: "brand_system", label: "Brand system (more robust)" },
              { value: "unsure", label: "Not sure yet" },
            ],
            defaultValue: "brand_kit",
          },
          {
            id: "need_templates",
            label: "Need social templates?",
            type: "toggle",
            defaultValue: true,
            optional: true,
          },
          {
            id: "truck_uniform",
            label: "Need truck/uniform lockup?",
            type: "toggle",
            defaultValue: false,
            optional: true,
          },
          {
            id: "photo_quality",
            label: "Photo quality",
            type: "single",
            options: [
              { value: "good", label: "We have good photos" },
              { value: "messy", label: "Usable but messy/dark" },
              { value: "none", label: "We barely have photos" },
              { value: "unsure", label: "Not sure" },
            ],
            defaultValue: "unsure",
            optional: true,
          },
        ],
      },
    ],
    [],
  );

  const PRESETS: PresetDef[] = useMemo(
    () => [
      {
        id: "foundation",
        title: "The Foundation",
        tagline: "Look legit. Get found.",
        icon: <Rocket size={18} />,
        services: ["websites", "local_seo_maps", "social_management"],
        defaults: {
          websites: { goal: "legit", ongoing_care: "essential" },
          local_seo_maps: { locations: "1", gbp_status: "messy" },
          social_management: { plan: "steady", profiles_setup: "cleanup" },
        },
      },
      {
        id: "build",
        title: "The Build",
        tagline: "Turn visitors into calls.",
        icon: <Zap size={18} />,
        services: [
          "websites",
          "local_seo_maps",
          "reviews_engine",
          "analytics_tracking",
        ],
        defaults: {
          websites: { goal: "calls", ongoing_care: "growth" },
          reviews_engine: { goal: "reviews", channels: ["sms"] },
          analytics_tracking: { goal: "pulse", data_quality: "unsure" },
          local_seo_maps: { gbp_status: "messy" },
        },
      },
      {
        id: "system",
        title: "The System",
        tagline: "Fewer missed leads. Clearer ROI.",
        icon: <Layers size={18} />,
        services: [
          "digital_secretary",
          "reviews_engine",
          "performance_marketing",
          "analytics_tracking",
        ],
        defaults: {
          digital_secretary: {
            handles: ["qualify", "faqs", "routing"],
            routing_complexity: "advanced",
          },
          reviews_engine: { goal: "both", channels: ["sms", "email"] },
          performance_marketing: { platforms: "both", ad_budget: "growth" },
          analytics_tracking: { goal: "roi", data_quality: "messy" },
        },
      },
      {
        id: "expansion",
        title: "The Expansion",
        tagline: "Multi-crew, multi-location growth.",
        icon: <Crown size={18} />,
        services: [
          "digital_secretary",
          "analytics_tracking",
          "local_seo_maps",
          "performance_marketing",
        ],
        defaults: {
          digital_secretary: {
            handles: ["qualify", "faqs", "routing", "booking"],
            services_count: "4+",
            zones: "3+",
            calendars: "multi",
            routing_complexity: "advanced",
          },
          analytics_tracking: {
            goal: "roi",
            locations: "2+",
            data_quality: "messy",
          },
          local_seo_maps: {
            locations: "2-3",
            zones: "3+",
            gbp_status: "messy",
          },
          performance_marketing: {
            coverage: "multi_area",
            ad_budget: "aggressive",
          },
        },
      },
    ],
    [],
  );

  // ---------- State ----------
  const [presetId, setPresetId] = useState<string>("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [answers, setAnswers] = useState<Record<string, Record<string, any>>>(
    {},
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lead, setLead] = useState<LeadForm>({
    name: "",
    email: "",
    phone: "",
    businessType: "",
    cityState: "",
    website: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitOk, setSubmitOk] = useState<null | boolean>(null);
  const [submitMsg, setSubmitMsg] = useState<string>("");

  // ---------- Initialize defaults on selection ----------
  const ensureServiceDefaults = (serviceId: string) => {
    const service = SERVICES.find((s) => s.id === serviceId);
    if (!service) return;

    setAnswers((prev) => {
      const next = { ...prev };
      const current = next[serviceId] ? { ...next[serviceId] } : {};

      for (const f of service.fields) {
        if (current[f.id] === undefined && f.defaultValue !== undefined) {
          current[f.id] = f.defaultValue;
        }
      }

      next[serviceId] = current;
      return next;
    });
  };

  const applyPreset = (p: PresetDef) => {
    setPresetId(p.id);

    const nextSelected: Record<string, boolean> = {};
    const nextExpanded: Record<string, boolean> = {};
    for (const sid of p.services) {
      nextSelected[sid] = true;
      nextExpanded[sid] = false;
    }

    setSelected(nextSelected);
    setExpanded(nextExpanded);

    setAnswers(() => {
      const merged: Record<string, Record<string, any>> = {};

      for (const sid of p.services)
        merged[sid] = { ...(p.defaults[sid] || {}) };

      for (const sid of p.services) {
        const service = SERVICES.find((s) => s.id === sid);
        if (!service) continue;
        const a = merged[sid] || {};
        for (const f of service.fields) {
          if (a[f.id] === undefined && f.defaultValue !== undefined) {
            a[f.id] = f.defaultValue;
          }
        }
        merged[sid] = a;
      }

      return merged;
    });
  };

  const toggleService = (serviceId: string, on?: boolean) => {
    setSelected((prev) => {
      const next = { ...prev };
      const nextValue = on !== undefined ? on : !prev[serviceId];
      next[serviceId] = nextValue;
      return next;
    });

    setExpanded((prev) => ({
      ...prev,
      [serviceId]: on !== undefined ? on : true,
    }));

    if (on === false) {
      setAnswers((prev) => {
        const next = { ...prev };
        delete next[serviceId];
        return next;
      });
      return;
    }

    ensureServiceDefaults(serviceId);
  };

  const setFieldValue = (serviceId: string, fieldId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [serviceId]: { ...(prev[serviceId] || {}), [fieldId]: value },
    }));
  };

  // ---------- Derived ----------
  const selectedServices = useMemo(() => {
    const ids = Object.entries(selected)
      .filter(([_, v]) => v)
      .map(([k]) => k);
    return SERVICES.filter((s) => ids.includes(s.id));
  }, [selected, SERVICES]);

  const preset = useMemo(
    () => PRESETS.find((p) => p.id === presetId) || null,
    [PRESETS, presetId],
  );

  const getOptionLabel = (field: Field, value: any) => {
    if (!field.options) return String(value ?? "");
    const opt = field.options.find((o) => o.value === value);
    return opt ? opt.label : String(value ?? "");
  };

  const summarizeService = (service: ServiceDef) => {
    const a = answers[service.id] || {};
    const parts: string[] = [];

    for (const f of service.fields) {
      const v = a[f.id];

      if (
        f.optional &&
        (v === undefined || v === "" || (Array.isArray(v) && v.length === 0))
      )
        continue;

      if (f.type === "toggle") {
        if (v === true) parts.push(`${f.label}: Yes`);
        else if (v === false && !f.optional) parts.push(`${f.label}: No`);
        continue;
      }

      if (f.type === "multi") {
        if (Array.isArray(v) && v.length > 0) {
          const labels = v
            .map((x) => (f.options ? getOptionLabel(f, x) : String(x)))
            .filter(Boolean);
          if (labels.length) parts.push(`${f.label}: ${labels.join(", ")}`);
        }
        continue;
      }

      if (f.type === "number") {
        if (typeof v === "number") parts.push(`${f.label}: ${v}`);
        continue;
      }

      if (f.type === "text") {
        if (typeof v === "string" && v.trim().length > 0) {
          parts.push(`${f.label}: ${v.trim()}`);
        }
        continue;
      }

      if (v !== undefined && v !== "") {
        parts.push(`${f.label}: ${getOptionLabel(f, v)}`);
      }
    }

    return parts.slice(0, 4);
  };

  const computeCompleteness = () => {
    let missing = 0;
    let required = 0;

    for (const s of selectedServices) {
      const a = answers[s.id] || {};
      for (const f of s.fields) {
        if (f.optional) continue;
        required += 1;

        const v = a[f.id];
        const isEmpty =
          v === undefined ||
          v === "" ||
          (Array.isArray(v) && v.length === 0) ||
          (f.type === "number" && typeof v !== "number");

        if (isEmpty) missing += 1;
      }
    }

    const filled = required - missing;
    const pct = required === 0 ? 0 : Math.round((filled / required) * 100);

    let label = "Empty";
    if (pct >= 90) label = "Great";
    else if (pct >= 65) label = "Good";
    else if (pct > 0) label = "Needs details";

    return { missing, required, pct, label };
  };

  const completeness = useMemo(computeCompleteness, [
    selectedServices,
    answers,
  ]);

  const buildPlainTextSummary = () => {
    const lines: string[] = [];
    lines.push("OLLIN PLAN REQUEST");
    lines.push("—");
    lines.push(`Name: ${lead.name || "-"}`);
    lines.push(`Email: ${lead.email || "-"}`);
    if (lead.phone) lines.push(`Phone: ${lead.phone}`);
    if (lead.businessType) lines.push(`Business type: ${lead.businessType}`);
    if (lead.cityState) lines.push(`City/State: ${lead.cityState}`);
    if (lead.website) lines.push(`Website: ${lead.website}`);
    lines.push("");

    lines.push(
      `Starting level: ${preset ? preset.title : "Custom / not selected"}`,
    );
    lines.push(`Services selected: ${selectedServices.length}`);
    lines.push("");

    for (const s of selectedServices) {
      lines.push(`• ${s.title}`);
      const bullets = summarizeService(s);
      if (bullets.length === 0) lines.push("  - (details not provided yet)");
      else for (const b of bullets) lines.push(`  - ${b}`);
      lines.push("");
    }

    if (lead.notes?.trim()) {
      lines.push("Notes:");
      lines.push(lead.notes.trim());
      lines.push("");
    }

    lines.push("Raw JSON (for internal use):");
    lines.push(
      safeJson({
        presetId: preset?.id || null,
        selectedServices: selectedServices.map((s) => s.id),
        answers,
      }),
    );

    return lines.join("\n");
  };

  const openMailtoFallback = () => {
    const subject = `New OLLIN Plan Request — ${lead.name || "New Lead"}`;
    const body = buildPlainTextSummary();
    const href = `mailto:${EMAIL_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  };

 const submitPlan = async () => {
  setSubmitOk(null);
  setSubmitMsg("");

  if (!lead.email.trim() || !lead.name.trim()) {
    setSubmitOk(false);
    setSubmitMsg("Please add your name and email.");
    return;
  }

  if (selectedServices.length === 0) {
    setSubmitOk(false);
    setSubmitMsg("Please select at least one service.");
    return;
  }

  const endpoint = import.meta.env.VITE_LEADS_GATEWAY_URL;
  if (!endpoint) {
    setSubmitOk(false);
    setSubmitMsg("Missing VITE_LEADS_GATEWAY_URL");
    return;
  }

  const selectedTitles = selectedServices.map((s) => s.title).join(", ");
  const summary = buildPlainTextSummary(); 

  const payload = {
    fullName: lead.name,
    email: lead.email,
    phone: lead.phone || "",
    businessType: lead.businessType || "packages_request",
    website: lead.website || "",
    location: lead.cityState || "",
    message: [
      `Packages request`,
      `Preset: ${preset ? preset.title : "Custom"}`,
      `Services: ${selectedTitles}`,
      lead.notes?.trim() ? `Notes: ${lead.notes.trim()}` : "",
      "",
      summary,
    ].filter(Boolean).join("\n"),
    page_url: window.location.href,
    referrer: document.referrer || null,
    user_agent: navigator.userAgent,
    ts_client: new Date().toISOString(),
    source: "ollin_packages_builder",
  };

  setSubmitting(true);

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const msg =
        data?.error
          ? `Error: ${data.error} (requestId: ${data.requestId ?? "n/a"})`
          : `Request failed (${res.status})`;
      throw new Error(msg);
    }

    setSubmitOk(true);
    setSubmitMsg("Thanks — we got your plan. We’ll reach out shortly.");
    return;
  } catch (err) {
    console.error("Plan submit error:", err);
    setSubmitOk(false);
    setSubmitMsg("Couldn’t send automatically. Please try again.");
  } finally {
    setSubmitting(false);
  }
};

  // ---------- UI ----------
  return (
    <div className="w-full min-h-screen bg-ollin-bg text-ollin-black relative">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-14 pb-16">
        {/* Hero */}
        <PersonalizedPackageHero />

        {/* Presets */}
        <PersonalizedPackagePresets
          SERVICES={SERVICES.map((s) => ({ id: s.id, title: s.title }))}
          PRESETS={PRESETS}
          presetId={presetId}
          onApplyPreset={applyPreset}
          onStartFromScratch={() => {
            setPresetId("");
            setSelected({});
            setExpanded({});
            setAnswers({});
          }}
        />

        {/* Builder */}
        <PersonalizedPackageBuilder
          SERVICES={SERVICES}
          selectedServices={selectedServices}
          selected={selected}
          expanded={expanded}
          answers={answers}
          preset={
            preset
              ? { id: preset.id, title: preset.title, tagline: preset.tagline }
              : null
          }
          completeness={completeness}
          setExpanded={setExpanded}
          toggleService={toggleService}
          setFieldValue={setFieldValue}
          summarizeService={summarizeService}
          onOpenModal={() => setIsModalOpen(true)}
          onSetCustom={() => setPresetId("")}
        />
      </div>

      {/* Modal */}
      <PersonalizedPackageModal
        isOpen={isModalOpen}
        submitting={submitting}
        lead={lead}
        setLead={setLead}
        selectedServicesCount={selectedServices.length}
        preset={
          preset
            ? { id: preset.id, title: preset.title, tagline: preset.tagline }
            : null
        }
        submitOk={submitOk}
        submitMsg={submitMsg}
        onClose={() => setIsModalOpen(false)}
        onSubmit={submitPlan}
      />
    </div>
  );
};

export default PersonalizedPackage;
