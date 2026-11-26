using System;
using System.Collections.Generic;
using System.Linq;
namespace Stress.CSharp;
public sealed class Session<T> where T : class
{
    private readonly List<T> items = new();
    public event Action<T>? Added;
    public void Add(T item) { items.Add(item); Added?.Invoke(item); }
    public IReadOnlyList<TResult> Select<TResult>(Func<T, TResult> selector) =>
        items.Select(selector).ToList();
    public int Count => items.Count;
}
