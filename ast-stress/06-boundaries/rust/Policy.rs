use std::cmp::min;
pub const LIMIT: i64 = 100;
pub struct Policy { pub active: bool, pub obsolete: i64 }
#[inline]
pub fn quote(
    miktar: i64,
    rate: i64,
) -> i64 {
    min(miktar * rate, LIMIT)
}
pub const LABEL: &str = "İstanbul 😀";
