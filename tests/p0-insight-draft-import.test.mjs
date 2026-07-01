import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';
import {
  PUBLIC_BLOG_GROQ_FILTER,
  PUBLIC_BLOG_SLUG_SET,
} from '../src/lib/public-blog-policy.js';

async function readJson(path) {
  try {
    return JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
  } catch {
    return null;
  }
}

async function readText(path) {
  try {
    return await readFile(new URL(path, import.meta.url), 'utf8');
  } catch {
    return '';
  }
}

async function readStats(path) {
  try {
    return await stat(new URL(path, import.meta.url));
  } catch {
    return null;
  }
}

const batch = await readJson('../scripts/sanity/p0-insight-draft-import.json');
const scriptSource = await readText('../scripts/sanity/import-p0-insight-drafts.mjs');
const redirectSource = await readText('../src/worker/migration-redirects.js');
const queriesSource = await readText('../src/lib/queries.ts');
const sanityClientSource = await readText('../src/lib/sanity.ts');
const insightRouteSource = await readText('../src/pages/insights/[slug].astro');
const insightsListingSource = await readText('../src/pages/insights/[...page].astro');
const astroConfigSource = await readText('../astro.config.mjs');
const builtSitemapSource = await readText('../dist/client/sitemap-0.xml');
const builtSitemapStats = await readStats('../dist/client/sitemap-0.xml');
const publicBlogPolicyStats = await readStats('../src/lib/public-blog-policy.js');
const sanityClientStats = await readStats('../src/lib/sanity.ts');

const expectedSlugs = [
  'what-is-custom-software',
  'business-process-automation-tools',
  'business-process-improvement-methods',
  'how-to-choose-erp-system',
  'on-premise-vs-cloud-erp',
  'devops-best-practices',
];

const allowedCategorySlugs = new Set([
  'custom-software-development',
  'automation-ai',
  'erp-business-systems',
  'cloud-devops',
]);

const canonicalCategoryIds = new Map([
  ['custom-software-development', 'blogCategory-custom-software-development'],
  ['automation-ai', 'blogCategory-automation-ai'],
  ['erp-business-systems', 'blogCategory-erp-business-systems'],
  ['cloud-devops', '0213cb0f-23cd-4489-9712-7107bd7a829e'],
]);

const forbiddenManualReviewUrls = [
  '/graphics-design/',
  '/how-to-choose-the-right-digital-marketing-channels-for-your-business/',
  '/sample-digital-marketing-strategy/',
  '/how-to-create-brand-guidelines/',
  '/b-2-b-lead-generation-strategies/',
];

const legacyRedirectTargets = new Map([
  ['/what-is-customised-software', '/services/custom-software-development/'],
  ['/business-process-automation-tools', '/services/business-automation/'],
  ['/business-process-improvement-methods', '/services/business-automation/'],
  ['/how-to-choose-erp-system', '/services/erp-software/'],
  ['/on-premise-vs-cloud-erp', '/services/erp-software/'],
  ['/best-practices-for-devops', '/services/cloud-devops/'],
]);

test('P0 insight draft batch file exists and targets only production Sanity', () => {
  assert.ok(batch, 'missing scripts/sanity/p0-insight-draft-import.json');
  assert.equal(batch.projectId, '5rux0mv2');
  assert.equal(batch.dataset, 'production');
});

test('P0 insight draft batch includes exactly the six reviewed articles', () => {
  assert.ok(Array.isArray(batch?.articles));
  assert.deepEqual(batch.articles.map((article) => article.slug).sort(), [...expectedSlugs].sort());
});

test('P0 insight slugs are explicitly included in the public blog allowlist', () => {
  assert.deepEqual(
    expectedSlugs.filter((slug) => !PUBLIC_BLOG_SLUG_SET.has(slug)),
    [],
  );

  for (const slug of expectedSlugs) {
    assert.match(PUBLIC_BLOG_GROQ_FILTER, new RegExp(`"${slug}"`), slug);
  }
});

test('P0 insight route, listing, and sitemap generation use the public blog query path', () => {
  assert.match(queriesSource, /publicBlogSlugsQuery[\s\S]*PUBLIC_BLOG_GROQ_FILTER/);
  assert.match(queriesSource, /allBlogPostsQuery[\s\S]*PUBLIC_BLOG_GROQ_FILTER/);
  assert.match(queriesSource, /blogPostBySlugQuery[\s\S]*PUBLIC_BLOG_GROQ_FILTER/);
  assert.match(insightRouteSource, /publicBlogSlugsQuery/);
  assert.match(insightRouteSource, /params:\s*\{\s*slug:\s*post\.slug\.current\s*\}/);
  assert.match(insightsListingSource, /allBlogPostsQuery/);
  assert.match(astroConfigSource, /sitemap\(\)/);
});

