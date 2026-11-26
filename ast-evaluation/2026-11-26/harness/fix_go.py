import json,pathlib,re,subprocess
out=pathlib.Path('/private/tmp/qommity-ast-multilingual-artifacts');repo=pathlib.Path('/private/tmp/qommity-multilingual-20261126');prs=json.loads((out/'branches.json').read_text());manifest=json.loads((out/'ast-test-expected-results.json').read_text())
def git(*a):return subprocess.check_output(['git','-C',str(repo),'-c','commit.gpgsign=false',*a],text=True).strip()
def fix():
 for f in (repo/'ast-stress').glob('*/go/*.go'):
  if f.parent.parent.name not in ('01-sparse','03-structure','07-dense'):continue
  s=f.read_text();s=re.sub(r'(?m)^(\s*)([a-z_]+) := ',r'\1var \2 int64 = ',s)
  f.write_text(s)
git('checkout','-q','main');fix();git('add','ast-stress');
if git('status','--porcelain','--','ast-stress'):git('commit','-qm','test(ast): explicitly type Go integer accumulators in fixture baseline')
base=git('rev-parse','HEAD')
oldprs={p['number']:dict(p) for p in prs}
for p in prs:
 git('checkout','-q',p['branch']);fix();git('add','ast-stress')
 if git('status','--porcelain','--','ast-stress'):git('commit','-qm','test(ast): use int64 accumulators in Go fixtures')
 git('merge','-X','ours','--no-edit','main');p['baseSha']=base;p['headSha']=git('rev-parse','HEAD')
# Recompute UTF-8 offsets from the original source positions, preserving source-authored line extents.
for s in manifest['scenarios']:
 p=next(p for p in prs if p['number']==s['pr']);oldp=oldprs[s['pr']]
 for side,key,path in [('base','baseSha',s['oldPath']),('head','headSha',s['path'])]:
  r=s[side]
  if not r:continue
  old=subprocess.check_output(['git','-C',str(repo),'show',oldp[key]+':'+path]);new=subprocess.check_output(['git','-C',str(repo),'show',p[key]+':'+path])
  lines=new.split(b'\n')
  for field in ['startByte','endByte']:
   before=old[:r[field]];line=before.count(b'\n');column=len(before.rsplit(b'\n',1)[-1]);r[field]=sum(len(x)+1 for x in lines[:line])+column
manifest['baseSha']=base
(out/'branches.json').write_text(json.dumps(prs,indent=2)+'\n');(out/'ast-test-expected-results.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n');git('checkout','-q','main')
# Preserve this correction in the fixture generator too.
f=out/'harness/generate.py';s=f.read_text().replace("'go':''", "'go':'var '").replace("name+(' := ' if new and lang=='go' else ' = ')","name+(' int64 = ' if new and lang=='go' else ' = ')");f.write_text(s)
print(json.dumps({'newBase':base,'heads':{p['number']:p['headSha'] for p in prs}},indent=2))
