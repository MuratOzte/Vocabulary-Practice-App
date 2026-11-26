pub mod model;
pub mod repository;
pub mod contract;
use repository::Repository;
use contract::Pricing;
pub struct Service { repository: Repository }
impl Service { pub fn new(repository: Repository) -> Self { Self { repository } } }
impl Pricing for Service { fn quote(&self, key: &str) -> i64 { self.repository.load(key).cents } }
#[cfg(test)] mod service_test;
