import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INPUT_CLASS =
  'w-full px-4 py-3 bg-white rounded-lg border-0 focus:ring-2 focus:ring-black/5 outline-none transition-all placeholder:text-gray-400 text-ollin-black';

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
};

export const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    businessType: '',
    website: '',
    location: '',
    message: '',
    company_fax: '',
  });

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const goToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) return;
    setDirection(1);
    setStep(2);
    setError('');
  };

  const goBack = () => {
    setDirection(-1);
    setStep(1);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = import.meta.env.VITE_LEADS_GATEWAY_URL;

      if (!endpoint) {
        throw new Error('Missing VITE_LEADS_GATEWAY_URL');
      }

      const { company_fax, ...fields } = formData;

      const payload = {
        ...fields,
        company_fax,
        page_url: window.location.href,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        ts_client: new Date().toISOString(),
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const msg = data?.error
          ? `Error: ${data.error} (requestId: ${data.requestId ?? 'n/a'})`
          : `Network error (status ${response.status})`;
        throw new Error(msg);
      }

      if (data?.requestId) console.log('Lead sent. requestId:', data.requestId);

      // Reset and redirect
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        businessType: '',
        website: '',
        location: '',
        message: '',
        company_fax: '',
      });
      setStep(1);
      setDirection(1);
      onClose();
      navigate('/thank-you');
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#F6F5F2] rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-black transition-colors rounded-full hover:bg-black/5 z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Honeypot — hidden from real users */}
        <input
          type="text"
          name="company_fax"
          value={formData.company_fax}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '-9999px',
            opacity: 0,
            height: 0,
            overflow: 'hidden',
          }}
        />

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-ollin-black mb-2">Get Your Free Plan</h2>
          <p className="text-ollin-gray text-sm">
            {step === 1
              ? "Fill out the form below and we'll help you scale your business."
              : "A few more details so we can tailor your plan."}
          </p>
        </div>

        <div className="overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 ? (
              <motion.form
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeOut' }}
                onSubmit={goToStep2}
                className="space-y-4"
              >
                <div>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="Full Name *"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={handleChange}
                    className={INPUT_CLASS}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-ollin-black text-white font-medium rounded-lg hover:bg-black/80 transition-all flex items-center justify-center mt-2"
                >
                  Get My Free Growth Plan →
                </button>

                <p className="text-xs text-center text-ollin-black/40 mt-3">
                  No spam. We'll reply within 24 hours.
                </p>
              </motion.form>
            ) : (
              <motion.form
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeOut' }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <button
                  type="button"
                  onClick={goBack}
                  className="text-sm text-ollin-gray hover:text-ollin-black transition-colors mb-1"
                >
                  ← Back
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className={INPUT_CLASS}
                  />
                  <select
                    name="businessType"
                    required
                    value={formData.businessType}
                    onChange={handleChange}
                    className={`${INPUT_CLASS} appearance-none cursor-pointer`}
                    style={{ backgroundImage: 'none' }}
                  >
                    <option value="" disabled className="text-gray-400">
                      Select Business Type *
                    </option>
                    <option value="roofing">Roofing</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="hvac">HVAC</option>
                    <option value="remodeling">Remodeling</option>
                    <option value="general-contractor">General Contractor</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="website"
                    placeholder="Business Website"
                    value={formData.website}
                    onChange={handleChange}
                    className={INPUT_CLASS}
                  />
                  <input
                    type="text"
                    name="location"
                    placeholder="City / State"
                    value={formData.location}
                    onChange={handleChange}
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Short Message (Optional)"
                    value={formData.message}
                    onChange={handleChange}
                    className={`${INPUT_CLASS} resize-none`}
                  />
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-ollin-black text-white font-medium rounded-lg hover:bg-black/80 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Request →'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
