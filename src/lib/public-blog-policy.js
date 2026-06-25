export const PUBLIC_BLOG_RECENT_CUTOFF = '2025-12-25T00:00:00Z';

export const PUBLIC_BLOG_SLUGS = Object.freeze([
  'angular-vs-react',
  'best-hr-software-for-startups',
  'best-seo-tools-for-small-businesses',
  'best-web-application-frameworks',
  'cloud-deployment-models-diagram',
  'database-design-best-practices',
  'erp-for-retail-stores',
  'erp-implementation-cost',
  'inventory-management-best-practices',
  'minimum-viable-product-examples',
  'mobile-app-monetization-strategies',
  'node-js-frameworks',
  'odoo-erp-complete-guide',
  'scalable-system-architecture',
]);

export const PUBLIC_BLOG_SLUG_SET = new Set(PUBLIC_BLOG_SLUGS);

export const FINAL_BLOG_CATEGORY_SLUGS = Object.freeze([
  'automation-ai',
  'cloud-devops',
  'custom-software-development',
  'digital-platforms-ecommerce',
  'erp-business-systems',
]);

function groqStringList(values) {
  return `[${values.map((value) => JSON.stringify(value)).join(', ')}]`;
}

export const PUBLIC_BLOG_GROQ_FILTER = [
  `slug.current in ${groqStringList(PUBLIC_BLOG_SLUGS)}`,
  `publishedAt >= ${JSON.stringify(PUBLIC_BLOG_RECENT_CUTOFF)}`,
].join(' || ');

export const FINAL_BLOG_CATEGORY_GROQ_FILTER =
  `slug.current in ${groqStringList(FINAL_BLOG_CATEGORY_SLUGS)}`;
