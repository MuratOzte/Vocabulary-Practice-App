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
