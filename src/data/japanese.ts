import type { Word } from "../engine";

// Hepburn readings and complete beginner examples are curated together.
// Long-vowel alternatives follow the kana spelling, not accent removal.
const vocabulary = `
こんにちは|こんにちは|konnichiwa|merhaba|こんにちは。|Konnichiwa.|Merhaba.
おはようございます|おはようございます|ohayō gozaimasu|günaydın|おはようございます。|Ohayō gozaimasu.|Günaydın.
こんばんは|こんばんは|konbanwa|iyi akşamlar|こんばんは。|Konbanwa.|İyi akşamlar.
おやすみなさい|おやすみなさい|oyasuminasai|iyi geceler|おやすみなさい。|Oyasuminasai.|İyi geceler.
ありがとう|ありがとう|arigatō|teşekkür ederim|ありがとう。|Arigatō.|Teşekkür ederim.
すみません|すみません|sumimasen|affedersiniz|すみません、駅はどこですか。|Sumimasen, eki wa doko desu ka.|Affedersiniz, istasyon nerede?
ごめんなさい|ごめんなさい|gomennasai|özür dilerim|ごめんなさい。|Gomennasai.|Özür dilerim.
さようなら|さようなら|sayōnara|hoşça kal|さようなら。|Sayōnara.|Hoşça kal.
またね|またね|mata ne|görüşürüz|またね。|Mata ne.|Görüşürüz.
はい|はい|hai|evet|はい、そうです。|Hai, sō desu.|Evet, öyle.
いいえ|いいえ|iie|hayır|いいえ、違います。|Iie, chigaimasu.|Hayır, öyle değil.
お願いします|おねがいします|onegai shimasu|rica ederim; lütfen|水をお願いします。|Mizu o onegai shimasu.|Su rica ediyorum.
どうぞ|どうぞ|dōzo|buyurun|どうぞ、座ってください。|Dōzo, suwatte kudasai.|Buyurun, oturun.
いただきます|いただきます|itadakimasu|yemekten önce söylenen teşekkür|いただきます。|Itadakimasu.|Yemek için teşekkürler.
ごちそうさまでした|ごちそうさまでした|gochisōsama deshita|yemekten sonra söylenen teşekkür|ごちそうさまでした。|Gochisōsama deshita.|Yemek için teşekkürler.
初めまして|はじめまして|hajimemashite|tanıştığımıza memnun oldum|初めまして。|Hajimemashite.|Tanıştığımıza memnun oldum.
よろしくお願いします|よろしくおねがいします|yoroshiku onegai shimasu|tanışırken söylenen nezaket ifadesi|よろしくお願いします。|Yoroshiku onegai shimasu.|Tanıştığımıza memnun oldum; iyi anlaşmayı umuyorum.
分かりません|わかりません|wakarimasen|anlamıyorum|日本語が分かりません。|Nihongo ga wakarimasen.|Japonca anlamıyorum.
もう一度|もういちど|mō ichido|bir kez daha|もう一度お願いします。|Mō ichido onegai shimasu.|Bir kez daha lütfen.
零|れい|rei|sıfır|答えは零です。|Kotae wa rei desu.|Cevap sıfır.
一|いち|ichi|bir|番号は一です。|Bangō wa ichi desu.|Numara bir.
二|に|ni|iki|番号は二です。|Bangō wa ni desu.|Numara iki.
三|さん|san|üç|番号は三です。|Bangō wa san desu.|Numara üç.
四|よん|yon|dört|番号は四です。|Bangō wa yon desu.|Numara dört.
五|ご|go|beş|番号は五です。|Bangō wa go desu.|Numara beş.
六|ろく|roku|altı|番号は六です。|Bangō wa roku desu.|Numara altı.
七|なな|nana|yedi|番号は七です。|Bangō wa nana desu.|Numara yedi.
八|はち|hachi|sekiz|番号は八です。|Bangō wa hachi desu.|Numara sekiz.
九|きゅう|kyū|dokuz|番号は九です。|Bangō wa kyū desu.|Numara dokuz.
十|じゅう|jū|on|番号は十です。|Bangō wa jū desu.|Numara on.
百|ひゃく|hyaku|yüz|百円です。|Hyaku en desu.|Yüz yen.
千|せん|sen|bin|千円です。|Sen en desu.|Bin yen.
円|えん|en|yen (para birimi)|五百円です。|Gohyaku en desu.|Beş yüz yen.
今日|きょう|kyō|bugün|今日は休みです。|Kyō wa yasumi desu.|Bugün tatil.
明日|あした|ashita|yarın|明日、学校に行きます。|Ashita, gakkō ni ikimasu.|Yarın okula gideceğim.
昨日|きのう|kinō|dün|昨日は雨でした。|Kinō wa ame deshita.|Dün yağmurluydu.
今|いま|ima|şimdi|今、勉強します。|Ima, benkyō shimasu.|Şimdi ders çalışacağım.
朝|あさ|asa|sabah|朝、パンを食べます。|Asa, pan o tabemasu.|Sabah ekmek yerim.
昼|ひる|hiru|öğle; gündüz|昼に会います。|Hiru ni aimasu.|Öğlen buluşacağız.
夜|よる|yoru|gece|夜、本を読みます。|Yoru, hon o yomimasu.|Gece kitap okurum.
時間|じかん|jikan|zaman; süre|時間があります。|Jikan ga arimasu.|Zamanım var.
毎日|まいにち|mainichi|her gün|毎日、勉強します。|Mainichi, benkyō shimasu.|Her gün ders çalışırım.
月曜日|げつようび|getsuyōbi|pazartesi|今日は月曜日です。|Kyō wa getsuyōbi desu.|Bugün pazartesi.
火曜日|かようび|kayōbi|salı|今日は火曜日です。|Kyō wa kayōbi desu.|Bugün salı.
水曜日|すいようび|suiyōbi|çarşamba|今日は水曜日です。|Kyō wa suiyōbi desu.|Bugün çarşamba.
木曜日|もくようび|mokuyōbi|perşembe|今日は木曜日です。|Kyō wa mokuyōbi desu.|Bugün perşembe.
金曜日|きんようび|kin'yōbi|cuma|今日は金曜日です。|Kyō wa kin'yōbi desu.|Bugün cuma.
土曜日|どようび|doyōbi|cumartesi|今日は土曜日です。|Kyō wa doyōbi desu.|Bugün cumartesi.
日曜日|にちようび|nichiyōbi|pazar|今日は日曜日です。|Kyō wa nichiyōbi desu.|Bugün pazar.
週|しゅう|shū|hafta|来週、会います。|Raishū, aimasu.|Gelecek hafta buluşacağız.
月|つき|tsuki|ay (gök cismi)|月がきれいです。|Tsuki ga kirei desu.|Ay güzel.
年|とし|toshi|yıl|今年は忙しいです。|Kotoshi wa isogashii desu.|Bu yıl yoğunum.
誕生日|たんじょうび|tanjōbi|doğum günü|今日は誕生日です。|Kyō wa tanjōbi desu.|Bugün doğum günüm.
私|わたし|watashi|ben|私は学生です。|Watashi wa gakusei desu.|Ben öğrenciyim.
あなた|あなた|anata|sen; siz|あなたの名前は何ですか。|Anata no namae wa nan desu ka.|Adınız nedir?
人|ひと|hito|insan; kişi|あの人は先生です。|Ano hito wa sensei desu.|O kişi öğretmen.
友達|ともだち|tomodachi|arkadaş|友達と話します。|Tomodachi to hanashimasu.|Arkadaşımla konuşurum.
家族|かぞく|kazoku|aile|家族と住んでいます。|Kazoku to sunde imasu.|Ailemle yaşıyorum.
母|はは|haha|annem (kendi annesi)|母は元気です。|Haha wa genki desu.|Annem iyi.
父|ちち|chichi|babam (kendi babası)|父は家にいます。|Chichi wa ie ni imasu.|Babam evde.
お母さん|おかあさん|okāsan|anne (hitap; başkasının annesi)|お母さん、ありがとう。|Okāsan, arigatō.|Anne, teşekkür ederim.
お父さん|おとうさん|otōsan|baba (hitap; başkasının babası)|お父さん、こんにちは。|Otōsan, konnichiwa.|Baba, merhaba.
兄|あに|ani|ağabeyim|兄は学生です。|Ani wa gakusei desu.|Ağabeyim öğrenci.
姉|あね|ane|ablam|姉は先生です。|Ane wa sensei desu.|Ablam öğretmen.
弟|おとうと|otōto|küçük erkek kardeş|弟と遊びます。|Otōto to asobimasu.|Küçük erkek kardeşimle oynarım.
妹|いもうと|imōto|küçük kız kardeş|妹は家にいます。|Imōto wa ie ni imasu.|Küçük kız kardeşim evde.
子供|こども|kodomo|çocuk|子供が遊んでいます。|Kodomo ga asonde imasu.|Çocuk oynuyor.
先生|せんせい|sensei|öğretmen|先生に聞きます。|Sensei ni kikimasu.|Öğretmene soracağım.
学生|がくせい|gakusei|öğrenci|私は学生です。|Watashi wa gakusei desu.|Ben öğrenciyim.
名前|なまえ|namae|isim|名前を書いてください。|Namae o kaite kudasai.|Lütfen adınızı yazın.
水|みず|mizu|su|水を飲みます。|Mizu o nomimasu.|Su içerim.
お茶|おちゃ|ocha|çay|お茶をください。|Ocha o kudasai.|Çay lütfen.
コーヒー|コーヒー|kōhī|kahve|コーヒーを飲みます。|Kōhī o nomimasu.|Kahve içerim.
牛乳|ぎゅうにゅう|gyūnyū|süt|牛乳を買います。|Gyūnyū o kaimasu.|Süt alacağım.
ジュース|ジュース|jūsu|meyve suyu|ジュースをください。|Jūsu o kudasai.|Meyve suyu lütfen.
ご飯|ごはん|gohan|pilav; yemek|ご飯を食べます。|Gohan o tabemasu.|Yemek yerim.
パン|パン|pan|ekmek|パンを買います。|Pan o kaimasu.|Ekmek alacağım.
卵|たまご|tamago|yumurta|卵を食べます。|Tamago o tabemasu.|Yumurta yerim.
肉|にく|niku|et|肉が好きです。|Niku ga suki desu.|Et severim.
魚|さかな|sakana|balık|魚を食べます。|Sakana o tabemasu.|Balık yerim.
野菜|やさい|yasai|sebze|野菜を買います。|Yasai o kaimasu.|Sebze alacağım.
果物|くだもの|kudamono|meyve|果物が好きです。|Kudamono ga suki desu.|Meyve severim.
りんご|りんご|ringo|elma|りんごを食べます。|Ringo o tabemasu.|Elma yerim.
バナナ|バナナ|banana|muz|バナナをください。|Banana o kudasai.|Muz lütfen.
米|こめ|kome|pirinç (pişmemiş)|米を買います。|Kome o kaimasu.|Pirinç alacağım.
砂糖|さとう|satō|şeker|砂糖を入れます。|Satō o iremasu.|Şeker koyarım.
塩|しお|shio|tuz|塩をください。|Shio o kudasai.|Tuz lütfen.
料理|りょうり|ryōri|yemek; yemek pişirme|日本の料理が好きです。|Nihon no ryōri ga suki desu.|Japon yemeklerini severim.
朝ご飯|あさごはん|asagohan|kahvaltı|朝ご飯を食べます。|Asagohan o tabemasu.|Kahvaltı yaparım.
昼ご飯|ひるごはん|hirugohan|öğle yemeği|昼ご飯を食べます。|Hirugohan o tabemasu.|Öğle yemeği yerim.
晩ご飯|ばんごはん|bangohan|akşam yemeği|晩ご飯を作ります。|Bangohan o tsukurimasu.|Akşam yemeği yapacağım.
おいしい|おいしい|oishii|lezzetli|このパンはおいしいです。|Kono pan wa oishii desu.|Bu ekmek lezzetli.
家|いえ|ie|ev|家に帰ります。|Ie ni kaerimasu.|Eve döneceğim.
学校|がっこう|gakkō|okul|学校に行きます。|Gakkō ni ikimasu.|Okula giderim.
駅|えき|eki|istasyon|駅はどこですか。|Eki wa doko desu ka.|İstasyon nerede?
店|みせ|mise|dükkân|この店は小さいです。|Kono mise wa chiisai desu.|Bu dükkân küçük.
病院|びょういん|byōin|hastane|病院に行きます。|Byōin ni ikimasu.|Hastaneye gideceğim.
銀行|ぎんこう|ginkō|banka|銀行はここです。|Ginkō wa koko desu.|Banka burada.
郵便局|ゆうびんきょく|yūbinkyoku|postane|郵便局に行きます。|Yūbinkyoku ni ikimasu.|Postaneye gideceğim.
図書館|としょかん|toshokan|kütüphane|図書館で勉強します。|Toshokan de benkyō shimasu.|Kütüphanede ders çalışırım.
公園|こうえん|kōen|park|公園で遊びます。|Kōen de asobimasu.|Parkta oynarım.
レストラン|レストラン|resutoran|restoran|レストランで食べます。|Resutoran de tabemasu.|Restoranda yemek yerim.
ホテル|ホテル|hoteru|otel|ホテルは駅の近くです。|Hoteru wa eki no chikaku desu.|Otel istasyonun yakınında.
トイレ|トイレ|toire|tuvalet|トイレはどこですか。|Toire wa doko desu ka.|Tuvalet nerede?
部屋|へや|heya|oda|部屋はきれいです。|Heya wa kirei desu.|Oda temiz.
会社|かいしゃ|kaisha|şirket|会社に行きます。|Kaisha ni ikimasu.|Şirkete giderim.
空港|くうこう|kūkō|havaalanı|空港は遠いです。|Kūkō wa tōi desu.|Havaalanı uzak.
日本|にほん|Nihon|Japonya|日本に行きたいです。|Nihon ni ikitai desu.|Japonya'ya gitmek istiyorum.
日本語|にほんご|nihongo|Japonca|日本語を勉強します。|Nihongo o benkyō shimasu.|Japonca çalışırım.
本|ほん|hon|kitap|本を読みます。|Hon o yomimasu.|Kitap okurum.
机|つくえ|tsukue|masa; çalışma masası|机の上に本があります。|Tsukue no ue ni hon ga arimasu.|Masanın üstünde kitap var.
椅子|いす|isu|sandalye|椅子に座ります。|Isu ni suwarimasu.|Sandalyeye otururum.
鉛筆|えんぴつ|enpitsu|kurşun kalem|鉛筆で書きます。|Enpitsu de kakimasu.|Kurşun kalemle yazarım.
ペン|ペン|pen|kalem|ペンをください。|Pen o kudasai.|Kalem lütfen.
紙|かみ|kami|kâğıt|紙に名前を書きます。|Kami ni namae o kakimasu.|Kâğıda adımı yazarım.
電話|でんわ|denwa|telefon|電話を使います。|Denwa o tsukaimasu.|Telefonu kullanırım.
時計|とけい|tokei|saat (eşya)|時計を見ます。|Tokei o mimasu.|Saate bakarım.
鞄|かばん|kaban|çanta|鞄はここです。|Kaban wa koko desu.|Çanta burada.
靴|くつ|kutsu|ayakkabı|靴を買います。|Kutsu o kaimasu.|Ayakkabı alacağım.
服|ふく|fuku|kıyafet|新しい服です。|Atarashii fuku desu.|Yeni bir kıyafet.
傘|かさ|kasa|şemsiye|傘を持っています。|Kasa o motte imasu.|Şemsiyem var.
鍵|かぎ|kagi|anahtar|鍵はどこですか。|Kagi wa doko desu ka.|Anahtar nerede?
お金|おかね|okane|para|お金があります。|Okane ga arimasu.|Param var.
車|くるま|kuruma|araba|車で行きます。|Kuruma de ikimasu.|Arabayla giderim.
電車|でんしゃ|densha|tren|電車に乗ります。|Densha ni norimasu.|Trene binerim.
バス|バス|basu|otobüs|バスを待ちます。|Basu o machimasu.|Otobüsü beklerim.
自転車|じてんしゃ|jitensha|bisiklet|自転車で行きます。|Jitensha de ikimasu.|Bisikletle giderim.
写真|しゃしん|shashin|fotoğraf|写真を見ます。|Shashin o mimasu.|Fotoğrafa bakarım.
犬|いぬ|inu|köpek|犬がいます。|Inu ga imasu.|Bir köpek var.
猫|ねこ|neko|kedi|猫がいます。|Neko ga imasu.|Bir kedi var.
花|はな|hana|çiçek|花がきれいです。|Hana ga kirei desu.|Çiçek güzel.
山|やま|yama|dağ|山に行きます。|Yama ni ikimasu.|Dağa giderim.
海|うみ|umi|deniz|海は青いです。|Umi wa aoi desu.|Deniz mavi.
雨|あめ|ame|yağmur|今日は雨です。|Kyō wa ame desu.|Bugün yağmurlu.
雪|ゆき|yuki|kar|雪が降っています。|Yuki ga futte imasu.|Kar yağıyor.
天気|てんき|tenki|hava durumu|いい天気です。|Ii tenki desu.|Hava güzel.
行く|いく|iku|gitmek|学校に行きます。|Gakkō ni ikimasu.|Okula giderim.
来る|くる|kuru|gelmek|友達が来ます。|Tomodachi ga kimasu.|Arkadaşım gelecek.
帰る|かえる|kaeru|geri dönmek|家に帰ります。|Ie ni kaerimasu.|Eve döneceğim.
食べる|たべる|taberu|yemek yemek|パンを食べます。|Pan o tabemasu.|Ekmek yerim.
飲む|のむ|nomu|içmek|水を飲みます。|Mizu o nomimasu.|Su içerim.
見る|みる|miru|görmek; bakmak; izlemek|テレビを見ます。|Terebi o mimasu.|Televizyon izlerim.
聞く|きく|kiku|dinlemek; sormak|音楽を聞きます。|Ongaku o kikimasu.|Müzik dinlerim.
話す|はなす|hanasu|konuşmak|日本語を話します。|Nihongo o hanashimasu.|Japonca konuşurum.
読む|よむ|yomu|okumak|本を読みます。|Hon o yomimasu.|Kitap okurum.
書く|かく|kaku|yazmak|名前を書きます。|Namae o kakimasu.|Adımı yazarım.
買う|かう|kau|satın almak|パンを買います。|Pan o kaimasu.|Ekmek alacağım.
する|する|suru|yapmak|勉強をします。|Benkyō o shimasu.|Ders çalışırım.
勉強する|べんきょうする|benkyō suru|ders çalışmak|毎日、勉強します。|Mainichi, benkyō shimasu.|Her gün ders çalışırım.
働く|はたらく|hataraku|çalışmak (iş)|会社で働きます。|Kaisha de hatarakimasu.|Şirkette çalışırım.
寝る|ねる|neru|uyumak; yatmak|夜、寝ます。|Yoru, nemasu.|Gece uyurum.
起きる|おきる|okiru|uyanmak; kalkmak|朝、起きます。|Asa, okimasu.|Sabah kalkarım.
会う|あう|au|buluşmak|友達に会います。|Tomodachi ni aimasu.|Arkadaşımla buluşacağım.
待つ|まつ|matsu|beklemek|バスを待ちます。|Basu o machimasu.|Otobüsü beklerim.
分かる|わかる|wakaru|anlamak|日本語が分かります。|Nihongo ga wakarimasu.|Japonca anlarım.
ある|ある|aru|var olmak (cansız)|本があります。|Hon ga arimasu.|Bir kitap var.
いる|いる|iru|var olmak (canlı)|猫がいます。|Neko ga imasu.|Bir kedi var.
使う|つかう|tsukau|kullanmak|ペンを使います。|Pen o tsukaimasu.|Kalem kullanırım.
作る|つくる|tsukuru|yapmak; üretmek|料理を作ります。|Ryōri o tsukurimasu.|Yemek yaparım.
歩く|あるく|aruku|yürümek|公園を歩きます。|Kōen o arukimasu.|Parkta yürürüm.
遊ぶ|あそぶ|asobu|oynamak; eğlenmek|友達と遊びます。|Tomodachi to asobimasu.|Arkadaşımla oynarım.
大きい|おおきい|ōkii|büyük|大きい家です。|Ōkii ie desu.|Büyük bir ev.
小さい|ちいさい|chiisai|küçük|小さい猫です。|Chiisai neko desu.|Küçük bir kedi.
新しい|あたらしい|atarashii|yeni|新しい本です。|Atarashii hon desu.|Yeni bir kitap.
古い|ふるい|furui|eski|古い時計です。|Furui tokei desu.|Eski bir saat.
いい|いい|ii|iyi|いい天気です。|Ii tenki desu.|Hava güzel.
悪い|わるい|warui|kötü|天気が悪いです。|Tenki ga warui desu.|Hava kötü.
暑い|あつい|atsui|sıcak (hava)|今日は暑いです。|Kyō wa atsui desu.|Bugün hava sıcak.
寒い|さむい|samui|soğuk (hava)|今日は寒いです。|Kyō wa samui desu.|Bugün hava soğuk.
熱い|あつい|atsui|sıcak (nesne; içecek)|お茶が熱いです。|Ocha ga atsui desu.|Çay sıcak.
冷たい|つめたい|tsumetai|soğuk (nesne; içecek)|水が冷たいです。|Mizu ga tsumetai desu.|Su soğuk.
高い|たかい|takai|pahalı; yüksek|この本は高いです。|Kono hon wa takai desu.|Bu kitap pahalı.
安い|やすい|yasui|ucuz|このパンは安いです。|Kono pan wa yasui desu.|Bu ekmek ucuz.
忙しい|いそがしい|isogashii|meşgul; yoğun|今日は忙しいです。|Kyō wa isogashii desu.|Bugün yoğunum.
楽しい|たのしい|tanoshii|eğlenceli|学校は楽しいです。|Gakkō wa tanoshii desu.|Okul eğlenceli.
難しい|むずかしい|muzukashii|zor|この本は難しいです。|Kono hon wa muzukashii desu.|Bu kitap zor.
易しい|やさしい|yasashii|kolay|この問題は易しいです。|Kono mondai wa yasashii desu.|Bu soru kolay.
近い|ちかい|chikai|yakın|駅は近いです。|Eki wa chikai desu.|İstasyon yakın.
遠い|とおい|tōi|uzak|学校は遠いです。|Gakkō wa tōi desu.|Okul uzak.
好き|すき|suki|sevilen; hoşlanılan|猫が好きです。|Neko ga suki desu.|Kedileri severim.
嫌い|きらい|kirai|sevilmeyen; hoşlanılmayan|魚が嫌いです。|Sakana ga kirai desu.|Balığı sevmem.
きれい|きれい|kirei|güzel; temiz|部屋はきれいです。|Heya wa kirei desu.|Oda temiz.
静か|しずか|shizuka|sessiz|図書館は静かです。|Toshokan wa shizuka desu.|Kütüphane sessiz.
元気|げんき|genki|sağlıklı; enerjik|私は元気です。|Watashi wa genki desu.|Ben iyiyim.
これ|これ|kore|bu (nesne)|これは本です。|Kore wa hon desu.|Bu bir kitap.
それ|それ|sore|o (dinleyene yakın nesne)|それはペンです。|Sore wa pen desu.|O bir kalem.
あれ|あれ|are|şu; o (uzaktaki nesne)|あれは学校です。|Are wa gakkō desu.|Şu bir okul.
ここ|ここ|koko|burası; burada|ここは駅です。|Koko wa eki desu.|Burası istasyon.
そこ|そこ|soko|orası; orada (dinleyene yakın)|そこに座ってください。|Soko ni suwatte kudasai.|Lütfen oraya oturun.
あそこ|あそこ|asoko|şurası; orada (uzakta)|あそこは公園です。|Asoko wa kōen desu.|Şurası park.
どこ|どこ|doko|nerede|駅はどこですか。|Eki wa doko desu ka.|İstasyon nerede?
何|なに|nani|ne|これは何ですか。|Kore wa nan desu ka.|Bu nedir?
誰|だれ|dare|kim|あの人は誰ですか。|Ano hito wa dare desu ka.|O kişi kim?
いつ|いつ|itsu|ne zaman|いつ来ますか。|Itsu kimasu ka.|Ne zaman geleceksiniz?
いくら|いくら|ikura|ne kadar (fiyat)|これはいくらですか。|Kore wa ikura desu ka.|Bu ne kadar?
上|うえ|ue|üst; yukarı|机の上に本があります。|Tsukue no ue ni hon ga arimasu.|Masanın üstünde kitap var.
下|した|shita|alt; aşağı|机の下に猫がいます。|Tsukue no shita ni neko ga imasu.|Masanın altında kedi var.
中|なか|naka|iç; içinde|鞄の中に本があります。|Kaban no naka ni hon ga arimasu.|Çantanın içinde kitap var.
右|みぎ|migi|sağ|右に曲がってください。|Migi ni magatte kudasai.|Lütfen sağa dönün.
左|ひだり|hidari|sol|左に曲がってください。|Hidari ni magatte kudasai.|Lütfen sola dönün.
`;

