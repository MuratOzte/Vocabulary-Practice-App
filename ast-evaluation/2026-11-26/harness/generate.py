import ast, json, os, pathlib, subprocess, hashlib, textwrap
from business import SOURCE
OUT=pathlib.Path('/private/tmp/qommity-ast-multilingual-artifacts')
REPO=pathlib.Path('/private/tmp/qommity-multilingual-20261126')
LANGS={'python':'py','java':'java','csharp':'cs','go':'go','rust':'rs'}
SLUGS=['sparse-large-files','complex-control-flow','structural-matching','language-specific-structures','cross-file-changes','declaration-boundaries','dense-context-overlap','edge-cases-fallback']
CASES=[]
def git(*args):
    return subprocess.check_output(['git','-C',str(REPO),'-c','commit.gpgsign=false',*args],text=True).strip()
def commit(title):
    git('add','ast-stress','.github/workflows/ast-fixtures.yml'); git('commit','-qm',title); return git('rev-parse','HEAD')
def write(p,s):
    f=REPO/p; f.parent.mkdir(parents=True,exist_ok=True); f.write_bytes(s.encode())
def expr(n,lang):
    if isinstance(n,ast.Constant): return str(n.value).lower() if isinstance(n.value,bool) else str(n.value)
    if isinstance(n,ast.Name): return n.id
    if isinstance(n,ast.UnaryOp): return '('+('!' if isinstance(n.op,ast.Not) else '-')+expr(n.operand,lang)+')'
    if isinstance(n,ast.BinOp):
        op={ast.Add:'+',ast.Sub:'-',ast.Mult:'*',ast.FloorDiv:'/',ast.Mod:'%'}[type(n.op)]
        return '('+expr(n.left,lang)+' '+op+' '+expr(n.right,lang)+')'
    if isinstance(n,ast.BoolOp): return '('+(' && ' if isinstance(n.op,ast.And) else ' || ').join(expr(x,lang) for x in n.values)+')'
    if isinstance(n,ast.Compare):
        ops={ast.Eq:'==',ast.NotEq:'!=',ast.Lt:'<',ast.LtE:'<=',ast.Gt:'>',ast.GtE:'>='}
        return '('+expr(n.left,lang)+' '+ops[type(n.ops[0])]+' '+expr(n.comparators[0],lang)+')'
    if isinstance(n,ast.Subscript):
        index=expr(n.slice,lang)
        if lang in ('java','csharp'): index='(int)('+index+')'
        if lang=='rust': index='('+index+') as usize'
        return expr(n.value,lang)+'['+index+']'
    if isinstance(n,ast.Call):
        name=n.func.id; args=[expr(x,lang) for x in n.args]
        if name=='len':
            a=args[0]
            return {'java':a+'.length','csharp':a+'.Length','go':'int64(len('+a+'))','rust':'('+a+'.len() as i64)'}[lang]
        if lang=='rust':
            if name=='abs': return '('+args[0]+').abs()'
            return '('+args[0]+').'+name+'('+args[1]+')'
        if lang=='go': return name+'64('+', '.join(args)+')'
        return ('Math.' if lang=='java' else 'System.Math.')+{'min':'Min','max':'Max','abs':'Abs'}[name].lower().capitalize().replace('Min','min' if lang=='java' else 'Min').replace('Max','max' if lang=='java' else 'Max').replace('Abs','abs' if lang=='java' else 'Abs')+'('+', '.join(args)+')'
    raise ValueError(ast.dump(n))
