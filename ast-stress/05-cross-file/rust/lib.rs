pub mod model;
pub mod repository;
pub mod contract;
use repository::Repository;
use contract::Pricing;
use model::Order;
pub struct Service { repository: Repository, fee: i64 }
impl Service { pub fn new(repository: Repository, fee: i64) -> Self { Self { repository, fee } } }
impl Pricing for Service { fn quote(&self, key: &str, currency: &str) -> i64 { let order: Order = self.repository.load(key, currency); order.cents + self.fee } }
#[cfg(test)] mod service_test;

pub fn normalize_currency(currency: &str) -> &str { if currency.is_empty() { "TRY" } else { currency } }
