// Shared helpers for form-handling API routes (careers, contact).

/** Best-effort client IP from Cloudflare / proxy headers. */
export function getClientIp(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    'unknown'
  );
}

interface RateEntry {
  count: number;
  resetAt: number;
}

/**
 * In-memory, per-route rate limiter. State lives in a single Worker isolate and
 * is not durable, so treat this as a best-effort throttle, not a guarantee.
 */
export function createRateLimiter(max: number, windowMs: number) {
  const map = new Map<string, RateEntry>();

  return {
    isRateLimited(ip: string): boolean {
      const entry = map.get(ip);
      if (!entry || Date.now() > entry.resetAt) return false;
      return entry.count >= max;
    },
    recordSubmission(ip: string): void {
      const now = Date.now();
      const entry = map.get(ip);
      if (!entry || now > entry.resetAt) {
        map.set(ip, { count: 1, resetAt: now + windowMs });
      } else {
        entry.count += 1;
      }
    },
  };
}

/** Verify a Cloudflare Turnstile token server-side. */
export async function verifyTurnstile(token: string, secretKey: string): Promise<boolean> {
  const body = new URLSearchParams();
  body.append('secret', secretKey);
  body.append('response', token);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });

  if (!response.ok) return false;

  const data = (await response.json()) as { success: boolean };
  return data.success === true;
}

/** Escape user-supplied text for safe interpolation into HTML email bodies. */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/** JSON Response helper. */
export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
