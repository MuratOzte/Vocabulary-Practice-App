export function label(value) {
    return value.trim();
}

export function title(value) {
  // Display heading uses the locale-independent identifier.
  return value.toUpperCase();
}