def render_fn(fn,lang):
    if lang=='python': return ast.get_source_segment(SOURCE,fn)+'\n'
    known={a.arg for a in fn.args.args}
    def typ(a):
        arr=isinstance(a.annotation,ast.Subscript); boolean=isinstance(a.annotation,ast.Name) and a.annotation.id=='bool'
        return {'java': 'long[]' if arr else 'boolean' if boolean else 'long','csharp':'long[]' if arr else 'bool' if boolean else 'long','go':'[]int64' if arr else 'bool' if boolean else 'int64','rust':'&[i64]' if arr else 'bool' if boolean else 'i64'}[lang]
    params=', '.join((a.arg+' '+typ(a) if lang=='go' else 'mut '+a.arg+': '+typ(a) if lang=='rust' else typ(a)+' '+a.arg) for a in fn.args.args)
    header={'java':'static long '+fn.name+'('+params+') {','csharp':'public static long '+fn.name+'('+params+') {','go':'func '+fn.name+'('+params+') int64 {','rust':'pub fn '+fn.name+'('+params+') -> i64 {'}[lang]
    lines=[header]
    def body(stmts,depth):
        pad='    '*depth
        for n in stmts:
            if isinstance(n,ast.Return): lines.append(pad+'return '+expr(n.value,lang)+(';' if lang!='go' else ''))
            elif isinstance(n,(ast.Break,ast.Continue)): lines.append(pad+('break' if isinstance(n,ast.Break) else 'continue')+(';' if lang!='go' else ''))
            elif isinstance(n,ast.Assign):
                name=n.targets[0].id; new=name not in known; known.add(name)
                declaration={'java':'long ','csharp':'long ','go':'var ','rust':'let mut '}[lang] if new else ''
                if new and lang=='rust': declaration+=''+name+': i64 = '; left=''
                else: left=name+(' int64 = ' if new and lang=='go' else ' = ')
                lines.append(pad+declaration+left+expr(n.value,lang)+(';' if lang!='go' else ''))
            elif isinstance(n,ast.AugAssign):
                op={ast.Add:'+=',ast.Sub:'-=',ast.Mult:'*='}[type(n.op)]
                lines.append(pad+n.target.id+' '+op+' '+expr(n.value,lang)+(';' if lang!='go' else ''))
            elif isinstance(n,(ast.If,ast.While)):
                keyword='if' if isinstance(n,ast.If) else 'for' if lang=='go' else 'while'
                scope=set(known)
                condition=expr(n.test,lang)
                if lang in ('java','csharp'): condition='('+condition+')'
                lines.append(pad+keyword+' '+condition+' {'); body(n.body,depth+1); lines.append(pad+'}')
                known.intersection_update(scope)
                if n.orelse: lines.append(pad+'else {'); body(n.orelse,depth+1); lines.append(pad+'}')
            elif isinstance(n,ast.For):
                name=n.target.id; limit=expr(n.iter.args[0],lang)
                header={'java':f'for (long {name} = 0; {name} < {limit}; {name}++) {{','csharp':f'for (long {name} = 0; {name} < {limit}; {name}++) {{','go':f'for {name} := int64(0); {name} < {limit}; {name}++ {{','rust':f'for {name} in 0..{limit} {{'}[lang]
                scope=set(known)
                lines.append(pad+header); body(n.body,depth+1); lines.append(pad+'}')
                known.intersection_update(scope)
            else: raise ValueError(ast.dump(n))
    body(fn.body,1); lines.append('}')
    return '\n'.join(lines)+'\n'
TREE=ast.parse(SOURCE)
def module(lang,fns=None):
    contents='\n'.join(render_fn(f,lang) for f in (fns or TREE.body))
    if lang=='java': return 'class Pipeline {\n'+textwrap.indent(contents,'    ')+'}\n'
    if lang=='csharp': return 'static class Pipeline {\n'+textwrap.indent(contents,'    ')+'}\n'
    if lang=='go': return 'package fixture\n\nfunc min64(a, b int64) int64 { if a < b { return a }; return b }\nfunc max64(a, b int64) int64 { if a > b { return a }; return b }\nfunc abs64(a int64) int64 { if a < 0 { return -a }; return a }\n\n'+contents
    return contents

def rng(src,fragment):
    assert src.count(fragment)==1,(fragment,src.count(fragment))
    start=src.index(fragment); before=src[:start]
    return {'from':before.count('\n')+1,'to':(before+fragment).count('\n')+(0 if fragment.endswith('\n') else 1),'startByte':len(before.encode()),'endByte':len((before+fragment).encode())}
def expectation(pr,lang,path,old,new,oldfrag,newfrag,symbol,kind='function',relationship='same-symbol',**extra):
    CASES.append({'pr':pr,'language':lang,'path':path,'oldPath':extra.pop('oldPath',path),'changeType':extra.pop('changeType','behavior-change'),'expectedNodeType':kind,'symbol':symbol,'base':rng(old,oldfrag) if oldfrag else None,'head':rng(new,newfrag) if newfrag else None,'matching':relationship,**extra})

def change(pr,lang,path,old,new,symbol,oldfrag=None,newfrag=None,**extra):
    assert old!=new
    expectation(pr,lang,path,old,new,oldfrag,newfrag,symbol,kind='method' if lang in ('java','csharp') else 'function',**extra)
    return (path,new)

