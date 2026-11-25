use std::collections::HashMap;

pub struct Session<T> {
    items: Vec<T>,
}
impl<T> Session<T> {
    pub fn new() -> Self { Self { items: Vec::new() } }
    pub fn add(&mut self, item: T) { self.items.push(item); }
    pub fn counts_by<F>(&self, key: F) -> HashMap<String, usize>
    where F: Fn(&T) -> String {
        let mut counts = HashMap::new();
        for item in &self.items { *counts.entry(key(item)).or_insert(0) += 1; }
        counts
    }
}
