use super::*;
#[test] fn quote() { assert_eq!(Service::new(Repository).quote("a"), 1000); }
