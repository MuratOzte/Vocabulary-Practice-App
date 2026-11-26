module Stress
  class Receipt
    def render(number, amount, currency)
      header = "Receipt #{number}"
      body = "Total: #{amount} #{currency}"
      [header, body].join("\n")
    end
  end
end
