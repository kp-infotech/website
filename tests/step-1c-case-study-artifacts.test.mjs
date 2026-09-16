import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {test} from 'node:test';

test('built sitemap and rendered work links contain only current reviewed case studies', () => {
  const result=spawnSync(process.execPath,['scripts/seo/audit-step1c.mjs'],{
    cwd:new URL('../',import.meta.url),encoding:'utf8',
  });
  assert.equal(result.status,0,result.stdout+'\n'+result.stderr);
});
