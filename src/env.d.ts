/// <reference types="astro/client" />

// ---------------------------------------------------------------------------
// Cloudflare Email Sending binding (env.EMAIL) — see wrangler.toml [[send_email]]
// ---------------------------------------------------------------------------

interface EmailAttachment {
  /** Raw string for text files, ArrayBuffer/ArrayBufferView for binary (e.g. PDF). */
  content: string | ArrayBuffer | ArrayBufferView;
  filename: string;
  type?: string;
  disposition?: 'attachment' | 'inline';
  contentId?: string;
}

interface EmailSendOptions {
  to: string | string[];
  from: string | { email: string; name?: string };
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: EmailAttachment[];
  headers?: Record<string, string>;
}

interface CloudflareEmailBinding {
  send(options: EmailSendOptions): Promise<{ messageId?: string }>;
}

/** Worker runtime env: bindings + vars + secrets, available via locals.runtime.env. */
interface CloudflareEnv {
  EMAIL: CloudflareEmailBinding;
  TURNSTILE_SECRET_KEY?: string;
  CAREERS_EMAIL_TO?: string;
  CONTACT_EMAIL_TO?: string;
  PUBLIC_SANITY_PROJECT_ID?: string;
  PUBLIC_SANITY_DATASET?: string;
  SANITY_API_TOKEN?: string;
  [key: string]: unknown;
}

// Astro v6 removed Astro.locals.runtime.env. Worker bindings/secrets/vars are
// accessed via `import { env } from 'cloudflare:workers'`.
declare module 'cloudflare:workers' {
  export const env: CloudflareEnv;
}
