// ğ ü ş İ ö ç 中文 😀 precede every edited declaration.
@Deprecated("güvenilir")
String kabul(
  num deger,
  String aciklama,
) {
  /* Türkçe 中文
     multiline explanation */
  final metin = """
      ğ ü ş İ ö ç 中文 😀
      toplam: ${deger * -1}
      açıklama: ${aciklama.isEmpty ? 'boş ${deger + 1}' : aciklama}
      """;
  final raw = r'ham $deger 😀';
  return metin + raw;
}
int sinir(int deger) { return deger * 2; }
int tasi(int deger) { return deger + 1; }
