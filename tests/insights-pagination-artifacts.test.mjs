import assert from 'node:assert/strict';
import fs from 'node:fs';
import {test} from 'node:test';

test('rendered insights pagination links use only canonical paths and preserve boundaries', () => {
  const paths = ['/insights/', '/insights/2/', '/insights/3/'];
  for (const [index, path] of paths.entries()) {
    const html = fs.readFileSync(new URL(`../dist/client${path}index.html`, import.meta.url), 'utf8');
    const nav = html.match(/<nav\b[^>]*aria-label="Article pages"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
    assert.ok(nav, `${path} pagination exists`);
    const anchors = [...nav.matchAll(/<a\b([^>]*)>/g)].map(m => m[1]);
    const hrefs = anchors.map(a => a.match(/\bhref="([^"]+)"/)?.[1]).filter(Boolean);
    assert.deepEqual([...new Set(hrefs)].sort(), [...paths].sort());
    for (const [label, expected] of [['Previous page', paths[index - 1]], ['Next page', paths[index + 1]]]) {
      const anchor = anchors.find(a => a.includes(`aria-label="${label}"`));
      assert.ok(anchor);
      assert.equal(anchor.match(/\bhref="([^"]+)"/)?.[1], expected, `${path} ${label}`);
      assert.equal(anchor.includes('aria-disabled="true"'), !expected);
    }
    const canonical = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*>/g)].map(m => m[0].match(/href="([^"]+)"/)?.[1]);
    assert.deepEqual(canonical, [`https://kpinfo.tech${path}`]);
  }
});
