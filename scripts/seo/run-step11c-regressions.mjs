import fs from 'node:fs';import {spawnSync} from 'node:child_process';
const mode=process.argv[2]||'build',out='docs/seo-review/step-11c-evidence/',raw='/private/tmp/kp-step11c-production-pages.json',input=mode==='build'?'build':raw;
const results=[];function run(name,args){const log=fs.openSync(out+name+'-'+mode+'.txt','w');const r=spawnSync('node',args,{stdio:['ignore',log,log]});fs.closeSync(log);results.push({name,exit:r.status});console.log(name,r.status);}
for(const step of ['1c','2','7a','7b','7c','7d','7e','9b','9c'])run('step'+step,['scripts/seo/audit-step'+step+'.mjs',...(mode==='production'?['--origin=https://kpinfo.tech']:[]),'--output='+out+'step'+step+'-'+mode+'.json']);
for(const step of ['3','4','10b'])run('step'+step,['scripts/seo/audit-step'+step+'.mjs',input,out+'step'+step+'-'+mode+'.json']);
const semantics=JSON.parse(fs.readFileSync(out+'step3-'+mode+'.json')).pages;
const errors=semantics.filter(p=>p.h1.length!==1||p.h1.some(h=>!h.text||h.hidden)||p.hierarchy.length||p.images.some(x=>x.alt===null)||p.duplicateIds.length||p.emptyButtons||p.emptyBodyElements.length||p.schemaErrors.length).map(p=>p.url);
results.push({name:'step3-explicit-error-gate',exit:errors.length?1:0,errors});
fs.writeFileSync(out+mode+'-regression-exits.json',JSON.stringify(results,null,2));if(results.some(r=>r.exit!==0))process.exitCode=1;
