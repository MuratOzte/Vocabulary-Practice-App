# Çok dilli AST değerlendirmesi — 26 Kasım 2026

Sekiz taslak PR, beş dil, 248 bağımsız senaryo tanımı. Ortak main/merge-base: `76c20e12e310d423e2b058b8d628f3500e8b11e2`. PR’lar kasıtlı regression ve syntax recovery kaynakları içerir; birleştirilmemelidir.

Qommity commit: `b6827a1f5324e3e5d637d6a5c02c868de24e4a3b`. Üretim parser, context selection, matching, prompt generation ve system prompt değişmedi. Ana Qommity çalışma ağacı temiz. Offline harness model çağrısı: **0**; ağ istekleri harness içinde engellenmiştir. Depo sahibinin API tarafında kapattığı otomatik review ayarına bu çalışma dokunmadı.

Native kontroller: **40/40 job başarılı** (8 PR × 5 dil); her job hem frozen base hem head kaynaklarını kontrol etti. Python/Go/Rust cross-file davranış testleri de çalıştı. Java/C# cross-file test kaynakları derlendi; test framework’ü ile çalıştırılmadı. Bilerek hatalı Recovery/Incomplete kaynakları native derlemeye alınmadı; AST safe fallback ayrı doğrulandı.

Bağımsız AST oracle: **1291 kontrol geçti, 118 kontrol beklentiyi karşılamadı**. Ayrıca 130 declaration/split/merge matching ilişkisi otomatik puanlanmadı; kaynak, aralık ve diff coverage kontrolleri bunlardan ayrı çalıştı. Bu sayılar ayrı bug sayıları değildir; aynı bağlam eksikliği birden fazla kontrolde görülebilir. 13 coverage uyuşmazlığı yalnızca boş satırların seçilmemesine aittir; ham başarısız kontroller saklandı.

İki bağımsız tekrarda **17 çıktı bayt düzeyinde aynı** kaldı. 254 prompt mesajı, 363 kaynak bloğu ve 441 oracle source range doğrulandı. Beklenmeyen fixture parse recovery: **0**; PR 8’de 10 kasıtlı hatalı head kaynağı standard fallback’e düştü.

