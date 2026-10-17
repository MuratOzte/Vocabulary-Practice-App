import type { PhraseCategory, RecordWord, PhraseDetails } from "../engine";

// Authored teaching examples; brackets mark the exact exercise target.
// Levels and priorities are editorial teaching estimates, not corpus frequency ranks.
const groups: [PhraseCategory, string][] = [
  ["verb_preposition", `
wait for someone|birini beklemek|A1|I'm waiting [for] my friend.|Arkadaşımı bekliyorum.|Wait ile beklenen kişi veya şeyden önce for kullanılır.|I'm waiting my friend.
listen to music|müzik dinlemek|A1|I listen [to] music on the bus.|Otobüste müzik dinlerim.|Listen fiilinden sonra dinlenen şey için to gerekir.|I listen music.
look at something|bir şeye bakmak|A1|Look [at] this photo.|Bu fotoğrafa bak.
go to work|işe gitmek|A1|I go [to] work by bus.|İşe otobüsle giderim.|Work burada yer belirtir; önüne the gelmez.
talk to someone|biriyle konuşmak|A1|Can I talk [to] you?|Seninle konuşabilir miyim?
ask for help|yardım istemek|A1|Don't be afraid to ask [for] help.|Yardım istemekten korkma.
come from somewhere|bir yerden gelmek|A1|I come [from] a small town.|Küçük bir kasabadan geliyorum.
live in a city|bir şehirde yaşamak|A1|They live [in] Ankara.|Ankara'da yaşıyorlar.
pay for something|bir şeyin parasını ödemek|A1|I'll pay [for] the tickets.|Biletlerin parasını ben öderim.
write to someone|birine yazmak|A1|I write [to] my cousin every month.|Her ay kuzenime yazarım.
speak to someone|biriyle konuşmak (speak)|A1|I'd like to speak [to] the manager.|Müdürle konuşmak istiyorum.
think about something|bir şey hakkında düşünmek|A2|I'm thinking [about] my holiday.|Tatilimi düşünüyorum.
look after someone|biriyle ilgilenmek|A2|She looks [after] her little brother.|Küçük erkek kardeşiyle ilgileniyor.
learn about something|bir şey hakkında bilgi edinmek|A2|We're learning [about] space.|Uzay hakkında bilgi ediniyoruz.
hear from someone|birinden haber almak|A2|Have you heard [from] Deniz?|Deniz'den haber aldın mı?
belong to someone|birine ait olmak|A2|This bag belongs [to] me.|Bu çanta bana ait.
agree with someone|biriyle aynı fikirde olmak|A2|I agree [with] you.|Seninle aynı fikirdeyim.
work for a company|bir şirkette çalışmak|A2|She works [for] a small company.|Küçük bir şirkette çalışıyor.
work on something|bir şey üzerinde çalışmak|A2|I'm working [on] a new project.|Yeni bir proje üzerinde çalışıyorum.
stay with someone|birinin yanında kalmak|A2|We're staying [with] friends.|Arkadaşlarımızın yanında kalıyoruz.
arrive at the station|istasyona varmak|A2|We arrived [at] the station early.|İstasyona erken vardık.|Bina ve durak gibi belirli noktalarda arrive at kullanılır.
arrive in a country|bir ülkeye varmak|A2|They arrived [in] Spain yesterday.|Dün İspanya'ya vardılar.|Ülke ve şehirlerle arrive in kullanılır.
travel by train|trenle seyahat etmek|A1|We usually travel [by] train.|Genellikle trenle seyahat ederiz.
walk to school|okula yürümek|A1|The children walk [to] school.|Çocuklar okula yürür.
get to the airport|havaalanına ulaşmak|A2|How do I get [to] the airport?|Havaalanına nasıl ulaşırım?
invite someone to dinner|birini akşam yemeğine davet etmek|A2|We invited her [to] dinner.|Onu akşam yemeğine davet ettik.
thank someone for something|birine bir şey için teşekkür etmek|A2|I thanked him [for] his help.|Yardımı için ona teşekkür ettim.
apologise for something|bir şey için özür dilemek|B1|I apologised [for] being late.|Geç kaldığım için özür diledim.
apologise to someone|birinden özür dilemek|B1|You should apologise [to] her.|Ondan özür dilemelisin.
depend on someone|birine güvenip dayanmak|B1|You can depend [on] me.|Bana güvenebilirsin.
rely on someone|birine bel bağlamak|B1|We rely [on] each other.|Birbirimize güveniyoruz.
care about someone|birini önemsemek|A2|I care [about] my friends.|Arkadaşlarımı önemsiyorum.
worry about something|bir şey için endişelenmek|A2|Don't worry [about] the exam.|Sınav için endişelenme.
laugh at something|bir şeye gülmek|A2|Everyone laughed [at] the joke.|Herkes şakaya güldü.
smile at someone|birine gülümsemek|A2|The baby smiled [at] me.|Bebek bana gülümsedi.
shout at someone|birine bağırmak|A2|Please don't shout [at] me.|Lütfen bana bağırma.
dream about something|bir şeyin rüyasını görmek|A2|I dreamed [about] the sea last night.|Dün gece rüyamda denizi gördüm.
dream of doing something|bir şey yapmanın hayalini kurmak|B1|She dreams [of] opening a café.|Bir kafe açmanın hayalini kuruyor.
prepare for something|bir şeye hazırlanmak|A2|I'm preparing [for] my driving test.|Ehliyet sınavıma hazırlanıyorum.
apply for a job|iş başvurusunda bulunmak|B1|He applied [for] a job at the hospital.|Hastanede bir işe başvurdu.
search for something|bir şeyi aramak|B1|We're searching [for] a new flat.|Yeni bir daire arıyoruz.
explain something to someone|bir şeyi birine açıklamak|A2|Can you explain this [to] me?|Bunu bana açıklayabilir misin?|Explain sonrasında dinleyiciden önce to kullanılır.|Can you explain me this?
borrow something from someone|birinden bir şey ödünç almak|A2|I borrowed a book [from] my sister.|Kız kardeşimden bir kitap ödünç aldım.
lend something to someone|birine bir şey ödünç vermek|A2|I lent my bike [to] a friend.|Bisikletimi bir arkadaşıma ödünç verdim.
spend money on something|bir şeye para harcamak|A2|We spend too much money [on] food.|Yiyeceğe çok fazla para harcıyoruz.
concentrate on something|bir şeye odaklanmak|B1|I can't concentrate [on] my work.|İşime odaklanamıyorum.
focus on something|bir şeye yoğunlaşmak|B1|Let's focus [on] one problem at a time.|Her seferinde bir soruna odaklanalım.
deal with a problem|bir sorunla ilgilenmek|B1|I'll deal [with] the problem tomorrow.|Sorunla yarın ilgileneceğim.
suffer from something|bir rahatsızlıktan muzdarip olmak|B1|She suffers [from] back pain.|Sırt ağrısı çekiyor.
recover from something|bir şeyden sonra iyileşmek|B1|He's recovering [from] the flu.|Gripten sonra iyileşiyor.
believe in yourself|kendine inanmak|B1|You need to believe [in] yourself.|Kendine inanman gerekiyor.
hear about something|bir şeyi duymak|A2|Did you hear [about] the new café?|Yeni kafeyi duydun mu?
hear of someone|birinin adını duymuş olmak|B1|I've never heard [of] that singer.|O şarkıcının adını hiç duymadım.
remind someone of something|birine bir şeyi hatırlatmak|B1|This song reminds me [of] home.|Bu şarkı bana evimi hatırlatıyor.
protect someone from something|birini bir şeyden korumak|B1|This coat protects you [from] the cold.|Bu palto seni soğuktan korur.
prevent someone from doing something|birinin bir şey yapmasını engellemek|B2|The rain prevented us [from] leaving.|Yağmur çıkmamızı engelledi.
stop someone from doing something|birini bir şey yapmaktan alıkoymak|B1|The noise stopped me [from] sleeping.|Gürültü uyumama engel oldu.
accuse someone of something|birini bir şeyle suçlamak|B2|They accused him [of] lying.|Onu yalan söylemekle suçladılar.
blame someone for something|birini bir şeyden dolayı suçlamak|B1|Don't blame me [for] the delay.|Gecikme için beni suçlama.
complain about something|bir şeyden şikâyet etmek|B1|Customers complained [about] the noise.|Müşteriler gürültüden şikâyet etti.
complain to someone|birine şikâyette bulunmak|B1|I complained [to] the manager.|Müdüre şikâyette bulundum.
insist on something|bir şeyde ısrar etmek|B2|She insisted [on] paying for lunch.|Öğle yemeğini ödemekte ısrar etti.
succeed in doing something|bir şeyi yapmayı başarmak|B1|We succeeded [in] finding a cheaper flat.|Daha ucuz bir daire bulmayı başardık.
participate in something|bir şeye katılmak|B1|Everyone can participate [in] the discussion.|Herkes tartışmaya katılabilir.
benefit from something|bir şeyden yararlanmak|B2|You could benefit [from] extra practice.|Ek pratikten yararlanabilirsin.
contribute to something|bir şeye katkıda bulunmak|B2|Everyone contributed [to] the discussion.|Herkes tartışmaya katkıda bulundu.
object to something|bir şeye itiraz etmek|B2|I object [to] paying extra.|Fazladan ödeme yapmaya itiraz ediyorum.
approve of something|bir şeyi onaylamak|B2|My parents approve [of] my decision.|Ailem kararımı onaylıyor.
refer to something|bir şeyden söz etmek|B2|Which email are you referring [to]?|Hangi e-postadan söz ediyorsun?
respond to something|bir şeye yanıt vermek|B1|Please respond [to] my email.|Lütfen e-postama yanıt ver.
reply to someone|birine cevap yazmak|A2|I haven't replied [to] her yet.|Ona henüz cevap yazmadım.
argue with someone|biriyle tartışmak|B1|I don't want to argue [with] you.|Seninle tartışmak istemiyorum.
argue about something|bir konu hakkında tartışmak|B1|They always argue [about] money.|Her zaman para hakkında tartışırlar.
divide something into parts|bir şeyi parçalara bölmek|B1|Divide the cake [into] six pieces.|Pastayı altı parçaya böl.
compare something with something|bir şeyi başka bir şeyle karşılaştırmak|B1|Compare this price [with] the others.|Bu fiyatı diğerleriyle karşılaştır.
translate something into English|bir şeyi İngilizceye çevirmek|B1|Can you translate this [into] English?|Bunu İngilizceye çevirebilir misin?
choose between two things|iki şey arasında seçim yapmak|A2|I can't choose [between] these two coats.|Bu iki palto arasında seçim yapamıyorum.
switch to something|bir şeye geçiş yapmak|B1|We switched [to] a cheaper phone plan.|Daha ucuz bir telefon tarifesine geçtik.
invest in something|bir şeye yatırım yapmak|B2|They invested [in] a new business.|Yeni bir işe yatırım yaptılar.
vote for someone|birine oy vermek|B1|Who did you vote [for]?|Kime oy verdin?
`],
  ["adjective_preposition", `
be interested in something|bir şeye ilgi duymak|A1|I'm interested [in] technology.|Teknolojiye ilgi duyuyorum.|Interested sıfatıyla ilgi alanından önce in kullanılır.|I'm interested on technology.
be good at something|bir şeyde iyi olmak|A1|She is good [at] mathematics.|Matematikte iyidir.|Bir beceriyi belirtirken good at kullanılır.|She is good in mathematics.
be bad at something|bir şeyde kötü olmak|A1|I'm bad [at] remembering names.|İsimleri hatırlamakta kötüyüm.
be afraid of something|bir şeyden korkmak|A1|He's afraid [of] spiders.|Örümceklerden korkuyor.
be happy with something|bir şeyden memnun olmak|A2|I'm happy [with] my new phone.|Yeni telefonumdan memnunum.
be happy about something|bir şeye sevinmek|A2|We're happy [about] the news.|Habere sevindik.
be angry with someone|birine kızgın olmak|A2|She's angry [with] me.|Bana kızgın.
be angry about something|bir şeye kızgın olmak|A2|He's angry [about] the cancellation.|İptale kızgın.
be worried about something|bir şeyden endişeli olmak|A2|I'm worried [about] the exam.|Sınavdan endişeliyim.
be excited about something|bir şey için heyecanlı olmak|A2|The kids are excited [about] the trip.|Çocuklar gezi için heyecanlı.
be tired of something|bir şeyden bıkmış olmak|A2|I'm tired [of] waiting.|Beklemekten bıktım.|Tired of bıkkınlık, tired from ise yorgunluğun nedenini belirtir.
be proud of someone|biriyle gurur duymak|A2|We're proud [of] you.|Seninle gurur duyuyoruz.
be full of something|bir şeyle dolu olmak|A2|The room is full [of] people.|Oda insanlarla dolu.
be ready for something|bir şeye hazır olmak|A1|Are you ready [for] lunch?|Öğle yemeğine hazır mısın?
be late for something|bir şeye geç kalmak|A1|I'm late [for] work.|İşe geç kaldım.
be sorry for someone|birine üzülmek|A2|I feel sorry [for] him.|Onun için üzülüyorum.
be sorry about something|bir şey için üzgün olmak|A2|I'm sorry [about] the mess.|Dağınıklık için üzgünüm.
be kind to someone|birine nazik davranmak|A2|Be kind [to] your sister.|Kız kardeşine nazik davran.
be nice to someone|birine iyi davranmak|A1|She's always nice [to] me.|Bana her zaman iyi davranır.
be married to someone|biriyle evli olmak|A2|She's married [to] a doctor.|Bir doktorla evli.|Married to kullanılır; Türkçedeki ile yapısı with değildir.|She's married with a doctor.
be different from something|bir şeyden farklı olmak|A2|This town is different [from] my hometown.|Bu kasaba memleketimden farklı.
be similar to something|bir şeye benzer olmak|A2|Your bag is similar [to] mine.|Çantan benimkine benziyor.
be famous for something|bir şeyle ünlü olmak|A2|This town is famous [for] its cheese.|Bu kasaba peyniriyle ünlü.
be popular with someone|bir grup arasında popüler olmak|B1|This game is popular [with] teenagers.|Bu oyun gençler arasında popüler.
be close to somewhere|bir yere yakın olmak|A2|Our hotel is close [to] the beach.|Otelimiz plaja yakın.
be far from somewhere|bir yerden uzak olmak|A1|The station is far [from] here.|İstasyon buradan uzak.
be keen on something|bir şeye meraklı olmak|B1|I'm keen [on] cycling.|Bisiklete binmeye meraklıyım.
be fond of someone|birini sevmek|B1|I'm very fond [of] my neighbours.|Komşularımı çok severim.
be bored with something|bir şeyden sıkılmak|A2|I'm bored [with] this game.|Bu oyundan sıkıldım.
be surprised at something|bir şeye şaşırmak|B1|I was surprised [at] the price.|Fiyata şaşırdım.
be shocked by something|bir şey karşısında şoke olmak|B1|We were shocked [by] the news.|Haber karşısında şoke olduk.
be disappointed with something|bir şeyden hayal kırıklığına uğramak|B1|I was disappointed [with] the meal.|Yemek beni hayal kırıklığına uğrattı.
be pleased with something|bir şeyden hoşnut olmak|B1|She's pleased [with] the result.|Sonuçtan hoşnut.
be satisfied with something|bir şeyden tatmin olmak|B1|Are you satisfied [with] the service?|Hizmetten memnun musun?
be responsible for something|bir şeyden sorumlu olmak|B1|Who's responsible [for] this project?|Bu projeden kim sorumlu?
be capable of something|bir şeyi yapabilecek durumda olmak|B2|You're capable [of] doing this.|Bunu yapabilecek durumdasın.
be aware of something|bir şeyin farkında olmak|B1|Are you aware [of] the risks?|Risklerin farkında mısın?
be familiar with something|bir şeye aşina olmak|B1|I'm familiar [with] this area.|Bu bölgeye aşinayım.
be used to something|bir şeye alışkın olmak|B1|I'm used [to] getting up early.|Erken kalkmaya alışkınım.|Be used to sonrasında isim veya -ing gelir; geçmiş alışkanlık olan used to ile karıştırma.
be accustomed to something|bir şeye alışmış olmak|B2|She's accustomed [to] working at night.|Geceleri çalışmaya alışmış.
be suitable for someone|birine uygun olmak|B1|This film isn't suitable [for] children.|Bu film çocuklara uygun değil.
be available to someone|birinin kullanımına açık olmak|B1|The gym is available [to] all guests.|Spor salonu tüm konukların kullanımına açık.
be free from something|bir şey içermemek|B2|This drink is free [from] added sugar.|Bu içecek ilave şeker içermez.
be short of something|bir şeyin eksikliğini çekmek|B1|We're short [of] time.|Zamanımız az.
be rich in something|bir şey bakımından zengin olmak|B1|These vegetables are rich [in] vitamins.|Bu sebzeler vitamin bakımından zengin.
be busy with something|bir şeyle meşgul olmak|A2|I'm busy [with] my homework.|Ödevimle meşgulüm.
be nervous about something|bir şey için gergin olmak|A2|I'm nervous [about] my interview.|Mülakatım için gerginim.
be curious about something|bir şeyi merak etmek|B1|I'm curious [about] your new job.|Yeni işini merak ediyorum.
be jealous of someone|birini kıskanmak|B1|He's jealous [of] his brother.|Erkek kardeşini kıskanıyor.
be scared of something|bir şeyden ürkmek|A2|She's scared [of] dogs.|Köpeklerden korkuyor.
be ashamed of something|bir şeyden utanmak|B1|I'm ashamed [of] my behaviour.|Davranışımdan utanıyorum.
be embarrassed about something|bir şeyden mahcup olmak|B1|He was embarrassed [about] his mistake.|Hatasından dolayı mahcup oldu.
be grateful for something|bir şey için minnettar olmak|B1|I'm grateful [for] your support.|Desteğin için minnettarım.
be grateful to someone|birine minnettar olmak|B1|We're grateful [to] our neighbours.|Komşularımıza minnettarız.
be patient with someone|birine sabırlı davranmak|B1|Please be patient [with] me.|Lütfen bana karşı sabırlı ol.
be rude to someone|birine kaba davranmak|A2|Don't be rude [to] the waiter.|Garsona kaba davranma.
be honest with someone|birine dürüst davranmak|B1|I'll be honest [with] you.|Sana dürüst olacağım.
be serious about something|bir konuda ciddi olmak|B1|She's serious [about] learning English.|İngilizce öğrenme konusunda ciddi.
be confident about something|bir konuda kendinden emin olmak|B1|I feel confident [about] the test.|Sınav konusunda kendime güveniyorum.
be addicted to something|bir şeye bağımlı olmak|B2|He's addicted [to] his phone.|Telefonuna bağımlı.
`],
];

