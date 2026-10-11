import re, json
from pathlib import Path
from pypdf import PdfReader

reader = PdfReader(r'C:/Users/mo255/Downloads/IELTS-POPULER-KELIMELER.pdf')
spelling = {'Adminstration':'Administration','Apperent':'Apparent','Abondon':'Abandon','Accompant':'Accompany','Ambigious':'Ambiguous','Diplacement':'Displacement','Diplace':'Displace','Expicit':'Explicit','Exploitatin':'Exploitation','Establihed':'Established','Emprical':'Empirical','Fundemental':'Fundamental','Institude':'Institute','Impementation':'Implementation','Maintanance':'Maintenance','Minisrty':'Ministry','Neatural':'Neutral','Northwithsanding':'Notwithstanding','Persue':'Pursue','Precere':'Precede','Supllementary':'Supplementary'}
meanings = {'Conceived':'Tasarlanmış, düşünülmüş','Empirical':'Deney ve gözleme dayalı, deneysel','No longer':'Artık değil, artık … yapmamak','Consequence':'Sonuç, netice','Involve':'İçermek, dahil etmek, gerektirmek','Undertaken':'Üstlenilmiş, yapmayı kabul etmiş','Emerge':'Ortaya çıkmak, belirmek','Confirmed':'Doğrulanmış, kesinleşmiş; kökleşmiş (alışkanlık)','Consent':'İzin, onay; izin vermek','Intrinsic':'Özünde olan, içsel','Identical':'Aynı, özdeş','Survey':'Araştırma, anket, ölçüm, inceleme','Bury':'Gömmek, gizlemek','Shrink':'Daralmak, küçülmek','Forthcoming':'Yaklaşan, gelmekte olan'}
items = []
for page in reader.pages[1:]:
    for line in (page.extract_text() or '').splitlines():
        line = line.strip().lstrip('•').strip()
        if not line or re.fullmatch('[A-Z]', line): continue
        if ':' in line:
            english, turkish = line.split(':', 1)
            items.append({'originalEnglish':english.strip(),'originalTurkish':turkish.strip()})
        elif items and not line.startswith('detect '):
            items[-1]['originalTurkish'] += ' ' + line
words = []
for i, item in enumerate(items):
    en = spelling.get(item['originalEnglish'], item['originalEnglish'])
    alternatives = en.split('/')
    en = alternatives[0]
    words.append({'id':f'ielts-{i+1:03}', 'english':en, 'turkish':meanings.get(en,item['originalTurkish']), 'alternatives':alternatives[1:], 'source':'IELTS PDF', **item})
Path('src/data').mkdir(parents=True, exist_ok=True)
Path('src/data/words.json').write_text(json.dumps(words, ensure_ascii=False, indent=2),encoding='utf-8')
print(f'{len(words)} words extracted')
