use crate::model::Order;
pub struct Repository;
impl Repository { pub fn load(&self, _key: &str, currency: &str) -> Order { Order { cents: 1000, currency: currency.to_owned() } } }
