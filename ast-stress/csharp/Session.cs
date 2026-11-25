using System;

namespace Stress.CSharp;

public sealed class Session
{
    public int ScoreLesson01(int correct, int total, int streak)
    {
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

    public int ScoreLesson02(int correct, int total, int streak)
    {
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

    public int ScoreLesson03(int correct, int total, int streak)
    {
        int minimum = 4;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.Min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.Min(streak, 10);
        }
        return score;
    }

    public int ScoreLesson04(int correct, int total, int streak)
    {
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

    public int ScoreLesson05(int correct, int total, int streak)
    {
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

    public int ScoreLesson06(int correct, int total, int streak)
    {
        int minimum = 2;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.Min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.Min(streak, 10);
        }
        return score;
    }

    public int ScoreLesson07(int correct, int total, int streak)
    {
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

    public int ScoreLesson08(int correct, int total, int streak)
    {
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

    public int ScoreLesson09(int correct, int total, int streak)
    {
        int minimum = 5;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.Min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.Min(streak, 10);
        }
        return score;
    }

    public int ScoreLesson10(int correct, int total, int streak)
    {
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

    public int ScoreLesson11(int correct, int total, int streak)
    {
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

    public int ScoreLesson12(int correct, int total, int streak)
    {
        int minimum = 3;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.Min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.Min(streak, 10);
        }
        return score;
    }

    public int ScoreLesson13(int correct, int total, int streak)
    {
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

    public int ScoreLesson14(int correct, int total, int streak)
    {
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

    public int ScoreLesson15(int correct, int total, int streak)
    {
        int minimum = 1;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.Min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.Min(streak, 10);
        }
        return score;
    }

    public int ScoreLesson16(int correct, int total, int streak)
    {
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

    public int ScoreLesson17(int correct, int total, int streak)
    {
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

    public int ScoreLesson18(int correct, int total, int streak)
    {
        int minimum = 4;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.Min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.Min(streak, 10);
        }
        return score;
    }

    public int ScoreLesson19(int correct, int total, int streak)
    {
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

    public int ScoreLesson20(int correct, int total, int streak)
    {
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

    public int ScoreLesson21(int correct, int total, int streak)
    {
        int minimum = 2;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.Min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.Min(streak, 10);
        }
        return score;
    }

    public int ScoreLesson22(int correct, int total, int streak)
    {
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

    public int ScoreLesson23(int correct, int total, int streak)
    {
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

    public int ScoreLesson24(int correct, int total, int streak)
    {
        int minimum = 5;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.Min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.Min(streak, 10);
        }
        return score;
    }

    public int ScoreLesson25(int correct, int total, int streak)
    {
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

    public int ScoreLesson26(int correct, int total, int streak)
    {
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

    public int ScoreLesson27(int correct, int total, int streak)
    {
        int minimum = 3;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.Min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.Min(streak, 10);
        }
        return score;
    }

    public int ScoreLesson28(int correct, int total, int streak)
    {
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

    public int ScoreLesson29(int correct, int total, int streak)
    {
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

    public int ScoreLesson30(int correct, int total, int streak)
    {
        int minimum = 1;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.Min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.Min(streak, 10);
        }
        return score;
    }

    public int ScoreLesson31(int correct, int total, int streak)
    {
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

    public int ScoreLesson32(int correct, int total, int streak)
    {
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

    public int ScoreLesson33(int correct, int total, int streak)
    {
        int minimum = 4;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.Min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.Min(streak, 10);
        }
        return score;
    }

    public int ScoreLesson34(int correct, int total, int streak)
    {
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

    public int ScoreLesson35(int correct, int total, int streak)
    {
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

    public int ScoreLesson36(int correct, int total, int streak)
    {
        int minimum = 2;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.Min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.Min(streak, 10);
        }
        return score;
    }

    public int ScoreLesson37(int correct, int total, int streak)
    {
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

    public int ScoreLesson38(int correct, int total, int streak)
    {
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

    public int ScoreLesson39(int correct, int total, int streak)
    {
        int minimum = 5;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.Min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.Min(streak, 10);
        }
        return score;
    }

    public int ScoreLesson40(int correct, int total, int streak)
    {
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

    public int ScoreLesson41(int correct, int total, int streak)
    {
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

    public int ScoreLesson42(int correct, int total, int streak)
    {
        int minimum = 3;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.Min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.Min(streak, 10);
        }
        return score;
    }

    public int ScoreLesson43(int correct, int total, int streak)
    {
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

    public int ScoreLesson44(int correct, int total, int streak)
    {
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

    public int ScoreLesson45(int correct, int total, int streak)
    {
        int minimum = 1;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.Min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.Min(streak, 10);
        }
        return score;
    }

    public int ScoreLesson46(int correct, int total, int streak)
    {
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

    public int ScoreLesson47(int correct, int total, int streak)
    {
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

    public int ScoreLesson48(int correct, int total, int streak)
    {
        int minimum = 4;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.Min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.Min(streak, 10);
        }
        return score;
    }

    public int ScoreLesson49(int correct, int total, int streak)
    {
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

    public int ScoreLesson50(int correct, int total, int streak)
    {
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

    public int ScoreLesson51(int correct, int total, int streak)
    {
        int minimum = 2;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.Min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.Min(streak, 10);
        }
        return score;
    }

    public int ScoreLesson52(int correct, int total, int streak)
    {
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

    public int ScoreLesson53(int correct, int total, int streak)
    {
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

    public int ScoreLesson54(int correct, int total, int streak)
    {
        int minimum = 5;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.Min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.Min(streak, 10);
        }
        return score;
    }

    public int ScoreLesson55(int correct, int total, int streak)
    {
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

    public int ScoreLesson56(int correct, int total, int streak)
    {
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

    public int ScoreLesson57(int correct, int total, int streak)
    {
        int minimum = 3;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.Min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.Min(streak, 10);
        }
        return score;
    }

    public int ScoreLesson58(int correct, int total, int streak)
    {
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

    public int ScoreLesson59(int correct, int total, int streak)
    {
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

    public int ScoreLesson60(int correct, int total, int streak)
    {
        int minimum = 1;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.Min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.Min(streak, 10);
        }
        return score;
    }

    public int ScoreLesson61(int correct, int total, int streak)
    {
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

    public int ScoreLesson62(int correct, int total, int streak)
    {
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

    public int ScoreLesson63(int correct, int total, int streak)
    {
        int minimum = 4;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.Min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.Min(streak, 10);
        }
        return score;
    }

    public int ScoreLesson64(int correct, int total, int streak)
    {
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

    public int ScoreLesson65(int correct, int total, int streak)
    {
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

    public int ScoreLesson66(int correct, int total, int streak)
    {
        int minimum = 2;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.Min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.Min(streak, 10);
        }
        return score;
    }

    public int ScoreLesson67(int correct, int total, int streak)
    {
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

    public int ScoreLesson68(int correct, int total, int streak)
    {
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

    public int ScoreLesson69(int correct, int total, int streak)
    {
        int minimum = 5;
        int score = 0; // Clamp invalid input before scoring.
        if (total <= 0 || correct < 0) {
            return score;
        }
        if (correct >= minimum && correct <= total) {
            score += Math.Min(correct, total) * 10;
        }
        if (streak > 0 && correct == total) {
            score += Math.Min(streak, 10);
        }
        return score;
    }

    public int ScoreLesson70(int correct, int total, int streak)
    {
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
