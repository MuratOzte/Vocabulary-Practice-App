use crate::model::Order;
pub struct Repository;
impl Repository { pub fn load(&self, _key: &str) -> Order { Order { cents: 1000 } } }

pub fn normalize_currency(currency: &str) -> &str { if currency.is_empty() { "TRY" } else { currency } }
