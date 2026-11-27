ExUnit.start()
defmodule Vocabulary.QueueTest do
  use ExUnit.Case
  def expected_score(value) do
    value * 2
  end
  test "integer score" do
    assert Vocabulary.Queue.score(2) == expected_score(2)
  end
end