groups.push(["verb_noun", `
take a shower|duş almak|A1|I take [a] shower every morning.|Her sabah duş alırım.|Take a shower kalıbında tekil shower önünde a bulunur.|I take shower every morning.
make a decision|karar vermek|A2|We need to make [a] decision today.|Bugün bir karar vermemiz gerekiyor.|Decision ile make kullanılır; do kullanılmaz.|We need to do a decision.
have breakfast|kahvaltı yapmak|A1|I [have] breakfast at seven.|Saat yedide kahvaltı yaparım.|Genel öğün adlarında article kullanılmaz: have breakfast.|I have a breakfast at seven every day.
make a mistake|hata yapmak|A1|Everyone can make [a] mistake.|Herkes hata yapabilir.
take a break|mola vermek|A1|Let's take [a] break.|Mola verelim.
have a look|bir göz atmak|A1|Can I have [a] look?|Bir göz atabilir miyim?
do homework|ödev yapmak|A1|I [do] homework after school.|Okuldan sonra ödev yaparım.|Homework sayılamaz; a homework denmez ve fiil do olur.
make a phone call|telefon görüşmesi yapmak|A1|I need to make [a] phone call.|Bir telefon görüşmesi yapmam gerekiyor.
have lunch|öğle yemeği yemek|A1|We [have] lunch at noon.|Öğle yemeğini öğlen yeriz.
have dinner|akşam yemeği yemek|A1|Let's [have] dinner together.|Birlikte akşam yemeği yiyelim.
drink a cup of tea|bir fincan çay içmek|A1|I drink a cup [of] tea after lunch.|Öğle yemeğinden sonra bir fincan çay içerim.
take a photo|fotoğraf çekmek|A1|Can you take [a] photo of us?|Fotoğrafımızı çekebilir misin?
catch a bus|otobüse yetişmek|A1|I need to catch [a] bus.|Bir otobüse yetişmem gerekiyor.
miss the train|treni kaçırmak|A1|Don't miss [the] train.|Treni kaçırma.
watch TV|televizyon izlemek|A1|We [watch] TV after dinner.|Akşam yemeğinden sonra televizyon izleriz.
read a book|kitap okumak|A1|She's reading [a] book.|Kitap okuyor.
play the guitar|gitar çalmak|A1|Can you play [the] guitar?|Gitar çalabiliyor musun?|Müzik aletlerini çalma becerisinden söz ederken the kullanılır.
play football|futbol oynamak|A1|We [play] football on Sundays.|Pazar günleri futbol oynarız.|Spor adının önüne article gelmez: play football.
go shopping|alışverişe gitmek|A1|Let's [go] shopping on Saturday.|Cumartesi alışverişe gidelim.
go for a walk|yürüyüşe çıkmak|A1|We went [for] a walk after lunch.|Öğle yemeğinden sonra yürüyüşe çıktık.
get some sleep|biraz uyumak|A2|You should get [some] sleep.|Biraz uyumalısın.
get a job|iş bulmak|A1|She got [a] job in a shop.|Bir mağazada iş buldu.
have a good time|iyi vakit geçirmek|A1|Did you have [a] good time?|İyi vakit geçirdin mi?
have fun|eğlenmek|A1|We always [have] fun together.|Birlikte her zaman eğleniriz.
have a rest|dinlenmek|A1|Sit down and have [a] rest.|Otur ve dinlen.
have a cold|nezle olmak|A1|I have [a] cold.|Nezleyim.
have a headache|başı ağrımak|A1|I have [a] headache.|Başım ağrıyor.
have a problem|bir sorunu olmak|A1|We have [a] problem with the car.|Arabayla ilgili bir sorunumuz var.
have a question|bir sorusu olmak|A1|I have [a] question.|Bir sorum var.
have a chat|sohbet etmek|A2|Let's have [a] chat over coffee.|Kahve içerken sohbet edelim.
have a seat|oturmak (davet)|A1|Please have [a] seat.|Lütfen oturun.
take a taxi|taksiye binmek|A1|We can take [a] taxi home.|Eve taksiyle gidebiliriz.
take the bus|otobüse binmek|A1|I take [the] bus to school.|Okula otobüsle giderim.
take a test|sınava girmek|A2|I'm taking [a] test tomorrow.|Yarın sınava giriyorum.
take notes|not almak|A2|Please [take] notes during the lesson.|Lütfen ders sırasında not alın.
take medicine|ilaç almak|A2|I [take] medicine every morning.|Her sabah ilaç alırım.
take your time|acele etmemek|A2|[Take] your time; we're not in a hurry.|Acele etme; acelemiz yok.
take care of someone|birine bakmak|A2|She takes care [of] her grandmother.|Büyükannesine bakıyor.
take part in something|bir şeye katılmak (take part)|B1|I took part [in] the race.|Yarışa katıldım.
take a chance|risk alıp denemek|B1|Let's take [a] chance and ask her.|Bir şansımızı deneyip ona soralım.
take responsibility for something|bir şeyin sorumluluğunu almak|B2|We must take responsibility [for] our actions.|Davranışlarımızın sorumluluğunu almalıyız.
take advantage of something|bir fırsattan yararlanmak|B2|Take advantage [of] the free lessons.|Ücretsiz derslerden yararlan.
take an interest in something|bir şeye ilgi göstermeye başlamak|B1|He took an interest [in] gardening.|Bahçeciliğe ilgi göstermeye başladı.
make an appointment|randevu almak|A2|I'd like to make [an] appointment.|Randevu almak istiyorum.|Appointment ünlü sesle başladığı için an kullanılır.
make an effort|çaba göstermek|B1|Please make [an] effort to arrive on time.|Lütfen zamanında gelmek için çaba göster.
make an excuse|bahane bulmak|B1|Don't make [an] excuse.|Bahane bulma.
make a plan|plan yapmak|A2|Let's make [a] plan for the weekend.|Hafta sonu için plan yapalım.
make a list|liste yapmak|A1|Make [a] list before you go shopping.|Alışverişe gitmeden önce liste yap.
make a difference|fark yaratmak|B1|A little help can make [a] difference.|Biraz yardım fark yaratabilir.
make a choice|seçim yapmak|B1|You have to make [a] choice.|Bir seçim yapmalısın.
make a promise|söz vermek|B1|Don't make [a] promise you can't keep.|Tutamayacağın bir söz verme.
make a complaint|şikâyette bulunmak|B1|I'd like to make [a] complaint.|Şikâyette bulunmak istiyorum.
make a suggestion|öneride bulunmak|B1|Can I make [a] suggestion?|Bir öneride bulunabilir miyim?
make an offer|teklifte bulunmak|B1|They made [an] offer on the house.|Ev için teklifte bulundular.
make progress|ilerleme kaydetmek|A2|You're [making] progress in English.|İngilizcede ilerleme kaydediyorsun.|Progress sayılamaz; make a progress denmez.
make friends|arkadaş edinmek|A2|It's easy to [make] friends here.|Burada arkadaş edinmek kolay.
make money|para kazanmak|A2|She [makes] money by selling cakes.|Pasta satarak para kazanıyor.
make sure|emin olmak|A2|[Make] sure the door is locked.|Kapının kilitli olduğundan emin ol.
make sense|anlamlı gelmek|B1|That doesn't [make] sense to me.|Bu bana mantıklı gelmiyor.
do the dishes|bulaşıkları yıkamak|A1|I'll do [the] dishes tonight.|Bu akşam bulaşıkları ben yıkarım.
do the laundry|çamaşır yıkamak|A2|I do [the] laundry on Sundays.|Pazar günleri çamaşır yıkarım.
do the shopping|alışverişi yapmak|A1|Who does [the] shopping in your family?|Ailenizde alışverişi kim yapar?
do your best|elinden geleni yapmak|A2|Just [do] your best.|Sadece elinden geleni yap.
do someone a favour|birine iyilik yapmak|A2|Could you do me [a] favour?|Bana bir iyilik yapabilir misin?
do exercise|egzersiz yapmak|A2|I [do] exercise every day.|Her gün egzersiz yaparım.
do research|araştırma yapmak|B1|We're [doing] research for a school project.|Bir okul projesi için araştırma yapıyoruz.
do business|iş yapmak|B1|We [do] business with local shops.|Yerel mağazalarla iş yapıyoruz.
give someone a hand|birine yardım etmek|A2|Can you give me [a] hand?|Bana yardım edebilir misin?
give advice|tavsiye vermek|A2|She always [gives] good advice.|Her zaman iyi tavsiye verir.
give a presentation|sunum yapmak|B1|I'm giving [a] presentation tomorrow.|Yarın bir sunum yapıyorum.
give permission|izin vermek|B1|Did your parents [give] permission?|Ailen izin verdi mi?
give someone a call|birini telefonla aramak|A2|Give me [a] call when you arrive.|Varınca beni ara.
keep a promise|sözünü tutmak|B1|It's important to keep [a] promise.|Sözünü tutmak önemlidir.
keep in touch|iletişimde kalmak|A2|Let's keep [in] touch.|İletişimde kalalım.
keep a secret|sır saklamak|A2|Can you keep [a] secret?|Sır saklayabilir misin?
keep an eye on something|bir şeye göz kulak olmak|B1|Can you keep an eye [on] my bag?|Çantama göz kulak olabilir misin?
keep calm|sakin kalmak|A2|Try to [keep] calm.|Sakin kalmaya çalış.
save time|zaman kazanmak|A2|This app [saves] time.|Bu uygulama zaman kazandırır.
save money|para biriktirmek|A2|I'm trying to [save] money.|Para biriktirmeye çalışıyorum.
spend time with someone|biriyle vakit geçirmek|A2|I like spending time [with] my family.|Ailemle vakit geçirmeyi severim.
pay attention to something|bir şeye dikkat etmek|B1|Pay attention [to] the instructions.|Talimatlara dikkat et.
pay a bill|fatura ödemek|A2|I need to pay [a] bill.|Bir fatura ödemem gerekiyor.
pay in cash|nakit ödemek|A1|Can I pay [in] cash?|Nakit ödeyebilir miyim?
pay by card|kartla ödemek|A1|I'd like to pay [by] card.|Kartla ödemek istiyorum.
book a table|masa ayırtmak|A2|I'd like to book [a] table for two.|İki kişilik masa ayırtmak istiyorum.
book a room|oda ayırtmak|A2|We need to book [a] room for Friday.|Cuma için oda ayırtmamız gerekiyor.
catch a cold|soğuk algınlığına yakalanmak|A2|I think I've caught [a] cold.|Sanırım soğuk algınlığına yakalandım.
break the law|kanunu çiğnemek|B1|You could break [the] law by doing that.|Bunu yaparak kanunu çiğneyebilirsin.
break a habit|bir alışkanlığı bırakmak|B1|It's hard to break [a] habit.|Bir alışkanlığı bırakmak zor.
lose your way|yolunu kaybetmek|A2|We [lost] our way in the city.|Şehirde yolumuzu kaybettik.
lose touch|iletişimi kaybetmek|B1|We [lost] touch after school.|Okuldan sonra iletişimimiz koptu.
change your mind|fikrini değiştirmek|A2|You can [change] your mind later.|Fikrini sonra değiştirebilirsin.
get married|evlenmek|A2|They're [getting] married in June.|Haziranda evleniyorlar.
get dressed|giyinmek|A1|Hurry up and [get] dressed.|Acele et ve giyin.
get ready for something|bir şeye hazırlanmak (get ready)|A2|I'm getting ready [for] work.|İşe gitmek için hazırlanıyorum.
get permission|izin almak|B1|You need to [get] permission first.|Önce izin almalısın.
tell the truth|doğruyu söylemek|A2|Please tell [the] truth.|Lütfen doğruyu söyle.
tell a lie|yalan söylemek|A2|Don't tell [a] lie.|Yalan söyleme.
ask a question|soru sormak|A1|Can I ask [a] question?|Bir soru sorabilir miyim?
answer the phone|telefona cevap vermek|A1|Could you answer [the] phone?|Telefona cevap verebilir misin?
`]);

