module Commerce
  class Ledger
    def self.validate(value)
      work(value + 1)
    end
  end
end
