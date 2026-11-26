package fixture
type Service struct { repository Repository }
func NewService(r Repository) Service { return Service{repository: r} }
func (s Service) Quote(key string) int64 { return s.repository.Load(key).Cents }