function longVowelAlternatives(romaji: string, kana: string): string[] {
  if (!/[āīūēō]/.test(romaji)) return [];
  // For ō the stored kana distinguishes おう from おお. All other long
  // vowels use doubled letters; katakana ー allows both conventional o spellings.
  const doubled = romaji.replace(/ā/g, "aa").replace(/ī/g, "ii").replace(/ū/g, "uu").replace(/ē/g, "ee");
  const spelling = doubled.replace(/ō/g, /おお|とお/.test(kana) ? "oo" : "ou");
  const forms = [spelling];
  if (kana.includes("ー") && romaji.includes("ō")) forms.push(doubled.replace(/ō/g, "oo"));
  return [...new Set(forms)];
}

const extraReadings: Record<string, string[]> = {
  "零": ["ゼロ", "zero"], "四": ["し", "shi"], "七": ["しち", "shichi"],
  "九": ["く", "ku"], "日本": ["にっぽん", "Nippon"], "何": ["なん", "nan"],
  "いい": ["よい", "yoi"],
};
export const japaneseVocabulary: Word[] = vocabulary.trim().split("\n").map((row, index) => {
  const [japanese, kana, romaji, turkish, example, exampleRomaji, exampleTurkish] = row.split("|");
  return {
    id: `ja-word-${String(index + 1).padStart(3, "0")}`, language: "ja", section: "vocabulary",
    // english remains the shared engine's legacy primary-text field.
    english: japanese, japanese, kana, romaji, turkish, example, exampleRomaji, exampleTurkish,
    alternatives: [...longVowelAlternatives(romaji, kana), ...(extraReadings[japanese] ?? [])],
    source: "Japonca başlangıç koleksiyonu",
  };
});

const hiragana = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん";
const katakana = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
const readings = "a i u e o ka ki ku ke ko sa shi su se so ta chi tsu te to na ni nu ne no ha hi fu he ho ma mi mu me mo ya yu yo ra ri ru re ro wa o n".split(" ");
function alphabet(characters: string, section: "hiragana" | "katakana"): Word[] {
  return [...characters].map((japanese, index) => ({
    id: `ja-${section}-${index + 1}`, language: "ja", section, english: japanese,
    japanese, kana: japanese, romaji: readings[index], turkish: readings[index],
    alternatives: [], source: "46 temel kana",
  }));
}
export const japaneseWords = [...japaneseVocabulary, ...alphabet(hiragana, "hiragana"), ...alphabet(katakana, "katakana")];
