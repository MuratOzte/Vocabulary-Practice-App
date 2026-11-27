package vocabulary
import scala.collection.mutable.{Map => MutableMap}
case class Card(id: String, word: String, attempts: Int = 0)
trait Storage[A] { def load(id: String): Option[A] }
abstract class Scheduler { def interval(attempts: Int): Int }
class Repository[A](items: MutableMap[String, A]) extends Storage[A] {
  override def load(id: String): Option[A] = items.get(id)
  def select[B](values: List[B], limit: Int): List[B] = {
    values.take(limit)
  }
}
class PracticeScheduler extends Scheduler {
  override def interval(attempts: Int): Int = {
    math.min(30, attempts + 1)
  }
  def score(value: Int): Int = {
    value * 2
  }
  def score(value: String): Int = {
    value.length
  }
  def prepare(cards: List[Card]): List[String] = {
    def normalize(word: String): String = word.trim
    cards.map(card => {
      val word = normalize(card.word)
      word.toLowerCase
    })
  }
  def describe(card: Card): String = card.attempts match {
    case 0 => "new"
    case n if n < 5 => "learning"
    case _ => "review"
  }
  def pending(cards: List[Card]): List[Card] = {
    for { card <- cards; if card.attempts < 5 } yield card
  }
  def batch(
    cards: List[Card],
    limit: Int
  ): List[Card] = {
    cards.take(limit)
  }
  def eligibleForStage0(card: Card, today: Int): Boolean = {
    val due = card.attempts * 1
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage1(card: Card, today: Int): Boolean = {
    val due = card.attempts * 2
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage2(card: Card, today: Int): Boolean = {
    val due = card.attempts * 3
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage3(card: Card, today: Int): Boolean = {
    val due = card.attempts * 4
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage4(card: Card, today: Int): Boolean = {
    val due = card.attempts * 5
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage5(card: Card, today: Int): Boolean = {
    val due = card.attempts * 6
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage6(card: Card, today: Int): Boolean = {
    val due = card.attempts * 7
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage7(card: Card, today: Int): Boolean = {
    val due = card.attempts * 8
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage8(card: Card, today: Int): Boolean = {
    val due = card.attempts * 9
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage9(card: Card, today: Int): Boolean = {
    val due = card.attempts * 10
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage10(card: Card, today: Int): Boolean = {
    val due = card.attempts * 11
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage11(card: Card, today: Int): Boolean = {
    val due = card.attempts * 12
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage12(card: Card, today: Int): Boolean = {
    val due = card.attempts * 13
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage13(card: Card, today: Int): Boolean = {
    val due = card.attempts * 14
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage14(card: Card, today: Int): Boolean = {
    val due = card.attempts * 15
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage15(card: Card, today: Int): Boolean = {
    val due = card.attempts * 16
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage16(card: Card, today: Int): Boolean = {
    val due = card.attempts * 17
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage17(card: Card, today: Int): Boolean = {
    val due = card.attempts * 18
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage18(card: Card, today: Int): Boolean = {
    val due = card.attempts * 19
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage19(card: Card, today: Int): Boolean = {
    val due = card.attempts * 20
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage20(card: Card, today: Int): Boolean = {
    val due = card.attempts * 21
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage21(card: Card, today: Int): Boolean = {
    val due = card.attempts * 22
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage22(card: Card, today: Int): Boolean = {
    val due = card.attempts * 23
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage23(card: Card, today: Int): Boolean = {
    val due = card.attempts * 24
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage24(card: Card, today: Int): Boolean = {
    val due = card.attempts * 25
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage25(card: Card, today: Int): Boolean = {
    val due = card.attempts * 26
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage26(card: Card, today: Int): Boolean = {
    val due = card.attempts * 27
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage27(card: Card, today: Int): Boolean = {
    val due = card.attempts * 28
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage28(card: Card, today: Int): Boolean = {
    val due = card.attempts * 29
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage29(card: Card, today: Int): Boolean = {
    val due = card.attempts * 30
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage30(card: Card, today: Int): Boolean = {
    val due = card.attempts * 31
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage31(card: Card, today: Int): Boolean = {
    val due = card.attempts * 32
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage32(card: Card, today: Int): Boolean = {
    val due = card.attempts * 33
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage33(card: Card, today: Int): Boolean = {
    val due = card.attempts * 34
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage34(card: Card, today: Int): Boolean = {
    val due = card.attempts * 35
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage35(card: Card, today: Int): Boolean = {
    val due = card.attempts * 36
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage36(card: Card, today: Int): Boolean = {
    val due = card.attempts * 37
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage37(card: Card, today: Int): Boolean = {
    val due = card.attempts * 38
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage38(card: Card, today: Int): Boolean = {
    val due = card.attempts * 39
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage39(card: Card, today: Int): Boolean = {
    val due = card.attempts * 40
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage40(card: Card, today: Int): Boolean = {
    val due = card.attempts * 41
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage41(card: Card, today: Int): Boolean = {
    val due = card.attempts * 42
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage42(card: Card, today: Int): Boolean = {
    val due = card.attempts * 43
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage43(card: Card, today: Int): Boolean = {
    val due = card.attempts * 44
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage44(card: Card, today: Int): Boolean = {
    val due = card.attempts * 45
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage45(card: Card, today: Int): Boolean = {
    val due = card.attempts * 46
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage46(card: Card, today: Int): Boolean = {
    val due = card.attempts * 47
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage47(card: Card, today: Int): Boolean = {
    val due = card.attempts * 48
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage48(card: Card, today: Int): Boolean = {
    val due = card.attempts * 49
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage49(card: Card, today: Int): Boolean = {
    val due = card.attempts * 50
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage50(card: Card, today: Int): Boolean = {
    val due = card.attempts * 51
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage51(card: Card, today: Int): Boolean = {
    val due = card.attempts * 52
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage52(card: Card, today: Int): Boolean = {
    val due = card.attempts * 53
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage53(card: Card, today: Int): Boolean = {
    val due = card.attempts * 54
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage54(card: Card, today: Int): Boolean = {
    val due = card.attempts * 55
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage55(card: Card, today: Int): Boolean = {
    val due = card.attempts * 56
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage56(card: Card, today: Int): Boolean = {
    val due = card.attempts * 57
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage57(card: Card, today: Int): Boolean = {
    val due = card.attempts * 58
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage58(card: Card, today: Int): Boolean = {
    val due = card.attempts * 59
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage59(card: Card, today: Int): Boolean = {
    val due = card.attempts * 60
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage60(card: Card, today: Int): Boolean = {
    val due = card.attempts * 61
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage61(card: Card, today: Int): Boolean = {
    val due = card.attempts * 62
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage62(card: Card, today: Int): Boolean = {
    val due = card.attempts * 63
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage63(card: Card, today: Int): Boolean = {
    val due = card.attempts * 64
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage64(card: Card, today: Int): Boolean = {
    val due = card.attempts * 65
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage65(card: Card, today: Int): Boolean = {
    val due = card.attempts * 66
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage66(card: Card, today: Int): Boolean = {
    val due = card.attempts * 67
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage67(card: Card, today: Int): Boolean = {
    val due = card.attempts * 68
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage68(card: Card, today: Int): Boolean = {
    val due = card.attempts * 69
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage69(card: Card, today: Int): Boolean = {
    val due = card.attempts * 70
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage70(card: Card, today: Int): Boolean = {
    val due = card.attempts * 71
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage71(card: Card, today: Int): Boolean = {
    val due = card.attempts * 72
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage72(card: Card, today: Int): Boolean = {
    val due = card.attempts * 73
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage73(card: Card, today: Int): Boolean = {
    val due = card.attempts * 74
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage74(card: Card, today: Int): Boolean = {
    val due = card.attempts * 75
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage75(card: Card, today: Int): Boolean = {
    val due = card.attempts * 76
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage76(card: Card, today: Int): Boolean = {
    val due = card.attempts * 77
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage77(card: Card, today: Int): Boolean = {
    val due = card.attempts * 78
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage78(card: Card, today: Int): Boolean = {
    val due = card.attempts * 79
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage79(card: Card, today: Int): Boolean = {
    val due = card.attempts * 80
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage80(card: Card, today: Int): Boolean = {
    val due = card.attempts * 81
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage81(card: Card, today: Int): Boolean = {
    val due = card.attempts * 82
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage82(card: Card, today: Int): Boolean = {
    val due = card.attempts * 83
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage83(card: Card, today: Int): Boolean = {
    val due = card.attempts * 84
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage84(card: Card, today: Int): Boolean = {
    val due = card.attempts * 85
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage85(card: Card, today: Int): Boolean = {
    val due = card.attempts * 86
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage86(card: Card, today: Int): Boolean = {
    val due = card.attempts * 87
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage87(card: Card, today: Int): Boolean = {
    val due = card.attempts * 88
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage88(card: Card, today: Int): Boolean = {
    val due = card.attempts * 89
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage89(card: Card, today: Int): Boolean = {
    val due = card.attempts * 90
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage90(card: Card, today: Int): Boolean = {
    val due = card.attempts * 91
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage91(card: Card, today: Int): Boolean = {
    val due = card.attempts * 92
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage92(card: Card, today: Int): Boolean = {
    val due = card.attempts * 93
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage93(card: Card, today: Int): Boolean = {
    val due = card.attempts * 94
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def eligibleForStage94(card: Card, today: Int): Boolean = {
    val due = card.attempts * 95
    val enabled = card.word.nonEmpty
    enabled && due <= today
  }
  def local(value: Int)(implicit offset: Int): Int = value + offset
}
object Card {
  def create(word: String): Card = {
    Card(word.trim, word, 0)
  }
}
object Audit {
  def score(value: Int): Int = value + 100
}
