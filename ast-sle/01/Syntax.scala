package vocabulary.modern
trait Formatter[A]:
  def format(value: A): String
object Syntax:
  given Formatter[String] with
    def format(value: String): String = value.trim
  extension (value: String)
    def normalized: String =
      value.toLowerCase
  def render[A](value: A)(using formatter: Formatter[A]): String =
    formatter.format(value)
