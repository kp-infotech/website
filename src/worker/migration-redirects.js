import { PUBLIC_BLOG_SLUG_SET } from '../lib/public-blog-policy.js';

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
  ['/what-is-customised-software', '/services/custom-software-development/'],
  ['/business-process-automation-tools', '/services/business-automation/'],
  ['/5-best-modern-website-design-ideas', '/services/custom-software-development/'],
  ['/data-visualization-best-practices', '/services/custom-software-development/'],
  ['/business-process-improvement-methods', '/services/business-automation/'],
  ['/best-ecommerce-platform-for-small-business', '/industries/retail-ecommerce/'],
  ['/about-kp-infotech-expertise', '/about/'],
  ['/on-premise-vs-cloud-erp', '/services/erp-software/'],
  ['/web-design-company', '/services/custom-software-development/'],
  ['/how-to-choose-erp-system', '/services/erp-software/'],
  ['/how-to-make-a-website-mobile-friendly', '/services/custom-software-development/'],
  ['/requirements-gathering-techniques', '/services/custom-software-development/'],
  ['/architecture-of-a-mobile-app', '/services/custom-software-development/'],
  ['/affordable-web-hosting-solutions-for-businesses', '/services/cloud-devops/'],
  ['/web-application-security-guide', '/services/cloud-devops/'],
  ['/analytics-and-data-visualization', '/services/custom-software-development/'],
  ['/digital-transformation-roadmap', '/services/business-automation/'],
  ['/digital-marketing-for-startups', '/industries/startups/'],
  ['/website-and-app-development-company', '/services/custom-software-development/'],
  ['/website-design', '/services/custom-software-development/'],
  ['/applications-based-on-cloud-computing', '/services/cloud-devops/'],
  ['/software-development-process-phases', '/services/custom-software-development/'],
  ['/software-development-life-cycle-example', '/services/custom-software-development/'],
  ['/benefits-of-erp', '/services/erp-software/'],
  ['/erp-solutions-for-small-businesses', '/services/erp-software/'],
  ['/erp-implementation-best-practices', '/services/erp-software/'],
  [
    '/how-to-use-odoo-crm-for-effective-customer-relationships',
    '/services/erp-software/',
  ],
  ['/business-process-automation-examples', '/services/business-automation/'],
  ['/analytics-in-banking-industry', '/industries/finance/'],
  ['/mobile-app-testing-checklist', '/services/custom-software-development/'],
  ['/how-to-create-a-process-map', '/services/business-automation/'],
  ['/how-to-increase-online-sales', '/industries/retail-ecommerce/'],
  ['/optimizing-cloud-computing', '/services/cloud-devops/'],
  ['/website-development-for-startups', '/industries/startups/'],
  ['/privacy-policy-2', '/privacy-policy/'],
  ['/how-to-make-a-website', '/services/custom-software-development/'],
  ['/best-practices-for-devops', '/services/cloud-devops/'],
  ['/career', '/careers/'],
  ['/blogs', '/insights/'],
  ['/casestudy', '/work/'],
  ['/hire-wordpress-developer', '/services/custom-software-development/'],
  ['/hire-laravel-developer', '/services/custom-software-development/'],
  ['/hire-react-js-developer', '/services/custom-software-development/'],
  ['/kp-infotech-faqs', '/contact/'],
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
  if (rootSlug && PUBLIC_BLOG_SLUG_SET.has(rootSlug)) {
    return createRedirectLocation(url, `/insights/${rootSlug}/`);
  }

  const blogSlug = getSingleSegmentSplat(pathname, '/blogs');
  if (blogSlug && PUBLIC_BLOG_SLUG_SET.has(blogSlug)) {
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
