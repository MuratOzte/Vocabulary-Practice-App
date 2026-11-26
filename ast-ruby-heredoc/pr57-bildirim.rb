module Mağaza
  class Bildirim
    BAŞLIK = "İşlem öncesi Türkçe: ğüşiöç 😀 🧾"

    def initialize(siparişler)
      @siparişler = siparişler
    end

    def geçerli?(tutar)
      tutar > 0 && tutar < 100_000
    end

    def özet
      başlık = "Siparişler 📦\nİstanbul"
      satırlar = @siparişler.map do |sipariş|
        "#{sipariş[:ad]}: #{sipariş[:tutar]} ₺"
      end
      <<~MESAJ
        #{başlık}
        #{satırlar.join("\n")}
        Güvenli ödeme ✅
      MESAJ
    end

    def çok_satırlı
      "İlk satır 🌍
İkinci satır: ödeme bekleniyor"
    end
  end
end
