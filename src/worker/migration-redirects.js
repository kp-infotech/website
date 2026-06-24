export const PERMANENT_REDIRECT_STATUS = 301;

const EXACT_REDIRECTS = new Map([
  ['/services/web-application-development', '/services/custom-software-development/'],
  ['/services/erp-solutions', '/services/erp-software/'],
  ['/services/ai-automation', '/services/ai-automation-agents/'],
  ['/services/mobile-app-development', '/services/custom-software-development/'],
  ['/services/ui-ux-design', '/services/custom-software-development/'],
  ['/services/website-design', '/services/custom-software-development/'],
  ['/services/graphics-design', '/services/custom-software-development/'],
  ['/services/mobile-web-app', '/services/custom-software-development/'],
  ['/services/erp-software/odoo-crm', '/services/erp-software/'],
  ['/erp-software', '/services/erp-software/'],
  ['/odoo-crm', '/services/erp-software/'],
  ['/mobile-web-app', '/services/custom-software-development/'],
  ['/career', '/careers/'],
  ['/blogs', '/insights/'],
  ['/casestudy', '/work/'],
  ['/hire-wordpress-developer', '/services/custom-software-development/'],
  ['/hire-laravel-developer', '/services/custom-software-development/'],
  ['/hire-react-js-developer', '/services/custom-software-development/'],
  ['/kp-infotech-faqs', '/contact/'],
]);

const MIGRATED_BLOG_SLUGS = new Set([
  '15-proven-benefits-of-erp-systems-for-businesses-in-2025',
  '5-best-modern-website-design-ideas',
  'about-kp-infotech-expertise',
  'affordable-web-hosting-solutions-for-businesses',
  'analytics-and-data-visualization',
  'analytics-in-banking-industry',
  'angular-vs-react',
  'angularjs-vs-reactjs',
  'application-cloud-migration',
  'application-modernization-strategy',
  'applications-based-on-cloud-computing',
  'architecture-of-a-mobile-app',
  'b-2-b-lead-generation-strategies',
  'benefits-of-custom-software-development',
  'benefits-of-erp',
  'best-ecommerce-platform-for-small-business',
  'best-framework-for-web-application',
  'best-hr-software-for-startups',
  'best-mobile-app-development-company',
  'best-practices-for-devops',
  'best-seo-tools-for-small-businesses',
  'best-web-application-frameworks',
  'brand-style-guide-template',
  'business-process-automation-examples',
  'business-process-automation-tools',
  'business-process-improvement-methods',
  'cloud-application-architecture-diagram',
  'cloud-deployment-models-diagram',
  'cloud-migration-checklist',
  'cloud-migration-plan',
  'cloud-migration-solution',
  'create-online-presence',
  'custom-software-development-costs',
  'data-visualization-best-practices',
  'database-design-best-practices',
  'database-security-best-practices',
  'designing-a-web-application',
  'digital-marketing-for-manufacturers',
  'digital-marketing-for-startups',
  'digital-marketing-tips-for-small-businesses',
  'digital-transformation-roadmap',
  'ecommerce-website-development-cost',
  'ecommerce-website-development-services',
  'erp-for-retail-stores',
  'erp-implementation-best-practices',
  'erp-implementation-cost',
  'erp-implementation-issues',
  'erp-software-odoo',
  'erp-solutions-for-small-businesses',
  'erp-system-selection-criteria',
  'freelancer-vs-graphic-design-company-for-your-startup-which-should-you-choose',
  'functional-vs-unit-tests',
  'global-technology-solutions',
  'google-analytics-360',
  'graphic-design-tips',
  'hire-a-wordpress-developer',
  'how-a-graphic-design-agency-can-fix-your-start-up-mistakes',
  'how-does-online-auction-work',
  'how-to-choose-erp-system',
  'how-to-choose-the-right-digital-marketing-channels-for-your-business',
  'how-to-conduct-competitor-analysis',
  'how-to-create-a-process-map',
  'how-to-create-brand-guidelines',
  'how-to-increase-online-sales',
  'how-to-make-a-website-mobile-friendly',
  'how-to-use-odoo-crm',
  'how-to-use-odoo-crm-for-effective-customer-relationships',
  'inventory-management-best-practices',
  'it-support-trends-2025',
  'legacy-system-modernisation',
  'legacy-system-modernization-strategies',
  'make-a-social-media-app',
  'marketing-strategy-retail-store',
  'migration-to-cloud-computing',
  'minimum-viable-product-examples',
  'mobile-app-developement-company',
  'mobile-app-development-tips',
  'mobile-app-monetization-strategies',
  'mobile-app-testing-checklist',
  'mvp-vs-mvvm',
  'node-js-frameworks',
  'odoo-erp-complete-guide',
  'odoo-erp-vs-traditional-erp-which-is-the-best-for-business-in-2025',
  'on-premise-vs-cloud-erp',
  'optimizing-cloud-computing',
  'react-vs-angular-js',
  'requirements-gathering-techniques',
  'responsive-web-design-principles',
  'sample-aws-lambda-function',
  'sample-digital-marketing-strategy',
  'scalable-system-architecture',
  'small-business-erp-solutions',
  'social-media-marketing-strategies',
  'software-development-cycle-models',
  'software-development-life-cycle-example',
  'software-development-process-phases',
  'software-development-workflow',
  'sql-count-group',
  'startup-business-marketing-strategy',
  'startup-business-marketing-strategy-playbook',
  'test-driven-development',
  'top-7-mistakes-businesses-make-when-building-their-first-mobile-app',
  'uniting-website-design-and-digital-marketing',
  'web-application-security-guide',
  'web-design-company',
  'web-designing-company',
  'web-designing-layout',
  'website-and-app-development-company',
  'website-development-for-startups',
  'what-is-customised-software',
  'what-is-digital-engineering',
  'woocommerce-development-services',
]);

