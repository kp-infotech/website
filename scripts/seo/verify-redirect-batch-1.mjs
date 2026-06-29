import { existsSync } from 'node:fs';
import { join } from 'node:path';

import {
  getMigrationRedirectLocation,
  PERMANENT_REDIRECT_STATUS,
} from '../../src/worker/migration-redirects.js';

const origin = 'https://kpinfo.tech';
const distClient = join(process.cwd(), 'dist', 'client');

const batch1Redirects = new Map([
  ['/what-is-customised-software/', '/services/custom-software-development/'],
  ['/business-process-automation-tools/', '/services/business-automation/'],
  ['/5-best-modern-website-design-ideas/', '/services/custom-software-development/'],
  ['/data-visualization-best-practices/', '/services/custom-software-development/'],
  ['/business-process-improvement-methods/', '/services/business-automation/'],
  ['/best-ecommerce-platform-for-small-business/', '/industries/retail-ecommerce/'],
  ['/about-kp-infotech-expertise/', '/about/'],
  ['/on-premise-vs-cloud-erp/', '/services/erp-software/'],
  ['/web-design-company/', '/services/custom-software-development/'],
  ['/how-to-choose-erp-system/', '/services/erp-software/'],
  ['/how-to-make-a-website-mobile-friendly/', '/services/custom-software-development/'],
  ['/requirements-gathering-techniques/', '/services/custom-software-development/'],
  ['/architecture-of-a-mobile-app/', '/services/custom-software-development/'],
  ['/affordable-web-hosting-solutions-for-businesses/', '/services/cloud-devops/'],
  ['/web-application-security-guide/', '/services/cloud-devops/'],
  ['/analytics-and-data-visualization/', '/services/custom-software-development/'],
  ['/digital-transformation-roadmap/', '/services/business-automation/'],
  ['/digital-marketing-for-startups/', '/industries/startups/'],
  ['/website-and-app-development-company/', '/services/custom-software-development/'],
  ['/website-design/', '/services/custom-software-development/'],
  ['/applications-based-on-cloud-computing/', '/services/cloud-devops/'],
  ['/software-development-process-phases/', '/services/custom-software-development/'],
  ['/software-development-life-cycle-example/', '/services/custom-software-development/'],
  ['/benefits-of-erp/', '/services/erp-software/'],
  ['/erp-solutions-for-small-businesses/', '/services/erp-software/'],
  ['/erp-implementation-best-practices/', '/services/erp-software/'],
  [
    '/how-to-use-odoo-crm-for-effective-customer-relationships/',
    '/services/erp-software/',
  ],
  ['/business-process-automation-examples/', '/services/business-automation/'],
  ['/analytics-in-banking-industry/', '/industries/finance/'],
  ['/mobile-app-testing-checklist/', '/services/custom-software-development/'],
  ['/how-to-create-a-process-map/', '/services/business-automation/'],
  ['/how-to-increase-online-sales/', '/industries/retail-ecommerce/'],
  ['/optimizing-cloud-computing/', '/services/cloud-devops/'],
  ['/website-development-for-startups/', '/industries/startups/'],
  ['/privacy-policy-2/', '/privacy-policy/'],
  ['/how-to-make-a-website/', '/services/custom-software-development/'],
  ['/best-practices-for-devops/', '/services/cloud-devops/'],
]);

const manualReviewPaths = [
  '/graphics-design/',
  '/how-to-choose-the-right-digital-marketing-channels-for-your-business/',
  '/sample-digital-marketing-strategy/',
  '/how-to-create-brand-guidelines/',
  '/b-2-b-lead-generation-strategies/',
];

const existingRedirects = new Map([
  ['/services/web-application-development/', '/services/custom-software-development/'],
  ['/services/erp-solutions/', '/services/erp-software/'],
  ['/services/ai-automation/', '/services/ai-automation-agents/'],
  ['/services/mobile-app-development/', '/services/custom-software-development/'],
  ['/services/ui-ux-design/', '/services/custom-software-development/'],
  ['/mobile-web-app/', '/services/custom-software-development/'],
  ['/odoo-crm/', '/services/erp-software/'],
  ['/career/', '/careers/'],
  ['/blogs/node-js-frameworks/', '/insights/node-js-frameworks/'],
  ['/casestudy/virtual-tours-ai-listings/', '/work/virtual-tours-ai-listings/'],
]);

function redirectFor(path) {
  return getMigrationRedirectLocation(`${origin}${path}`);
}

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(`${message}: expected ${expected}, got ${actual}`);
    return;
  }

  pass(message);
}

function targetHtmlPath(targetPath) {
  const normalized = targetPath.replace(/^\/+|\/+$/g, '');
  return normalized
    ? join(distClient, ...normalized.split('/'), 'index.html')
    : join(distClient, 'index.html');
}

assertEqual(PERMANENT_REDIRECT_STATUS, 301, 'redirect status constant is 301');

for (const [source, target] of batch1Redirects) {
  assertEqual(redirectFor(source), `${origin}${target}`, `Batch 1 ${source}`);
}

for (const [source, target] of existingRedirects) {
  assertEqual(redirectFor(source), `${origin}${target}`, `existing redirect ${source}`);
}

for (const source of manualReviewPaths) {
  assertEqual(redirectFor(source), null, `manual review remains unredirected ${source}`);
}

for (const target of new Set([...batch1Redirects.values(), ...existingRedirects.values()])) {
  assertEqual(redirectFor(target), null, `no redirect chain at target ${target}`);

  if (existsSync(distClient)) {
    const htmlPath = targetHtmlPath(target);
    if (existsSync(htmlPath)) {
      pass(`built target exists ${target}`);
    } else {
      fail(`built target missing ${target} (${htmlPath})`);
    }
  }
}

if (!existsSync(distClient)) {
  console.warn('WARN dist/client not found; run npm run build before using this as target-200 evidence.');
}

if (process.exitCode) {
  process.exit(process.exitCode);
}
