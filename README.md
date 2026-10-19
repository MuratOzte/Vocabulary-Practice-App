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

Yedek yüklemede en fazla 10 MB JSON dosyası kabul edilir. `src/backup.ts` dosya boyutunu, JSON biçimini, dil bilgisini ve kelime/ilerleme şemasını kontrol eder. Ayarlar ekranı geçerli yedeği onay için gösterir; `src/db.ts` geri yüklemeden önce şemayı yeniden kontrol eder ve verileri tek IndexedDB işlemiyle değiştirir. Geçersiz dosyalar mevcut kayıtları değiştirmez.

## İngilizce kalıplar ve edatlar

İngilizce sayfasında mod seçicisindeki **Kalıplar · Edatlar** ayrı bir çalışma alanıdır. Mevcut kelime koleksiyonu ve kelime kartlarının yönü korunur. Yedi kategoride 515 kalıp bulunur; A1–B2 seviyesi, kategori ve öğrenilme durumuyla filtrelenebilir. Yeni kalıplar, günlük tekrar veya serbest pratik seçilebilir.

Kalıp kartında önce Türkçe anlam, çevrildiğinde İngilizce kalıp, örnek cümle, çeviri, kullanım notu ve varsa yaygın hata gösterilir. Boşluk doldurmada açıkça işaretlenmiş edat, article veya kalıbın temel kelimesi sorulur. Biliyorum / Unutabilirim / Bilmiyorum ve otomatik doğru/yanlış değerlendirmesi mevcut `StudySession`, `grade`, `nextWord` ve `recordAnswer` akışını kullanır; ikinci bir tekrar motoru yoktur.

Öğrenilen sayısı şu an **Biliyorum** durumundaki kalıplardır. Günlük ilerleme cihazın yerel takvimine göre kaydedilen cevap sayısıdır (aynı kalıbın tekrarları dahil). Kategorilerdeki hata sayısı yanlış cevapları ve Bilmiyorum seçimlerini, eksik kelime istatistikleri yalnızca boşluk doldurma hatalarını içerir. Toplam hata/cevap sayıları ve hata oranı birlikte gösterilir.

`src/data/phrases.ts` içindeki örnekler uygulama için yazılmıştır. Köşeli parantezler tam olarak sorulacak kelimeyi işaretler; kullanıcıya gösterilmeden kaldırılır. Yeni kayıt kimlikleri İngilizce kalıptan türetilir; kalıbın metni değişirse ilerlemeyi korumak için kimliği sabit tutmak gerekir. Otomatik denetimler benzersiz kimlik/kalıp/örnek, alan bütünlüğü, yedi kategori, dört seviye ve boşluğun doğru cümleyi yeniden oluşturmasını kontrol eder. Bunlar bağımsız bir dil uzmanı incelemesinin yerine geçmez.

