package astfixtures.java;

import java.util.List;

public final class VocabularySession {
    public record Answer(String expected, String actual) {}

    public int score(List<Answer> answers) {
        int correct = 0;
        for (Answer answer : answers) {
            if (matches(answer)) correct++;
        }
        return correct * 100 / answers.size();
    }

    private boolean matches(Answer answer) {
        return answer.expected().trim().equalsIgnoreCase(answer.actual().trim());
    }
}
