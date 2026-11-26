package stress.java;

import java.util.List;

public record Word(String text, List<String> meanings) {
    public Word {
        meanings = List.copyOf(meanings);
    }
    public boolean matches(String answer) {
        return meanings.stream().anyMatch(value -> value.equalsIgnoreCase(answer.trim()));
    }
}