groups.push(["noun_phrase", `
a glass of water|bir bardak su|A1|I need [a] glass of water.|Bir bardak suya ihtiyacım var.|Glass sayılabilen tekil bir kaptır; a gerekir. Water miktarı of ile bağlanır.|I need glass of water.
a cup of coffee|bir fincan kahve|A1|Would you like a cup [of] coffee?|Bir fincan kahve ister misin?
a bottle of water|bir şişe su|A1|Can I have a bottle [of] water?|Bir şişe su alabilir miyim?
a piece of advice|bir tavsiye|A2|Let me give you a piece [of] advice.|Sana bir tavsiye vereyim.|Advice sayılamaz; tek tavsiye için a piece of advice denir.|Let me give you an advice.
a piece of information|bir bilgi|A2|I need one more piece [of] information.|Bir bilgiye daha ihtiyacım var.|Information sayılamaz; an information denmez.
a piece of cake|bir dilim pasta|A1|Would you like a piece [of] cake?|Bir dilim pasta ister misin?|Bu örnekte gerçek bir pasta dilimi anlatılır; deyim anlamı hedeflenmez.
a slice of bread|bir dilim ekmek|A1|I had a slice [of] bread with soup.|Çorbayla bir dilim ekmek yedim.
a loaf of bread|bir somun ekmek|A2|Please buy a loaf [of] bread.|Lütfen bir somun ekmek al.
a bowl of soup|bir kâse çorba|A1|I'd like a bowl [of] soup.|Bir kâse çorba istiyorum.
a plate of rice|bir tabak pilav|A1|He ordered a plate [of] rice.|Bir tabak pilav sipariş etti.
a pair of shoes|bir çift ayakkabı|A1|I bought a pair [of] shoes.|Bir çift ayakkabı aldım.
a pair of glasses|bir gözlük|A1|I need a new pair [of] glasses.|Yeni bir gözlüğe ihtiyacım var.
a lot of people|birçok insan|A1|There are a lot [of] people here.|Burada birçok insan var.
lots of time|bol zaman|A1|We've got lots [of] time.|Bol zamanımız var.
a bit of time|biraz zaman|A2|I need a bit [of] time to think.|Düşünmek için biraz zamana ihtiyacım var.
a little bit|birazcık|A1|I'm [a] little bit tired.|Birazcık yorgunum.
a few minutes|birkaç dakika|A1|I'll be ready in [a] few minutes.|Birkaç dakika içinde hazır olacağım.|A few olumlu anlamda birkaç demektir; few ise çok az anlamı taşır.
a couple of days|bir iki gün|A2|I'll be away for a couple [of] days.|Bir iki gün burada olmayacağım.
the rest of the day|günün geri kalanı|A2|I'm free for the rest [of] the day.|Günün geri kalanında boşum.
the end of the road|yolun sonu|A1|The shop is at the end [of] the road.|Mağaza yolun sonunda.
the beginning of the week|haftanın başı|A2|Let's meet at the beginning [of] the week.|Haftanın başında buluşalım.
the middle of the night|gecenin ortası|A2|I woke up in the middle [of] the night.|Gecenin ortasında uyandım.
the top of the page|sayfanın üstü|A1|Write your name at the top [of] the page.|Adını sayfanın üstüne yaz.
the bottom of the page|sayfanın altı|A1|Look at the bottom [of] the page.|Sayfanın altına bak.
the centre of town|şehir merkezi|A2|Our hotel is in the centre [of] town.|Otelimiz şehir merkezinde.
the other side|diğer taraf|A2|The bank is on [the] other side of the street.|Banka sokağın diğer tarafında.
the same thing|aynı şey|A1|We ordered [the] same thing.|Aynı şeyi sipariş ettik.|Same genellikle the ile kullanılır.|We ordered same thing.
the right answer|doğru cevap|A1|What is [the] right answer?|Doğru cevap nedir?
the wrong number|yanlış numara|A1|Sorry, I've got [the] wrong number.|Üzgünüm, yanlış numarayı aradım.
an hour and a half|bir buçuk saat|A2|The journey takes [an] hour and a half.|Yolculuk bir buçuk saat sürüyor.|Hour sözcüğünde h okunmaz; ilk ses ünlü olduğu için an kullanılır.|The journey takes a hour and a half.
a university student|bir üniversite öğrencisi|A1|She's [a] university student.|O bir üniversite öğrencisi.|University /juː/ sesiyle başlar; an yerine a gelir.|She's an university student.
an umbrella|bir şemsiye|A1|You should take [an] umbrella.|Bir şemsiye almalısın.
an important question|önemli bir soru|A2|That's [an] important question.|Bu önemli bir soru.
an interesting idea|ilginç bir fikir|A2|That's [an] interesting idea.|Bu ilginç bir fikir.
a good idea|iyi bir fikir|A1|That's [a] good idea.|Bu iyi bir fikir.
a bad idea|kötü bir fikir|A1|Driving in this weather is [a] bad idea.|Bu havada araba kullanmak kötü bir fikir.
a waste of time|zaman kaybı|B1|Waiting here is a waste [of] time.|Burada beklemek zaman kaybı.
a way of life|bir yaşam biçimi|B1|For her, cycling is a way [of] life.|Onun için bisiklete binmek bir yaşam biçimi.
a matter of time|an meselesi|B2|It's only a matter [of] time before they find out.|Öğrenmeleri an meselesi.
a sense of humour|mizah anlayışı|B1|She has a great sense [of] humour.|Harika bir mizah anlayışı var.
a lack of sleep|uyku eksikliği|B1|A lack [of] sleep makes me tired.|Uyku eksikliği beni yorgun düşürüyor.
a change of plan|plan değişikliği|B1|There's been a change [of] plan.|Planda değişiklik oldu.
a group of friends|bir arkadaş grubu|A1|I went with a group [of] friends.|Bir arkadaş grubuyla gittim.
a member of the team|takımın bir üyesi|A2|She's a member [of] the team.|O takımın bir üyesi.
a friend of mine|bir arkadaşım|A2|He's a friend [of] mine.|O bir arkadaşım.
a family of four|dört kişilik bir aile|A2|We're a family [of] four.|Dört kişilik bir aileyiz.
an only child|tek çocuk|A2|I'm [an] only child.|Ailemin tek çocuğuyum.
an old friend|eski bir arkadaş|A1|I met [an] old friend yesterday.|Dün eski bir arkadaşımla karşılaştım.
the bus stop|otobüs durağı|A1|I'll meet you at [the] bus stop.|Seninle otobüs durağında buluşurum.
the train station|tren istasyonu|A1|Where is [the] train station?|Tren istasyonu nerede?
the way home|eve dönüş yolu|A2|I bought milk on [the] way home.|Eve dönerken süt aldım.
the first time|ilk kez|A1|This is [the] first time I've been here.|Buraya ilk kez geliyorum.
the last time|son kez|A2|When was [the] last time you saw her?|Onu en son ne zaman gördün?
the next day|ertesi gün|A2|We left [the] next day.|Ertesi gün ayrıldık.
next week|gelecek hafta|A1|I'll see you [next] week.|Gelecek hafta görüşürüz.|Next week önünde in veya the kullanılmaz.
last night|dün gece|A1|I slept well [last] night.|Dün gece iyi uyudum.
every other day|gün aşırı|B1|I go running [every] other day.|Gün aşırı koşuya çıkarım.
once a week|haftada bir|A1|We meet once [a] week.|Haftada bir buluşuruz.
twice a month|ayda iki kez|A1|She visits twice [a] month.|Ayda iki kez ziyarete gelir.
three times a day|günde üç kez|A2|The bus runs three times [a] day.|Otobüs günde üç kez çalışır.
one of my friends|arkadaşlarımdan biri|A2|One [of] my friends lives nearby.|Arkadaşlarımdan biri yakınlarda yaşıyor.|One of sonrasında çoğul isim kullanılır.|One of my friend lives nearby.
most of the time|çoğu zaman|A2|I work from home most [of] the time.|Çoğu zaman evden çalışırım.
some of the people|insanların bazıları|A2|Some [of] the people left early.|İnsanların bazıları erken ayrıldı.
all of us|hepimiz|A2|All [of] us enjoyed the film.|Hepimiz filmden keyif aldık.
both of them|ikisinin de|A2|Both [of] them speak English.|İkisi de İngilizce konuşuyor.
`]);

