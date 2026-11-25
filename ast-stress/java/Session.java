package stress.java;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public final class Session<T extends Comparable<T>> {
    private final List<Word> words;
    public Session(List<Word> words) { this.words = List.copyOf(words); }
    public Map<String, Long> byInitial() {
        return words.stream().collect(Collectors.groupingBy(
            word -> word.text().substring(0, 1), Collectors.counting()));
    }
    public static class Result {
        private int correct;
        public void record(boolean passed) { if (passed) correct++; }
        public int correct() { return correct; }
    }
}
