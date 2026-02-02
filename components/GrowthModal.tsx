import React, { useState } from 'react';
import { sendGrowthPlanEmail } from '../utils/email';

interface GrowthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const GrowthModal: React.FC<GrowthModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        businessType: '',
        website: '',
        city: '',
        message: '',
    });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setErrorMessage('');

        const res = await sendGrowthPlanEmail({
            ...formData,
            sourcePage: window.location.pathname,
        });

        if (res.success) {
            setStatus('success');
            setFormData({
                name: '',
                email: '',
                phone: '',
                businessType: '',
                website: '',
                city: '',
                message: '',
            });
            // Close after 2 seconds or let user close? User said "Clear form on success".
            // I'll leave it open with success message so they see it.
        } else {
            setStatus('error');
            setErrorMessage(res.error || 'Something went wrong.');
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-[#f2efe9] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 md:p-10 z-[70]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-ollin-black hover:opacity-60 transition-opacity"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-3xl md:text-4xl font-semibold mb-2 text-ollin-black">Get Your Free Growth Plan</h2>
                <p className="text-ollin-black/60 mb-8">
                    Tell us about your business and we'll craft a custom strategy for you.
                </p>

                {status === 'success' ? (
                    <div className="text-center py-12">
                        <h3 className="text-2xl font-medium text-green-600 mb-4">Request Sent Successfully!</h3>
                        <p className="text-ollin-black/70 mb-8">We'll be in touch with your growth plan shortly.</p>
                        <button
                            onClick={onClose}
                            className="bg-ollin-black text-white px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1 text-ollin-black">Full Name *</label>
                            <input
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-ollin-black transition-colors"
                                placeholder="John Doe"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-ollin-black">Email *</label>
                            <input
                                required
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-ollin-black transition-colors"
                                placeholder="john@example.com"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-ollin-black">Phone (Optional)</label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-ollin-black transition-colors"
                                placeholder="(555) 000-0000"
                            />
                        </div>

                        {/* Business Type */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1 text-ollin-black">Business Type *</label>
                            <select
                                required
                                name="businessType"
                                value={formData.businessType}
                                onChange={handleChange}
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-ollin-black transition-colors appearance-none"
                            >
                                <option value="">Select your industry...</option>
                                <option value="Handyman">Handyman</option>
                                <option value="General Contractor">General Contractor</option>
                                <option value="Plumber">Plumber</option>
                                <option value="Electrician">Electrician</option>
                                <option value="Roofing">Roofing</option>
                                <option value="HVAC">HVAC</option>
                                <option value="Remodeling">Remodeling</option>
                                <option value="Restoration">Restoration</option>
                                <option value="Landscaping">Landscaping</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Website */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1 text-ollin-black">Business Website (Optional)</label>
                            <input
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-ollin-black transition-colors"
                                placeholder="www.yourbusiness.com"
                            />
                        </div>

                        {/* City/State */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1 text-ollin-black">City / State (Optional)</label>
                            <input
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-ollin-black transition-colors"
                                placeholder="e.g. Austin, TX"
                            />
                        </div>

                        {/* Message */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1 text-ollin-black">Short Message (Optional)</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={3}
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-ollin-black transition-colors resize-none"
                                placeholder="Anything specific you need help with?"
                            />
                        </div>

                        {/* Error Message */}
                        {status === 'error' && (
                            <div className="md:col-span-2 text-red-600 text-sm">
                                Error: {errorMessage}
                            </div>
                        )}

                        {/* Submit */}
                        <div className="md:col-span-2 mt-2">
                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="w-full bg-ollin-black text-white font-medium py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {status === 'sending' ? 'Sending...' : 'Get My Free Plan'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default GrowthModal;
