# Source-only oracle refinement: never reads Qommity AST results.
import ast,json,pathlib,re,subprocess
out=pathlib.Path('/private/tmp/qommity-ast-multilingual-artifacts');repo='/private/tmp/qommity-multilingual-20261126'
manifest=json.loads((out/'ast-test-expected-results.json').read_text());prs={p['number']:p for p in json.loads((out/'branches.json').read_text())}
def source(ref,path):return subprocess.check_output(['git','-C',repo,'show',ref+':'+path]).decode()
def location(text,start,end):
    return {'from':text[:start].count('\n')+1,'to':text[:end].count('\n')+(0 if text[:end].endswith('\n') else 1),'startByte':len(text[:start].encode()),'endByte':len(text[:end].encode())}
def callable_range(text,name,lang):
    if lang=='python':
        nodes=[n for n in ast.walk(ast.parse(text)) if isinstance(n,(ast.FunctionDef,ast.AsyncFunctionDef)) and n.name==name]
        assert len(nodes)==1
        n=nodes[0];lines=text.splitlines(True);start=sum(map(len,lines[:n.lineno-1]))+n.col_offset;end=sum(map(len,lines[:n.end_lineno-1]))+n.end_col_offset
        return location(text,start,end)
    pattern={'java':r'(?:public |private |protected )?(?:static )?(?:long|String)\s+'+name+r'\s*\(', 'csharp':r'(?:public |private |protected )?(?:static )?(?:long|string)\s+'+name+r'\s*\(', 'go':r'func\s+'+name+r'\s*\(', 'rust':r'(?:pub )?fn\s+'+name+r'\s*\('}[lang]
    hits=list(re.finditer(pattern,text));assert len(hits)==1,(name,lang)
    start=hits[0].start();brace=text.index('{',hits[0].end());depth=1;end=brace+1
    while depth:
        if text[end]=='{':depth+=1
        if text[end]=='}':depth-=1
        end+=1
    return location(text,start,end)
for s in manifest['scenarios']:
    p=prs[s['pr']]
    if s['pr']==3 and s['symbol']=='capture':s['baseSymbol']='capture';s['headSymbol']='capture_payment'
    if s['pr']==3 and '/CachePolicy.' in s['path']:
        s['head']=callable_range(source(p['headSha'],s['path']),'cache_lifetime',s['language'])
    if s['pr']==5 and s['changeType'].startswith('function-move'):
        name={'java':'normalize','csharp':'Normalize','go':'NormalizeCurrency','python':'normalize_currency','rust':'normalize_currency'}[s['language']]
        s['symbol']=name;s['qualifiedName']=('CurrencyCode.' if s['language'] in ('java','csharp') else '')+name
        s['expectedNodeType']='method' if s['language'] in ('java','csharp') else 'function'
        for side,ref,path in [('base',p['baseSha'],s['oldPath']),('head',p['headSha'],s['path'])]:
            if s[side]:s[side]=callable_range(source(ref,path),name,s['language'])
    if s['pr']==8 and s['changeType']=='added':s['head']=location(source(p['headSha'],s['path']),0,len(source(p['headSha'],s['path'])))
    if s['matching']=='ambiguous-unmatched':s['acceptedMatchingStates']=['ambiguous-without-match','unmatched-without-match']
manifest['oracleNotes']=['Callable ranges exclude blank separators and wrapper classes/imports, derived from authored source only.','Renamed functions have separate base/head symbol identities.','Ambiguity is safe when no candidate is matched; ambiguous and unmatched are distinct serialization buckets.']
(out/'ast-test-expected-results.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n')
