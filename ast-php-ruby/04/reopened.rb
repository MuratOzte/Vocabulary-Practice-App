module App
  module Services
    module Searchable
      def search(term)
        all.select { |row| row[:name].include?(term) }
      end
    end
  end
end

class App::Services::UserService
  extend App::Services::Searchable
  attr_accessor :settings
  SCOPES = %i[active pending]

  def self.all
    []
  end

  def self.limit
    25
  end

  def export
    @settings.map { |key, value| "#{key}=#{value}" }.join("\n")
  end
end

module App::Services
  def self.instrument(event)
    yield event
  end
end
