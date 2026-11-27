defmodule Vocabulary.Card do
  @moduledoc """
  Persistent vocabulary practice progress.
  """
  defstruct word: "", attempts: 0
end

defprotocol Vocabulary.Display do
  def label(value)
end

defimpl Vocabulary.Display, for: Vocabulary.Card do
  def label(card), do: card.word
end

defmodule Vocabulary.Queue do
  use GenServer
  alias Vocabulary.Card, as: Entry
  import Enum, only: [map: 2]
  require Logger
  @max_attempts 5
  defmacro audit(value) do
    quote do
      {:ok, unquote(value)}
    end
  end
  def start_link(cards), do: GenServer.start_link(__MODULE__, cards)
  @impl true
  def init(cards), do: {:ok, %{cards: cards, cursor: 0}}
  def score(value) when is_integer(value) do
    value * 2
  end
  def score(value) when is_binary(value), do: String.length(value)
  def score(value, offset), do: score(value) + offset
  def describe(%Entry{attempts: 0}), do: :new
  def describe(%Entry{attempts: n}) when n < 5, do: :learning
  def describe(_), do: :review
  def prepare(cards, limit \\ 20) do
    cards
    |> Enum.filter(fn card -> card.attempts < @max_attempts end)
    |> map(fn card -> %{card | word: String.trim(card.word)} end)
    |> Enum.take(limit)
    |> Enum.sort_by(& &1.word)
  end
  def enroll(card, store) do
    with true <- card.word != "",
         {:ok, current} <- Map.fetch(store, card.word),
         true <- current.attempts < @max_attempts do
      {:ok, %{current | attempts: current.attempts + 1}}
    else
      _ -> {:error, :invalid}
    end
  end
  @impl true
  def handle_call(:next, _from, state) do
    card = Enum.at(state.cards, state.cursor)
    {:reply, card, %{state | cursor: state.cursor + 1}}
  end
  def handle_call(:count, _from, state), do: {:reply, length(state.cards), state}
  def classify(value) do
    case value do
      nil -> :missing
      %Entry{} -> :card
      _ -> :unknown
    end
  end
  def priority(attempts) do
    cond do
      attempts == 0 -> :high
      attempts < 5 -> :medium
      true -> :low
    end
  end
  def await_result do
    receive do
      {:ok, word} -> "Learned #{word}"
      {:error, reason} -> inspect(reason)
    after
      100 -> :timeout
    end
  end
  def eligible_for_stage_0(card, today) do
    due = card.attempts * 1
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_1(card, today) do
    due = card.attempts * 2
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_2(card, today) do
    due = card.attempts * 3
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_3(card, today) do
    due = card.attempts * 4
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_4(card, today) do
    due = card.attempts * 5
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_5(card, today) do
    due = card.attempts * 6
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_6(card, today) do
    due = card.attempts * 7
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_7(card, today) do
    due = card.attempts * 8
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_8(card, today) do
    due = card.attempts * 9
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_9(card, today) do
    due = card.attempts * 10
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_10(card, today) do
    due = card.attempts * 11
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_11(card, today) do
    due = card.attempts * 12
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_12(card, today) do
    due = card.attempts * 13
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_13(card, today) do
    due = card.attempts * 14
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_14(card, today) do
    due = card.attempts * 15
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_15(card, today) do
    due = card.attempts * 16
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_16(card, today) do
    due = card.attempts * 17
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_17(card, today) do
    due = card.attempts * 18
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_18(card, today) do
    due = card.attempts * 19
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_19(card, today) do
    due = card.attempts * 20
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_20(card, today) do
    due = card.attempts * 21
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_21(card, today) do
    due = card.attempts * 22
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_22(card, today) do
    due = card.attempts * 23
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_23(card, today) do
    due = card.attempts * 24
    enabled = card.word != ""
    enabled and due <= today
  end
  defp normalize(word), do: String.trim(word)
  defmodule Metrics do
    def score(value), do: value + 100
  end
end