groups.push(["common_expression", `
at the moment|şu anda|A1|I'm busy [at] the moment.|Şu anda meşgulüm.
in the morning|sabahleyin|A1|I go running [in] the morning.|Sabahleyin koşuya çıkarım.|Günün bölümleriyle in the; night ile at night kullanılır.|I go running on the morning.
in the afternoon|öğleden sonra|A1|Let's meet [in] the afternoon.|Öğleden sonra buluşalım.
in the evening|akşamleyin|A1|I read [in] the evening.|Akşamleyin okurum.
at night|geceleri|A1|It's quiet here [at] night.|Burada geceleri sessizlik olur.
on time|zamanında|A2|The train arrived [on] time.|Tren zamanında geldi.|On time planlanan saatte; in time ise geç olmadan demektir.
in time|vaktinde yetişerek|A2|We arrived [in] time to catch the train.|Trene yetişecek kadar erken vardık.
at home|evde|A1|I'll be [at] home all day.|Bütün gün evde olacağım.
at work|işte|A1|She's [at] work right now.|Şu anda işte.
at school|okulda|A1|The children are [at] school.|Çocuklar okulda.
in bed|yatakta|A1|He's still [in] bed.|Hâlâ yatakta.
on the bus|otobüste|A1|I'm [on] the bus now.|Şimdi otobüsteyim.
on the train|trende|A1|We met [on] the train.|Trende tanıştık.
in the car|arabada|A1|I left my phone [in] the car.|Telefonumu arabada bıraktım.
on foot|yürüyerek|A1|We went there [on] foot.|Oraya yürüyerek gittik.|Ulaşım biçimlerinde by bus ama on foot kullanılır.|We went there by foot.
by mistake|yanlışlıkla|A2|I took your bag [by] mistake.|Çantanı yanlışlıkla aldım.
by chance|tesadüfen|B1|We met [by] chance.|Tesadüfen karşılaştık.
on purpose|bilerek|B1|I didn't do it [on] purpose.|Bunu bilerek yapmadım.
in a hurry|acele içinde|A2|Sorry, I'm [in] a hurry.|Üzgünüm, acelem var.
in trouble|başı dertte|A2|I think we're [in] trouble.|Sanırım başımız dertte.
in danger|tehlikede|B1|The animals are [in] danger.|Hayvanlar tehlikede.
in fact|aslında|A2|[In] fact, I've never been there.|Aslında oraya hiç gitmedim.
of course|elbette|A1|[Of] course you can come.|Elbette gelebilirsin.
at least|en azından|A2|At [least] we tried.|En azından denedik.
at first|ilk başta|A2|I didn't like it [at] first.|İlk başta hoşuma gitmedi.
at last|nihayet|A2|You're here [at] last!|Nihayet geldin!
in the end|sonunda|A2|[In] the end, we stayed home.|Sonunda evde kaldık.
at the end of something|bir şeyin sonunda|A2|There's a test [at] the end of the course.|Kursun sonunda bir sınav var.|At the end of belirli bir şeyin son noktasını belirtir.
for example|örneğin|A2|Try a team sport, [for] example, basketball.|Bir takım sporu dene; örneğin basketbol.
such as|gibi|B1|I like fruit such [as] apples and pears.|Elma ve armut gibi meyveleri severim.
instead of|yerine|A2|Let's walk instead [of] taking the bus.|Otobüse binmek yerine yürüyelim.
because of|nedeniyle|A2|We stayed inside because [of] the rain.|Yağmur nedeniyle içeride kaldık.|Because of ardından isim; because ardından cümle gelir.
in front of|önünde|A1|I'll wait in front [of] the shop.|Mağazanın önünde bekleyeceğim.
next to|yanında|A1|The bank is next [to] the supermarket.|Banka süpermarketin yanında.
opposite the bank|bankanın karşısında|A1|The café is [opposite] the bank.|Kafe bankanın karşısında.
on the left|solda|A1|The station is [on] the left.|İstasyon solda.
on the right|sağda|A1|The hotel is [on] the right.|Otel sağda.
at the weekend|hafta sonunda|A1|What do you do [at] the weekend?|Hafta sonunda ne yaparsın?|Britanya İngilizcesinde at the weekend; Amerikan İngilizcesinde on the weekend yaygındır.
on Monday|pazartesi günü|A1|I'll call you [on] Monday.|Seni pazartesi arayacağım.
in June|haziranda|A1|Our holiday starts [in] June.|Tatilimiz haziranda başlıyor.
in summer|yazın|A1|It's hot here [in] summer.|Burası yazın sıcak olur.
at six o'clock|saat altıda|A1|Dinner is [at] six o'clock.|Akşam yemeği saat altıda.
on my birthday|doğum günümde|A1|We went out [on] my birthday.|Doğum günümde dışarı çıktık.
for a long time|uzun zamandır|A2|I've lived here [for] a long time.|Uzun zamandır burada yaşıyorum.|For süreyi; since başlangıç noktasını belirtir.
since last year|geçen yıldan beri|A2|I've worked here [since] last year.|Geçen yıldan beri burada çalışıyorum.
from time to time|zaman zaman|B1|We meet from time [to] time.|Zaman zaman buluşuruz.
so far|şimdiye kadar|B1|Everything is fine [so] far.|Şimdiye kadar her şey yolunda.
right now|tam şu anda|A1|I can't talk [right] now.|Tam şu anda konuşamam.
as soon as possible|mümkün olan en kısa sürede|A2|Please reply as soon [as] possible.|Lütfen mümkün olan en kısa sürede yanıt ver.
all of a sudden|birdenbire|B1|All [of] a sudden, the lights went out.|Birdenbire ışıklar söndü.
on the other hand|diğer yandan|B1|It's expensive; [on] the other hand, it's very good.|Pahalı; diğer yandan çok iyi.
in my opinion|bence|A2|[In] my opinion, we should wait.|Bence beklemeliyiz.
as far as I know|bildiğim kadarıyla|B1|As far [as] I know, she's at home.|Bildiğim kadarıyla evde.
by the way|bu arada|A2|[By] the way, how was your trip?|Bu arada yolculuğun nasıldı?
in other words|başka bir deyişle|B1|[In] other words, we need more time.|Başka bir deyişle daha fazla zamana ihtiyacımız var.
after all|ne de olsa|B1|Don't be too hard on him; [after] all, he's only ten.|Ona çok yüklenme; ne de olsa daha on yaşında.
above all|her şeyden önce|B2|[Above] all, be honest.|Her şeyden önce dürüst ol.
in general|genel olarak|B1|[In] general, I prefer tea.|Genel olarak çayı tercih ederim.
in particular|özellikle|B1|Is there anything [in] particular you want?|Özellikle istediğin bir şey var mı?
at the same time|aynı zamanda|A2|We arrived [at] the same time.|Aynı zamanda vardık.
for a while|bir süreliğine|A2|Can you stay [for] a while?|Bir süre kalabilir misin?
in advance|önceden|B1|You need to book [in] advance.|Önceden rezervasyon yapman gerekiyor.
on sale|indirimde|A2|These shoes are [on] sale.|Bu ayakkabılar indirimde.
out of stock|stokta kalmamış|B1|That size is out [of] stock.|O beden stokta kalmamış.
out of order|bozuk (cihaz)|A2|The lift is out [of] order.|Asansör bozuk.
out of breath|nefes nefese|B1|I was out [of] breath after running.|Koştuktan sonra nefes nefeseydim.
out of date|güncelliğini yitirmiş|B1|This information is out [of] date.|Bu bilgi güncelliğini yitirmiş.
up to date|güncel|B1|Keep your contact details up [to] date.|İletişim bilgilerini güncel tut.
under pressure|baskı altında|B2|She's [under] pressure at work.|İşte baskı altında.
on holiday|tatilde|A1|They're [on] holiday in Spain.|İspanya'da tatildeler.
on business|iş için|A2|I'm here [on] business.|Buraya iş için geldim.
in person|yüz yüze|B1|I'd rather talk [in] person.|Yüz yüze konuşmayı tercih ederim.
by myself|tek başıma|A2|I live [by] myself.|Tek başıma yaşıyorum.
on my own|kendi başıma|A2|I did it [on] my own.|Bunu kendi başıma yaptım.
in common|ortak olarak|B1|We have a lot [in] common.|Birçok ortak yönümüz var.
in charge of|sorumlu olarak|B1|Who's in charge [of] the kitchen?|Mutfaktan kim sorumlu?
in case of|durumunda|B1|[In] case of fire, use the stairs.|Yangın durumunda merdivenleri kullanın.|In case of ardından isim gelir; in case ardından cümle gelir.
in spite of|rağmen|B2|We went out in spite [of] the rain.|Yağmura rağmen dışarı çıktık.
according to|göre|B1|According [to] the forecast, it will rain.|Hava tahminine göre yağmur yağacak.
thanks to|sayesinde|B1|We finished early thanks [to] your help.|Yardımın sayesinde erken bitirdik.
`]);

