module Stress
  class RetryPolicy
    def delay(attempt)
      [3600, 60 * 2 ** attempt].min
    end
  end
end
