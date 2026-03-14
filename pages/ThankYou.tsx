import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useHead } from "@unhead/react";

const ThankYou: React.FC = () => {
  useHead({
    title: "Thank You — OLLIN",
    meta: [
      {
        name: "description",
        content:
          "Your request has been received. We will be in touch within 24 hours.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
    link: [{ rel: "canonical", href: "https://ollin.agency/thank-you" }],
  });

  useEffect(() => {
    // Google Ads conversion
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "conversion", {
        send_to: "AW-XXXXXXXXX/YYYYYYYYYY", // Replace with real conversion ID
      });
    }

    // Meta Pixel
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Lead");
    }

    // Generic dataLayer push for GTM
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: "lead_form_submission",
        page: "/thank-you",
      });
    }
  }, []);

  const steps = [
    "We review your request and match you with the right services",
    "You'll get a personalized growth plan within 48 hours",
    "We hop on a 15-minute call to walk through it — no pressure",
  ];

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-xl w-full text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-ollin-black/50 font-medium mb-4">
          Request Received
        </p>

        <h1 className="text-3xl md:text-4xl font-bold text-ollin-black font-[Montserrat] leading-tight mb-4">
          We'll be in touch within 24 hours
        </h1>

        <p className="text-ollin-black/60 text-sm md:text-base leading-relaxed mb-10">
          Check your inbox — we'll send a confirmation email with next steps.
          <br />
          In the meantime, here's what happens next:
        </p>

        <ol className="text-left space-y-4 mb-12 max-w-md mx-auto">
          {steps.map((text, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="shrink-0 w-8 h-8 rounded-full bg-ollin-black text-white flex items-center justify-center text-sm font-semibold">
                {i + 1}
              </span>
              <span className="text-ollin-black/80 text-sm leading-relaxed pt-1">
                {text}
              </span>
            </li>
          ))}
        </ol>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="px-6 py-3 bg-ollin-black text-white font-medium rounded-lg hover:bg-black/80 transition-all text-sm"
          >
            Back to Home →
          </Link>
          <Link
            to="/services"
            className="px-6 py-3 text-ollin-black font-medium rounded-lg border border-ollin-black/15 hover:bg-black/5 transition-all text-sm"
          >
            Explore Our Services →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ThankYou;
