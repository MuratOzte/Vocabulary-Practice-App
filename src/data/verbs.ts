import type { Word } from "../engine";

// A curated everyday study list, not a corpus frequency ranking. Examples are original.
// Columns: base | past form(s) | Turkish meaning | example in the past simple.
const irregular = `be|was/were|olmak|We were at home yesterday.
have|had|sahip olmak|I had a small bike as a child.
do|did|yapmak|She did her homework after dinner.
say|said|söylemek|He said hello to everyone.
go|went|gitmek|We went to the park yesterday.
get|got|almak, elde etmek|I got a message this morning.
make|made|yapmak, üretmek|She made a cake for us.
know|knew|bilmek|I knew the answer.
think|thought|düşünmek|We thought about your idea.
take|took|almak, götürmek|He took an umbrella with him.
see|saw|görmek|I saw a cat outside.
come|came|gelmek|They came home early.
give|gave|vermek|She gave me a book.
find|found|bulmak|I found my keys under the table.
tell|told|anlatmak, söylemek|He told us a funny story.
feel|felt|hissetmek|I felt tired after work.
become|became|olmak, hâline gelmek|She became a teacher last year.
leave|left|ayrılmak, bırakmak|We left the house at eight.
put|put|koymak|I put the bag on the floor.
mean|meant|anlamına gelmek, kastetmek|I meant every word I said.
keep|kept|saklamak, tutmak|She kept the letter in a box.
let|let|izin vermek|They let us use the kitchen.
begin|began|başlamak|The film began at nine.
bring|brought|getirmek|He brought some bread.
hear|heard|duymak|We heard a noise upstairs.
run|ran|koşmak|I ran to the bus stop.
write|wrote|yazmak|She wrote a letter yesterday.
sit|sat|oturmak|We sat near the window.
stand|stood|ayakta durmak|He stood next to the door.
lose|lost|kaybetmek|I lost my phone on the bus.
pay|paid|ödemek|We paid for the tickets online.
meet|met|tanışmak, buluşmak|I met a friend for lunch.
set|set|ayarlamak, koymak|She set the alarm for seven.
lead|led|önderlik etmek|He led the team last season.
understand|understood|anlamak|I understood the question.
speak|spoke|konuşmak|We spoke about our plans.
read|read|okumak|I read two books last month.
spend|spent|harcamak, geçirmek|They spent the weekend by the sea.
grow|grew|büyümek, yetişmek|The plants grew quickly.
win|won|kazanmak|Our team won the match.
buy|bought|satın almak|I bought a new notebook.
send|sent|göndermek|She sent an email yesterday.
build|built|inşa etmek|They built a bridge over the river.
fall|fell|düşmek|The glass fell off the table.
cut|cut|kesmek|He cut the paper into strips.
sell|sold|satmak|We sold our old car.
break|broke|kırmak|I broke a plate yesterday.
choose|chose|seçmek|She chose the blue dress.
drive|drove|araç sürmek|He drove to work this morning.
eat|ate|yemek yemek|We ate soup for lunch.
drink|drank|içmek|I drank a glass of water.
sleep|slept|uyumak|The baby slept all night.
wear|wore|giymek|She wore a warm coat.
forget|forgot|unutmak|I forgot my password.
teach|taught|öğretmek|He taught English at our school.
catch|caught|yakalamak, yetişmek|We caught the last train.
fight|fought|kavga etmek, savaşmak|They fought over a toy.
throw|threw|atmak, fırlatmak|She threw the ball to me.
draw|drew|çizmek|I drew a picture of our house.
fly|flew|uçmak|We flew to London last summer.
swim|swam|yüzmek|They swam in the lake.
sing|sang|şarkı söylemek|She sang a song for us.
hold|held|tutmak|He held the door open.
hurt|hurt|incitmek, acıtmak|I hurt my knee yesterday.
cost|cost|mal olmak|The ticket cost ten pounds.
learn|learned/learnt|öğrenmek|We learned a new word today.`;

const regular = `work|worked|çalışmak|I worked from home yesterday.
use|used|kullanmak|She used my pen.
want|wanted|istemek|We wanted a quiet room.
need|needed|ihtiyaç duymak|He needed some help.
ask|asked|sormak, istemek|I asked a question.
try|tried|denemek|She tried a new recipe.
call|called|aramak, seslenmek|We called our parents last night.
help|helped|yardım etmek|He helped me carry the bags.
talk|talked|konuşmak|We talked for an hour.
turn|turned|dönmek, çevirmek|She turned left at the lights.
start|started|başlamak|The lesson started at ten.
show|showed|göstermek|He showed me the photo.
play|played|oynamak|The children played outside.
move|moved|taşınmak, hareket etmek|We moved to a new flat.
live|lived|yaşamak|I lived in Ankara for two years.
believe|believed|inanmak|She believed his story.
happen|happened|olmak, meydana gelmek|It happened last night.
include|included|içermek, dahil etmek|The price included breakfast.
continue|continued|devam etmek|We continued our walk after lunch.
change|changed|değiştirmek, değişmek|He changed his plans.
watch|watched|izlemek|I watched a film yesterday.
follow|followed|takip etmek|We followed the signs.
stop|stopped|durmak, durdurmak|The bus stopped near our house.
open|opened|açmak|She opened the window.
close|closed|kapatmak|He closed the door quietly.
walk|walked|yürümek|We walked to school.
like|liked|beğenmek, sevmek|I liked the film.
love|loved|sevmek|She loved the gift.
visit|visited|ziyaret etmek|We visited our cousins on Sunday.
wait|waited|beklemek|I waited for the bus.
listen|listened|dinlemek|They listened to the radio.
study|studied|ders çalışmak|He studied English last night.
finish|finished|bitirmek|I finished my homework before dinner.
travel|travelled/traveled|seyahat etmek|We travelled by train last summer.`;

function parse(rows: string, kind: "regular" | "irregular"): Word[] {
  return rows.split("\n").map(row => {
    const [base, forms, turkish, example] = row.split("|");
    const [english, ...alternatives] = forms.split("/");
    const note = base === "be" ? "I/he/she/it ile was; you/we/they ile were kullanılır. Bu fiil sorusunda ikisinden birini yazabilirsin."
      : base === "read" ? "Yazılışı değişmez; ikinci hâli /red/ diye okunur."
      : alternatives.length ? "Kayıtlı İngiliz ve Amerikan İngilizcesi biçimlerinden biri kabul edilir." : undefined;
    return { id: `verb-${base}`, english, alternatives, turkish, example, language: "en", verb: { base, kind, note } };
  });
}

export const verbs = [...parse(irregular, "irregular"), ...parse(regular, "regular")];
