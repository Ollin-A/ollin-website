import React, { useEffect } from "react";

const Privacy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#F2F2F2] pt-32 pb-20 px-6 sm:px-10 lg:px-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-normal mb-2 tracking-[-0.04em]">
          Privacy Policy
        </h1>
        <p className="text-sm uppercase tracking-[0.2em] text-black/60 mb-12">
          Effective Date: 02/17/2026
        </p>

        <div className="space-y-12 text-lg leading-relaxed font-light text-black/80">
          {/* 1. Introduction */}
          <section>
            <h2 className="text-2xl font-medium mb-4 text-black">1. Introduction</h2>
            <p className="mb-4">
              Ollin Agency (“Ollin,” “we,” “us,” or “our”) respects your
              privacy and is committed to protecting the information you provide
              when interacting with our website and services.
            </p>
            <p className="mb-4">
              This Privacy Policy explains what information we collect, how we
              use it, and the choices available to you.
            </p>
            <p>
              Our services are designed primarily for business owners and
              contractors operating in the United States.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section>
            <h2 className="text-2xl font-medium mb-4 text-black">
              2. Information We Collect
            </h2>
            <p className="mb-4">
              We collect information you voluntarily provide to us when you fill
              out forms, email us, or send us direct messages. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-black/50">
              <li>
                <strong className="font-medium text-black">Contact Information:</strong> Full
                name, email address, phone number, business name, business type,
                city/state, and website URL.
              </li>
              <li>
                <strong className="font-medium text-black">Project Information:</strong>{" "}
                Service requests, business goals, and any notes submitted
                through our contact channels.
              </li>
              <li>
                <strong className="font-medium text-black">Technical Information:</strong>{" "}
                When you visit our website, our servers automatically collect
                basic, essential technical data such as IP address, browser
                type, and referring URL strictly for security and site
                functionality.
              </li>
            </ul>
            <p>
              We do not collect sensitive personal data, nor do we use AI
              resources or voice agents to process visitor data on our website.
            </p>
          </section>

          {/* 3. How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-medium mb-4 text-black">
              3. How We Use Your Information
            </h2>
            <p className="mb-4">We use the information collected solely to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-black/50">
              <li>Respond to inquiries and communicate regarding projects.</li>
              <li>Provide proposals or service recommendations.</li>
              <li>Deliver contracted services.</li>
              <li>Maintain internal business records.</li>
            </ul>
            <p>We do not sell your personal information to anyone.</p>
          </section>

          {/* 4. Cookies and Tracking Technologies */}
          <section>
            <h2 className="text-2xl font-medium mb-4 text-black">
              4. Cookies and Tracking Technologies
            </h2>
            <p className="mb-4">
              Our website uses strictly essential cookies required for basic
              site functionality and security.
            </p>
            <p>
              We do not use non-essential cookies, behavioral tracking
              technologies, or third-party marketing and advertising cookies. If
              our data collection practices change in the future, this Privacy
              Policy will be updated accordingly.
            </p>
          </section>

          {/* 5. Client Data vs. Visitor Data */}
          <section>
            <h2 className="text-2xl font-medium mb-4 text-black">
              5. Client Data vs. Visitor Data (Data Processing)
            </h2>
            <p className="mb-4">
              Ollin Agency provides marketing and operational systems for
              contractors. In delivering these services (such as CRM management,
              automation, and review generation), we act as a Data Processor for
              the lead and customer data provided by our clients.
            </p>
            <p>
              This Privacy Policy applies only to visitors of the Ollin website.
              Data processed on behalf of our clients is governed by our
              specific service agreements with those clients. We do not use our
              clients' data for our own marketing purposes.
            </p>
          </section>

          {/* 6. Data Sharing and Third Parties */}
          <section>
            <h2 className="text-2xl font-medium mb-4 text-black">
              6. Data Sharing and Third Parties
            </h2>
            <p>
              We use trusted third-party service providers strictly to operate
              our business, including cloud infrastructure, email tools, and
              internal database services. These providers process information
              only to provide services on our behalf and are contractually
              obligated to keep your data secure. We do not share personal
              information with third parties for their own marketing purposes.
            </p>
          </section>

          {/* 7. Data Security and Retention */}
          <section>
            <h2 className="text-2xl font-medium mb-4 text-black">
              7. Data Security and Retention
            </h2>
            <p>
              We implement reasonable administrative and technical safeguards to
              protect your business information. We retain contact and
              project-related information only for as long as necessary to
              provide our services, maintain our records, and comply with legal
              obligations.
            </p>
          </section>

          {/* 8. Your Rights (U.S. Residents) */}
          <section>
            <h2 className="text-2xl font-medium mb-4 text-black">
              8. Your Rights (U.S. Residents)
            </h2>
            <p className="mb-4">
              Depending on your state of residence, you may have the right to
              request access to, correction of, or deletion of your personal
              information. To exercise these rights, please contact us at:
            </p>
            <p className="mb-4">
              📧{" "}
              <a
                href="mailto:contact@ollin.agency"
                className="underline hover:opacity-70"
              >
                contact@ollin.agency
              </a>
            </p>
            <p>
              We will respond within a reasonable timeframe consistent with
              applicable law.
            </p>
          </section>

          {/* 9. Children’s Privacy */}
          <section>
            <h2 className="text-2xl font-medium mb-4 text-black">
              9. Children’s Privacy
            </h2>
            <p>
              Our website and services are entirely B2B (business-to-business)
              and are not directed to individuals under 18. We do not knowingly
              collect personal information from children.
            </p>
          </section>

          {/* 10. Changes to This Policy */}
          <section>
            <h2 className="text-2xl font-medium mb-4 text-black">
              10. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy as our business evolves. Any
              changes will be posted on this page with an updated effective
              date.
            </p>
          </section>

          {/* 11. Contact Information */}
          <section>
            <h2 className="text-2xl font-medium mb-4 text-black">
              11. Contact Information
            </h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy, please contact:
            </p>
            <address className="not-italic">
              <strong className="block text-black">Ollin Agency</strong>
              <p>
                Email:{" "}
                <a
                  href="mailto:contact@ollin.agency"
                  className="underline hover:opacity-70"
                >
                  contact@ollin.agency
                </a>
              </p>
              <p>
                Website:{" "}
                <a
                  href="https://ollin.agency"
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:opacity-70"
                >
                  https://ollin.agency
                </a>
              </p>
            </address>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
