import React, { useState } from 'react';
import { X, CheckCircle, Loader2 } from 'lucide-react';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    businessType: '',
    website: '',
    location: '',
    message: '',
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    const payload = {
      ...formData,
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

    // intenta leer json para ver requestId / error
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const msg =
        data?.error ? `Error: ${data.error} (requestId: ${data.requestId ?? 'n/a'})`
        : `Network error (status ${response.status})`;
      throw new Error(msg);
    }

    // opcional: log de requestId
    if (data?.requestId) console.log('Lead sent. requestId:', data.requestId);

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        businessType: '',
        website: '',
        location: '',
        message: '',
      });
    }, 1500);
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
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-black transition-colors rounded-full hover:bg-black/5"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-ollin-black">Thank You!</h3>
            <p className="text-ollin-gray">
              We've received your details and will be in touch shortly.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ollin-black mb-2">Get Your Free Plan</h2>
              <p className="text-ollin-gray text-sm">
                Fill out the form below and we'll help you scale your business.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Full Name *"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white rounded-lg border-0 focus:ring-2 focus:ring-black/5 outline-none transition-all placeholder:text-gray-400 text-ollin-black"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white rounded-lg border-0 focus:ring-2 focus:ring-black/5 outline-none transition-all placeholder:text-gray-400 text-ollin-black"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white rounded-lg border-0 focus:ring-2 focus:ring-black/5 outline-none transition-all placeholder:text-gray-400 text-ollin-black"
                />
              </div>

              {/* Business Type */}
              <div>
                <select
                  name="businessType"
                  required
                  value={formData.businessType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white rounded-lg border-0 focus:ring-2 focus:ring-black/5 outline-none transition-all text-ollin-black appearance-none cursor-pointer"
                  style={{ backgroundImage: 'none' }} 
                >
                  <option value="" disabled className="text-gray-400">Select Business Type *</option>
                  <option value="e-commerce">E-commerce</option>
                  <option value="saas">SaaS</option>
                  <option value="agency">Agency</option>
                  <option value="local-business">Local Business</option>
                  <option value="content-creator">Content Creator</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Website & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="website"
                  placeholder="Business Website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white rounded-lg border-0 focus:ring-2 focus:ring-black/5 outline-none transition-all placeholder:text-gray-400 text-ollin-black"
                />
                <input
                  type="text"
                  name="location"
                  placeholder="City / State"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white rounded-lg border-0 focus:ring-2 focus:ring-black/5 outline-none transition-all placeholder:text-gray-400 text-ollin-black"
                />
              </div>

              {/* Message */}
              <div>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Short Message (Optional)"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white rounded-lg border-0 focus:ring-2 focus:ring-black/5 outline-none transition-all placeholder:text-gray-400 text-ollin-black resize-none"
                />
              </div>

               {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-ollin-black text-white font-medium rounded-lg hover:bg-black/80 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Get My Free Plan'
                )}
              </button>

              <p className="text-xs text-center text-ollin-gray mt-4">
                No spam. We respect your privacy.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
