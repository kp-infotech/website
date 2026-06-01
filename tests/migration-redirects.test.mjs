import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  getMigrationRedirectLocation,
  PERMANENT_REDIRECT_STATUS,
} from '../src/worker/migration-redirects.js';

const origin = 'https://kpinfo.tech';

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
      redirectFor('/casestudy/ai-shopping-app-visual-search/'),
      `${origin}/work/ai-shopping-app-visual-search/`,
    );
    assert.equal(redirectFor('/blogs/not-a-migrated-post/'), null);
    assert.equal(redirectFor('/casestudy/not-a-known-case-study/'), null);
  });

  it('does not redirect current target routes back to old routes', () => {
    assert.equal(redirectFor('/services/erp-software/'), null);
    assert.equal(redirectFor('/services/custom-software-development/'), null);
    assert.equal(redirectFor('/insights/node-js-frameworks/'), null);
    assert.equal(redirectFor('/work/ai-shopping-app-visual-search/'), null);
  });
});
