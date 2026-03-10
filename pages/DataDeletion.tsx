import React, { useEffect } from "react";

const DataDeletion: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#F2F2F2] pt-32 pb-20 px-6 sm:px-10 lg:px-20">
      <div className="max-w-3xl mx-auto prose prose-black">
        <h1 className="text-4xl sm:text-5xl font-normal mb-2 tracking-[-0.04em]">
          User Data Deletion Instructions
        </h1>
        <p className="text-sm uppercase tracking-[0.2em] text-black/60 mb-12">
          Effective Date: March 09, 2026
        </p>

        <div className="space-y-8 text-lg leading-relaxed font-light text-black/80">
          <p>
            Ollin Agency respects your right to data privacy. If you wish to disconnect your Meta assets from our application and request the deletion of your data, please follow the steps below.
          </p>

          <section>
            <h2 className="text-2xl font-medium mb-4 text-black">What data is deleted?</h2>
            <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-black/50">
              <li>Meta API Access Tokens and Webhook subscriptions.</li>
              <li>Conversational state data and system routing logs.</li>
              <li>Connection between your WhatsApp/Messenger/Instagram accounts and Ollin OS.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-4 text-black">How to request deletion:</h2>
            <p className="mb-4">
              Please send an email to <a href="mailto:contact@ollin.agency" className="underline hover:opacity-70">contact@ollin.agency</a> with the subject line: <strong>"Data Deletion Request - [Your Business Name]"</strong>.
            </p>
            <p className="mb-4">Include the following information in your email:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-black/50">
              <li>Your full name and business name.</li>
              <li>The specific Meta assets connected (e.g., the WhatsApp phone number or Facebook Page link).</li>
              <li>A clear statement requesting the deletion of your data.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-4 text-black">Processing Time:</h2>
            <p>
              We will process your request, revoke all technical access, and delete your configuration from our active databases within 10 business days.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DataDeletion;
