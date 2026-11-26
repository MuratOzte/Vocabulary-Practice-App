use std::fmt::Debug;
#[derive(Debug, Clone)]
pub enum Payment { Pending(i64), Captured(i64), Refunded }
pub trait Ledger { fn balance(&self) -> i64; }
pub struct Checkout { pub cents: i64 }
impl Ledger for Checkout {
    fn balance(&self) -> i64 { self.cents }
}
impl Checkout {
    pub fn new(cents: i64) -> Self { Self { cents } }
}
impl Checkout {
    pub async fn capture(&mut self, amount: i64) -> Result<i64, &'static str> {
        if amount > self.cents { return Err("insufficient"); }
        self.cents -= amount;
        Ok(self.cents)
    }
}
pub fn choose<'a, T: Debug>(primary: &'a T, backup: &'a T, ready: bool) -> &'a T {
    if ready { primary } else { backup }
}
pub fn settle(payment: Payment) -> i64 {
    let fee = |value: i64| value / 100;
    let result = match payment {
        Payment::Pending(cents) => cents - fee(cents),
        Payment::Captured(cents) => cents,
        Payment::Refunded => 0,
    };
    assert!(result >= 0);
    result
}
