pub trait Pricing { fn quote(&self, key: &str) -> i64; }
