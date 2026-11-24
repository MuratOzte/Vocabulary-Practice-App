package astreview

type Store struct{}
type Archive struct{}

func (s *Store) Label() string {
	return "Active store"
}

func (a Archive) Label() string {
	return "Archive"
}
