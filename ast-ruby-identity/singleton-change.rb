module Commerce
  class Ledger
    class << self
    def validate(value)
      work(value + 1)
    end
    end
    def validate(value)
      work(value)
    end
  end
end
