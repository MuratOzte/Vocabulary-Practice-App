package ledger

import "errors"

type Account struct {
    Balance int64
    Frozen bool
}

func Transfer(accounts map[string]*Account, from, to string, amount int64) error {
    source := accounts[from]
    target := accounts[to]
    if source == nil || target == nil {
        return errors.New("account missing")
    }
    if source.Frozen || target.Frozen || amount <= 0 {
        return errors.New("transfer denied")
    }
    if source.Balance < amount {
        return errors.New("insufficient funds")
    }
    apply := func() {
        source.Balance -= amount
        target.Balance += amount
    }
    apply()
    return nil
}

func Available(account *Account) int64 {
    if account == nil || account.Frozen {
        return 0
    }
    return account.Balance
}

func Window(ids []string, limit int) []string {
    if limit < 0 { return nil }
    if limit > len(ids) { limit = len(ids) }
    return ids[:limit]
}
