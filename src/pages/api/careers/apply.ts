export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';

// ---------------------------------------------------------------------------
// Rate limiting — in-memory Map, max 3 submissions per IP per hour
// ---------------------------------------------------------------------------

interface RateEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateEntry>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function getClientIp(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    'unknown'
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    // No entry or window has expired — not limited yet (entry will be created on record)
    return false;
  }

  return entry.count >= RATE_LIMIT_MAX;
}

function recordSubmission(ip: string): void {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

// ---------------------------------------------------------------------------
// Cloudflare Turnstile verification
// ---------------------------------------------------------------------------

async function verifyTurnstile(token: string, secretKey: string): Promise<boolean> {
  const body = new URLSearchParams();
  body.append('secret', secretKey);
  body.append('response', token);

  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      body,
    }
  );

  if (!response.ok) return false;

  const data = (await response.json()) as { success: boolean };
  return data.success === true;
}

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
  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Too many submissions. Please try again later.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Parse multipart form data
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid form data.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 2. Honeypot — silently succeed if the hidden "website" field is filled
  const honeypot = formData.get('website');
  if (honeypot && String(honeypot).trim() !== '') {
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 3. Cloudflare Turnstile verification (only when secret key is configured)
  const turnstileSecretKey = import.meta.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecretKey) {
    const turnstileToken = formData.get('cf-turnstile-response');
    if (!turnstileToken || String(turnstileToken).trim() === '') {
      return new Response(
        JSON.stringify({ success: false, error: 'CAPTCHA verification required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const turnstileValid = await verifyTurnstile(String(turnstileToken), turnstileSecretKey);
    if (!turnstileValid) {
      return new Response(
        JSON.stringify({ success: false, error: 'CAPTCHA verification failed. Please try again.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // 4. Field validation
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const position = String(formData.get('position') ?? '').trim() || 'General Application';
  const linkedin = String(formData.get('linkedin') ?? '').trim();

  if (!name) {
    return new Response(
      JSON.stringify({ success: false, error: 'Name is required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!email) {
    return new Response(
      JSON.stringify({ success: false, error: 'Email is required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!phone) {
    return new Response(
      JSON.stringify({ success: false, error: 'Phone is required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 5. Resume file validation
  const resumeEntry = formData.get('resume');

  if (!resumeEntry || !(resumeEntry instanceof File)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Resume file is required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const resume = resumeEntry as File;

  if (resume.size === 0) {
    return new Response(
      JSON.stringify({ success: false, error: 'Resume file is empty.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (resume.size > MAX_FILE_SIZE_BYTES) {
    return new Response(
      JSON.stringify({ success: false, error: 'Resume file must be smaller than 5 MB.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!ALLOWED_MIME_TYPES.has(resume.type)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Resume must be a PDF or Word document (.pdf, .doc, .docx).' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 6. Send email via Resend
  const resendApiKey = import.meta.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return new Response(
      JSON.stringify({ success: false, error: 'Email service is not configured.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const resend = new Resend(resendApiKey);

  const careersEmailTo =
    import.meta.env.CAREERS_EMAIL_TO || 'careers@kpinfo.tech';

  const resumeBuffer = Buffer.from(await resume.arrayBuffer());

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

  try {
    const { error } = await resend.emails.send({
      from: 'KP Infotech Careers <careers@kpinfo.tech>',
      to: careersEmailTo,
      subject: `New Application: ${position} — ${name}`,
      html: emailHtml,
      attachments: [
        {
          filename: resume.name,
          content: resumeBuffer,
        },
      ],
    });

    if (error) {
      console.error('Resend API error:', error);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to send application. Please try again.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (err) {
    console.error('Unexpected error sending email:', err);
    return new Response(
      JSON.stringify({ success: false, error: 'An unexpected error occurred. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 7. Record the submission for rate limiting (only after successful send)
  recordSubmission(ip);

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
