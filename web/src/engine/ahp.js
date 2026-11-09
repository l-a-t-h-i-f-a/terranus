// Analytic Hierarchy Process (Saaty, 1980): matriks perbandingan berpasangan,
// vektor prioritas (eigenvector utama) dan rasio konsistensi (CR).

const RI = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];

// Bulatkan rasio ke skala Saaty 1..9 (atau kebalikannya).
export function toSaaty(ratio) {
  if (ratio >= 1) return Math.min(9, Math.max(1, Math.round(ratio)));
  return 1 / Math.min(9, Math.max(1, Math.round(1 / ratio)));
}

export function buildPairwise(priorities) {
  return priorities.map((pi) => priorities.map((pj) => toSaaty(pi / pj)));
}

export function priorityVector(M, iters = 100) {
  const n = M.length;
  let v = Array(n).fill(1 / n);
  for (let k = 0; k < iters; k++) {
    const next = M.map((row) => row.reduce((s, a, j) => s + a * v[j], 0));
    const sum = next.reduce((a, b) => a + b, 0);
    v = next.map((x) => x / sum);
  }
  return v;
}

export function consistency(M, w) {
  const n = M.length;
  const Aw = M.map((row) => row.reduce((s, a, j) => s + a * w[j], 0));
  const lambdaMax = Aw.reduce((s, x, i) => s + x / w[i], 0) / n;
  const CI = (lambdaMax - n) / (n - 1);
  const CR = RI[n] ? CI / RI[n] : 0;
  return { lambdaMax, CI, CR };
}

export function ahpWeights(priorities) {
  const M = buildPairwise(priorities);
  const w = priorityVector(M);
  return { matrix: M, weights: w, ...consistency(M, w) };
}
