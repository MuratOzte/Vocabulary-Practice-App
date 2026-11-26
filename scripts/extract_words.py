import argparse
import json
import re
from pathlib import Path

spelling = {'Adminstration':'Administration','Apperent':'Apparent','Abondon':'Abandon','Accompant':'Accompany','Ambigious':'Ambiguous','Diplacement':'Displacement','Diplace':'Displace','Expicit':'Explicit','Exploitatin':'Exploitation','Establihed':'Established','Emprical':'Empirical','Fundemental':'Fundamental','Institude':'Institute','Impementation':'Implementation','Maintanance':'Maintenance','Minisrty':'Ministry','Neatural':'Neutral','Northwithsanding':'Notwithstanding','Persue':'Pursue','Precere':'Precede','Supllementary':'Supplementary'}
meanings = {'Conceived':'Tasarlanmış, düşünülmüş','Empirical':'Deney ve gözleme dayalı, deneysel','No longer':'Artık değil, artık … yapmamak','Consequence':'Sonuç, netice','Involve':'İçermek, dahil etmek, gerektirmek','Undertaken':'Üstlenilmiş, yapmayı kabul etmiş','Emerge':'Ortaya çıkmak, belirmek','Confirmed':'Doğrulanmış, kesinleşmiş; kökleşmiş (alışkanlık)','Consent':'İzin, onay; izin vermek','Intrinsic':'Özünde olan, içsel','Identical':'Aynı, özdeş','Survey':'Araştırma, anket, ölçüm, inceleme','Bury':'Gömmek, gizlemek','Shrink':'Daralmak, küçülmek','Forthcoming':'Yaklaşan, gelmekte olan'}


def extract_words(pages):
    items = []

    def entry_lines():
        for page in pages:
            for raw_line in (page.extract_text() or '').splitlines():
                line = raw_line.strip().lstrip('•').strip()
                if line and not re.fullmatch('[A-Z]', line):
                    yield line

    for line in entry_lines():
        if ':' in line:
            english, turkish = line.split(':', 1)
            items.append({'originalEnglish': english.strip(), 'originalTurkish': turkish.strip()})
        elif items and not line.startswith('detect '):
            items[-1]['originalTurkish'] += ' ' + line

    words = []
    for i, item in enumerate(items, start=1):
        corrected = spelling.get(item['originalEnglish'], item['originalEnglish'])
        english, *alternatives = corrected.split('/')
        words.append({
            'id': f'ielts-{i:03}',
            'english': english,
            'turkish': meanings.get(english, item['originalTurkish']),
            'alternatives': alternatives,
            'source': 'IELTS PDF',
            **item,
        })
    return words


def main():
    parser = argparse.ArgumentParser(description='Extract vocabulary from an IELTS PDF.')
    parser.add_argument('pdf', type=Path)
    default_output = Path(__file__).resolve().parents[1] / 'src' / 'data' / 'words.json'
    parser.add_argument('-o', '--output', type=Path, default=default_output)
    args = parser.parse_args()

    from pypdf import PdfReader

    words = extract_words(PdfReader(args.pdf).pages[1:])
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(words, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'{len(words)} words extracted')


if __name__ == '__main__':
    main()
