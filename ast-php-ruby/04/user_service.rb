module App
  module Services
    module Reporting
      def audit(message)
        "audit:#{message}"
      end
    end
    module Cache
      def cached(key)
        @cache ||= {}
        @cache[key] ||= yield
      end
    end
    module Guards
      def save!
        raise 'invalid' unless valid?
        super
      end
    end
    class UserService
      include Reporting
      extend Cache
      prepend Guards
      attr_accessor :status, :name, :email
      DEFAULT_LIMIT = 20

      def self.limit
        DEFAULT_LIMIT * 2
      end

      def limit
        DEFAULT_LIMIT + 1
      end

      class << self
        def enabled?
          false
        end

        def build(name)
          new.tap { |service| service.name = name }
        end
      end

      def valid? = name.to_s.length >= 3
      def [](key) = @settings[key]

      define_method(:display_name) do
        name.to_s.strip.downcase
      end

      def save!
        @saved = true
      end

      def render
        sanitize = ->(value) { value.to_s }
        title = [name, status].map { |part| sanitize.call(part) }.join(' / ')
        <<~HTML
          <h1>#{title}</h1>
          <p>Active account</p>
        HTML
      end
    end
  end
end

module App
  module Services
    class UserService
      def update!(attributes)
        attributes.each { |key, value| public_send("#{key}=", value) unless value.nil? }
        save!
      end
    end
  end
end
