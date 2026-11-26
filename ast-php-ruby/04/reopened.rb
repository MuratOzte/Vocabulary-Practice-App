module App
  module Services
    module Searchable
      def search(term)
        all.select { |row| row[:name].downcase.include?(term.downcase) }
      end
    end
  end
end

class App::Services::UserService
  extend App::Services::Searchable
  attr_accessor :settings
  SCOPES = %i[active pending suspended]

  def self.all
    []
  end

  def self.limit
    50
  end

  def export
    @settings.map { |key, value| "#{key}=#{value}" }.join("\n")
  end
end

module App::Services
  def self.instrument(event)
    yield event.to_sym
  end
end
