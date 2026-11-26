int outer(int value) {
    int inner(int value) { return value - 1; }
    return inner(-value);
}
