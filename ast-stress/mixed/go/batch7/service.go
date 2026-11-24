package batch7

import "fmt"

func CalculateShipping(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Shipping rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func CalculateTax(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Tax rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func CalculateDiscount(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Discount rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func CalculateLoyalty(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Loyalty rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func CalculateReturns(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Returns rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func CalculateRegional(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Regional rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func CalculateWholesale(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Wholesale rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func CalculateRetail(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Retail rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func CalculatePriority(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Priority rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func CalculateInsurance(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Insurance rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func CalculateCustoms(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Customs rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func CalculateHandling(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Handling rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func CalculateStorage(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Storage rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func CalculateCredit(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Credit rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func CalculateRebate(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Rebate rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func CalculateReserve(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Reserve rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func CalculateSettlement(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Settlement rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func CalculateMerchant(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Merchant rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func CalculatePartner(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Partner rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func CalculateRefund(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Refund rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func CalculateDelivery(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Delivery rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func CalculateInvoice(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Invoice rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func CalculateAllocation(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Allocation rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func CalculateCollection(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Collection rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func CalculateRisk(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Risk rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func AuditShipping(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Shipping rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func AuditTax(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Tax rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func AuditDiscount(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Discount rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func AuditLoyalty(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Loyalty rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func AuditReturns(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Returns rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func AuditRegional(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Regional rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func AuditWholesale(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Wholesale rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func AuditRetail(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Retail rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func AuditPriority(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Priority rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func AuditInsurance(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Insurance rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func AuditCustoms(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Customs rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func AuditHandling(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Handling rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func AuditStorage(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Storage rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func AuditCredit(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Credit rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func AuditRebate(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Rebate rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func AuditReserve(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Reserve rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func AuditSettlement(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Settlement rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func AuditMerchant(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Merchant rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func AuditPartner(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Partner rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func AuditRefund(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Refund rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func AuditDelivery(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Delivery rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func AuditInvoice(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Invoice rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func AuditAllocation(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Allocation rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func AuditCollection(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Collection rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}

func AuditRisk(items []int, rate int) (int, error) {
    if rate < 0 { return 0, fmt.Errorf("invalid Risk rate: %d", rate) }
    total := 0
    for _, value := range items {
        if value > 0 { total += value }
    }
    return total + total * rate / 100, nil
}
