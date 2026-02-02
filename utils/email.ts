import emailjs from '@emailjs/browser';

interface GrowthPlanData {
    name: string;
    email: string;
    phone?: string;
    businessType: string;
    website?: string;
    city?: string;
    message?: string;
    sourcePage?: string;
    timestamp?: string;
}

interface EmailResponse {
    success: boolean;
    error?: string;
}

export const sendGrowthPlanEmail = async (data: GrowthPlanData): Promise<EmailResponse> => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
        return {
            success: false,
            error: "Email configuration missing. Please check environment variables."
        };
    }

    try {
        const templateParams = {
            ...data,
            timestamp: new Date().toLocaleString(),
        };

        await emailjs.send(serviceId, templateId, templateParams, publicKey);
        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            error: error?.text || error?.message || "Failed to send email."
        };
    }
};
