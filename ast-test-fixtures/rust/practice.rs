use std::collections::HashSet;

pub struct PracticeSession {
    seen: HashSet<String>,
    correct: usize,
}

impl PracticeSession {
    pub fn new() -> Self {
        Self { seen: HashSet::new(), correct: 0 }
    }

    pub fn record(&mut self, word: &str, is_correct: bool) {
        self.seen.insert(word.trim().to_lowercase());
        if is_correct { self.correct += 1; }
    }

    pub fn accuracy(&self) -> f64 {
        if self.seen.is_empty() { return 0.0; }
        self.correct as f64 / self.seen.len() as f64
    }
}
