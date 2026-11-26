import json,pathlib,subprocess
out=pathlib.Path('/private/tmp/qommity-ast-multilingual-artifacts');repo='/private/tmp/qommity-multilingual-20261126'
prs=json.loads((out/'branches.json').read_text())
subprocess.run(['git','-C',repo,'push','--atomic','origin','main',*[p['branch'] for p in prs]],check=True)
notes={1:'Five existing 626–882 line domain modules; six sparse changed lines per language, spread across authorization, capture, retry, inventory, sessions, and circuit breaking. Zero-amount authorization and expiry equality are intentional regressions.',2:'Java, C#, Python: 100–150 line settlement routines with loops, nested state transitions, early returns and exception handling. The fee reservation guard intentionally stops accounting for the fee.',3:'Five languages: file/function renames, deletion, cross-file moves, unchanged relocation, extraction/merge, same-name scoped methods, and equally plausible successors that should remain unmatched.',4:'Five languages: actual edits inside language-specific generic, annotation, overload, record, async, closure, receiver, trait, macro, goroutine, channel, property, generator, context-manager and comprehension structures.',5:'Five related files per language: shared model, repository, interface, service, test; signatures, dependency construction, imports, type changes, and a helper moved between files. Dependency resolution is outside AST parsing scope.',6:'Five languages: isolated import-only, annotation/decorator-only (where supported), unchanged-body signature changes, fields/constants, Unicode strings, LF/CRLF, multiline declarations, first/last-line changes.',7:'Five large domain modules with diverse functions; nearby edits, several hunks in one function, sparse and complete function replacements, surrounding guards outside diff. Preserved as a future context-overlap regression fixture.',8:'Five languages: added/deleted/empty files, comment-only/whitespace-only changes, tiny and scoped functions, boundary edits. Recovery and Incomplete files are the only intentional invalid head sources; valid files must remain analyzable.'}
for p in prs:
    body=f'''## Purpose

{notes[p['number']]}

This is an AST evaluation fixture PR. Keep it unmerged: the regressions and recovery examples are intentional.

## Frozen comparison

- Base and merge-base: `{p['baseSha']}`
- Head: `{p['headSha']}`
- Review configuration: `null`; previous findings: empty; incremental carry: disabled.
- Existing Qommity normal/AST preview and deterministic `ceil(Unicode code points / 4)` estimation are used offline.
- Production parser, selection, matching, prompt generation, system prompt and optimization layers are unchanged.
- No model API is called by the evaluation harness. Automatic review settings are managed by the repository owner.

## Validation

Independent source-authored expected ranges and relationships are compared against verified Git blobs/diffs. Missing context, mismatches, fallback, parse issues and token overhead are retained in the reports.

The native validation workflow checks both frozen base and head across Python, Java, C#, Go and Rust. Syntax recovery fixtures are intentionally excluded from native compilation and checked by the AST evaluator. The workflow exercises compile validity, not whether intentional regressions are desirable.

Report: `review-prompts-AST-multilingual-{p['number']:02d}-{p['slug']}.json`. Final evaluation metrics and artifact links will be added after validation.
'''
    f=out/f'pr-{p["number"]:02d}.md';f.write_text(body)
    title=f'AST multilingual {p["number"]:02d}: {p["slug"]}'
    result=subprocess.check_output(['gh','pr','create','--repo','MuratOzte/Vocabulary-Practice-App','--base','main','--head',p['branch'],'--title',title,'--body-file',str(f),'--draft'],text=True).strip()
    p['url']=result
    (out/'branches.json').write_text(json.dumps(prs,indent=2)+'\n')
    print(result,flush=True)
