package fixture
import "strings"
type Service struct { repository Repository; fee int64 }
func NewService(r Repository, fee int64) Service { return Service{repository: r, fee: fee} }
func (s Service) Quote(key, currency string) int64 { return s.repository.Load(key, strings.ToUpper(currency)).Cents + s.fee }

func NormalizeCurrency(currency string) string { if currency == "" { return "TRY" }; return currency }