groups.push(["sentence_pattern", `
I want to...|... yapmak istiyorum|A1|I want [to] learn English.|İngilizce öğrenmek istiyorum.|Want ardından fiil geliyorsa to + fiil kullanılır.|I want learn English.
I'd like to...|... yapmak isterim|A1|I'd like [to] order a coffee.|Bir kahve sipariş etmek isterim.
I'm going to...|... yapacağım (plan)|A1|I'm going [to] call her tonight.|Bu akşam onu arayacağım.
Would you like to...?|... yapmak ister misin?|A1|Would you like [to] join us?|Bize katılmak ister misin?
I need to...|... yapmam gerekiyor|A1|I need [to] go home.|Eve gitmem gerekiyor.
I have to...|... yapmak zorundayım|A1|I have [to] work tomorrow.|Yarın çalışmak zorundayım.
I don't have to...|... yapmak zorunda değilim|A2|I don't have [to] get up early.|Erken kalkmak zorunda değilim.|Don't have to zorunluluğun olmadığını belirtir; yasak anlamı taşımaz.
I'd love to...|... yapmayı çok isterim|A2|I'd love [to] visit Japan.|Japonya'yı ziyaret etmeyi çok isterim.
I'm trying to...|... yapmaya çalışıyorum|A2|I'm trying [to] find my keys.|Anahtarlarımı bulmaya çalışıyorum.
I hope to...|... yapmayı umuyorum|A2|I hope [to] see you soon.|Seni yakında görmeyi umuyorum.
I decided to...|... yapmaya karar verdim|A2|I decided [to] take the train.|Trene binmeye karar verdim.
I forgot to...|... yapmayı unuttum|A2|I forgot [to] bring my phone.|Telefonumu getirmeyi unuttum.
Don't forget to...|... yapmayı unutma|A2|Don't forget [to] lock the door.|Kapıyı kilitlemeyi unutma.
Remember to...|... yapmayı hatırla|A2|Remember [to] call your mum.|Anneni aramayı unutma.
It's time to...|... yapma zamanı|A1|It's time [to] leave.|Gitme zamanı.
It's important to...|... yapmak önemli|A2|It's important [to] get enough sleep.|Yeterince uyumak önemli.
It's easy to...|... yapmak kolay|A2|It's easy [to] use this app.|Bu uygulamayı kullanmak kolay.
It's hard to...|... yapmak zor|A2|It's hard [to] find a taxi here.|Burada taksi bulmak zor.
I'm happy to...|... yapmaktan mutluyum|A2|I'm happy [to] help.|Yardım etmekten mutluyum.
I'm looking forward to...|... yapmayı dört gözle bekliyorum|B1|I'm looking forward [to] seeing you.|Seni görmeyi dört gözle bekliyorum.|Buradaki to bir edattır; ardından fiilin -ing biçimi gelir.|I'm looking forward to see you.
Would you mind ...ing?|... yapar mısınız? (nazik rica)|B1|Would you mind [closing] the window?|Pencereyi kapatır mısınız?|Mind ardından fiilin -ing biçimi gelir.|Would you mind to close the window?
Do you mind if I...?|... yapmamın sakıncası var mı?|A2|Do you mind [if] I sit here?|Buraya oturmamın sakıncası var mı?
How about ...ing?|... yapmaya ne dersin?|A2|How [about] going for a walk?|Yürüyüşe çıkmaya ne dersin?|How about ardından isim veya -ing kullanılır.
What about ...ing?|... yapmaya ne dersin? (what about)|A2|What [about] having lunch together?|Birlikte öğle yemeği yemeye ne dersin?
Why don't we...?|neden ... yapmıyoruz?|A2|Why [don't] we take a break?|Neden mola vermiyoruz?
Let's...|haydi ... yapalım|A1|Let's [go] home.|Haydi eve gidelim.|Let's ardından fiilin yalın biçimi gelir; to kullanılmaz.|Let's to go home.
Shall we...?|... yapalım mı?|A2|[Shall] we open the window?|Pencereyi açalım mı?
Can you help me with...?|... konusunda bana yardım eder misin?|A1|Can you help me [with] my homework?|Ödevimde bana yardım eder misin?
Could you tell me...?|bana ... söyleyebilir misiniz?|A2|Could you [tell] me the time?|Bana saati söyleyebilir misiniz?
Could you show me how to...?|bana nasıl ... yapıldığını gösterir misiniz?|A2|Could you show me how [to] use this?|Bunu nasıl kullanacağımı gösterir misiniz?
Do you know where ... is?|... nerede biliyor musun?|A2|Do you know where the station [is]?|İstasyonun nerede olduğunu biliyor musun?|Dolaylı soruda düz cümle sırası kullanılır: where the station is.|Do you know where is the station?
I'd rather...|... yapmayı tercih ederim|B1|I'd [rather] stay at home.|Evde kalmayı tercih ederim.|Would rather sonrasında fiilin yalın biçimi kullanılır.
I prefer ... to ...|... yerine ... tercih ederim|A2|I prefer tea [to] coffee.|Kahve yerine çayı tercih ederim.
I used to...|eskiden ... yapardım|B1|I used [to] live near the sea.|Eskiden deniz kenarında yaşardım.|Used to + yalın fiil geçmiş alışkanlıktır; be used to + -ing alışkın olmaktır.
I didn't use to...|eskiden ... yapmazdım|B1|I didn't use [to] like coffee.|Eskiden kahve sevmezdim.
I'm about to...|... yapmak üzereyim|B1|I'm about [to] leave.|Çıkmak üzereyim.
I've just...|az önce ... yaptım|A2|I've [just] finished my homework.|Ödevimi az önce bitirdim.
I haven't ... yet|henüz ... yapmadım|A2|I haven't eaten [yet].|Henüz yemek yemedim.
Have you ever...?|hiç ... yaptın mı?|A2|Have you [ever] been to London?|Hiç Londra'ya gittin mi?
I've never...|hiç ... yapmadım|A2|I've [never] tried sushi.|Hiç suşi denemedim.
There is a...|bir ... var|A1|There is [a] café near my house.|Evimin yakınında bir kafe var.
There are some...|birkaç ... var|A1|There are [some] apples on the table.|Masada birkaç elma var.
Is there a...?|bir ... var mı?|A1|Is there [a] pharmacy nearby?|Yakınlarda bir eczane var mı?
Are there any...?|hiç ... var mı? (çoğul)|A1|Are there [any] seats left?|Boş koltuk kaldı mı?
How much ... do you need?|ne kadar ... ihtiyacın var?|A1|How [much] water do you need?|Ne kadar suya ihtiyacın var?|Much sayılamayan isimlerle; many sayılabilen çoğul isimlerle kullanılır.
How many ... are there?|kaç tane ... var?|A1|How [many] chairs are there?|Kaç tane sandalye var?
It takes ... to...|... yapmak ... sürer|A2|It takes ten minutes [to] walk there.|Oraya yürümek on dakika sürer.
I'm not sure if...|... olup olmadığından emin değilim|B1|I'm not sure [if] he's coming.|Gelip gelmeyeceğinden emin değilim.
As long as...|... olduğu sürece|B1|You can stay as long [as] you're quiet.|Sessiz olduğun sürece kalabilirsin.
Even though...|... olmasına rağmen|B1|Even [though] it was cold, we went out.|Hava soğuk olmasına rağmen dışarı çıktık.
If I were you, I'd...|senin yerinde olsam ... yapardım|B1|If I [were] you, I'd take a break.|Senin yerinde olsam mola verirdim.
I wish I could...|keşke ... yapabilsem|B1|I wish I [could] speak French.|Keşke Fransızca konuşabilsem.
You should have...|... yapmalıydın|B2|You should [have] called me.|Beni aramalıydın.|Geçmişte yapılmayan eylem için should have + üçüncü biçim kullanılır.
I might have...|... yapmış olabilirim|B2|I might [have] left it at work.|Onu işte bırakmış olabilirim.
There's no point in ...ing|... yapmanın anlamı yok|B2|There's no point [in] arguing.|Tartışmanın anlamı yok.
I'm supposed to...|... yapmam bekleniyor|B1|I'm supposed [to] be there at nine.|Dokuzda orada olmam bekleniyor.
It's worth ...ing|... yapmaya değer|B1|It's worth [visiting] the old town.|Eski şehri ziyaret etmeye değer.|Worth ardından isim veya -ing gelir; to + fiil gelmez.|It's worth to visit the old town.
The more ..., the more ...|ne kadar ... o kadar ...|B2|The more you practise, [the] more you learn.|Ne kadar çok pratik yaparsan o kadar çok öğrenirsin.
Not only ... but also ...|yalnızca ... değil aynı zamanda ...|B2|She's not only kind [but] also funny.|O yalnızca nazik değil, aynı zamanda komik.
I'd better...|... yapsam iyi olur|B1|I'd [better] leave now.|Şimdi çıksam iyi olur.|Had better ardından fiilin yalın biçimi gelir.
`]);

