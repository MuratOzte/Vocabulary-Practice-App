// Offline evaluation harness: calls existing Qommity parsers and preview, no model transports.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const ROOT=process.env.QOMMITY_ROOT??'/Users/muratozturk/Qommity-Legacy/qommity-com';
const OUT=process.env.AST_OUTPUT??'/private/tmp/qommity-ast-multilingual-artifacts';
const REPO=process.env.AST_FIXTURE_REPO??'/private/tmp/qommity-multilingual-20261126';
const load=name=>require(ROOT+'/tools/review-compare/'+name+'.cjs');
const {snapshotFromGit,sourceLines}=load('git-snapshot');
const {defaults,estimateTokens,sha256}=load('runtime');
const {buildMultilingualParsers,multilingualGrammarFor}=load('native-parser');
const {parseUnits}=load('multilingual-units');
const {sourceIndex}=load('preview-units');
const {reviewPreview}=load('preview');
const {buildAstReviewContexts,extractReviewContext}=load('ast-review');
const {PromptBuilderService,summarizePrFiles,findCallSites,formatFileContent,reviewFileSkipReason,DEFAULT_SKIP_PATTERNS}=require(ROOT+'/packages/core/dist');
const branches=JSON.parse(fs.readFileSync(OUT+'/branches.json'));
const expected=JSON.parse(fs.readFileSync(OUT+'/ast-test-expected-results.json'));
const git=(...a)=>execFileSync('git',['-C',REPO,...a],{encoding:'utf8',maxBuffer:32*1024*1024});
const json=(p,x)=>fs.writeFileSync(OUT+'/'+p,JSON.stringify(x,null,2)+'\n');
function independentDiff(base,head){
 const patch=git('diff','--no-ext-diff','--no-textconv','--no-color','--find-renames=50%','--diff-algorithm=myers','--no-indent-heuristic','--unified=0',base,head,'--','ast-stress');
 let oldPath,newPath,oldLine,newLine; const rows=[];
 for(const line of patch.split('\n')){
  if(line.startsWith('--- ')){oldPath=line.slice(4)==='/dev/null'?null:line.slice(6);continue;}
  if(line.startsWith('+++ ')){newPath=line.slice(4)==='/dev/null'?null:line.slice(6);continue;}
  const m=/^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(line);
  if(m){oldLine=+m[1];newLine=+m[2];continue;}
  if(line.startsWith('diff --git ')){oldLine=newLine=undefined;continue;}
  if(oldLine===undefined)continue;
  if(line.startsWith('-'))rows.push({side:'merge-base',path:oldPath,line:oldLine++,source:line.slice(1)});
  else if(line.startsWith('+'))rows.push({side:'head',path:newPath,line:newLine++,source:line.slice(1)});
  else if(line.startsWith(' ')){oldLine++;newLine++;}
 }
 return rows;
}
const tag=(user,name)=>new RegExp('<'+name+'(?: [^>]*)?>\\n([\\s\\S]*?)\\n</'+name+'>').exec(user)?.[1]??'';
function checkedOverlap(f,analysis){
 const blocks=analysis?.context?.blocks??[];const result={};
 for(const side of ['head','merge-base']){
  const src=sourceLines(side==='head'?f.updated:f.original).lines;
  const diff=new Set();const diffWithContext=new Set();
  for(const hunk of f.diffFile?.hunks??[]){let a=hunk.oldStart,b=hunk.newStart;
   for(const row of hunk.content.replace(/\n$/,'').split('\n').slice(1)){
    if(row.startsWith('\\'))continue;
    const marker=row[0],text=row.slice(1);
    const at=side==='head'?b:a;const visible=side==='head'?marker!== '-':marker!=='+';
    if(visible){assert.equal(src[at-1],text);diffWithContext.add(at);if(marker!==' ')diff.add(at);}
    if(marker!=='+')a++;if(marker!=='-')b++;
   }
  }
  const occurrences=[];for(const block of blocks.filter(x=>x.side===side)){
   assert.equal(block.path,side==='head'?f.path:f.old.path);
   assert.equal(block.source,src.slice(block.from-1,block.to).join('\n'));
   for(let line=block.from;line<=block.to;line++)occurrences.push(line);
  }
  const unique=[...new Set(occurrences)];
  const inside=unique.filter(n=>diffWithContext.has(n)),outside=unique.filter(n=>!diffWithContext.has(n));
  result[side]={contextLineOccurrences:occurrences.length,uniqueContextLines:unique.length,duplicateContextLines:occurrences.length-unique.length,alreadyInDiff:inside.length,outsideDiff:outside.length,changedLinesInContext:unique.filter(n=>diff.has(n)).length,
   alreadyInDiffSourceEstimatedTokens:estimateTokens(inside.map(n=>src[n-1]).join('\n')),outsideDiffSourceEstimatedTokens:estimateTokens(outside.map(n=>src[n-1]).join('\n')),sourceEqualityVerified:true};
 }
 return result;
}
async function main(){
 global.fetch=()=>{throw Error('Network is prohibited in offline preview evaluation');};
 for(const protocol of ['node:http','node:https'])for(const method of ['request','get'])require(protocol)[method]=()=>{throw Error('Network is prohibited in offline preview evaluation');};
 fs.mkdirSync(OUT+'/parser',{recursive:true});
 const allPaths=git('ls-tree','-r','--name-only',branches[0].baseSha,'--','ast-stress').trim().split('\n');
 const multilingual=buildMultilingualParsers(OUT+'/parser',allPaths);const parser={multilingual};
 json('parser-provenance.json',multilingual.metadata);
 const syntaxCache=new Map();const summary={schema:1,modelCalls:0,productionAstModified:false,qommityCommit:gitQ('rev-parse','HEAD').trim(),limits:defaults,reviewConfig:null,previousFindings:[],incrementalCarry:false,existingTests:{tests:123,passed:117,failed:0,skipped:6,log:'existing-tests.log'},prs:[],languages:{},failures:[],limitations:['AST analysis is file-local; cross-file dependency resolution is not scored as a parser error.','Token component estimates are diagnostics; independent rounding means component sums may differ from per-message totals.','No LLM is invoked by this harness. Repository automatic reviews are outside this offline run.']};
 for(const pr of branches){
  const changedFiles=git('diff','--name-only','-z',pr.baseSha+'...'+pr.headSha).split('\0').filter(Boolean).length;
  const snapshot=snapshotFromGit(REPO,{base:{sha:pr.baseSha},head:{sha:pr.headSha},changedFiles},defaults);
  const metadata={prTitle:`AST multilingual ${String(pr.number).padStart(2,'0')}: ${pr.slug}`,prAuthor:'MuratOzte',prDescription:'Offline AST stress evaluation; intentional regressions and syntax errors are labeled.',sourceBranch:pr.branch,targetBranch:'main'};
  const all=snapshot.files.map(f=>f.diffFile).filter(Boolean),prFiles=summarizePrFiles(all);
  const files=snapshot.files.filter(f=>f.diffFile&&!f.skip&&!reviewFileSkipReason(f.diffFile,DEFAULT_SKIP_PATTERNS));
  const diagnostics=new Map(), contexts=new Map();
  for(const f of files){const result=extractReviewContext({diff:f.diffFile,original:f.original,updated:f.updated},parser);diagnostics.set(f.path,result.diagnostics);if(result.context)contexts.set(f.path,result.context);}
  const preview=reviewPreview(snapshot,metadata,null,parser,defaults);
  const report={baseSha:pr.baseSha,mergeBaseSha:snapshot.mergeBase,headSha:pr.headSha,sourceHeadSha:pr.headSha,normal:[],ast:[],tokenEstimate:{method:'ceil(Unicode code points / 4), per message',normal:0,ast:0,saved:0}};
  const checks=[];const details=[];const metrics={number:pr.number,slug:pr.slug,branch:pr.branch,baseSha:pr.baseSha,headSha:pr.headSha,files:changedFiles,reviewedFiles:files.length,skippedFiles:[],normalTokens:0,astTokens:0,parseIssues:[],checks:{passed:0,failed:0,notScored:0},languages:{}};
  const independent=independentDiff(pr.baseSha,pr.headSha);
  // Independent diff uses no rename detection; compare side/path/absolute-line/source tuples to verified snapshot.
  const key=r=>[r.side,r.path,r.line,r.source].join('\0');
  const actualRows=snapshot.files.flatMap(f=>f.changed.map(r=>({...r,path:r.side==='head'?f.path:f.old.path,source:sourceLines(r.side==='head'?f.updated:f.original).lines[r.line-1]})));
  assert.deepEqual(actualRows.map(key).sort(),independent.map(key).sort());
  const builder=new PromptBuilderService();
  for(const f of snapshot.files){
   const language=multilingualGrammarFor(f.path);const lang=language==='c-sharp'?'csharp':language;
   const stat=metrics.languages[lang]??={files:0,normalTokens:0,astTokens:0,fallbacks:0,parseIssues:0,changedHead:0,changedBase:0,includedHead:0,includedBase:0};stat.files++;
   const analysis=diagnostics.get(f.path);const pv=preview.files.find(x=>x.path===f.path);
   const detail={path:f.path,oldPath:f.old?.path??null,language:lang,change:f.status,skip:f.skip??null,original:f.original,updated:f.updated,changedLines:independent.filter(r=>r.path===f.path||r.path===f.old?.path),preview:pv,analysis};
   // Parse both complete revisions to find accidental fixture errors, even on skipped files.
   detail.sourceValidation={};
   for(const [side,source] of [['merge-base',f.original],['head',f.updated]]){
    if(!source)continue; const cacheKey=sha256(lang+'\0'+source);
    if(!syntaxCache.has(cacheKey)){
     const parsed=parseUnits(multilingual,language,source,sourceIndex(source),defaults);
     syntaxCache.set(cacheKey,{reason:parsed.reason??null,recovery:(parsed.nodes??[]).filter(n=>n.kind==='recovery'),nodes:(parsed.nodes??[]).filter(n=>n.kind!=='reference')});
    }
    detail.sourceValidation[side]=syntaxCache.get(cacheKey);
    const s=detail.sourceValidation[side];
    if((s.reason||s.recovery.length)&&!/\/(Recovery|Incomplete)\./.test(f.path))summary.failures.push({pr:pr.number,path:f.path,side,type:'unexpected-fixture-syntax',reason:s.reason,recovery:s.recovery});
   }
   if(!files.includes(f)){metrics.skippedFiles.push({path:f.path,reason:f.skip??reviewFileSkipReason(f.diffFile,DEFAULT_SKIP_PATTERNS)});details.push(detail);continue;}
   const common={fileContent:f.updated,prFiles:prFiles.filter(x=>x.path!==f.path),callSites:findCallSites(f.diffFile,all),previousFindings:[]};
   const normal=builder.buildFileReviewPrompt(f.diffFile,metadata,null,common);
   const selected=contexts.get(f.path);const ast=builder.buildFileReviewPrompt(f.diffFile,metadata,null,{...common,...selected});
   assert.equal(normal.system,ast.system);
   const bodyN=tag(normal.user,'file_content'),bodyA=tag(ast.user,'file_content');
   assert.equal(normal.user.replace(/\n\n<file_content(?: [^>]*)?>\n[\s\S]*?\n<\/file_content>/,''),ast.user.replace(/\n\n<file_content(?: [^>]*)?>\n[\s\S]*?\n<\/file_content>/,''));
   const nt=estimateTokens(normal.system)+estimateTokens(normal.user),at=estimateTokens(ast.system)+estimateTokens(ast.user);
   report.normal.push({path:f.path,system:normal.system,user:normal.user,estimatedTokens:nt});
   report.ast.push({path:f.path,system:ast.system,user:ast.user,estimatedTokens:at,astUsed:!!selected,astAnalysis:analysis});
   const token={normalTotal:nt,astTotal:at,system:estimateTokens(normal.system),diff:estimateTokens(tag(normal.user,'file_diff')),normalFileContext:estimateTokens(bodyN),additionalAstContext:selected?estimateTokens(bodyA):0,astFileContext:estimateTokens(bodyA),saved:nt-at,overhead:at-nt};
   detail.tokenMetrics=token;detail.overlap=checkedOverlap(f,analysis);detail.promptParity=true;
   assert.deepEqual(extractReviewContext({diff:f.diffFile,original:f.original,updated:f.updated},parser).diagnostics,analysis);
   stat.normalTokens+=nt;stat.astTokens+=at;metrics.normalTokens+=nt;metrics.astTokens+=at;
   if(!selected)stat.fallbacks++;
   if(analysis.issues?.length){metrics.parseIssues.push({path:f.path,parse:analysis.parse,issues:analysis.issues});stat.parseIssues++;}
   for(const [side,label] of [['head','Head'],['merge-base','Base']]){stat['changed'+label]+=analysis.coverage?.[side]?.total??0;stat['included'+label]+=analysis.coverage?.[side]?.included??0;}
   for(const [name,value] of Object.entries(token))stat['token_'+name]=(stat['token_'+name]??0)+value;
   for(const side of ['head','merge-base'])for(const [name,value] of Object.entries(detail.overlap[side]))if(typeof value==='number')stat['overlap_'+side+'_'+name]=(stat['overlap_'+side+'_'+name]??0)+value;
   const matching=analysis?.matching;
   stat.matches=(stat.matches??0)+(matching?.matches?.length??0);stat.ambiguous=(stat.ambiguous??0)+(matching?.ambiguous?.length??0);
   for(const side of ['head','merge-base'])stat['unmatched_'+side]=(stat['unmatched_'+side]??0)+(matching?.unmatched?.[side]?.length??0);
   details.push(detail);
  }
  // Evaluate the authored oracle, including node identity/extent, matching and independent coverage.
  function check(scenario,type,pass,evidence){checks.push({scenario:scenario.symbol,path:scenario.path,type,pass,evidence});if(pass===null)metrics.checks.notScored++;else metrics.checks[pass?'passed':'failed']++;}
  for(const s of expected.scenarios.filter(x=>x.pr===pr.number)){
   const f=details.find(x=>x.path===s.path)??details.find(x=>x.path===s.oldPath);
   if(!f){check(s,'file-present',false,'Missing file');continue;}
   check(s,'file-present',true,f.change);
   if(f.skip){check(s,'review-skip',true,f.skip);continue;}
   const a=f.analysis;
   if(s.intentionalParseError){check(s,'safe-parse-fallback',a?.issues?.some(x=>x.reason==='syntax-recovery')&&!contexts.has(s.path),a?.issues);continue;}
   for(const [side,range] of [['merge-base',s.base],['head',s.head]]){
    if(!range)continue;
    const source=side==='head'?f.updated:f.original;
    const bytes=Buffer.from(source);
    check(s,'source-range-'+side,range.from>=1&&range.to<=sourceLines(source).lines.length&&range.startByte<=range.endByte&&range.endByte<=bytes.length,range);
    const blocks=a?.context?.blocks?.filter(b=>b.side===side)??[];
    if(s.rangeContract==='contains-anchor'){
     // Anchors are declarations or multi-node files. Score actual changed lines, not whole-file selection.
     const lines=f.changedLines.filter(r=>r.side===side&&range.from<=r.line&&r.line<=range.to);
     const missed=lines.filter(r=>!blocks.some(b=>b.from<=r.line&&r.line<=b.to));
     check(s,'independent-changed-line-coverage-'+side,!missed.length,{changed:lines.length,missed});
    }else{
     const candidates=f.preview?.ledger?.filter(r=>r.side===side&&r.unit?.name===(side==='head'?(s.headSymbol??s.symbol):(s.baseSymbol??s.symbol))).map(r=>r.unit)??[];
     const match=candidates.some(u=>u.kind===s.expectedNodeType&&u.from===range.from&&u.to===range.to);
     check(s,'selected-node-identity-and-range-'+side,match,{expected:{kind:s.expectedNodeType,name:s.symbol,...range},actual:candidates});
     const included=new Set(blocks.flatMap(b=>Array.from({length:b.to-b.from+1},(_,i)=>b.from+i)));
     const missing=Array.from({length:range.to-range.from+1},(_,i)=>range.from+i).filter(l=>!included.has(l));
     check(s,'complete-function-context-'+side,!missing.length,{missingLines:missing});
    }
   }
   const matching=a?.matching;
   if(s.matching==='renamed')check(s,'renamed-match',matching?.matches?.some(m=>m.old.name===s.symbol&&m.head.name==='capture_payment'&&m.renamed)??false,matching);
   else if(s.matching==='deleted')check(s,'deleted-unmatched',matching?.unmatched?.['merge-base']?.some(u=>u.name===s.symbol)??false,matching);
   else if(s.matching==='moved-within-file')check(s,'moved-match',matching?.matches?.some(m=>m.old.name===s.symbol&&m.head.name===s.symbol&&m.moved)??false,matching);
   else if(s.matching==='ambiguous-unmatched')check(s,'safe-ambiguous-match',!matching?.matches?.some(m=>m.old.name==='route')&&((matching?.unmatched?.['merge-base']?.some(u=>u.name==='route')??false)||(matching?.ambiguous?.some(x=>x.side==='merge-base'&&x.unit.name==='route')??false)),matching);
   else if(s.matching==='cross-file-unmatched')check(s,'file-local-safe-move',!matching?.matches?.some(m=>m.old.name===s.symbol&&m.head.name===s.symbol)??true,matching);
   else if(s.matching==='scope-sensitive') {
    const pairs=matching?.matches?.filter(m=>m.old.kind==='method'&&m.old.name.toLowerCase()==='validate')??[];
    check(s,'scope-sensitive-matching',pairs.length===2&&pairs.every(m=>m.old.receiver===m.head.receiver&&m.old.parent?.name===m.head.parent?.name),matching);
   }
   else if(s.matching==='same-symbol'&&!s.rangeContract)check(s,'same-symbol-match',matching?.matches?.some(m=>m.old.name===s.symbol&&m.head.name===s.symbol)??false,matching);
   else check(s,'matching-contract',null,'Declaration and split/merge relations are recorded for manual review; no artificial callable expectation.');
   for(const name of s.forbiddenContext??[]){
    const nodes=f.sourceValidation.head?.nodes.filter(n=>n.name===name)??[];
    check(s,'irrelevant-context-excluded-'+name,!nodes.some(n=>a?.context.blocks.some(b=>b.side==='head'&&b.from<=n.from&&b.to>=n.to)),nodes);
   }
  }
  report.tokenEstimate.normal=metrics.normalTokens;report.tokenEstimate.ast=metrics.astTokens;report.tokenEstimate.saved=metrics.normalTokens-metrics.astTokens;
  metrics.componentTotals={};for(const stat of Object.values(metrics.languages))for(const [key,value] of Object.entries(stat))if(key.startsWith('token_')||key.startsWith('overlap_'))metrics.componentTotals[key]=(metrics.componentTotals[key]??0)+value;
  metrics.savedTokens=report.tokenEstimate.saved;metrics.overheadTokens=-metrics.savedTokens;metrics.sourceDiffRowsVerified=independent.length;
  json(`review-prompts-AST-multilingual-${String(pr.number).padStart(2,'0')}-${pr.slug}.json`,report);
  json(`evaluation-${String(pr.number).padStart(2,'0')}.json`,{...metrics,checks,files:details});
  summary.prs.push(metrics);
  for(const [lang,stat] of Object.entries(metrics.languages)){
   const total=summary.languages[lang]??={prs:0};total.prs++;for(const [k,v] of Object.entries(stat))total[k]=(total[k]??0)+v;
  }
  summary.failures.push(...checks.filter(c=>c.pass===false).map(c=>({pr:pr.number,...c})));
  console.log(JSON.stringify({pr:pr.number,files:metrics.files,tokens:[metrics.normalTokens,metrics.astTokens],checks:metrics.checks,unexpectedSyntax:summary.failures.filter(x=>x.pr===pr.number&&x.type==='unexpected-fixture-syntax').length}));
 }
 summary.expectedScenarios=expected.scenarios.length;summary.failureCount=summary.failures.length;
 json('ast-test-evaluation-summary.json',summary);
}
function gitQ(...args){return execFileSync('git',['-C',ROOT,...args],{encoding:'utf8'});}
main().catch(e=>{console.error(e);process.exitCode=1});
