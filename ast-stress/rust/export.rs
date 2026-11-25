use crate::word::Word;

#[deprecated(note = "Use structured export")]
pub fn csv(words: &[Word]) -> String {
    words.iter().map(|word| format!("\"{}\",{}", word.text.replace('"', "\"\""), word.meanings.len()))
        .collect::<Vec<_>>().join("\n")
}
pub fn label(word: &Word) -> &'static str {
    match word.meanings.len() {
        0 => "no meanings",
        1 => "single",
        _ => "İstanbul 📚",
    }
}