CEFR seviyeleri ve 1–4 öncelik puanları **öğretim amaçlı tahminlerdir**; ölçülmüş korpus sıklıkları veya resmî tek tek CEFR etiketleri değildir. Temel günlük yapılar önce gelir. Dilbilgisi yaklaşımı için [British Council: sıfatlar ve edatlar](https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2/adjectives-prepositions) ve [fiiller ve edatlar](https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/verbs-prepositions) incelendi. [English Vocabulary Profile](https://englishprofile.org/?menu=english-vocabulary-profile) kalıp ve eşdizimleri de kapsayan bir seviye kaynağıdır; bu veri setinin tüm kayıtlarıyla tek tek eşleştirme yapılmadı. Örnekler bu kaynaklardan kopyalanmadı.

Kalıp ilerlemesi `kelime-phrases-local` IndexedDB veritabanında saklanır. İngilizce/Japonca kelimeleri ve eski yedek şemaları değişmez. **Ayarlar'daki kelime yedekleri kalıp ilerlemesini kapsamaz**; tarayıcı verilerini temizlemek kalıp ilerlemesini siler.

## İngilizce fiiller · Geçmiş zaman

İngilizce sayfasında **Mod seç → Fiiller · Geçmiş zaman** bölümünden günlük kullanıma yönelik 100 fiilin ikinci hâline (Past simple) çalışılır. Liste 66 düzensiz/alternatif biçimli ve 34 düzenli fiilden oluşan bir seçkidir; ölçülmüş sıklık sıralaması değildir. Her fiilde yalın hâl, ikinci hâl, Türkçe anlam ve uygulama için yazılmış bir örnek cümle vardır.

**İkinci hâlini yaz** modunda yalın hâl ve Türkçe anlam gösterilir; geçmiş zaman cevabı kontrol edilir. Üçüncü hâller kabul edilmez (`go → went`, `gone` değil). `be` için `was` veya `were`, `learn` için `learned` veya `learnt`, `travel` için `travelled` veya `traveled` kabul edilir. **Ezber kartları** cevabı kart çevrilince gösterir. Düzenli/düzensiz fiil filtresi, yeni fiiller, günlük tekrar, serbest pratik ve 10/20/tümü oturumları bulunur. Mevcut tekrar aralıkları kullanılır.

İlerleme ayrı `kelime-verbs-local` IndexedDB veritabanında saklanır. Ayarlar'daki kelime yedekleri fiil ilerlemesini kapsamaz. Bölüm Japonca sayfasında gösterilmez. Dilbilgisi referansı: [British Council: Past simple](https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/past-simple).

## Japonca sürümü

Üstteki Japonca bağlantısı aynı sekmede `/japonca` sayfasını açar; İngilizceye `/` bağlantısından dönülür. Dil değiştirmek açık oturumu kapatır, kaydedilen cevapları korur. Arayüz Türkçedir. Japonca bölümünde 200 temel kelime/kısa ifade ve her biri 46 karakter içeren hiragana/katakana koleksiyonları vardır. Başlangıç koleksiyonu tam bir A1 müfredatı veya dilbilgisi kursu değildir.

Kelime kartları Japonca, kana, Hepburn romajisi ve Türkçe anlamı birlikte gösterir. Örneklerde Japonca, romaji ve Türkçe çeviri bulunur. Alfabe sorularında okunuş cevaba kadar gizlenir. Yazma modunda kelimeler için Japonca, kana veya kayıtlı romaji alternatifleri kabul edilir; alfabe için sorulan alfabenin karakteri yazılır. Uzun ünlülerin Latin harfli alternatifleri veride açıkça tanımlanır; Japonca karakterler birbirine dönüştürülmez.

Japonca telaffuz tarayıcının `ja-JP` sesini kullanır; cihazdaki Japonca ses desteğine bağlıdır. İlerleme `kelime-japanese-local` IndexedDB veritabanında, oturum uzunluğu `kelime-ja-session-size` anahtarında saklanır. İngilizcenin mevcut veritabanı korunur. Yedekler dile özeldir; eski dil etiketi olmayan İngilizce yedekleri desteklenir.

Vite geliştirme/önizleme sunucusu `/japonca` doğrudan açılışını destekler. Netlify/Cloudflare Pages için `public/_redirects`, Vercel için `vercel.json` yönlendirmeleri hazırdır. Başka bir statik sunucuda `/japonca` ve `/japonca/` yollarını `/index.html` dosyasına **200 yanıtıyla yeniden yazın**; 301/302 yönlendirmesi adresi değiştirir. Sunucu yapılandırması bu projede bulunmadığından diğer barındırmalar için bu kural ayrıca uygulanmalıdır.

### İngilizce kaynak verisi

300 İngilizce–Türkçe girdi kullanıcı tarafından sağlanan IELTS PDF'sinden çıkarıldı. Başlangıç verisi `src/data/words.json` içinde; özgün kelime ve çeviri her kayıtta korunur. `scripts/extract_words.py` listeyi yeniden üretir (Python ve pypdf gerektirir). Türkçe çevirisi olmayan eş anlamlılar bölümü dahil edilmedi.

Belirgin yazım hataları ve hatalı anlamlar düzeltildi. Kaynak kontrolü için sözlükler: [conceive](https://www.collinsdictionary.com/us/dictionary/english/conceive), [empirical](https://www.dictionary.com/browse/empirical), [no longer](https://dictionary.cambridge.org/us/grammar/british-grammar/no-longer-not-any-longer.). Özgün kayıt kelime düzenleme ekranında görülebilir.

Tekrar aralıkları: Bilmiyorum 10 dakika, Unutabilirim 1 gün, Biliyorum ardışık başarılarla 3/7/14/30 gün. Serbest seçim ağırlıkları 5/3/1. Bir oturumun soru sınırı tekrarları da kapsar. Bilmiyorum seçimi en az üç başka cevap sonrası yeniden sorulabilir; yeterli kelime yoksa oturum erken tamamlanır.
