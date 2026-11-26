const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const out=process.env.AST_OUTPUT??'/private/tmp/qommity-ast-multilingual-artifacts';
const repo=process.env.AST_FIXTURE_REPO??'/private/tmp/qommity-multilingual-20261126';
const root=process.env.QOMMITY_ROOT??'/Users/muratozturk/Qommity-Legacy/qommity-com';
const read=n=>JSON.parse(fs.readFileSync(out+'/'+n));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const estimate=t=>Math.ceil(Array.from(t).length/4);
const original=read('determinism-before.json');const deterministic=Object.keys(original).map(name=>({name,sha256:hash(fs.readFileSync(out+'/'+name)),identical:original[name]===hash(fs.readFileSync(out+'/'+name))}));assert(deterministic.every(x=>x.identical));
const branches=read('branches.json');const expected=read('ast-test-expected-results.json');
let prompts=0,blocks=0,sourceRanges=0;
for(const p of branches){
 assert.equal(execFileSync('git',['-C',repo,'merge-base',p.baseSha,p.headSha],{encoding:'utf8'}).trim(),p.baseSha);
 const report=read(`review-prompts-AST-multilingual-${String(p.number).padStart(2,'0')}-${p.slug}.json`);
 assert.equal(report.baseSha,p.baseSha);assert.equal(report.headSha,p.headSha);assert.equal(report.mergeBaseSha,p.baseSha);
 assert.equal(report.normal.length,report.ast.length);
 for(let i=0;i<report.normal.length;i++){
  const normal=report.normal[i],ast=report.ast[i];assert.equal(normal.path,ast.path);assert.equal(normal.system,ast.system);
  for(const value of [normal,ast])assert.equal(value.estimatedTokens,estimate(value.system)+estimate(value.user));
  for(const b of ast.astAnalysis.context.blocks){
   const ref=b.side==='head'?p.headSha:p.baseSha;const src=execFileSync('git',['-C',repo,'show',ref+':'+b.path],{encoding:'utf8'});
   const lines=src.split('\n');if(src.endsWith('\n'))lines.pop();assert.equal(b.source,lines.slice(b.from-1,b.to).join('\n'));blocks++;
  }
  prompts+=2;
 }
 for(const side of ['normal','ast'])assert.equal(report.tokenEstimate[side],report[side].reduce((sum,p)=>sum+p.estimatedTokens,0));
}
for(const scenario of expected.scenarios){
 const p=branches.find(p=>p.number===scenario.pr);
 for(const [side,ref,file] of [['base',p.baseSha,scenario.oldPath],['head',p.headSha,scenario.path]]){
  const r=scenario[side];if(!r)continue;
  const src=execFileSync('git',['-C',repo,'show',ref+':'+file]);assert(r.startByte<=r.endByte&&r.endByte<=src.length);
  const fragment=src.subarray(r.startByte,r.endByte).toString('utf8');assert.equal(Buffer.byteLength(fragment),r.endByte-r.startByte);
  assert.equal(src.subarray(0,r.startByte).toString().split('\n').length,r.from);
  const prefix=src.subarray(0,r.endByte).toString();assert.equal(prefix.split('\n').length-(prefix.endsWith('\n')?1:0),r.to);sourceRanges++;
 }
}
const native=read('native-ci-summary.json');assert(native.allPassed);assert.equal(native.successfulJobs,40);
for(const p of branches){const run=native.runs.find(r=>r.pr===p.number);assert.equal(run.baseSha,p.baseSha);assert.equal(run.headSha,p.headSha);}
execFileSync('git',['-C',root,'diff','--exit-code','HEAD','--','tools/review-compare','packages/core','apps/api/src/modules/pr-review']);
const productionFiles=execFileSync('git',['-C',root,'ls-files','tools/review-compare','packages/core/src','apps/api/src/modules/pr-review'],{encoding:'utf8'}).trim().split('\n');
const fingerprint=hash(productionFiles.map(name=>name+'\0'+hash(fs.readFileSync(root+'/'+name))).join('\n'));
const result={passed:true,promptMessages:prompts,sourceBlocksVerified:blocks,expectedSourceRangesVerified:sourceRanges,deterministicArtifacts:deterministic,nativeJobsPassed:40,productionTrackedFilesUnchanged:true,productionSourceFingerprint:fingerprint,modelCalls:0};
fs.writeFileSync(out+'/verification.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({...result,deterministicArtifacts:deterministic.length}));
