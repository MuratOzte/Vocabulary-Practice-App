object Türkçe {
  def ölçüm(
    değer: Int
  ): String = {
    val sonuç = List(
      değer,
      3
    ).sum
    """İstanbul 😀
yeni orta satır
son""" + sonuç
  }
}
