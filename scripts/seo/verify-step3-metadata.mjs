import {readFileSync,writeFileSync} from 'node:fs';import {inspect} from './audit-step2.mjs';
const baseline=JSON.parse(readFileSync('docs/seo-review/step-3-evidence/metadata-baseline.json'));const errors=[];
for(const p of baseline){const b=p;const a=inspect(readFileSync('dist/client'+new URL(p.url).pathname+'index.html','utf8'));for(const k of ['titles','descriptions','canonicals','meta'])if(JSON.stringify(a[k])!==JSON.stringify(b[k]))errors.push({url:p.url,field:k,before:b[k],after:a[k]});}
writeFileSync('docs/seo-review/step-3-evidence/all-metadata-preserved.json',JSON.stringify({pages:baseline.length,errors},null,2));console.log({pages:baseline.length,errors});if(errors.length)process.exitCode=1;
