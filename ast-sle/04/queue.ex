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
  @max_attempts 6
  defmacro audit(value) do
    quote do
      {:ok, unquote(value)}
    end
  end
  def start_link(cards), do: GenServer.start_link(__MODULE__, cards)
  @impl true
  def init(cards), do: {:ok, %{cards: cards, cursor: 0}}
  def score(value) when is_integer(value) do
    value * 3
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
  def eligible_for_stage_24(card, today) do
    due = card.attempts * 25
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_25(card, today) do
    due = card.attempts * 26
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_26(card, today) do
    due = card.attempts * 27
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_27(card, today) do
    due = card.attempts * 28
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_28(card, today) do
    due = card.attempts * 29
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_29(card, today) do
    due = card.attempts * 30
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_30(card, today) do
    due = card.attempts * 31
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_31(card, today) do
    due = card.attempts * 32
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_32(card, today) do
    due = card.attempts * 33
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_33(card, today) do
    due = card.attempts * 34
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_34(card, today) do
    due = card.attempts * 35
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_35(card, today) do
    due = card.attempts * 36
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_36(card, today) do
    due = card.attempts * 37
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_37(card, today) do
    due = card.attempts * 38
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_38(card, today) do
    due = card.attempts * 39
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_39(card, today) do
    due = card.attempts * 40
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_40(card, today) do
    due = card.attempts * 41
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_41(card, today) do
    due = card.attempts * 42
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_42(card, today) do
    due = card.attempts * 43
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_43(card, today) do
    due = card.attempts * 44
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_44(card, today) do
    due = card.attempts * 45
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_45(card, today) do
    due = card.attempts * 46
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_46(card, today) do
    due = card.attempts * 47
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_47(card, today) do
    due = card.attempts * 49
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_48(card, today) do
    due = card.attempts * 49
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_49(card, today) do
    due = card.attempts * 50
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_50(card, today) do
    due = card.attempts * 51
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_51(card, today) do
    due = card.attempts * 52
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_52(card, today) do
    due = card.attempts * 53
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_53(card, today) do
    due = card.attempts * 54
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_54(card, today) do
    due = card.attempts * 55
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_55(card, today) do
    due = card.attempts * 56
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_56(card, today) do
    due = card.attempts * 57
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_57(card, today) do
    due = card.attempts * 58
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_58(card, today) do
    due = card.attempts * 59
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_59(card, today) do
    due = card.attempts * 60
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_60(card, today) do
    due = card.attempts * 61
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_61(card, today) do
    due = card.attempts * 62
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_62(card, today) do
    due = card.attempts * 63
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_63(card, today) do
    due = card.attempts * 64
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_64(card, today) do
    due = card.attempts * 65
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_65(card, today) do
    due = card.attempts * 66
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_66(card, today) do
    due = card.attempts * 67
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_67(card, today) do
    due = card.attempts * 68
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_68(card, today) do
    due = card.attempts * 69
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_69(card, today) do
    due = card.attempts * 70
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_70(card, today) do
    due = card.attempts * 71
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_71(card, today) do
    due = card.attempts * 72
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_72(card, today) do
    due = card.attempts * 73
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_73(card, today) do
    due = card.attempts * 74
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_74(card, today) do
    due = card.attempts * 75
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_75(card, today) do
    due = card.attempts * 76
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_76(card, today) do
    due = card.attempts * 77
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_77(card, today) do
    due = card.attempts * 78
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_78(card, today) do
    due = card.attempts * 79
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_79(card, today) do
    due = card.attempts * 80
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_80(card, today) do
    due = card.attempts * 81
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_81(card, today) do
    due = card.attempts * 82
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_82(card, today) do
    due = card.attempts * 83
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_83(card, today) do
    due = card.attempts * 84
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_84(card, today) do
    due = card.attempts * 85
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_85(card, today) do
    due = card.attempts * 86
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_86(card, today) do
    due = card.attempts * 87
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_87(card, today) do
    due = card.attempts * 88
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_88(card, today) do
    due = card.attempts * 89
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_89(card, today) do
    due = card.attempts * 90
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_90(card, today) do
    due = card.attempts * 91
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_91(card, today) do
    due = card.attempts * 92
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_92(card, today) do
    due = card.attempts * 93
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_93(card, today) do
    due = card.attempts * 94
    enabled = card.word != ""
    enabled and due <= today
  end
  def eligible_for_stage_94(card, today) do
    due = card.attempts * 96
    enabled = card.word != ""
    enabled and due <= today
  end
  defp normalize(word), do: String.trim(word)
  defmodule Metrics do
    def score(value), do: value + 100
  end
end
