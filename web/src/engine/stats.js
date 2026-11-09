// Korelasi peringkat Spearman untuk membandingkan dua urutan id.
export function spearman(orderA, orderB) {
  const ids = orderA.filter((id) => orderB.includes(id));
  const n = ids.length;
  if (n < 2) return null;
  const rankB = new Map(orderB.filter((id) => ids.includes(id)).map((id, i) => [id, i]));
  const d2 = ids.reduce((s, id, i) => s + (i - rankB.get(id)) ** 2, 0);
  return 1 - (6 * d2) / (n * (n * n - 1));
}
