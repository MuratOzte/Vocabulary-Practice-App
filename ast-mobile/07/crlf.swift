import Foundation
// ğ ü ş İ ö ç 中文 😀 precede every edited declaration.
@available(*, deprecated, message: "eski")
func müşteri(
    değer: Int,
    açıklama: String
) -> String {
    /* Türkçe 中文
       multiline explanation */
    let metin = """
        ğ ü ş İ ö ç 中文 😀
        toplam: \(değer)
        açıklama: \(açıklama)
        """
    let raw = #"ham \(değer) 😀"#
    return metin + raw
}
func taşı(_ değer: Int) -> Int { return değer + 1 }
func sil(_ değer: Int) -> Int { return değer - 1 }
func `repeat`(_ değer: Int) -> Int { return değer * 2 }