# All base fixtures are added together to main: every PR is a small independent delta.
BASE={}; CHANGES={i:[] for i in range(1,9)}
for lang,ext in LANGS.items():
    p=f'ast-stress/01-sparse/{lang}/Pipeline.{ext}'; old=module(lang); BASE[p]=old
    mods={'amount <= 0':'amount < 0','requested > remaining':'requested >= remaining','delay *= 2':'delay *= 3','after == 0':'after <= 0','now >= expires':'now > expires','failures < 5':'failures < 4'}
    # Use authored Python expressions translated exactly into each target language.
    new=old
    for a,b in mods.items():
        if lang=='python': aa,bb=a,b
        elif '*=' in a: aa,bb=a,b
        else: aa,bb=expr(ast.parse(a,mode='eval').body,lang),expr(ast.parse(b,mode='eval').body,lang)
        assert aa in new,(lang,aa)
        new=new.replace(aa,bb,1)
    for symbol in ('authorize','capture','retry_delay','reserve_stock','authenticate','circuit_state'):
        fn=next(f for f in TREE.body if f.name==symbol)
        oldfn=render_fn(fn,lang)
        if lang in ('java','csharp'): oldfn=textwrap.indent(oldfn,'    ')
        start=old.index(oldfn); end=start+len(oldfn)
        # Each change has the same line extent; derive new function by line positions.
        fromline=old[:start].count('\n'); count=oldfn.count('\n')
        newfn='\n'.join(new.split('\n')[fromline:fromline+count])+'\n'
        expectation(1,lang,p,old,new,oldfn,newfn,symbol,'method' if lang in ('java','csharp') else 'function',
          importantContext=['initial guard and limit initialization in '+symbol],forbiddenContext=['retention_cutoff','health_score'],controlledRegression='Boundary or policy changed; e.g. zero authorization and expiry equality now accepted.' if symbol in ('authorize','authenticate') else None)
    CHANGES[1].append((p,new))
    # Dense changes reuse the domain, changing independent policies across distinct functions.
    p=f'ast-stress/07-dense/{lang}/Pipeline.{ext}'; BASE[p]=old
    new=old
    dense=[('daily_used < 0','daily_used <= 0'),('remaining < amount','remaining <= amount'),('reserved < 100','reserved < 200'),('total == authorized','total >= authorized'),('requested <= 0','requested < 0'),('fee_bps > 10000','fee_bps > 9000'),('ages[i] > max_age','ages[i] >= max_age'),('delay >= cap // 2','delay > cap // 2'),('attempt >= maximum','attempt > maximum'),('stock[i] <= 0','stock[i] < 0'),('delta > tolerance','delta >= tolerance'),('hours <= 1','hours <= 2'),('now >= expires','now > expires'),('age < window','age <= window'),('role < 2','role < 1'),('idle_age >= idle','idle_age > idle'),('size > capacity // 4','size > capacity // 2'),('attempts > 2','attempts > 3'),('failures < 5','failures < 3'),('latencies[i] > 500','latencies[i] > 800')]
    for a,b in dense:
        aa,bb=(a,b) if lang=='python' else (expr(ast.parse(a,mode='eval').body,lang),expr(ast.parse(b,mode='eval').body,lang))
        assert aa in new,(lang,aa);new=new.replace(aa,bb,1)
    # Full body replacement with materially different control flow.
    fn=next(f for f in TREE.body if f.name=='circuit_state'); before=render_fn(fn,lang)
    replacement=ast.parse('def circuit_state(failures: int, successes: int, elapsed: int, cooldown: int, probes: int) -> int:\n    if successes >= probes and probes > 0:\n        return 0\n    if elapsed >= cooldown:\n        return 2\n    return 1\n').body[0]
    if lang=='python': after=ast.unparse(replacement)+'\n'
    else: after=render_fn(replacement,lang)
    # Existing policy replacement above also touched this function.
    touched=before.replace('failures < 5','failures < 3').replace('(failures < 5)','(failures < 3)')
    if lang in ('java','csharp'): touched=textwrap.indent(touched,'    ');after=textwrap.indent(after,'    ')
    new=new.replace(touched,after)
    for name in ('authorize','circuit_state','cache_admission','authenticate'):
        f=next(f for f in TREE.body if f.name==name); frag=render_fn(f,lang)
        if lang in ('java','csharp'): frag=textwrap.indent(frag,'    ')
        # ranges independently from authored function boundaries, including changed full body.
        if name=='circuit_state': newfrag=after
        else:
            start=old[:old.index(frag)].count('\n'); n=frag.count('\n');newfrag='\n'.join(new.split('\n')[start:start+n])+'\n'
        expectation(7,lang,p,old,new,frag,newfrag,name,'method' if lang in ('java','csharp') else 'function',importantContext=['authorize initial guard'],overlapFixture=True)
    CHANGES[7].append((p,new))

