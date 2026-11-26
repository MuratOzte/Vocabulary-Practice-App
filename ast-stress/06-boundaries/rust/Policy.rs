use std::cmp::max;
pub const LIMIT: i64 = 200;
pub struct Policy { pub active: bool, pub currency: String }
#[inline(always)]
pub fn quote(
    miktar_ö: i32,
    rate: i32,
) -> i32 {
    max(miktar_ö * rate, LIMIT as i32)
}
pub const LABEL: &str = "İzmir 😀";
