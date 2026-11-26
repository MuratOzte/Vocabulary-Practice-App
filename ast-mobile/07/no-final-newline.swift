import Foundation
// ğ ü ş İ ö ç 中文 😀 precede every edited declaration.
@available(*, deprecated, message: "güvenilir")
func kabul(
    değer: Int64,
    açıklama: String
) -> String {
    /* Türkçe 中文
       multiline explanation */
    let metin = """
        ğ ü ş İ ö ç 中文 😀
        toplam: \(değer * -1)
        açıklama: \(açıklama)
        """
    let raw = #"ham \(değer) 😀"#
    return metin + raw
}
func `repeat`(_ değer: Int) -> Int { return değer * 2 }
func taşı(_ değer: Int) -> Int { return değer + 1 }