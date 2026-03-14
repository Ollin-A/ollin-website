import React, { useEffect } from "react";
import { useHead } from "@unhead/react";

const Privacy: React.FC = () => {
  useHead({
    title: "Privacy Policy — OLLIN",
    meta: [
      { name: "description", content: "How OLLIN Agency handles your data. Privacy policy for ollin.agency." },
      { property: "og:title", content: "Privacy Policy — OLLIN" },
      { property: "og:description", content: "How OLLIN Agency handles your data. Privacy policy for ollin.agency." },
    ],
    link: [{ rel: "canonical", href: "https://ollin.agency/privacy" }],
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#F2F2F2] pt-32 pb-20 px-6 sm:px-10 lg:px-20">
      <div className="max-w-3xl mx-auto prose prose-black">
        <h1 className="text-4xl sm:text-5xl font-normal mb-2 tracking-[-0.04em]">
          Privacy Policy
        </h1>
        <p className="text-sm uppercase tracking-[0.2em] text-black/60 mb-12">
          Effective Date: March 09, 2026
        </p>

        <div className="space-y-8 text-lg leading-relaxed font-light text-black/80">
          <section>
            <h2 className="text-2xl font-medium mb-4 text-black">1. Introduction</h2>
            <p>
              Ollin Agency (“Ollin,” “we,” “us,” or “our”) respects your privacy and is committed to protecting the information you provide when interacting with our website and services. This Privacy Policy explains what information we collect, how we use it, and the choices available to you. Our services are designed primarily for business owners and contractors operating in the United States.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-4 text-black">2. Information We Collect</h2>
            <p className="mb-4">We collect information you voluntarily provide to us, as well as technical data required to operate our automation infrastructure:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-black/50">
              <li>
                <strong className="font-medium text-black">Contact & Business Information:</strong> Full name, email address, phone number, business name, and Meta Business Manager identifiers.
              </li>
              <li>
                <strong className="font-medium text-black">API & Integration Data:</strong> Meta API access tokens, WhatsApp/Messenger/Instagram Webhook configurations, and conversational state data stored securely in our database (Supabase).
              </li>
              <li>
                <strong className="font-medium text-black">Technical Information:</strong> IP address, browser type, and system logs strictly for security, observability, and debugging. We do not store full message payloads longer than necessary for processing.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-4 text-black">3. How We Use Your Information</h2>
            <p className="mb-4">We use the information collected solely to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-black/50">
              <li>Configure and operate automated workflows via WhatsApp Business API, Facebook Messenger, and Instagram Messaging.</li>
              <li>Provide our internal operational system (Ollin OS) to classify and orchestrate business conversations.</li>
              <li>Deliver contracted services and provide technical support.</li>
            </ul>
            <p>We do not sell your personal information or your clients' information to anyone.</p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-4 text-black">4. Client Data vs. Visitor Data (Data Processing)</h2>
            <p>
              Ollin Agency provides an operational runtime and communication systems for contractors. In delivering these services, we act as a Data Processor for the lead and customer data provided by our clients. Our system strictly separates decision logic from execution, ensuring that clients retain control over their communications. Data processed on behalf of our clients is governed by our service agreements and Meta's platform policies. We do not use our clients' data for our own marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-4 text-black">5. Data Sharing and Third Parties</h2>
            <p className="mb-4">We share data only to operate our services:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-black/50">
              <li>With Meta Platforms Inc., to facilitate the Meta Business APIs.</li>
              <li>With trusted cloud infrastructure providers (such as Supabase) under strict confidentiality agreements.</li>
            </ul>
            <p>We do not share personal information with third parties for their own marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-4 text-black">6. Data Security and Retention</h2>
            <p>
              We implement reasonable safeguards, including tenant isolation and strict token management, to protect your business information. We retain information only for as long as necessary to provide our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-4 text-black">7. Your Rights & Contact Information</h2>
            <p className="mb-4">
              Depending on your state of residence, you may request access to, correction of, or deletion of your data.
            </p>
            <address className="not-italic space-y-2">
              <p>
                Email: <a href="mailto:contact@ollin.agency" className="underline hover:opacity-70">contact@ollin.agency</a>
              </p>
              <p>
                Website: <a href="https://ollin.agency" className="underline hover:opacity-70">https://ollin.agency</a>
              </p>
            </address>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
