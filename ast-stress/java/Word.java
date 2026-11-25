package stress.java;

import java.util.List;

public record Word(String text, List<String> meanings) {
    public Word {
        text = text.strip();
        meanings = List.copyOf(meanings);
    }
    public boolean matches(String answer) {
        return meanings.stream().anyMatch(value -> value.strip().equalsIgnoreCase(answer.strip()));
    }
}
