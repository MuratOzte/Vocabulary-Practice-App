local RetiredLedger = {}
function RetiredLedger.purge(id)
 return "retired-only-ledger" .. id
end
return RetiredLedger
