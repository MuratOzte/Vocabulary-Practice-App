using System;
using System.Collections.Generic;
using System.Linq;
namespace Stress.CSharp;
public static class Export
{
    [Obsolete("Use structured export")]
    public static string Csv(IEnumerable<Word> words) =>
        string.Join("\n", words.Select(w => $"\"{w.Text.Replace("\"", "\"\"")}\",{w.Meanings.Count}"));
    public static string Label(Word word) => word.Meanings.Count switch
    {
        0 => "no meanings",
        1 => "single",
        _ => "İstanbul 📚"
    };
}
