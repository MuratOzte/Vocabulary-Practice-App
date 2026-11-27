object Türkçe {
  def ölçüm(
    değer: Int
  ): String = {
    val sonuç = List(
      değer,
      2
    ).sum
    """İstanbul 😀
orta satır
son""" + sonuç
  }
}