groups.push(["phrasal_verb", `
wake up|uyanmak|A1|I wake [up] at seven.|Saat yedide uyanırım.
get up|yataktan kalkmak|A1|I get [up] early on weekdays.|Hafta içi erken kalkarım.
turn on|açmak (cihaz)|A1|Please turn [on] the light.|Lütfen ışığı aç.
turn off|kapatmak (cihaz)|A1|Turn [off] the TV before bed.|Yatmadan önce televizyonu kapat.
look for|aramak|A1|He is looking [for] his keys.|Anahtarlarını arıyor.|Look for aramak; look at bakmak demektir.|He is looking his keys.
put on|giymek|A1|Put [on] your coat; it's cold.|Paltonu giy; hava soğuk.
take off|çıkarmak (giysi)|A1|Please take [off] your shoes.|Lütfen ayakkabılarını çıkar.
sit down|oturmak|A1|Please sit [down].|Lütfen oturun.
stand up|ayağa kalkmak|A1|Please stand [up] for a moment.|Lütfen bir an ayağa kalkın.
come in|içeri girmek|A1|Come [in] and have a seat.|İçeri gel ve otur.
go out|dışarı çıkmak|A1|Do you want to go [out] tonight?|Bu akşam dışarı çıkmak ister misin?
come back|geri gelmek|A1|When will you come [back]?|Ne zaman geri geleceksin?
go back|geri dönmek|A1|I need to go [back] to work.|İşe geri dönmem gerekiyor.
get back|geri varmak|A2|What time did you get [back]?|Saat kaçta geri döndün?
pick up|gidip almak|A2|I'll pick you [up] at six.|Seni altıda alırım.|Nesne zamirse araya girer: pick you up.|I'll pick up you at six.
drop off|bir yere bırakmak|A2|Can you drop me [off] at the station?|Beni istasyonda bırakabilir misin?
get on|binmek (otobüs/tren)|A1|We got [on] the bus at the station.|İstasyonda otobüse bindik.
get off|inmek (otobüs/tren)|A1|Get [off] at the next stop.|Bir sonraki durakta in.
get in|binmek (araba)|A1|Get [in] the car; we're leaving.|Arabaya bin; gidiyoruz.
get out of|inmek (araba)|A2|She got out [of] the taxi.|Taksiden indi.
find out|öğrenip ortaya çıkarmak|A2|I'll find [out] what time it starts.|Saat kaçta başladığını öğreneceğim.
give up|vazgeçmek|A2|Don't give [up]; you're doing well.|Vazgeçme; iyi gidiyorsun.
grow up|büyümek|A2|I grew [up] in a small town.|Küçük bir kasabada büyüdüm.
put away|yerine kaldırmak|A2|Please put [away] your toys.|Lütfen oyuncaklarını yerine kaldır.
put down|elindekini bırakmak|A2|Put [down] your phone and listen.|Telefonunu bırak ve dinle.
put back|yerine geri koymak|A2|Put the book [back] on the shelf.|Kitabı rafa geri koy.
throw away|çöpe atmak|A2|Don't throw [away] that box.|O kutuyu çöpe atma.
try on|denemek (giysi)|A2|Can I try this [on]?|Bunu deneyebilir miyim?
fill in|doldurmak (form)|A2|Please fill [in] this form.|Lütfen bu formu doldurun.
write down|yazıp not etmek|A2|Write [down] the address.|Adresi not et.
look up|bakıp bulmak (sözlük)|A2|Look [up] the word in a dictionary.|Kelimeye sözlükten bak.
look out|dikkat etmek (uyarı)|A2|Look [out]! There's a car!|Dikkat et! Araba var!
look around|etrafa bakınmak|A2|Can we look [around] the shop?|Mağazada etrafa bakınabilir miyiz?
look back|geçmişe dönüp bakmak|B1|I look [back] on that summer with a smile.|O yazı gülümseyerek hatırlıyorum.
look into|araştırmak (sorun)|B2|We'll look [into] the problem.|Sorunu araştıracağız.
run out of|tükenmek|B1|We've run out [of] milk.|Sütümüz bitti.
run into|tesadüfen karşılaşmak|B1|I ran [into] an old friend yesterday.|Dün eski bir arkadaşımla karşılaştım.
get along with|iyi geçinmek|B1|I get along [with] my neighbours.|Komşularımla iyi geçinirim.
fall out with|arası bozulmak|B1|She fell out [with] her best friend.|En iyi arkadaşıyla arası bozuldu.
break down|bozulmak (araç)|A2|Our car broke [down] on the way home.|Arabamız eve dönerken bozuldu.
break up|ayrılmak (ilişki)|B1|They broke [up] last month.|Geçen ay ayrıldılar.
calm down|sakinleşmek|A2|Take a breath and calm [down].|Nefes al ve sakinleş.
cheer up|neşelenmek|B1|Cheer [up]; tomorrow will be better.|Neşelen; yarın daha iyi olacak.
slow down|yavaşlamak|A2|Please slow [down]; I can't keep up.|Lütfen yavaşla; yetişemiyorum.
hurry up|acele etmek|A1|Hurry [up], or we'll be late.|Acele et, yoksa geç kalacağız.
carry on|devam etmek|B1|Please carry [on] with your work.|Lütfen işine devam et.
keep up with|ayak uydurmak|B1|It's hard to keep up [with] all the changes.|Bütün değişikliklere ayak uydurmak zor.
catch up with|arayı kapatıp yetişmek|B1|I'll catch up [with] you later.|Size sonra yetişirim.
set off|yola çıkmak|B1|We set [off] early in the morning.|Sabah erkenden yola çıktık.
set up|kurmak|B1|She wants to set [up] her own business.|Kendi işini kurmak istiyor.
show up|ortaya çıkıp gelmek|B1|He didn't show [up] for the meeting.|Toplantıya gelmedi.
turn up|sesini açmak|A2|Can you turn [up] the volume?|Sesi açabilir misin?
turn down|sesini kısmak|A2|Please turn [down] the music.|Lütfen müziğin sesini kıs.
turn around|arkasını dönmek|A2|Turn [around] and look behind you.|Arkanı dön ve arkana bak.
hang up|telefonu kapatmak|A2|Don't hang [up]; I need to tell you something.|Telefonu kapatma; sana bir şey söylemem gerekiyor.
call back|geri aramak|A2|I'll call you [back] in five minutes.|Seni beş dakika içinde geri ararım.
check in|giriş işlemi yapmak|A2|What time can we check [in]?|Saat kaçta giriş yapabiliriz?
check out|çıkış işlemi yapmak|A2|We need to check [out] by eleven.|On bire kadar çıkış yapmamız gerekiyor.
eat out|dışarıda yemek yemek|A2|Let's eat [out] tonight.|Bu akşam dışarıda yiyelim.
warm up|ısınmak (egzersiz)|A2|Always warm [up] before running.|Koşmadan önce her zaman ısın.
work out|spor yapmak|A2|I work [out] three times a week.|Haftada üç kez spor yaparım.
tidy up|ortalığı toplamak|A2|Let's tidy [up] before they arrive.|Onlar gelmeden ortalığı toplayalım.
clean up|temizlemek|A2|We need to clean [up] the kitchen.|Mutfağı temizlememiz gerekiyor.
wash up|bulaşık yıkamak|A2|I'll wash [up] after dinner.|Akşam yemeğinden sonra bulaşıkları yıkarım.
log in|oturum açmak|A2|You need to log [in] to see your messages.|Mesajlarını görmek için oturum açmalısın.
log out|oturum kapatmak|A2|Don't forget to log [out].|Oturumu kapatmayı unutma.
sign up for|kaydolmak|B1|I signed up [for] a cooking class.|Bir yemek kursuna kaydoldum.
put off|ertelemek|B1|Don't put [off] your homework until Sunday.|Ödevini pazara kadar erteleme.
come up with|bulmak (fikir/çözüm)|B2|We need to come up [with] a better plan.|Daha iyi bir plan bulmamız gerekiyor.
put up with|katlanmak|B2|I can't put up [with] this noise.|Bu gürültüye katlanamıyorum.
`]);

