import { Handler } from '@netlify/functions';
import { Resend } from 'resend';

export const handler: Handler = async (event) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ ok: false, error: 'Method Not Allowed' }),
        };
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.error('Missing RESEND_API_KEY environment variable');
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ ok: false, error: 'Server configuration error' }),
        };
    }

    const resend = new Resend(apiKey);

    try {
        const body = JSON.parse(event.body || '{}');
        const { to, lead, preset, plainText } = body;

        // Fallback if domain is not verified
        // TODO: Change to "OLLIN <noreply@ollin.agency>" once domain is verified in Resend
        const fromEmail = 'OLLIN <onboarding@resend.dev>';

        // Default recipient
        const toEmail = to || 'contact@ollin.agency';

        // Construct email content with preset info if available
        let emailContent = plainText || 'No details provided.';
        if (preset) {
            const presetName = typeof preset === 'string' ? preset : (preset.name || 'Unknown Request');
            emailContent = `Starting level: ${presetName}\n\n${emailContent}`;
        }

        await resend.emails.send({
            from: fromEmail,
            to: toEmail,
            replyTo: lead?.email,
            subject: `New OLLIN Plan Request — ${lead?.name || 'New Lead'}`,
            text: emailContent,
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ ok: true }),
        };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                ok: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            }),
        };
    }
};
