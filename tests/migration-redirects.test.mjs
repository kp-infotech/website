import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  getMigrationRedirectLocation,
  PERMANENT_REDIRECT_STATUS,
} from '../src/worker/migration-redirects.js';

const origin = 'https://kpinfo.tech';

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

function redirectFor(path) {
  return getMigrationRedirectLocation(`${origin}${path}`);
}

describe('migration redirects', () => {
  it('uses permanent redirects', () => {
    assert.equal(PERMANENT_REDIRECT_STATUS, 301);
  });

  it('redirects old service slugs to current service routes', () => {
    assert.equal(
      redirectFor('/services/web-application-development/'),
      `${origin}/services/custom-software-development/`,
    );
    assert.equal(
      redirectFor('/services/erp-solutions'),
      `${origin}/services/erp-software/`,
    );
    assert.equal(
      redirectFor('/services/ai-automation/'),
      `${origin}/services/ai-automation-agents/`,
    );
  });

  it('falls ambiguous removed service pages back to existing current service routes', () => {
    assert.equal(
      redirectFor('/services/mobile-app-development/'),
      `${origin}/services/custom-software-development/`,
    );
    assert.equal(
      redirectFor('/services/ui-ux-design/'),
      `${origin}/services/custom-software-development/`,
    );
    assert.equal(
      redirectFor('/mobile-web-app/'),
      `${origin}/services/custom-software-development/`,
    );
    assert.equal(redirectFor('/odoo-crm/'), `${origin}/services/erp-software/`);
  });

  it('preserves query strings while normalizing trailing slashes', () => {
    assert.equal(
      redirectFor('/career?utm_source=old-site'),
      `${origin}/careers/?utm_source=old-site`,
    );
    assert.equal(
      redirectFor('/blogs/node-js-frameworks/?utm_campaign=migration'),
      `${origin}/insights/node-js-frameworks/?utm_campaign=migration`,
    );
    assert.equal(
      redirectFor('/what-is-customised-software/?utm_campaign=migration'),
      `${origin}/services/custom-software-development/?utm_campaign=migration`,
    );
  });

  it('redirects only known migrated blog and case-study slugs', () => {
    assert.equal(
      redirectFor('/node-js-frameworks/'),
      `${origin}/insights/node-js-frameworks/`,
    );
    assert.equal(
      redirectFor('/blogs/node-js-frameworks/'),
      `${origin}/insights/node-js-frameworks/`,
    );
    assert.equal(
      redirectFor('/erp-for-retail-stores/'),
      `${origin}/insights/erp-for-retail-stores/`,
    );
    assert.equal(
      redirectFor('/casestudy/virtual-tours-ai-listings/'),
      `${origin}/work/virtual-tours-ai-listings/`,
    );
    assert.equal(redirectFor('/blogs/not-a-migrated-post/'), null);
    assert.equal(redirectFor('/casestudy/not-a-known-case-study/'), null);
  });

  it('redirects Batch 1 hard 404 recovery URLs to approved current routes', () => {
    for (const [source, target] of batch1Redirects) {
      assert.equal(redirectFor(source), `${origin}${target}`, source);
    }
  });

  it('does not redirect manual review URLs before approval', () => {
    for (const source of manualReviewPaths) {
      assert.equal(redirectFor(source), null, source);
    }
  });

  it('does not redirect current target routes back to old routes', () => {
    assert.equal(redirectFor('/services/erp-software/'), null);
    assert.equal(redirectFor('/services/custom-software-development/'), null);
    assert.equal(redirectFor('/insights/node-js-frameworks/'), null);
    assert.equal(redirectFor('/work/virtual-tours-ai-listings/'), null);
  });

  it('does not introduce redirect chains for Batch 1 targets', () => {
    for (const target of new Set(batch1Redirects.values())) {
      assert.equal(redirectFor(target), null, target);
    }
  });
});
