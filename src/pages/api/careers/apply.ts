export const prerender = false;

import type { APIRoute } from 'astro';
import {
  getClientIp,
  createRateLimiter,
  verifyTurnstile,
  escapeHtml,
  json,
} from '../../../lib/form-utils';
// Astro 6 + @astrojs/cloudflare: Worker bindings/secrets/vars come from here,
// NOT Astro.locals.runtime.env (removed in v6). `env` resolves per-request.
import { env } from 'cloudflare:workers';

// Rate limiting — 3 submissions per IP per hour (best-effort, per Worker isolate)
const limiter = createRateLimiter(3, 60 * 60 * 1000);

// ---------------------------------------------------------------------------
// Allowed MIME types for resume files
// ---------------------------------------------------------------------------

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export const POST: APIRoute = async ({ request }) => {
  const ip = getClientIp(request);

  // 1. Rate limiting check
  if (limiter.isRateLimited(ip)) {
    return json({ success: false, error: 'Too many submissions. Please try again later.' }, 429);
  }

  // Parse multipart form data
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

  // 3. Cloudflare Turnstile verification (only when secret key is configured)
  const turnstileSecretKey = env.TURNSTILE_SECRET_KEY ?? import.meta.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecretKey) {
    const turnstileToken = formData.get('cf-turnstile-response');
    if (!turnstileToken || String(turnstileToken).trim() === '') {
      return json({ success: false, error: 'CAPTCHA verification required.' }, 400);
    }

    const turnstileValid = await verifyTurnstile(String(turnstileToken), turnstileSecretKey);
    if (!turnstileValid) {
      return json({ success: false, error: 'CAPTCHA verification failed. Please try again.' }, 400);
    }
  }

  // 4. Field validation
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const position = String(formData.get('position') ?? '').trim() || 'General Application';
  const linkedin = String(formData.get('linkedin') ?? '').trim();

  if (!name) {
    return json({ success: false, error: 'Name is required.' }, 400);
  }

  if (!email) {
    return json({ success: false, error: 'Email is required.' }, 400);
  }

  if (!phone) {
    return json({ success: false, error: 'Phone is required.' }, 400);
  }

  // 5. Resume file validation
  const resumeEntry = formData.get('resume');

  if (!resumeEntry || !(resumeEntry instanceof File)) {
    return json({ success: false, error: 'Resume file is required.' }, 400);
  }

  const resume = resumeEntry as File;

  if (resume.size === 0) {
    return json({ success: false, error: 'Resume file is empty.' }, 400);
  }

  if (resume.size > MAX_FILE_SIZE_BYTES) {
    return json({ success: false, error: 'Resume file must be smaller than 5 MB.' }, 400);
  }

  if (!ALLOWED_MIME_TYPES.has(resume.type)) {
    return json({ success: false, error: 'Resume must be a PDF or Word document (.pdf, .doc, .docx).' }, 400);
  }

  // 6. Send email via Cloudflare Email Sending (env.EMAIL binding — no API key)
  const emailBinding = env.EMAIL;
  if (!emailBinding) {
    return json({ success: false, error: 'Email service is not configured.' }, 500);
  }

  const careersEmailTo =
    env.CAREERS_EMAIL_TO || import.meta.env.CAREERS_EMAIL_TO || 'careers@kpinfo.tech';

  // Cloudflare's binding takes binary attachment content as an ArrayBuffer.
  const resumeContent = await resume.arrayBuffer();

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #1a1a1a; border-bottom: 2px solid #c9a87c; padding-bottom: 12px;">
        New Job Application
      </h2>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tbody>
          <tr>
            <td style="padding: 10px 12px; background: #f5f5f5; font-weight: bold; width: 30%; border: 1px solid #e0e0e0;">Position</td>
            <td style="padding: 10px 12px; border: 1px solid #e0e0e0;">${escapeHtml(position)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background: #f5f5f5; font-weight: bold; border: 1px solid #e0e0e0;">Name</td>
            <td style="padding: 10px 12px; border: 1px solid #e0e0e0;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background: #f5f5f5; font-weight: bold; border: 1px solid #e0e0e0;">Email</td>
            <td style="padding: 10px 12px; border: 1px solid #e0e0e0;">
              <a href="mailto:${escapeHtml(email)}" style="color: #c9a87c;">${escapeHtml(email)}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background: #f5f5f5; font-weight: bold; border: 1px solid #e0e0e0;">Phone</td>
            <td style="padding: 10px 12px; border: 1px solid #e0e0e0;">${escapeHtml(phone)}</td>
          </tr>
          ${linkedin ? `
          <tr>
            <td style="padding: 10px 12px; background: #f5f5f5; font-weight: bold; border: 1px solid #e0e0e0;">LinkedIn</td>
            <td style="padding: 10px 12px; border: 1px solid #e0e0e0;">
              <a href="${escapeHtml(linkedin)}" style="color: #c9a87c;" target="_blank" rel="noopener noreferrer">${escapeHtml(linkedin)}</a>
            </td>
          </tr>` : ''}
          <tr>
            <td style="padding: 10px 12px; background: #f5f5f5; font-weight: bold; border: 1px solid #e0e0e0;">Resume</td>
            <td style="padding: 10px 12px; border: 1px solid #e0e0e0;">
              <em>Attached — ${escapeHtml(resume.name)}</em>
            </td>
          </tr>
        </tbody>
      </table>

      <p style="margin-top: 24px; font-size: 12px; color: #888;">
        Submitted from kpinfo.tech/careers
      </p>
    </div>
  `;

  // Plain-text alternative — improves deliverability and spam scores.
  const emailText = [
    'New Job Application',
    '',
    `Position: ${position}`,
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    linkedin ? `LinkedIn: ${linkedin}` : '',
    `Resume: attached (${resume.name})`,
    '',
    'Submitted from kpinfo.tech/careers',
  ]
    .filter(Boolean)
    .join('\n');

  try {
    await emailBinding.send({
      to: careersEmailTo,
      from: { email: 'careers@kpinfo.tech', name: 'KP Infotech Careers' },
      replyTo: email,
      subject: `New Application: ${position} — ${name}`,
      html: emailHtml,
      text: emailText,
      attachments: [
        {
          content: resumeContent,
          filename: resume.name,
          type: resume.type || 'application/octet-stream',
          disposition: 'attachment',
        },
      ],
    });
  } catch (err: any) {
    console.error('Cloudflare Email send error:', err?.code, err?.message ?? err);
    return json({ success: false, error: 'Failed to send application. Please try again.' }, 500);
  }

  // 7. Record the submission for rate limiting (only after successful send)
  limiter.recordSubmission(ip);

  return json({ success: true }, 200);
};
