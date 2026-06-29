import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const batch = JSON.parse(
  await readFile(new URL('../scripts/sanity/seo-metadata-batch-1.json', import.meta.url), 'utf8')
);
const scriptSource = await readFile(
  new URL('../scripts/sanity/update-seo-metadata.mjs', import.meta.url),
  'utf8'
);

test('SEO metadata batch targets only the production Sanity project', () => {
  assert.equal(batch.projectId, '5rux0mv2');
  assert.equal(batch.dataset, 'production');
});

test('SEO metadata batch is limited to P0 and P1 items', () => {
  const priorities = new Set(batch.updates.map((update) => update.priority));
  assert.deepEqual([...priorities].sort(), ['P0', 'P1']);
  assert.equal(batch.updates.some((update) => update.documentType === 'service'), false);
});

test('SEO metadata batch includes the first-batch industry scope', () => {
  const industrySlugs = batch.updates
    .filter((update) => update.documentType === 'industry')
    .map((update) => update.slug)
    .sort();

  assert.deepEqual(industrySlugs, [
    'education',
    'finance',
    'healthcare',
    'logistics',
    'manufacturing',
    'real-estate',
    'retail-ecommerce',
    'startups',
  ]);
});

test('SEO metadata batch includes only P1 blog posts from the inventory', () => {
  const blogSlugs = batch.updates
    .filter((update) => update.documentType === 'blogPost')
    .map((update) => update.slug)
    .sort();

  assert.deepEqual(blogSlugs, [
    'angular-vs-react',
    'best-hr-software-for-startups',
    'best-web-application-frameworks',
    'cloud-deployment-models-diagram',
    'erp-for-retail-stores',
    'minimum-viable-product-examples',
    'node-js-frameworks',
    'odoo-erp-complete-guide',
  ]);
});

test('SEO metadata batch only patches the guarded virtual tour case-study description', () => {
  const caseStudies = batch.updates.filter((update) => update.documentType === 'caseStudy');
  assert.equal(caseStudies.length, 1);
  assert.equal(caseStudies[0].slug, 'virtual-tours-ai-listings');
  assert.deepEqual(Object.keys(caseStudies[0].fields), ['seoDescription']);
  assert.deepEqual(caseStudies[0].fields.seoDescription.allowedCurrent, [
    '3D virtual tour platform generating 85K leads, 420% views, $180M sales, 34% conversion.',
  ]);
});

test('SEO metadata batch does not update default OG image without a reviewed asset', () => {
  const siteSettings = batch.updates.find((update) => update.documentType === 'siteSettings');
  assert.ok(siteSettings);
  assert.deepEqual(Object.keys(siteSettings.fields).sort(), [
    'defaultSeoDescription',
    'defaultSeoTitle',
  ]);
});

test('SEO metadata script targets published documents, not drafts', () => {
  assert.match(scriptSource, /perspective:\s*['"]published['"]/);
});
