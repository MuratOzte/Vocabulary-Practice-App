module Stress
  class Invoice
    def total(items)
      items.sum { |item| item[:price] * item[:quantity] }
    end
  end
end
