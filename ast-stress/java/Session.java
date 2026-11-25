package stress.java;

public final class Session {
    public int scoreLesson01(int correct, int total, int streak) {
        int minimum = 2;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson02(int correct, int total, int streak) {
        int minimum = 3;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson03(int correct, int total, int streak) {
        int minimum = 4;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.min(streak, 10);
        }
        return score;
    }

    public int scoreLesson04(int correct, int total, int streak) {
        int minimum = 5;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson05(int correct, int total, int streak) {
        int minimum = 1;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson06(int correct, int total, int streak) {
        int minimum = 2;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.min(streak, 10);
        }
        return score;
    }

    public int scoreLesson07(int correct, int total, int streak) {
        int minimum = 3;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson08(int correct, int total, int streak) {
        int minimum = 4;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson09(int correct, int total, int streak) {
        int minimum = 5;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.min(streak, 10);
        }
        return score;
    }

    public int scoreLesson10(int correct, int total, int streak) {
        int minimum = 1;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson11(int correct, int total, int streak) {
        int minimum = 2;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson12(int correct, int total, int streak) {
        int minimum = 3;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.min(streak, 10);
        }
        return score;
    }

    public int scoreLesson13(int correct, int total, int streak) {
        int minimum = 4;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson14(int correct, int total, int streak) {
        int minimum = 5;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson15(int correct, int total, int streak) {
        int minimum = 1;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.min(streak, 10);
        }
        return score;
    }

    public int scoreLesson16(int correct, int total, int streak) {
        int minimum = 2;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson17(int correct, int total, int streak) {
        int minimum = 3;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson18(int correct, int total, int streak) {
        int minimum = 4;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.min(streak, 10);
        }
        return score;
    }

    public int scoreLesson19(int correct, int total, int streak) {
        int minimum = 5;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson20(int correct, int total, int streak) {
        int minimum = 1;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson21(int correct, int total, int streak) {
        int minimum = 2;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.min(streak, 10);
        }
        return score;
    }

    public int scoreLesson22(int correct, int total, int streak) {
        int minimum = 3;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson23(int correct, int total, int streak) {
        int minimum = 4;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson24(int correct, int total, int streak) {
        int minimum = 5;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.min(streak, 10);
        }
        return score;
    }

    public int scoreLesson25(int correct, int total, int streak) {
        int minimum = 1;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson26(int correct, int total, int streak) {
        int minimum = 2;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson27(int correct, int total, int streak) {
        int minimum = 3;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.min(streak, 10);
        }
        return score;
    }

    public int scoreLesson28(int correct, int total, int streak) {
        int minimum = 4;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson29(int correct, int total, int streak) {
        int minimum = 5;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson30(int correct, int total, int streak) {
        int minimum = 1;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.min(streak, 10);
        }
        return score;
    }

    public int scoreLesson31(int correct, int total, int streak) {
        int minimum = 2;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson32(int correct, int total, int streak) {
        int minimum = 3;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson33(int correct, int total, int streak) {
        int minimum = 4;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.min(streak, 10);
        }
        return score;
    }

    public int scoreLesson34(int correct, int total, int streak) {
        int minimum = 5;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson35(int correct, int total, int streak) {
        int minimum = 1;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson36(int correct, int total, int streak) {
        int minimum = 2;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.min(streak, 10);
        }
        return score;
    }

    public int scoreLesson37(int correct, int total, int streak) {
        int minimum = 3;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson38(int correct, int total, int streak) {
        int minimum = 4;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson39(int correct, int total, int streak) {
        int minimum = 5;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.min(streak, 10);
        }
        return score;
    }

    public int scoreLesson40(int correct, int total, int streak) {
        int minimum = 1;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson41(int correct, int total, int streak) {
        int minimum = 2;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson42(int correct, int total, int streak) {
        int minimum = 3;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.min(streak, 10);
        }
        return score;
    }

    public int scoreLesson43(int correct, int total, int streak) {
        int minimum = 4;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson44(int correct, int total, int streak) {
        int minimum = 5;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson45(int correct, int total, int streak) {
        int minimum = 1;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.min(streak, 10);
        }
        return score;
    }

    public int scoreLesson46(int correct, int total, int streak) {
        int minimum = 2;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson47(int correct, int total, int streak) {
        int minimum = 3;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson48(int correct, int total, int streak) {
        int minimum = 4;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.min(streak, 10);
        }
        return score;
    }

    public int scoreLesson49(int correct, int total, int streak) {
        int minimum = 5;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson50(int correct, int total, int streak) {
        int minimum = 1;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson51(int correct, int total, int streak) {
        int minimum = 2;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.min(streak, 10);
        }
        return score;
    }

    public int scoreLesson52(int correct, int total, int streak) {
        int minimum = 3;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson53(int correct, int total, int streak) {
        int minimum = 4;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson54(int correct, int total, int streak) {
        int minimum = 5;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.min(streak, 10);
        }
        return score;
    }

    public int scoreLesson55(int correct, int total, int streak) {
        int minimum = 1;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson56(int correct, int total, int streak) {
        int minimum = 2;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson57(int correct, int total, int streak) {
        int minimum = 3;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.min(streak, 10);
        }
        return score;
    }

    public int scoreLesson58(int correct, int total, int streak) {
        int minimum = 4;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson59(int correct, int total, int streak) {
        int minimum = 5;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson60(int correct, int total, int streak) {
        int minimum = 1;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.min(streak, 10);
        }
        return score;
    }

    public int scoreLesson61(int correct, int total, int streak) {
        int minimum = 2;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson62(int correct, int total, int streak) {
        int minimum = 3;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson63(int correct, int total, int streak) {
        int minimum = 4;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.min(streak, 10);
        }
        return score;
    }

    public int scoreLesson64(int correct, int total, int streak) {
        int minimum = 5;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson65(int correct, int total, int streak) {
        int minimum = 1;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson66(int correct, int total, int streak) {
        int minimum = 2;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.min(streak, 10);
        }
        return score;
    }

    public int scoreLesson67(int correct, int total, int streak) {
        int minimum = 3;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson68(int correct, int total, int streak) {
        int minimum = 4;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

    public int scoreLesson69(int correct, int total, int streak) {
        int minimum = 5;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.min(streak, 10);
        }
        return score;
    }

    public int scoreLesson70(int correct, int total, int streak) {
        int minimum = 1;
        int score = 0;
        if (total <= 0) {
            return score;
        }
        if (correct >= minimum) {
            score += correct * 10;
        }
        if (streak > 0) {
            score += streak;
        }
        return score;
    }

}
