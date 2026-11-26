# Additional structural changes inserted into the generator's authored fixture definitions.
# Cross-file moves stay within the existing five files per language.
MOVES={
 'python':('repository.py','service.py','\ndef normalize_currency(currency: str) -> str:\n    return currency.upper() if currency else "TRY"\n'),
 'java':('Repository.java','Service.java','\nclass CurrencyCode { static String normalize(String currency) { return currency.isEmpty() ? "TRY" : currency.toUpperCase(); } }\n'),
 'csharp':('Repository.cs','Service.cs','\nstatic class CurrencyCode { public static string Normalize(string currency) { return currency.Length == 0 ? "TRY" : currency.ToUpperInvariant(); } }\n'),
 'go':('repository.go','service.go','\nfunc NormalizeCurrency(currency string) string { if currency == "" { return "TRY" }; return currency }\n'),
 'rust':('repository.rs','lib.rs','\npub fn normalize_currency(currency: &str) -> &str { if currency.is_empty() { "TRY" } else { currency } }\n')}
for lang,(origin,destination,helper) in MOVES.items():
    src=f'ast-stress/05-cross-file/{lang}/{origin}';dst=f'ast-stress/05-cross-file/{lang}/{destination}'
    old=BASE[src];BASE[src]=old+helper
    # Adjust whole-file authored source range because the baseline now includes the helper.
    for case in CASES:
        if case['pr']==5 and case['path']==src:case['base']=rng(BASE[src],BASE[src])
    changes=dict(CHANGES[5]);a=changes[src];b=changes[dst];changes[dst]=b+helper
    CHANGES[5]=list(changes.items())
    expectation(5,lang,src,BASE[src],a,helper,None,'normalize_currency','function','cross-file-unmatched',changeType='function-move-out')
    expectation(5,lang,dst,BASE[dst],changes[dst],None,helper,'normalize_currency','function','cross-file-unmatched',changeType='function-move-in')
# Same names in distinct lexical scopes; one method moves, the other changes policy.
SCOPES={
'python':('class Wallet:\n    def validate(self, cents):\n        return cents > 0\n\nclass Gift:\n    def validate(self, cents):\n        return cents <= 1000\n','class Wallet:\n    def validate(self, cents):\n        return cents >= 0\n\nclass Gift:\n    def validate(self, cents):\n        return cents < 1000\n'),
'java':('class WalletScope { boolean validate(long cents) { return cents > 0; } }\nclass GiftScope { boolean validate(long cents) { return cents <= 1000; } }\n','class WalletScope { boolean validate(long cents) { return cents >= 0; } }\nclass GiftScope { boolean validate(long cents) { return cents < 1000; } }\n'),
'csharp':('class WalletScope { bool Validate(long cents) { return cents > 0; } }\nclass GiftScope { bool Validate(long cents) { return cents <= 1000; } }\n','class WalletScope { bool Validate(long cents) { return cents >= 0; } }\nclass GiftScope { bool Validate(long cents) { return cents < 1000; } }\n'),
'go':('package fixture\ntype WalletScope struct {}\ntype GiftScope struct {}\nfunc (w WalletScope) Validate(cents int64) bool { return cents > 0 }\nfunc (g GiftScope) Validate(cents int64) bool { return cents <= 1000 }\n','package fixture\ntype WalletScope struct {}\ntype GiftScope struct {}\nfunc (w WalletScope) Validate(cents int64) bool { return cents >= 0 }\nfunc (g GiftScope) Validate(cents int64) bool { return cents < 1000 }\n'),
'rust':('struct WalletScope;\nstruct GiftScope;\nimpl WalletScope { fn validate(&self, cents: i64) -> bool { cents > 0 } }\nimpl GiftScope { fn validate(&self, cents: i64) -> bool { cents <= 1000 } }\n','struct WalletScope;\nstruct GiftScope;\nimpl WalletScope { fn validate(&self, cents: i64) -> bool { cents >= 0 } }\nimpl GiftScope { fn validate(&self, cents: i64) -> bool { cents < 1000 } }\n')}
for lang,(old,new) in SCOPES.items():
    p=f'ast-stress/03-structure/{lang}/Scopes.{LANGS[lang]}';BASE[p]=old;CHANGES[3].append((p,new))
    expectation(3,lang,p,old,new,old,new,'WalletScope.validate / GiftScope.validate','method','scope-sensitive',changeType='same-name-distinct-scopes',rangeContract='contains-anchor')
SIGNATURE={
'python':('def identity(value: int) -> int:\n    return value\n','def identity(value: float) -> float:\n    return value\n'),
'java':('class Signature { long identity(int value) { return value; } }\n','class Signature { double identity(int value) { return value; } }\n'),
'csharp':('class Signature { long Identity(int value) { return value; } }\n','class Signature { double Identity(int value) { return value; } }\n'),
'go':('package fixture\nfunc Identity(value int64) int64 { return value }\n','package fixture\nfunc Identity(value int32) int32 { return value }\n'),
'rust':('pub fn identity(value: i64) -> i64 { value }\n','pub fn identity(value: i32) -> i32 { value }\n')}
for lang,(old,new) in SIGNATURE.items():
    p=f'ast-stress/06-boundaries/{lang}/Signature.{LANGS[lang]}';BASE[p]=old;CHANGES[6].append((p,new));expectation(6,lang,p,old,new,old,new,'identity','declaration','same-symbol',changeType='signature-only-unchanged-body',rangeContract='contains-anchor')
# Separate incomplete syntax in all five languages.
for lang in LANGS:
    tiny={'python':'def value():\n    return 1\n','java':'class Incomplete { int value() { return 1; } }\n','csharp':'class Incomplete { int Value() { return 1; } }\n','go':'package fixture\nfunc Value() int { return 1 }\n','rust':'pub fn value() -> i64 { 1 }\n'}[lang]
    broken=tiny[:tiny.rfind('}')] if lang!='python' else 'def value(\n'
    p=f'ast-stress/08-edges/{lang}/Incomplete.{LANGS[lang]}';BASE[p]=tiny;CHANGES[8].append((p,broken));expectation(8,lang,p,tiny,broken,tiny,broken,'incomplete','function','unmatched',changeType='incomplete-syntax',intentionalParseError=True,rangeContract='contains-anchor')
