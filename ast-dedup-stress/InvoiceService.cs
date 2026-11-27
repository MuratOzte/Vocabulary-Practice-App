using System;
using System.Collections.Generic;
using System.Linq;

namespace Billing;
public record Invoice(string Customer, decimal Amount, DateTime Due, bool Paid);
public static class InvoiceService
{
    public static decimal Outstanding(IEnumerable<Invoice> invoices, string customer, DateTime today)
    {
        bool IsOverdue(Invoice invoice)
        {
            if (invoice.Paid || invoice.Customer != customer) return false;
            return invoice.Due.Date < today.Date;
        }
        return invoices.Where(invoice => IsOverdue(invoice)).Sum(invoice => invoice.Amount);
    }

    public static string Recipient(Dictionary<string, string> contacts, string customer)
    {
        if (!contacts.TryGetValue(customer, out var email)) return "unassigned";
        return email.Trim().ToLowerInvariant();
    }

    public static decimal ApplyCredit(decimal amount, decimal credit)
    {
        if (credit < 0) throw new ArgumentOutOfRangeException(nameof(credit));
        return Math.Max(0, amount - credit);
    }
}