| Senaryo | PR | Normal token | AST token | Tasarruf (+) / ek yük (−) | Karşılanmayan kontroller |
|---|---|---:|---:|---:|---:|
| 01 sparse-large-files | [#35](https://github.com/MuratOzte/Vocabulary-Practice-App/pull/35) | 54,746 | 35,074 | +19,672 | 30 |
| 02 complex-control-flow | [#36](https://github.com/MuratOzte/Vocabulary-Practice-App/pull/36) | 16,719 | 16,595 | +124 | 3 |
| 03 structural-matching | [#37](https://github.com/MuratOzte/Vocabulary-Practice-App/pull/37) | 249,529 | 253,555 | -4,026 | 10 |
| 04 language-specific-structures | [#38](https://github.com/MuratOzte/Vocabulary-Practice-App/pull/38) | 31,377 | 31,963 | -586 | 16 |
| 05 cross-file-changes | [#39](https://github.com/MuratOzte/Vocabulary-Practice-App/pull/39) | 159,830 | 160,433 | -603 | 17 |
| 06 declaration-boundaries | [#40](https://github.com/MuratOzte/Vocabulary-Practice-App/pull/40) | 103,040 | 103,530 | -490 | 9 |
| 07 dense-context-overlap | [#41](https://github.com/MuratOzte/Vocabulary-Practice-App/pull/41) | 77,447 | 61,688 | +15,759 | 15 |
| 08 edge-cases-fallback | [#42](https://github.com/MuratOzte/Vocabulary-Practice-App/pull/42) | 240,804 | 239,973 | +831 | 18 |

Toplam: normal **933,492**, AST **902,811** tahmini token; fark **+30,681** (%3.29). Her dosya için system prompt yeniden sayılır. Bu deterministic bir tahmindir; provider token kullanımını veya LLM bulgu kalitesini ölçmez.

| Dil | PR sayısı | Değişen dosya | Normal token | AST token |
|---|---:|---:|---:|---:|
| csharp | 8 | 28 | 188,420 | 184,713 |
| go | 7 | 26 | 181,658 | 173,418 |
| java | 8 | 28 | 187,734 | 183,985 |
| python | 8 | 28 | 189,465 | 183,066 |
| rust | 7 | 27 | 186,215 | 177,629 |

## Kaydedilen gözlemler

- Sparse ve dense değişikliklerde AST bağlamı token azaltıyor; structural, language-feature, cross-file ve declaration senaryolarında ek yük üretiyor.
- Eski sürüm bağlamı güncel sürümden daha az gösteriliyor. Sadece head gövdesinin seçilmesi, eski tam fonksiyonu bekleyen oracle kontrollerini karşılamıyor. Diff içindeki eski satırlar ayrıca korunuyor.
- Rust aynı adlı farklı impl scope’larındaki validate metotlarını yanlış eşleştirmek yerine unmatched bırakıyor; beklenen iki scope içi eşleşme oluşmuyor.
- Java/C# tek fiziksel satıra yazılmış CurrencyCode sınıfında taşınan normalize metodu yerine dış class node’u seçilebiliyor. Kaynak görünür olsa da beklenen method node kimliği seçilmiyor.
- Ambiguous route successor senaryolarının beşi de yanlış bir aday seçmeden ambiguity kaydediyor. Silinmiş dosyalar mevcut production politikasına göre atlanıyor; empty-added dosyalar no-text-changes olarak kaydediliyor.
- Eksik dependency resolution AST parsing hatası olarak puanlanmadı. Cross-file helper taşımalarında dosyalar arasında eşleşme beklenmedi.

Karşılanmayan kontrol türleri:

- `complete-function-context-merge-base`: 48
- `independent-changed-line-coverage-merge-base`: 61
- `independent-changed-line-coverage-head`: 4
- `scope-sensitive-matching`: 1
- `selected-node-identity-and-range-merge-base`: 2
- `selected-node-identity-and-range-head`: 2

## Çıktılar

- İstenen sekiz `review-prompts-AST-multilingual-*.json`: mevcut normal/AST preview şeması, tam system/user prompt’ları ve `estimatedTokens`, `astUsed`, `astAnalysis` alanları. İçerikler ayrıca kısaltılmadı.
- `ast-test-expected-results.json`: AST çıktısından türetilmemiş kaynak/senaryo oracle’ı; source range, symbol, matching ilişkisi ve kontrollü regression bilgileri.
- `ast-test-evaluation-summary.json`: PR/dil aggregate ölçümleri ve tüm başarısız kontrol kanıtları.
- `evaluation-01.json` … `evaluation-08.json`: kaynakların iki revision’ı, seçili node’lar, matching/ambiguity/unmatched, parse recovery, omitted context, bağımsız diff kontrolleri ve token bileşenleri.
- Head/merge-base overlap ölçümü path + revision side + mutlak satır + kaynak eşitliğiyle yapılır. Yalnız metin benzerliği kullanılmaz; deduplication uygulanmaz.
- `native-ci/`: sekiz frozen CI run’ının orijinal base/head derleyici çıktı ve job kayıtları. Python compiler çıktısı iki JSON dokümanı içeren bir akıştır (business contract bulguları, ardından compile özeti).
- `native-ci-summary.json`, `verification.json`, `parser-provenance.json`, `branches.json`: CI, determinism, parser sürüm/hash ve SHA/PR kanıtları.
- `native-first-go/`: ilk native Go tip hatalarının çıktısı. Bu fixture hataları main ve bütün branch’lerde aynı şekilde düzeltildi; final SHA’larda 40 job geçti. GitHub’daki önceki başarısız run geçmişi korundu.

## Mevcut test paketi ve atlananlar

`npm run review:compare:test`: 123 test, 117 başarılı, 0 başarısız, 6 opsiyonel test atlandı. `VERB_PREVIEW_DIR`, `PR101_PREVIEW_DIR` ve `AST_SCOPE_PR_REPO` tarihsel arşiv girdileri ayarlanmadığı için atlananlar:

- ﹣ 17 frozen diff positions, eight ledger rows and four head edits (0.063375ms)
- ﹣ frozen head shows timer identity, pool input, and sibling session props (0.033417ms)
- ﹣ 16 frozen legacy bytes, independent builder and historical selector (0.019584ms)
- ﹣ pinned PR 101 replay retains both labeled head lines and historical legacy bytes (0.033584ms)
- ﹣ VerbLearning comparison preserves all eight diff anchors while removing repeated source lines (0.016291ms)
- ﹣ AST review extracts the complete function and independent test from the reported PR (0.03425ms)

## Tekrar üretme

Önce Qommity bağımlılıkları ve `@qommity/core` dist çıktısı mevcut olmalıdır. Test deposunda `branches.json` içindeki commit’leri fetch et. Ardından rapor dizininin kopyası üzerinde:

```sh
QOMMITY_ROOT=/path/to/qommity-com \
AST_FIXTURE_REPO=/path/to/Vocabulary-Practice-App \
AST_OUTPUT=/path/to/copied-report-directory \
node /path/to/copied-report-directory/harness/evaluate.cjs
```

`evaluate.cjs` mevcut `snapshotFromGit`, `reviewPreview`, `extractReviewContext`, `PromptBuilderService` ve deterministic estimator’ı çağırır. Yalnız test kaynakları ve sidecar ölçümleri eklenmiştir. `verify.cjs` sabit SHA, kaynak eşitliği, prompt paritesi, estimator ve determinism kanıtlarını doğrular. `generate.py`/`business.py`/`specialized.py`/`enhance.py` kaynak üretimini belgelendirir; mevcut branch’leri tekrar yazmak için kullanılmamalıdır.

Kalıcı çıktı dizini: https://github.com/MuratOzte/Vocabulary-Practice-App/tree/test/ast-multilingual-results-20261126/ast-evaluation/2026-11-26
