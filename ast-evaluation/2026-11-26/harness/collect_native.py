import concurrent.futures,json,pathlib,subprocess,time
out=pathlib.Path('/private/tmp/qommity-ast-multilingual-artifacts');prs=json.loads((out/'branches.json').read_text());repo='MuratOzte/Vocabulary-Practice-App'
runs=json.loads(subprocess.check_output(['gh','run','list','--repo',repo,'--workflow','ast-fixtures.yml','--limit','30','--json','databaseId,headBranch,headSha,status,conclusion,url'],text=True))
def collect(p):
    matches=[r for r in runs if r['headSha']==p['headSha'] and r['status']=='completed'];assert matches,p
    r=matches[0];assert r['conclusion']=='success',r
    folder=out/'native-ci'/f'{p["number"]:02d}'
    if folder.exists():
        old=folder/'run.json'
        if not old.exists() or json.loads(old.read_text()).get('headSha')!=p['headSha']:
            import shutil;shutil.rmtree(folder)
    folder.mkdir(parents=True,exist_ok=True)
    if (folder/'run.json').exists():
        jobs=json.loads((folder/'run.json').read_text())
        return {'pr':p['number'],'url':r['url'],'runId':r['databaseId'],'headSha':p['headSha'],'baseSha':p['baseSha'],'status':r['status'],'conclusion':r['conclusion'],'jobs':[{'name':j['name'],'conclusion':j['conclusion'],'url':j['url']} for j in jobs['jobs']]}
    for attempt in range(3):
        result=subprocess.run(['gh','run','download',str(r['databaseId']),'--repo',repo,'-D',str(folder)],capture_output=True,text=True)
        if result.returncode==0:break
        if attempt==2:raise RuntimeError(result.stderr)
    jobs=json.loads(subprocess.check_output(['gh','run','view',str(r['databaseId']),'--repo',repo,'--json','status,conclusion,jobs'],text=True))
    (folder/'run.json').write_text(json.dumps({**r,**jobs},indent=2)+'\n')
    return {'pr':p['number'],'url':r['url'],'runId':r['databaseId'],'headSha':p['headSha'],'baseSha':p['baseSha'],'status':r['status'],'conclusion':r['conclusion'],'jobs':[{'name':j['name'],'conclusion':j['conclusion'],'url':j['url']} for j in jobs['jobs']]}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:results=sorted(pool.map(collect,prs),key=lambda x:x['pr'])
(out/'native-ci-summary.json').write_text(json.dumps({'runs':results,'successfulJobs':sum(len(r['jobs']) for r in results),'allPassed':all(j['conclusion']=='success' for r in results for j in r['jobs'])},indent=2)+'\n')
print(json.dumps({'runs':len(results),'successfulJobs':sum(len(r['jobs']) for r in results)}))
