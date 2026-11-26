module Commerce
  module Billing
    class Ledger
    def validate(value)
      work(value)
    end
    end
  end
  class Other
    def validate(value)
      work(value)
    end
  end
end
module External::Billing
  class Ledger
    def validate(value)
      work(value)
    end
  end
end
