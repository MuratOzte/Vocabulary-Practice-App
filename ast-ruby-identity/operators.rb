module Commerce
  class Ledger
    def [](value)
      work(value)
    end
    def []=(value)
      work(value)
    end
    def +(value)
      work(value)
    end
    def ==(value)
      work(value)
    end
    def <=>(value)
      work(value)
    end
    def status=(value)
      work(value)
    end
    def valid?(value)
      work(value)
    end
    def save!(value)
      work(value)
    end
  end
end
