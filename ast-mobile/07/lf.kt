package fixtures.unicode
// ğ ü ş İ ö ç 中文 😀 precede every edited declaration.
@Deprecated("güvenilir")
fun `müşteri kabul`(
    değer: Long,
    açıklama: String
): String {
    /* Türkçe 中文
       multiline explanation */
    val metin = """
        ğ ü ş İ ö ç 中文 😀
        toplam: ${değer * -1}
        açıklama: ${açıklama.ifEmpty { "boş ${değer + 1}" }}
    """.trimIndent()
    return metin
}
fun sınır(değer: Int): Int { return değer * 2 }
fun taşı(değer: Int): Int { return değer + 1 }
