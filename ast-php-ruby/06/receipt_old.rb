module Stress
  class Receipt
    def render(number, amount, currency)
      header = "Receipt #{number}"
      body = "Amount: #{amount} #{currency}"
      [header, body].join("\n")
    end
  end
end
