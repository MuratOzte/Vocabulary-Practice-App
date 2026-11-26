module Commerce
  class Ledger
    def Other.validate(value)
      work(value + 1)
    end
    def validate(value)
      work(value)
    end
  end
end