# Complex control flow: 111-line settlement engine, explicit state and exception handling.
COMPLEX='''\
def settle(events: list[int], budget: int, retry_limit: int) -> int:
    if budget <= 0:
        return -1
    if retry_limit < 0:
        return -2
    remaining = budget
    settled = 0
    pending = 0
    failed = 0
    retries = 0
    state = 0
    for i in range(len(events)):
        amount = events[i]
        if amount == 0:
            if state == 2:
                state = 0
            continue
        if amount < 0:
            reversal = -amount
            if reversal > settled:
                failed += 1
                if failed > retry_limit:
                    return -3
                continue
            settled -= reversal
            remaining += reversal
            state = 3
            if pending > 0:
                pending = max(0, pending - reversal)
            continue
        if state == 4:
            if retries >= retry_limit:
                break
            retries += 1
            state = 0
        if amount > remaining:
            pending += amount
            if pending > budget:
                failed += 1
                state = 4
                if failed > retry_limit:
                    break
            else:
                state = 2
            continue
        if state == 3:
            if amount > budget // 2:
                pending += amount
                state = 2
                continue
            state = 0
        if amount > 10000:
            fee = amount // 100
            if remaining < amount + fee:
                pending += amount
                state = 2
                continue
            remaining -= fee
        if remaining < amount:
            return -4
        remaining -= amount
        settled += amount
        state = 1
        if pending > 0:
            recovered = min(pending, remaining)
            if recovered > 0:
                remaining -= recovered
                settled += recovered
                pending -= recovered
                state = 1
            if pending == 0:
                retries = 0
        if remaining == 0:
            if pending > 0:
                state = 2
            break
    if state == 4:
        if settled == 0:
            return -5
        if retries < retry_limit:
            state = 2
    if pending > 0:
        if remaining > 0:
            recovered = min(pending, remaining)
            settled += recovered
            remaining -= recovered
            pending -= recovered
        if pending > 0:
            return -pending
    if settled > budget:
        return -6
    if remaining < 0:
        return -7
    if failed > 0:
        if settled == 0:
            return -8
    if state == 3:
        if settled == 0:
            return 0
    if retries > retry_limit:
        return -9
    return settled
'''
for lang in ('java','csharp','python'):
    ext=LANGS[lang]; p=f'ast-stress/02-complex/{lang}/Settlement.{ext}'
    fn=ast.parse(COMPLEX).body[0]
    if lang=='python':
        first,rest=COMPLEX.split('\n',1)
        body=first+'\n    try:\n'+textwrap.indent(rest,'    ')+'    except (TypeError, OverflowError):\n        return -99\n'
        # Exception handling in a wrapper remains outside the changed function.
        body+='\ndef settle_safely(events, budget, retry_limit):\n    try:\n        return settle(events, budget, retry_limit)\n    except (TypeError, OverflowError):\n        return -99\n'
        old=body;new=old.replace('if remaining < amount + fee:', 'if remaining < amount:')
        ofrag=body[:body.index('\ndef settle_safely')]; nfrag=ofrag.replace('if remaining < amount + fee:', 'if remaining < amount:')
    else:
        body=render_fn(fn,lang)
        # Keep exception handling inside the complex callable itself.
        begin=body.index('\n');body=body[:begin+1]+'    try {\n'+textwrap.indent(body[begin+1:body.rfind('}')],'    ')+'    } catch ('+('ArithmeticException' if lang=='java' else 'System.ArithmeticException')+' ex) {\n        return -99;\n    }\n}\n'
        old='class Settlement {\n'+textwrap.indent(body,'    ')+'}\n'
        a=expr(ast.parse('remaining < amount + fee',mode='eval').body,lang);b=expr(ast.parse('remaining < amount',mode='eval').body,lang)
        new=old.replace(a,b);ofrag=textwrap.indent(body,'    ');nfrag=ofrag.replace(a,b)
    BASE[p]=old;CHANGES[2].append((p,new))
    expectation(2,lang,p,old,new,ofrag,nfrag,'settle','function' if lang=='python' else 'method',importantContext=['remaining = budget','fee calculation','initial budget guard'],controlledRegression='Fee reservation guard ignores the fee; amount fits but fee can consume required budget.')

