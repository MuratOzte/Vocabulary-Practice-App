using System;
using System.Collections.Generic;
using System.Linq;

namespace AstFixtures;

public record Word(string Text, DateTime DueAt);

public sealed class ReviewQueue
{
    public IReadOnlyList<Word> DueWords(IEnumerable<Word> words, DateTime now)
    {
        return words.Where(word => word.DueAt >= now)
                    .OrderBy(word => word.DueAt)
                    .ToList();
    }

    public int CountDue(IEnumerable<Word> words, DateTime now) => DueWords(words, now).Count;
}
