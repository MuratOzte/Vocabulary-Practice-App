// ğ ü ş İ ö ç 中文 😀 precede every edited declaration.
@deprecated
String musteri(
  int deger,
  String aciklama,
) {
  /* Türkçe 中文
     multiline explanation */
  final metin = """
      ğ ü ş İ ö ç 中文 😀
      toplam: $deger
      açıklama: ${aciklama.isEmpty ? 'boş ${deger + 1}' : aciklama}
      """;
  final raw = r'ham $deger 😀';
  return metin + raw;
}
int tasi(int deger) { return deger + 1; }
int sil(int deger) { return deger - 1; }
int sinir(int deger) { return deger * 2; }