const MIGRATED_CASE_STUDY_SLUGS = new Set([
  'ai-shopping-app-visual-search',
  'ar-furniture-configurator',
  'cloud-ehr-multi-specialty',
  'collaboration-platform-distributed-teams',
  'crypto-trading-platform',
  'digital-banking-platform',
  'digital-wallet-p2p-payments',
  'fleet-management-route-optimization',
  'food-delivery-platform',
  'insurance-claims-ai-portal',
  'inventory-warehouse-management',
  'investment-portfolio-app',
  'learning-management-system-university',
  'omnichannel-ecommerce-platform',
  'patient-engagement-app',
  'production-planning-mrp-automotive',
  'property-management-erp-portal',
  'quality-control-dashboard-spc',
  'saas-mvp-project-management',
  'secure-telemedicine-platform',
  'shipment-tracking-last-mile',
  'student-portal-mobile-app',
  'supplier-management-procurement',
  'virtual-tours-ai-listings',
  'warehouse-automation-robotics',
]);

export function getMigrationRedirectLocation(requestUrl) {
  const url = new URL(requestUrl);
  const pathname = normalizePathname(url.pathname);
  const exactTarget = EXACT_REDIRECTS.get(pathname);

  if (exactTarget) {
    return createRedirectLocation(url, exactTarget);
  }

  const rootSlug = getRootSlug(pathname);
  if (rootSlug && MIGRATED_BLOG_SLUGS.has(rootSlug)) {
    return createRedirectLocation(url, `/insights/${rootSlug}/`);
  }

  const blogSlug = getSingleSegmentSplat(pathname, '/blogs');
  if (blogSlug && MIGRATED_BLOG_SLUGS.has(blogSlug)) {
    return createRedirectLocation(url, `/insights/${blogSlug}/`);
  }

  const caseStudySlug = getSingleSegmentSplat(pathname, '/casestudy');
  if (caseStudySlug && MIGRATED_CASE_STUDY_SLUGS.has(caseStudySlug)) {
    return createRedirectLocation(url, `/work/${caseStudySlug}/`);
  }

  return null;
}

function normalizePathname(pathname) {
  if (pathname === '/') {
    return pathname;
  }

  return pathname.replace(/\/+$/, '');
}

function getRootSlug(pathname) {
  if (pathname === '/' || pathname.slice(1).includes('/')) {
    return null;
  }

  return pathname.slice(1);
}

function getSingleSegmentSplat(pathname, prefix) {
  if (!pathname.startsWith(`${prefix}/`)) {
    return null;
  }

  const splat = pathname.slice(prefix.length + 1);
  return splat && !splat.includes('/') ? splat : null;
}

function createRedirectLocation(url, targetPath) {
  const target = new URL(targetPath, url.origin);
  target.search = url.search;

  if (normalizePathname(target.pathname) === normalizePathname(url.pathname)) {
    return null;
  }

  return target.toString();
}
