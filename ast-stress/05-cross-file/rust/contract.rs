pub trait Pricing { fn quote(&self, key: &str, currency: &str) -> i64; }
