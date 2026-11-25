#[derive(Clone, Debug)]
pub struct Word {
    pub text: String,
    pub meanings: Vec<String>,
}
impl Word {
    pub fn matches(&self, answer: &str) -> bool {
        self.meanings.iter().any(|value| value.trim().eq_ignore_ascii_case(answer.trim()))
    }
}
