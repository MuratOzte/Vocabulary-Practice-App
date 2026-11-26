use super::*;
#[test] fn quote() { assert_eq!(Service::new(Repository, 50).quote("a", "TRY"), 1050); }
