module Commerce
  class Ledger
    def validate(value)
      work(value)
    end
    def self.validate(value)
      work(value)
    end
  end
end
