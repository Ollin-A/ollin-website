import React, { useEffect } from "react";

const Terms: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#F2F2F2] pt-32 pb-20 px-6 sm:px-10 lg:px-20">
      <div className="max-w-3xl mx-auto prose prose-black">
        <h1 className="text-4xl sm:text-5xl font-normal mb-2 tracking-[-0.04em]">
          Terms of Service
        </h1>
        <p className="text-sm uppercase tracking-[0.2em] text-black/60 mb-12">
          Effective Date: March 09, 2026
        </p>

        <div className="space-y-8 text-lg leading-relaxed font-light text-black/80">
          <section>
            <h2 className="text-2xl font-medium mb-4 text-black">1. Services Provided</h2>
            <p>
              Ollin Agency provides an operational system (Ollin OS) designed to automate, classify, and orchestrate business conversations for contractors across messaging channels. Our services connect your Meta Business assets (WhatsApp Business API, Instagram, Messenger) to our infrastructure to ensure no commercial intent is lost and to maximize your business outcomes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-4 text-black">2. Client Responsibilities</h2>
            <p className="mb-4">To utilize Ollin Agency's technology, the client agrees to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-black/50">
              <li>Provide and maintain valid Meta assets (WhatsApp numbers, Facebook Pages, Instagram Professional accounts).</li>
              <li>Maintain a verified Meta Business Portfolio.</li>
              <li>Use the services strictly in compliance with Meta’s Commerce and Business Policies.</li>
              <li>Acknowledge that while Ollin reduces manual work, the human operator governs the final business decisions.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-4 text-black">3. Ollin Agency's Responsibilities</h2>
            <p className="mb-4">We commit to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-black/50">
              <li>Providing a stable infrastructure that gracefully degrades in case of errors, ensuring the communication pipeline never stops completely.</li>
              <li>Maintaining strict separation of client data and secure management of API tokens.</li>
              <li>Allowing a "Soft Human Override," enabling clients to take manual control of conversations at any time without breaking the system.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-4 text-black">4. Limitation of Liability</h2>
            <p className="mb-4">Ollin Agency is not responsible for:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-black/50">
              <li>Account restrictions, bans, or limitations imposed by Meta due to the client's violation of Meta's messaging policies.</li>
              <li>Lost revenue resulting from third-party API outages (e.g., Meta, WhatsApp Cloud API).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-4 text-black">5. Modifications</h2>
            <p>
              We reserve the right to update these terms. Continued use of our services constitutes acceptance of the updated terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
