local text = require("vocabulary.text")
local Queue = {}
Queue.__index = Queue
local description = [=[
Vocabulary practice queue
Keeps progress across sessions.
]=]
local max_attempts = 5
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
  ] BROKEN [
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
Queue.policies = policies
Queue.meta = meta
Queue.collector = collector
return Queue
