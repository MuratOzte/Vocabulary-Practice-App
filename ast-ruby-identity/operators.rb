module Commerce
  class Ledger
    def [](value)
      work(value + 1)
    end
    def []=(value)
      work(value + 1)
    end
    def +(value)
      work(value + 1)
    end
    def ==(value)
      work(value + 1)
    end
    def <=>(value)
      work(value + 1)
    end
    def status=(value)
      work(value + 1)
    end
    def valid?(value)
      work(value + 1)
    end
    def save!(value)
      work(value + 1)
    end
  end
end
