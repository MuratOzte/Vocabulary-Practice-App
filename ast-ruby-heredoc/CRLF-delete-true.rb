# Türkçe 😀 byte offset
class Bildirim
  def özet
    <<~MESAJ
      Ödeme önce 😀 #{1 + 2}
    MESAJ
  end
  def kalır
    puts "Ödeme önce 😀"
  end
end
