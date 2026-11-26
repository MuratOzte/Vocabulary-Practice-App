module Commerce
  class Ledger
    def self.validate(value)
      work(value + 1)
    end
    def validate(value)
      work(value + 2)
    end
  end
end
