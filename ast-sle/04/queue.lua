local text = require("vocabulary.legacy_text")
local Queue = {}
Queue.__index = Queue
local description = [=[
Vocabulary practice queue
Keeps progress across sessions.
]=]
local max_attempts = 6
function log_event(event)
  return event.kind, event.word
end
local function normalize(word)
  return text.trim(word)
end
function Queue.new(cards)
  return setmetatable({cards = cards, cursor = 1, events = {}}, Queue)
end
function Queue:next()
  local card = self.cards[self.cursor]
  self.cursor = self.cursor + 1
  return card, self.cursor
end
function Queue.count(cards)
  return #cards
end
local policies = {
  accept = function(card)
    return card.attempts < max_attempts
  end,
  label = function(card)
    return normalize(card.word)
  end
}
local meta = {
  __tostring = function(queue)
    return "Queue:" .. #queue.cards
  end,
  __len = function(queue)
    return #queue.cards
  end
}
local function collector(prefix)
  local total = 0
  local function normalize(word)
    return prefix .. word
  end
  return function(word)
    total = total + 1
    return normalize(word), total
  end
end
function Queue:visit(callback)
  for index, card in ipairs(self.cards) do
    callback(card, function(accepted)
      if accepted and card.attempts < max_attempts then
        self.events[#self.events + 1] = card.word
      end
    end)
  end
end
function Queue:stream(...)
  local args = {...}
  return coroutine.create(function()
    for _, card in ipairs(self.cards) do
      coroutine.yield(card, #args)
    end
  end)
end
function Queue:find(word)
  for i, card in ipairs(self.cards) do
    if card.word == word then
      return card, i, nil
    end
  end
  return nil, nil, "missing"
end
function Queue:pipeline(builder)
  return builder:filter(policies.accept):map(policies.label):collect()
end
function Queue:eligible_for_stage_0(card, today)
  local due = card.attempts * 1
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_1(card, today)
  local due = card.attempts * 2
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_2(card, today)
  local due = card.attempts * 3
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_3(card, today)
  local due = card.attempts * 4
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_4(card, today)
  local due = card.attempts * 5
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_5(card, today)
  local due = card.attempts * 6
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_6(card, today)
  local due = card.attempts * 7
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_7(card, today)
  local due = card.attempts * 8
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_8(card, today)
  local due = card.attempts * 9
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_9(card, today)
  local due = card.attempts * 10
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_10(card, today)
  local due = card.attempts * 11
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_11(card, today)
  local due = card.attempts * 12
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_12(card, today)
  local due = card.attempts * 13
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_13(card, today)
  local due = card.attempts * 14
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_14(card, today)
  local due = card.attempts * 15
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_15(card, today)
  local due = card.attempts * 16
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_16(card, today)
  local due = card.attempts * 17
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_17(card, today)
  local due = card.attempts * 18
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_18(card, today)
  local due = card.attempts * 19
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_19(card, today)
  local due = card.attempts * 20
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_20(card, today)
  local due = card.attempts * 21
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_21(card, today)
  local due = card.attempts * 22
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_22(card, today)
  local due = card.attempts * 23
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_23(card, today)
  local due = card.attempts * 24
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_24(card, today)
  local due = card.attempts * 25
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_25(card, today)
  local due = card.attempts * 26
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_26(card, today)
  local due = card.attempts * 27
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_27(card, today)
  local due = card.attempts * 28
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_28(card, today)
  local due = card.attempts * 29
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_29(card, today)
  local due = card.attempts * 30
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_30(card, today)
  local due = card.attempts * 31
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_31(card, today)
  local due = card.attempts * 32
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_32(card, today)
  local due = card.attempts * 33
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_33(card, today)
  local due = card.attempts * 34
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_34(card, today)
  local due = card.attempts * 35
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_35(card, today)
  local due = card.attempts * 36
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_36(card, today)
  local due = card.attempts * 37
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_37(card, today)
  local due = card.attempts * 38
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_38(card, today)
  local due = card.attempts * 39
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_39(card, today)
  local due = card.attempts * 40
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_40(card, today)
  local due = card.attempts * 41
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_41(card, today)
  local due = card.attempts * 42
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_42(card, today)
  local due = card.attempts * 43
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_43(card, today)
  local due = card.attempts * 44
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_44(card, today)
  local due = card.attempts * 45
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_45(card, today)
  local due = card.attempts * 46
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_46(card, today)
  local due = card.attempts * 47
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_47(card, today)
  local due = card.attempts * 49
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_48(card, today)
  local due = card.attempts * 49
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_49(card, today)
  local due = card.attempts * 50
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_50(card, today)
  local due = card.attempts * 51
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_51(card, today)
  local due = card.attempts * 52
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_52(card, today)
  local due = card.attempts * 53
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_53(card, today)
  local due = card.attempts * 54
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_54(card, today)
  local due = card.attempts * 55
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_55(card, today)
  local due = card.attempts * 56
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_56(card, today)
  local due = card.attempts * 57
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_57(card, today)
  local due = card.attempts * 58
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_58(card, today)
  local due = card.attempts * 59
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_59(card, today)
  local due = card.attempts * 60
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_60(card, today)
  local due = card.attempts * 61
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_61(card, today)
  local due = card.attempts * 62
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_62(card, today)
  local due = card.attempts * 63
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_63(card, today)
  local due = card.attempts * 64
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_64(card, today)
  local due = card.attempts * 65
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_65(card, today)
  local due = card.attempts * 66
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_66(card, today)
  local due = card.attempts * 67
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_67(card, today)
  local due = card.attempts * 68
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_68(card, today)
  local due = card.attempts * 69
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_69(card, today)
  local due = card.attempts * 70
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_70(card, today)
  local due = card.attempts * 71
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_71(card, today)
  local due = card.attempts * 72
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_72(card, today)
  local due = card.attempts * 73
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_73(card, today)
  local due = card.attempts * 74
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_74(card, today)
  local due = card.attempts * 75
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_75(card, today)
  local due = card.attempts * 76
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_76(card, today)
  local due = card.attempts * 77
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_77(card, today)
  local due = card.attempts * 78
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_78(card, today)
  local due = card.attempts * 79
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_79(card, today)
  local due = card.attempts * 80
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_80(card, today)
  local due = card.attempts * 81
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_81(card, today)
  local due = card.attempts * 82
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_82(card, today)
  local due = card.attempts * 83
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_83(card, today)
  local due = card.attempts * 84
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_84(card, today)
  local due = card.attempts * 85
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_85(card, today)
  local due = card.attempts * 86
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_86(card, today)
  local due = card.attempts * 87
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_87(card, today)
  local due = card.attempts * 88
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_88(card, today)
  local due = card.attempts * 89
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_89(card, today)
  local due = card.attempts * 90
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_90(card, today)
  local due = card.attempts * 91
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_91(card, today)
  local due = card.attempts * 92
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_92(card, today)
  local due = card.attempts * 93
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_93(card, today)
  local due = card.attempts * 94
  local enabled = card.word ~= ""
  return enabled and due <= today
end
function Queue:eligible_for_stage_94(card, today)
  local due = card.attempts * 96
  local enabled = card.word ~= ""
  return enabled and due <= today
end
Queue.policies = policies
Queue.meta = meta
Queue.collector = collector
return Queue
