#!/usr/bin/env node
/**
 * Safe SEO-field updater for KP Infotech (Sanity project 5rux0mv2 / production).
 *
 * Updates ONLY seoTitle / seoDescription (and siteSettings defaults).
 * Default mode = DRY RUN (prints diffs, writes nothing). Pass --apply to write.
 *
 *   node seo-audit/2026-06-26/sanity-seo-update.mjs                 # dry run (all)
 *   node seo-audit/2026-06-26/sanity-seo-update.mjs --apply         # apply (all)
 *   node seo-audit/2026-06-26/sanity-seo-update.mjs --only=industry # dry run, one type
 *   node seo-audit/2026-06-26/sanity-seo-update.mjs --apply --only=blogPost
 *
 * Requires SANITY_API_TOKEN (Editor) in env or .env.local.
 * Never touches: slugs, publish state, body content, references, images,
 * or any field other than seoTitle/seoDescription/defaultSeoTitle/defaultSeoDescription.
 */
import { createClient } from '@sanity/client';
import { readFileSync } from 'node:fs';

// --- tiny .env.local loader (no extra deps) ---------------------------------
try {
  const env = readFileSync(new URL('../../.env.local', import.meta.url), 'utf8');
  for (const line of env.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch { /* no .env.local — rely on process.env */ }

const APPLY = process.argv.includes('--apply');
const onlyArg = process.argv.find((a) => a.startsWith('--only='));
const ONLY = onlyArg ? onlyArg.split('=')[1] : null;

const token = process.env.SANITY_API_TOKEN;
if (!token) { console.error('✖ SANITY_API_TOKEN is required (Editor token).'); process.exit(1); }

const client = createClient({
  projectId: '5rux0mv2',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

// --- proposed values, keyed by document _id (published IDs) -----------------
// type is only used for --only filtering and logging.
const UPDATES = [
  // ── siteSettings (stale → B2B-ops fallback) ──
  { _id: '376db61e-bc91-4f7f-8a3c-a2c3b7ef60b9', type: 'siteSettings',
    fields: {
      defaultSeoTitle: 'Custom Software, ERP, Automation & AI | KP Infotech',
      defaultSeoDescription: 'KP Infotech is a B2B operations technology partner building custom software, business automation, ERP & Odoo, AI agents, and cloud & DevOps for growing businesses.',
    } },

  // ── industries (currently null) ──
  { _id: '17978c9d-b513-4597-9d8c-4360c05f925a', type: 'industry',
    fields: { seoTitle: 'Healthcare Software & Automation Solutions | KP Infotech',
      seoDescription: 'Custom software, ERP, and workflow automation for healthcare providers — connect scheduling, billing, records, and operations and cut manual admin work.' } },
  { _id: '99901f6b-55bb-4d05-9bb4-53fbdcd0e92e', type: 'industry',
    fields: { seoTitle: 'Retail & E-commerce Software Solutions | KP Infotech',
      seoDescription: 'Custom commerce platforms, inventory and order automation, and ERP for retail and e-commerce businesses scaling past spreadsheets and disconnected tools.' } },
  { _id: '49adddf8-8b71-409e-af3c-09871f25696a', type: 'industry',
    fields: { seoTitle: 'Manufacturing Software & ERP Solutions | KP Infotech',
      seoDescription: 'ERP, production tracking, inventory, and process automation for manufacturers — connect shop floor, purchasing, and operations in one reliable system.' } },
  { _id: '11cb3700-a502-496e-9ccd-163fc7c5439d', type: 'industry',
    fields: { seoTitle: 'Logistics & Supply Chain Software | KP Infotech',
      seoDescription: 'Custom logistics software and automation for shipment visibility, dispatch, inventory, and operations — replace manual tracking and disconnected tools.' } },
  { _id: '5807cc3f-6fa8-4352-b644-b61820dad506', type: 'industry',
    fields: { seoTitle: 'Finance & Fintech Software Solutions | KP Infotech',
      seoDescription: 'Secure custom software, automation, and integrations for finance and fintech operations — from portals and dashboards to compliant workflow systems.' } },
  { _id: '8df4b488-255f-42de-bf15-fef756dbc300', type: 'industry',
    fields: { seoTitle: 'Software for Startups & SMEs | KP Infotech',
      seoDescription: 'MVPs, internal tools, automation, and cloud setup for startups and SMEs — go from idea to launch with practical software built around how you operate.' } },
  { _id: '3250b94d-c394-461e-a8b8-61307d9eaf18', type: 'industry',
    fields: { seoTitle: 'Real Estate Software & Platforms | KP Infotech',
      seoDescription: 'Custom property platforms, CRM, and listing/lead automation for real estate businesses — manage deals, listings, and operations in one connected system.' } },
  { _id: 'd290902d-4d69-4914-9d20-7906d6bbfb82', type: 'industry',
    fields: { seoTitle: 'Education & EdTech Software Solutions | KP Infotech',
      seoDescription: 'Custom learning platforms, student and admin portals, and automation for education and edtech — replace manual processes with connected, scalable systems.' } },

  // ── blog posts (currently null) ──
  { _id: '22114651-112b-40f6-af14-a6ecdd448dfd', type: 'blogPost',
    fields: { seoTitle: 'Odoo ERP Guide: Features, Benefits & Pricing | KP Infotech',
      seoDescription: 'A complete guide to Odoo ERP — modules, features, benefits, and pricing — to help growing businesses decide if Odoo is the right ERP for their operations.' } },
  { _id: '3011f67f-8bba-43b3-b60d-8896384d64a0', type: 'blogPost',
    fields: { seoTitle: 'Cloud Deployment Models Explained (with Diagram) | KP Infotech',
      seoDescription: 'Public, private, hybrid, and community cloud deployment models explained with a clear diagram — understand the trade-offs and pick the right model for your business.' } },
  { _id: 'c69b5f83-c71d-456c-9d23-60d1dc867fab', type: 'blogPost',
    fields: { seoTitle: '12 Best Node.js Frameworks for 2026 | KP Infotech',
      seoDescription: 'A practical roundup of the best Node.js frameworks for building scalable backends and APIs in 2026 — with use cases, pros, and when to choose each.' } },
  { _id: 'c78863d6-a962-4365-a153-7e1942d0f0b8', type: 'blogPost',
    fields: { seoTitle: 'ERP for Retail Stores in India: A Practical Guide | KP Infotech',
      seoDescription: 'How retail businesses in India use ERP to connect inventory, billing, purchase, and accounting — benefits, features, and what to look for before implementing.' } },
  { _id: '7a6b6881-d12d-4f83-a314-c3f00f8819d2', type: 'blogPost',
    fields: { seoTitle: '9 Inventory Management Best Practices for 2026 | KP Infotech',
      seoDescription: 'Nine practical inventory management best practices to cut stockouts, reduce carrying costs, and keep operations accurate as your business scales.' } },
  { _id: 'fc2fe8e6-9359-4626-919e-ec95006b731a', type: 'blogPost',
    fields: { seoTitle: 'Angular vs React: Which to Choose in 2026? | KP Infotech',
      seoDescription: 'Angular vs React compared for 2026 — performance, learning curve, ecosystem, and team fit — to help you choose the right framework for your next project.' } },
  { _id: '439cf1fe-7b82-4d5c-8566-3586e6d1dd72', type: 'blogPost',
    fields: { seoTitle: '12 Best Web Application Frameworks for 2026 | KP Infotech',
      seoDescription: 'The best web application frameworks for 2026 across frontend and backend — strengths, use cases, and how to choose the right stack for your product.' } },
  { _id: '3e40f487-87db-42d0-a113-86a22fed6393', type: 'blogPost',
    fields: { seoTitle: '12 Best HR Software for Startups in 2026 | KP Infotech',
      seoDescription: 'The best HR software for startups in 2026 — payroll, onboarding, leave, and people management tools compared to help small teams scale without admin overload.' } },
  { _id: 'b2ca9ea9-cb68-4957-b502-eb0d437deeb7', type: 'blogPost',
    fields: { seoTitle: '7 Minimum Viable Product (MVP) Examples That Succeeded | KP Infotech',
      seoDescription: 'Seven real minimum viable product examples and what made them work — practical lessons for validating your idea before building the full product.' } },
  { _id: 'ef89f4cb-8421-46ff-9ba6-628fd3647e1e', type: 'blogPost',
    fields: { seoTitle: '10 Mobile App Monetization Strategies for 2026 | KP Infotech',
      seoDescription: 'Ten proven mobile app monetization strategies — subscriptions, in-app purchases, ads, and hybrid models — with guidance on choosing the right mix.' } },

  // ── case study (expand thin description) ──
  { _id: 'e907e1d9-f6be-4f56-a048-276e29d2d3fc', type: 'caseStudy',
    fields: { seoDescription: 'How KP Infotech built a 3D virtual tour and AI property-listing platform that generated 85K leads, 420% more views, and $180M in sales for a realty network.' } },
];

const ALLOWED = new Set(['seoTitle', 'seoDescription', 'defaultSeoTitle', 'defaultSeoDescription']);

function clip(s, n = 90) { return s == null ? '(null)' : (s.length > n ? s.slice(0, n) + '…' : s); }

const targets = UPDATES.filter((u) => !ONLY || u.type === ONLY);
console.log(`\n${APPLY ? '🟢 APPLY' : '🔎 DRY RUN'} — ${targets.length} document(s)${ONLY ? ` (type=${ONLY})` : ''}\n`);

let changed = 0, skipped = 0, written = 0;
for (const u of targets) {
  // guard: never allow a non-SEO field to sneak in
  for (const k of Object.keys(u.fields)) if (!ALLOWED.has(k)) { console.error(`✖ refusing non-SEO field "${k}" on ${u._id}`); process.exit(1); }

  const projection = Object.keys(u.fields).join(',');
  const current = await client.fetch(`*[_id == $id][0]{${projection}}`, { id: u._id });
  if (!current) { console.error(`✖ document not found: ${u._id} (${u.type})`); continue; }

  const diff = {};
  for (const [field, after] of Object.entries(u.fields)) {
    const before = current[field] ?? null;
    if (before === after) { skipped++; continue; }
    diff[field] = after;
    changed++;
    console.log(`• ${u.type} ${u._id}  [${field}]`);
    console.log(`    BEFORE: ${clip(before)}`);
    console.log(`    AFTER : ${clip(after)}`);
  }

  if (APPLY && Object.keys(diff).length) {
    await client.patch(u._id).set(diff).commit({ autoGenerateArrayKeys: false });
    written += Object.keys(diff).length;
    console.log(`    ✓ written: ${Object.keys(diff).join(', ')}`);
  }
}

console.log(`\nSummary: ${changed} field(s) to change, ${skipped} already current.` + (APPLY ? ` ${written} written.` : ' (dry run — nothing written)') + '\n');
if (!APPLY && changed) console.log('Review the diffs above, then re-run with --apply to write.\n');