test('Sanity build client can read published private-id P0 documents without drafts', () => {
  assert.match(sanityClientSource, /SANITY_API_TOKEN/);
  assert.match(sanityClientSource, /perspective:\s*['"]published['"]/);
});

test('P0 insight draft batch never uses published Sanity IDs', () => {
  for (const article of batch?.articles || []) {
    assert.equal(article.documentType, 'blogPost');
    assert.match(article.draftId, /^drafts\./, article.slug);
    assert.equal(Object.hasOwn(article, 'publishedId'), false, article.slug);
    assert.equal(Object.hasOwn(article, 'documentId'), false, article.slug);
  }
});

test('P0 insight draft slugs are unique', () => {
  const slugs = batch?.articles?.map((article) => article.slug) || [];
  assert.equal(new Set(slugs).size, slugs.length);
});

test('P0 insight draft batch has required article fields and existing category slugs', () => {
  for (const article of batch?.articles || []) {
    assert.ok(article.title, `missing title for ${article.slug}`);
    assert.ok(article.slug, `missing slug for ${article.title}`);
    assert.ok(article.seoTitle, `missing seoTitle for ${article.slug}`);
    assert.ok(article.seoDescription, `missing seoDescription for ${article.slug}`);
    assert.ok(article.excerpt, `missing excerpt for ${article.slug}`);
    assert.ok(article.categorySlug, `missing categorySlug for ${article.slug}`);
    assert.ok(article.categoryId, `missing categoryId for ${article.slug}`);
    assert.ok(article.sourceDraft, `missing sourceDraft for ${article.slug}`);
    assert.equal(allowedCategorySlugs.has(article.categorySlug), true, article.slug);
    assert.equal(article.categoryId, canonicalCategoryIds.get(article.categorySlug), article.slug);
  }
});

test('P0 insight draft SEO titles and descriptions stay within reviewed lengths', () => {
  for (const article of batch?.articles || []) {
    assert.ok(article.seoTitle.length >= 30, `${article.slug} seoTitle is too short`);
    assert.ok(article.seoTitle.length <= 60, `${article.slug} seoTitle is too long`);
    assert.ok(article.seoDescription.length >= 120, `${article.slug} seoDescription is too short`);
    assert.ok(article.seoDescription.length <= 160, `${article.slug} seoDescription is too long`);
  }
});

test('P0 insight draft batch excludes manual-review URLs', () => {
  const serializedBatch = JSON.stringify(batch);
  for (const url of forbiddenManualReviewUrls) {
    assert.equal(serializedBatch.includes(url), false, url);
  }
});

test('P0 insight draft batch contains no redirect mutations', () => {
  const serializedBatch = JSON.stringify(batch);
  assert.doesNotMatch(serializedBatch, /redirect/i);
  assert.equal(Object.hasOwn(batch || {}, 'redirects'), false);
});

test('P0 insight import script has no publish operation', () => {
  assert.ok(scriptSource, 'missing scripts/sanity/import-p0-insight-drafts.mjs');
  assert.doesNotMatch(scriptSource, /\.publish\s*\(/);
  assert.doesNotMatch(scriptSource, /\bpublish_documents\b/);
  assert.doesNotMatch(scriptSource, /\bunpublish\s*\(/);
});

test('P0 insight import script defaults to dry-run and gates draft updates', () => {
  assert.match(scriptSource, /dryRun:\s*true/);
  assert.match(scriptSource, /--apply/);
  assert.match(scriptSource, /SANITY_WRITE_TOKEN/);
  assert.match(scriptSource, /--update-existing-drafts/);
  assert.match(scriptSource, /perspective:\s*['"]published['"]/);
  assert.match(scriptSource, /drafts\./);
  assert.match(scriptSource, /categoryId/);
});

test('P0 insight import does not change legacy redirect targets yet', () => {
  for (const [source, target] of legacyRedirectTargets) {
    const escapedSource = source.replaceAll('/', '\\/');
    const escapedTarget = target.replaceAll('/', '\\/');
    assert.match(redirectSource, new RegExp(`\\['${escapedSource}',\\s*'${escapedTarget}'\\]`));
  }
});

test('built sitemap includes all P0 insight URLs when build output exists', (t) => {
  if (!builtSitemapSource) {
    t.skip('dist/client/sitemap-0.xml does not exist; run npm run build for sitemap output verification.');
    return;
  }

  const latestInputMtime = Math.max(
    publicBlogPolicyStats?.mtimeMs || 0,
    sanityClientStats?.mtimeMs || 0,
  );

  if (!builtSitemapStats || builtSitemapStats.mtimeMs < latestInputMtime) {
    t.skip('dist/client/sitemap-0.xml is older than the public blog build inputs; rerun after npm run build.');
    return;
  }

  for (const slug of expectedSlugs) {
    assert.match(builtSitemapSource, new RegExp(`https://kpinfo\\.tech/insights/${slug}/`), slug);
  }
});