const explanations: Record<PhraseCategory, (phrase: string, target: string) => string> = {
  verb_preposition: (p, t) => `“${p}” kalıbında fiili “${t}” ile birlikte öğren; ardından kişi, nesne veya -ing gelebilir.`,
  adjective_preposition: (p, t) => `“${p}” kalıbında sıfatla birlikte “${t}” kullanılır.`,
  verb_noun: (p) => `“${p}” doğal bir fiil–isim eşleşmesidir. Fiili ve ismi birlikte hatırla.`,
  noun_phrase: (p, t) => `“${p}” bir isim grubudur; bu örnekte “${t}” yapının parçasıdır.`,
  common_expression: (p) => `“${p}” ifadesini kelime kelime çevirmek yerine bir bütün olarak öğren.`,
  sentence_pattern: (p) => `“${p}” cümle iskeletini örnekteki gibi tamamla.`,
  phrasal_verb: (p, t) => `“${p}” içinde “${t}” fiilin anlamını tamamlar; fiil ve parçacığı birlikte öğren.`,
};

// Accept common standard variants when the sentence alone cannot distinguish them.
const gapAlternatives: Record<string, string[]> = {
  "talk to someone": ["with"],
  "speak to someone": ["with"],
  "compare something with something": ["to"],
  "be different from something": ["to", "than"],
  "be bored with something": ["of", "by"],
  "be surprised at something": ["by"],
  "be disappointed with something": ["by", "in", "at"],
  "be free from something": ["of"],
  "be scared of something": ["by"],
  "be embarrassed about something": ["by", "at"],
  "be confident about something": ["in"],
  "at the weekend": ["on"],
  "fill in": ["out"],
};

export const phrases: RecordWord[] = groups.flatMap(([category, rows]) => rows.trim().split("\n").map(row => {
  const [english, turkish, level, marked, translation, explanation, commonMistake] = row.split("|");
  const answer = marked.match(/\[([^\]]+)\]/)![1];
  const phrase: PhraseDetails = {
    level: level as PhraseDetails["level"],
    priority: ["A1", "A2", "B1", "B2"].indexOf(level) + 1,
    category, translation,
    explanation: explanation || explanations[category](english, answer),
    ...(commonMistake ? { commonMistake } : {}),
    gap: { sentence: marked.replace(/\[[^\]]+\]/, "___"), answer, ...(gapAlternatives[english] ? { alternatives: gapAlternatives[english] } : {}) },
  };
  return { id: `phrase:${english.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "")}`, english, turkish, alternatives: [], language: "en", example: marked.replace(/[\[\]]/g, ""), phrase };
}));