# Structural changes, one coherent module per language plus cross-module moves.
for lang,ext in LANGS.items():
    chosen=[f for f in TREE.body if f.name in ('capture','refund','retry_delay','permission','quota_remaining','cache_lifetime')]
    old=module(lang,chosen)
    new=old.replace('capture(', 'capture_payment(',1)
    deleted=render_fn(next(f for f in chosen if f.name=='refund'),lang)
    moved=render_fn(next(f for f in chosen if f.name=='cache_lifetime'),lang)
    if lang in ('java','csharp'): deleted=textwrap.indent(deleted,'    '); moved=textwrap.indent(moved,'    ')
    new=new.replace(deleted,'').replace(moved,'')
    # Move an unchanged function within the same file.
    retry=render_fn(next(f for f in chosen if f.name=='retry_delay'),lang)
    if lang in ('java','csharp'): retry=textwrap.indent(retry,'    ')
    new=new.replace(retry,'')
    pos=new.rfind('}') if lang in ('java','csharp') else len(new)
    new=new[:pos]+retry+new[pos:]
    p=f'ast-stress/03-structure/{lang}/Before.{ext}'; newp=f'ast-stress/03-structure/{lang}/Operations.{ext}'
    BASE[p]=old;CHANGES[3]+=[(p,None),(newp,new)]
    for symbol,fragment,headfrag,relation in [('capture',render_fn(chosen[0],lang),None,'renamed'),('refund',None,None,'deleted'),('retry_delay',retry,retry,'moved-within-file'),('cache_lifetime',moved,None,'cross-file-unmatched')]:
        if symbol=='capture':
            fragment=render_fn(next(f for f in chosen if f.name==symbol),lang)
            if lang in ('java','csharp'): fragment=textwrap.indent(fragment,'    ')
            headfrag=fragment.replace('capture(', 'capture_payment(',1)
        if symbol=='refund': fragment=deleted
        expectation(3,lang,newp,old,new,fragment,headfrag,symbol,'method' if lang in ('java','csharp') else 'function',relation,oldPath=p,changeType='rename-move-delete')
    dest=f'ast-stress/03-structure/{lang}/CachePolicy.{ext}'
    source=module(lang,[next(f for f in chosen if f.name=='cache_lifetime')])
    if lang in ('java','csharp'): source=source.replace('class Pipeline','class CachePolicy')
    CHANGES[3].append((dest,source))
    expectation(3,lang,dest,'',source,None,source,'cache_lifetime','method' if lang in ('java','csharp') else 'function','cross-file-unmatched',changeType='cross-file-move')

# Files added below are authored language-specific fixtures and independent expectations.
exec((OUT/'harness/specialized.py').read_text())

exec((OUT/'harness/enhance.py').read_text())

for p,s in BASE.items(): write(p,s)
write('ast-stress/README.md', '''# Multilingual AST evaluation fixtures\n\nThese isolated fixtures do not participate in the vocabulary application runtime.\nThey model payment, inventory, authentication, jobs, caching, and event processing.\nThe eight test branches are independent changes against this baseline.\nControlled regressions and syntax recovery examples are intentional.\nNo model invocation is required to build review prompts.\n''')
write('ast-stress/validate.py',(OUT/'harness/validate.py').read_text())
write('.github/workflows/ast-fixtures.yml',(OUT/'harness/ast-fixtures.yml').read_text())
base=commit('test(ast): add realistic multilingual baseline for eight independent evaluations')
prs=[]
for number,slug in enumerate(SLUGS,1):
    branch=f'test/ast-multilingual-{number:02d}-{slug}'
    git('checkout','-qb',branch,base)
    for p,s in CHANGES[number]:
        if s is None: (REPO/p).unlink()
        else: write(p,s)
    head=commit(f'test(ast): {number:02d} {slug}')
    prs.append({'number':number,'slug':slug,'branch':branch,'baseSha':base,'headSha':head,'files':len(CHANGES[number])})
    git('checkout','-q','main')
(OUT/'branches.json').write_text(json.dumps(prs,indent=2)+'\n')
(OUT/'ast-test-expected-results.json').write_text(json.dumps({'schema':1,'method':'Authored source fragments and scenario intent; no AST output used to build these expectations. Ranges use physical lines and UTF-8 byte offsets.','baseSha':base,'scenarios':CASES},indent=2,ensure_ascii=False)+'\n')
print(json.dumps({'baseline':base,'prs':prs,'expected':len(CASES),'sparseSizes':{lang:len(BASE[f'ast-stress/01-sparse/{lang}/Pipeline.{ext}'].splitlines()) for lang,ext in LANGS.items()}},indent=2))
