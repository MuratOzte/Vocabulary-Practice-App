using System;
using System.Linq;
using System.Threading.Tasks;
[AttributeUsage(AttributeTargets.All)]
class AuditedAttribute : Attribute { public AuditedAttribute(string label) {} }
record Receipt(string Id, long Cents, string Currency);
partial class Checkout<T> where T : class, new() {
    public long Limit { get; set; } = 2000;
    [Audited("payment")]
    public async Task<long> Capture(long[] amounts) {
        await Task.Delay(1);
        long Fee(long value) { return value / 50; }
        return amounts.Where(x => x >= 0).Select(x => x - Fee(x)).Sum();
    }
}
partial class Checkout<T> where T : class, new() {
    public void Configure(long limit) { Limit = Math.Max(100, limit); }
}
static class ReceiptExtensions {
    public static bool IsRefundable(this Receipt receipt) { return receipt.Cents >= 100; }
}
