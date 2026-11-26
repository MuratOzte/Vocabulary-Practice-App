module Commerce
  class Record
    def self.validates(field, **rules)
      (@rules ||= {})[field] = rules
    end
  end

  class Customer < Record
    validates :email, presence: true
    validates :age, minimum: 18
    attr_accessor :email, :age

    define_method(:eligible?) do
      age && age >= 18
    end

    def self.eligible?(age)
      age >= 18
    end

    def eligible?
      age && age >= 18 && !email.to_s.empty?
    end

    def label
      formatter = lambda do |value|
        value.to_s.upcase
      end
      formatter.call(email)
    end
  end
end
