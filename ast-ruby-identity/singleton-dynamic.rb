module Commerce
  class Ledger
    class << factory()
    def validate(value)
      work(value + 1)
    end
    end
  end
end
