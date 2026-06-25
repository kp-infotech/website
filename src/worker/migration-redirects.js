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
