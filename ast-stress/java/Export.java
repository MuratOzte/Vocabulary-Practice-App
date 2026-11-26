package stress.java;

import java.util.List;

public final class Export {
    @Deprecated(since = "1.0")
    public static String csv(List<Word> words) {
        var rows = words.stream().map(word -> word.text() + "," + word.meanings().size()).toList();
        return String.join("\n", rows);
    }
    public static String label(Word word) {
        return switch (word.meanings().size()) {
            case 0 -> "empty";
            case 1 -> "single";
            default -> "İstanbul 📚";
        };
    }
}
