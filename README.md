# kelime.

Mobil öncelikli İngilizce kelime çalışma uygulaması. React + TypeScript + Vite; kelimeler ve ilerleme IndexedDB'de, sunucu veya hesap sistemi yok.

## Çalıştırma

```sh
npm install
npm run dev
```

`npm run dev` çıktısındaki yerel adresi aç. Telefonda aynı ağdan erişmek için çıktıda verilen Network adresini kullan. Geliştirme sunucusu gerekirse Windows güvenlik duvarında izin ister. Üretim çıktısı `npm run build` ile `dist/` altında oluşur.

```sh
npm test
npm run build
```

## Kullanım

- Kartı çevirip Bilmiyorum / Unutabilirim / Biliyorum seç.
- Anlam testi, yazma ve eşleştirme modlarında yanıtlar tekrar sıklığını otomatik günceller.
- Günlük tekrar zamanı gelen kelimeleri, serbest pratik tüm koleksiyonu kullanır.
- Gördüğüm kelimeler modunda işaretlediğin tüm kelimeleri veya yalnızca Biliyorum / Unutabilirim / Bilmiyorum grubunu tekrar tarihini beklemeden çalış. Tümü oturumunda seçilen her kelime bir kez gösterilir; yeni işaretlerin kaydedilir.
- Kelimeler ekranından ekle/düzenle. Ayarlar ekranından JSON yedeği indir veya mevcut koleksiyonun yerine yedek yükle.

Kayıtlar tarayıcıya ve site adresine özeldir; farklı cihazlara otomatik aktarılmaz. Tarayıcı verilerinin temizlenmesine karşı yedek indir. PWA ve çevrimdışı açılış içermez.

## Japonca sürümü

Üstteki 日本語 · Japonca bağlantısı aynı sekmede `/japonca` sayfasını açar; İngilizceye `/` bağlantısından dönülür. Dil değiştirmek açık oturumu kapatır, kaydedilen cevapları korur. Arayüz Türkçedir. Japonca bölümünde 200 temel kelime/kısa ifade ve her biri 46 karakter içeren hiragana/katakana koleksiyonları vardır. Başlangıç koleksiyonu tam bir A1 müfredatı veya dilbilgisi kursu değildir.

Kelime kartları Japonca, kana, Hepburn romajisi ve Türkçe anlamı birlikte gösterir. Örneklerde Japonca, romaji ve Türkçe çeviri bulunur. Alfabe sorularında okunuş cevaba kadar gizlenir. Yazma modunda kelimeler için Japonca, kana veya kayıtlı romaji alternatifleri kabul edilir; alfabe için sorulan alfabenin karakteri yazılır. Uzun ünlülerin Latin harfli alternatifleri veride açıkça tanımlanır; Japonca karakterler birbirine dönüştürülmez.

Japonca telaffuz tarayıcının `ja-JP` sesini kullanır; cihazdaki Japonca ses desteğine bağlıdır. İlerleme `kelime-japanese-local` IndexedDB veritabanında, oturum uzunluğu `kelime-ja-session-size` anahtarında saklanır. İngilizcenin mevcut veritabanı korunur. Yedekler dile özeldir; eski dil etiketi olmayan İngilizce yedekleri desteklenir.

Vite geliştirme/önizleme sunucusu `/japonca` doğrudan açılışını destekler. Netlify/Cloudflare Pages için `public/_redirects`, Vercel için `vercel.json` yönlendirmeleri hazırdır. Başka bir statik sunucuda `/japonca` ve `/japonca/` yollarını `/index.html` dosyasına **200 yanıtıyla yeniden yazın**; 301/302 yönlendirmesi adresi değiştirir. Sunucu yapılandırması bu projede bulunmadığından diğer barındırmalar için bu kural ayrıca uygulanmalıdır.

### İngilizce kaynak verisi

300 İngilizce–Türkçe girdi kullanıcı tarafından sağlanan IELTS PDF'sinden çıkarıldı. Başlangıç verisi `src/data/words.json` içinde; özgün kelime ve çeviri her kayıtta korunur. `scripts/extract_words.py` listeyi yeniden üretir (Python ve pypdf gerektirir). Türkçe çevirisi olmayan eş anlamlılar bölümü dahil edilmedi.

Belirgin yazım hataları ve hatalı anlamlar düzeltildi. Kaynak kontrolü için sözlükler: [conceive](https://www.collinsdictionary.com/us/dictionary/english/conceive), [empirical](https://www.dictionary.com/browse/empirical), [no longer](https://dictionary.cambridge.org/us/grammar/british-grammar/no-longer-not-any-longer.). Özgün kayıt kelime düzenleme ekranında görülebilir.

Tekrar aralıkları: Bilmiyorum 10 dakika, Unutabilirim 1 gün, Biliyorum ardışık başarılarla 3/7/14/30 gün. Serbest seçim ağırlıkları 5/3/1. Bir oturumun soru sınırı tekrarları da kapsar. Bilmiyorum seçimi en az üç başka cevap sonrası yeniden sorulabilir; yeterli kelime yoksa oturum erken tamamlanır.
