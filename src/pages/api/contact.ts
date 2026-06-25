export const prerender = false;

import type { APIRoute } from 'astro';
import {
  getClientIp,
  createRateLimiter,
  verifyTurnstile,
  escapeHtml,
  json,
} from '../../lib/form-utils';
// Astro 6 + @astrojs/cloudflare: Worker bindings/secrets/vars come from here,
// NOT Astro.locals.runtime.env (removed in v6). `env` resolves per-request.
import { env } from 'cloudflare:workers';

// Rate limiting — 5 submissions per IP per hour (best-effort, per Worker isolate)
const limiter = createRateLimiter(5, 60 * 60 * 1000);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
  const ip = getClientIp(request);

  // 1. Rate limiting
  if (limiter.isRateLimited(ip)) {
    return json({ success: false, error: 'Too many submissions. Please try again later.' }, 429);
  }

  // Parse form data
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return json({ success: false, error: 'Invalid form data.' }, 400);
  }

  // 2. Honeypot — silently succeed if the hidden "website" field is filled
  const honeypot = formData.get('website');
  if (honeypot && String(honeypot).trim() !== '') {
    return json({ success: true }, 200);
  }

  // 3. Cloudflare Turnstile verification (only when the secret key is configured)
  const turnstileSecretKey = env.TURNSTILE_SECRET_KEY ?? import.meta.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecretKey) {
    const token = formData.get('cf-turnstile-response');
    if (!token || String(token).trim() === '') {
      return json({ success: false, error: 'CAPTCHA verification required.' }, 400);
    }
    const valid = await verifyTurnstile(String(token), turnstileSecretKey);
    if (!valid) {
      return json({ success: false, error: 'CAPTCHA verification failed. Please try again.' }, 400);
    }
  }

  // 4. Field validation
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();
  const company = String(formData.get('company') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const projectType = String(formData.get('project_type') ?? '').trim();
  const budget = String(formData.get('budget') ?? '').trim();

  if (!name) {
    return json({ success: false, error: 'Name is required.' }, 400);
  }
  if (!email || !EMAIL_RE.test(email)) {
    return json({ success: false, error: 'A valid email address is required.' }, 400);
  }
  if (!message) {
    return json({ success: false, error: 'Message is required.' }, 400);
  }

  // 5. Send email via Cloudflare Email Sending (env.EMAIL binding — no API key)
  const emailBinding = env.EMAIL;
  if (!emailBinding) {
    return json({ success: false, error: 'Email service is not configured.' }, 500);
  }

  const contactEmailTo =
    env.CONTACT_EMAIL_TO || import.meta.env.CONTACT_EMAIL_TO || 'info@kpinfo.tech';

  // Summary rows (skip empty optional fields)
  const fields: Array<[string, string]> = [
    ['Name', name],
    ['Email', email],
  ];
  if (company) fields.push(['Company', company]);
  if (phone) fields.push(['Phone', phone]);
  if (projectType) fields.push(['Project Type', projectType]);
  if (budget) fields.push(['Budget', budget]);

  const rowsHtml = fields
    .map(
      ([label, value]) => `
          <tr>
            <td style="padding: 10px 12px; background: #f5f5f5; font-weight: bold; width: 30%; border: 1px solid #e0e0e0;">${escapeHtml(label)}</td>
            <td style="padding: 10px 12px; border: 1px solid #e0e0e0;">${escapeHtml(value)}</td>
          </tr>`
    )
    .join('');

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #1a1a1a; border-bottom: 2px solid #c9a87c; padding-bottom: 12px;">
        New Contact Inquiry
      </h2>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tbody>
          ${rowsHtml}
          <tr>
            <td style="padding: 10px 12px; background: #f5f5f5; font-weight: bold; border: 1px solid #e0e0e0; vertical-align: top;">Message</td>
            <td style="padding: 10px 12px; border: 1px solid #e0e0e0; white-space: pre-wrap;">${escapeHtml(message)}</td>
          </tr>
        </tbody>
      </table>

      <p style="margin-top: 24px; font-size: 12px; color: #888;">
        Submitted from kpinfo.tech/contact
      </p>
    </div>
  `;

  const emailText = [
    'New Contact Inquiry',
    '',
    ...fields.map(([label, value]) => `${label}: ${value}`),
    '',
    'Message:',
    message,
    '',
    'Submitted from kpinfo.tech/contact',
  ].join('\n');

  try {
    await emailBinding.send({
      to: contactEmailTo,
      from: { email: 'noreply@kpinfo.tech', name: 'KP Infotech Website' },
      replyTo: email,
      subject: `New inquiry from ${name}`,
      html: emailHtml,
      text: emailText,
    });
  } catch (err: any) {
    console.error('Cloudflare Email send error (contact):', err?.code, err?.message ?? err);
    return json({ success: false, error: 'Failed to send your message. Please try again.' }, 500);
  }

  // 6. Record submission only after a successful send
  limiter.recordSubmission(ip);

  return json({ success: true }, 200);
};
