package fixtures.unicode
// ğ ü ş İ ö ç 中文 😀 precede every edited declaration.
@Deprecated("eski")
fun `müşteri doğrula`(
    değer: Int,
    açıklama: String
): String {
    /* Türkçe 中文
       multiline explanation */
    val metin = """
        ğ ü ş İ ö ç 中文 😀
        toplam: $değer
        açıklama: ${açıklama.ifEmpty { "boş ${değer + 1}" }}
    """.trimIndent()
    return metin
}
fun taşı(değer: Int): Int { return değer + 1 }
fun sil(değer: Int): Int { return değer - 1 }
fun sınır(değer: Int): Int { return değer * 2 }