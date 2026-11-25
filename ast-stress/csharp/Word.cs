using System.Collections.Generic;
using System.Linq;
namespace Stress.CSharp;
public record Word(string Text, IReadOnlyList<string> Meanings)
{
    public bool Matches(string answer) => Meanings.Contains(answer.Trim());
}
