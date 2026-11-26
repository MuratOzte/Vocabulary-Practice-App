import json,pathlib,re,subprocess
out=pathlib.Path('/private/tmp/qommity-ast-multilingual-artifacts');prs=json.loads((out/'branches.json').read_text());summary=json.loads((out/'ast-test-evaluation-summary.json').read_text());native=json.loads((out/'native-ci-summary.json').read_text())
root='https://github.com/MuratOzte/Vocabulary-Practice-App';branch='test/ast-multilingual-results-20261126';directory=f'{root}/tree/{branch}/ast-evaluation/2026-11-26';blob=f'{root}/blob/{branch}/ast-evaluation/2026-11-26'
for p,m,n in zip(prs,summary['prs'],native['runs']):
 assert p['headSha']==n['headSha']
 body=(out/f'pr-{p["number"]:02d}.md').read_text()
 body=re.sub(r'Base and merge-base: `[^`]+`',f'Base and merge-base: `{p["baseSha"]}`',body)
 body=re.sub(r'Head: `[^`]+`',f'Head: `{p["headSha"]}`',body)
 body=body[:body.index('\nReport:')]
 body+=f'''
## Final results

- Native checks: **5/5 language jobs passed** for frozen base and final head. [CI evidence]({n['url']}). Intentionally invalid Recovery/Incomplete sources are checked for AST fallback, excluded from native compilation.
- Independent AST checks: **{m['checks']['passed']} passed**, **{m['checks']['failed']} unmet**, **{m['checks']['notScored']} matching relations not automatically scored. All evidence is retained; unmet checks are not a count of distinct bugs.
- Normal estimated tokens: **{m['normalTokens']:,}**; AST: **{m['astTokens']:,}**; saved (+) / overhead (−): **{m['savedTokens']:+,}**.
- No unexpected fixture parse errors. Production Qommity implementation unchanged. Offline model calls: **0**.
- Across all eight PRs: 17 deterministic artifacts reproduced byte-for-byte; all source context blocks and expected UTF-8 ranges verified against pinned Git objects.

[Full prompt JSON]({blob}/review-prompts-AST-multilingual-{p['number']:02d}-{p['slug']}.json) · [Per-file evaluation]({blob}/evaluation-{p['number']:02d}.json) · [Expected-results manifest]({blob}/ast-test-expected-results.json) · [Aggregate report and limitations]({directory})

The report includes missing base context, parent-node selections, unmatched/ambiguous nodes, omitted and duplicate context, fallback and token overhead. Existing Qommity test suite: 117 passed, 0 failed, 6 historical-fixture tests skipped because archive environment inputs were absent.
'''
 (out/f'pr-{p["number"]:02d}.md').write_text(body)
 subprocess.run(['gh','pr','edit',p['url'],'--body-file',str(out/f'pr-{p["number"]:02d}.md')],check=True,stdout=subprocess.DEVNULL)
 print('Updated '+p['url'],flush=True)
