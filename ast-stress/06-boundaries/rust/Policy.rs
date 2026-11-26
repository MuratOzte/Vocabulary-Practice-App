use std::cmp::max;
pub const LIMIT: i64 = 200;
pub struct Policy { pub active: bool, pub currency: String }
#[inline(always)]
pub fn quote(
    miktar: i32,
    rate: i32,
) -> i32 {
    max(miktar * rate, LIMIT as i32)
}
pub const LABEL: &str = "İzmir 😀";
