module Commerce
  class Record
    def self.validates(field, **rules)
      (@rules ||= {})[field] = rules
    end
  end

  class Customer < Record
    validates :email, presence: true
    validates :age, minimum: 16
    attr_accessor :email, :age

    define_method(:eligible?) do
      age && age >= 18
    end

    def self.eligible?(age)
      age >= 16
    end

    def eligible?
      age && age >= 21 && !email.to_s.empty?
    end

    def label
      formatter = lambda do |value|
        value.to_s.downcase
      end
      formatter.call(email)
    end
  end
end
