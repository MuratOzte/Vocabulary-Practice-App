using System;
using System.Linq;
using System.Threading.Tasks;
[AttributeUsage(AttributeTargets.All)]
class AuditedAttribute : Attribute { public AuditedAttribute(string label) {} }
record Receipt(string Id, long Cents);
partial class Checkout<T> where T : class {
    public long Limit { get; private set; } = 1000;
    [Audited("capture")]
    public async Task<long> Capture(long[] amounts) {
        if (amounts.Length == 0) return 0;
        await Task.Yield();
        long Fee(long value) { return value / 100; }
        return amounts.Where(x => x > 0).Select(x => x - Fee(x)).Sum();
    }
}
partial class Checkout<T> where T : class {
    public void Configure(long limit) { Limit = Math.Max(0, limit); }
}
static class ReceiptExtensions {
    public static bool IsRefundable(this Receipt receipt) { return receipt.Cents > 0; }
}
