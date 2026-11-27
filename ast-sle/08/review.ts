export function due(attempts: number): boolean {
  return attempts <= 5;
}
