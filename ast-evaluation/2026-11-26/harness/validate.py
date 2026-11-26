"""Compile isolated fixtures with native toolchains; no Qommity or model APIs."""
import argparse, importlib.util, json, pathlib, shutil, subprocess, tempfile, sys, types
p=argparse.ArgumentParser();p.add_argument('language',choices=['python','java','csharp','go','rust']);p.add_argument('--root',default='ast-stress');args=p.parse_args()
root=pathlib.Path(args.root).resolve(); results=[]; count=0
with tempfile.TemporaryDirectory(prefix='ast-native-') as temp:
    temp=pathlib.Path(temp)
    def run(cmd,label):
        result=subprocess.run(cmd,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
        results.append({'fixture':label,'command':cmd,'returncode':result.returncode,'output':result.stdout})
    extension={'python':'py','java':'java','csharp':'cs','go':'go','rust':'rs'}[args.language]
    files=sorted(root.glob('*/'+args.language+'/*.'+extension))
    cross=root/'05-cross-file'/args.language
    if args.language=='python':
        for file in files:
            if file.stem in ('Recovery','Incomplete'):
                try:compile(file.read_bytes(),str(file),'exec')
                except SyntaxError:results.append({'fixture':str(file),'intentionalSyntaxError':True,'returncode':0});continue
                results.append({'fixture':str(file),'returncode':0,'validBaseRecoveryFixture':True});continue
            try:compile(file.read_bytes(),str(file),'exec');results.append({'fixture':str(file),'returncode':0})
            except SyntaxError as e:results.append({'fixture':str(file),'returncode':1,'output':str(e)})
        pkg=types.ModuleType('crossfixture');pkg.__path__=[str(cross)];sys.modules[pkg.__name__]=pkg
        spec=importlib.util.spec_from_file_location('crossfixture.service_test',cross/'service_test.py');mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod);mod.test_quote()
        # Business contracts are expected to expose controlled regressions on PR 1.
        ns={};exec((root/'01-sparse/python/Pipeline.py').read_text(),ns)
        contracts=[('authorize',[0,1000,0,1000,False],-2),('authenticate',[100,100,10,False],-4),('refund',[1000,100,300,False],1),('cache_lifetime',[100,50,90,100,20],10)]
        print(json.dumps({'businessContracts':[{'symbol':n,'input':a,'expectedBase':e,'actual':ns[n](*a),'regression':ns[n](*a)!=e} for n,a,e in contracts]}))
    else:
        for directory in sorted({f.parent for f in files}):
            grouped=directory==cross
            groups=[list(directory.glob('*.'+extension))] if grouped else [[f] for f in files if f.parent==directory and f.stem not in ('Recovery','Incomplete','EmptyAdded','Emptied')]
            if args.language=='rust' and grouped:groups=[[cross/'lib.rs']]
            for group in groups:
                count+=1;target=temp/str(count);target.mkdir();label=','.join(str(f.relative_to(root)) for f in group)
                if args.language=='java':cmd=['javac','-d',str(target),*[str(f) for f in group]]
                elif args.language=='csharp':
                    for f in group:shutil.copy(f,target/f.name)
                    (target/'Fixture.csproj').write_text('<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><TargetFramework>net8.0</TargetFramework><OutputType>Library</OutputType><EnableDefaultCompileItems>true</EnableDefaultCompileItems><NoWarn>CS8981;CS3021</NoWarn></PropertyGroup></Project>')
                    cmd=['dotnet','build',str(target/'Fixture.csproj'),'--nologo','-v','quiet']
                elif args.language=='rust':cmd=['rustc','--edition=2021','--test' if grouped else '--crate-type=lib',str(group[0]),'-o',str(target/'fixture')]
                else:cmd=['go','test',*[str(f) for f in group]]
                run(cmd,label)
                if args.language=='rust' and grouped and results[-1]['returncode']==0:run([str(target/'fixture')],label+' runtime')
    failed=[r for r in results if r['returncode']]
    print(json.dumps({'language':args.language,'checks':len(results),'failures':failed,'results':results},indent=2))
    sys.exit(bool(failed))
