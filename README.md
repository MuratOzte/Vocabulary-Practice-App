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
- Kelimeler ekranından ekle/düzenle. Ayarlar ekranından JSON yedeği indir veya mevcut koleksiyonun yerine yedek yükle.

Kayıtlar tarayıcıya ve site adresine özeldir; farklı cihazlara otomatik aktarılmaz. Tarayıcı verilerinin temizlenmesine karşı yedek indir. PWA ve çevrimdışı açılış içermez.

## Kelime verisi

300 İngilizce–Türkçe girdi kullanıcı tarafından sağlanan IELTS PDF'sinden çıkarıldı. Başlangıç verisi `src/data/words.json` içinde; özgün kelime ve çeviri her kayıtta korunur. `scripts/extract_words.py` listeyi yeniden üretir (Python ve pypdf gerektirir). Türkçe çevirisi olmayan eş anlamlılar bölümü dahil edilmedi.

Belirgin yazım hataları ve hatalı anlamlar düzeltildi. Kaynak kontrolü için sözlükler: [conceive](https://www.collinsdictionary.com/us/dictionary/english/conceive), [empirical](https://www.dictionary.com/browse/empirical), [no longer](https://dictionary.cambridge.org/us/grammar/british-grammar/no-longer-not-any-longer.). Özgün kayıt kelime düzenleme ekranında görülebilir.

Tekrar aralıkları: Bilmiyorum 10 dakika, Unutabilirim 1 gün, Biliyorum ardışık başarılarla 3/7/14/30 gün. Serbest seçim ağırlıkları 5/3/1. Bir oturumun soru sınırı tekrarları da kapsar. Bilmiyorum seçimi en az üç başka cevap sonrası yeniden sorulabilir; yeterli kelime yoksa oturum erken tamamlanır.
