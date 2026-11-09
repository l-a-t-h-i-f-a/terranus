// Model rekomendasi TerraNus (Bagian 3.3 paper):
//   (1) S_geo(l,u) = Σ_k w_k(u) · x_k(l)            x_k dinormalisasi min–max ke [0,1]
//   (2) S_lw(l)    = Σ_j v_j · r_j(l),  c(l) ∈ {0,1}
//   (3) Score(l,u) = c(l) · [ (1 − λ) · S_geo + λ · S_lw ]
// Agar S_lw sebanding dengan S_geo, nilai Σ v·r digeser ke titik netral 0,5 lalu dipotong ke [0,1].

import { BUSINESS_TYPES, CRITERIA, RISK_PREFS, TARGET_MARKETS } from '../data/business.js';
import { RULES } from '../data/knowledgeBase.js';
import { ahpWeights } from './ahp.js';
import { spearman } from './stats.js';

export function profileWeights(profile) {
  const bt = BUSINESS_TYPES.find((b) => b.key === profile.businessType);
  const risk = RISK_PREFS.find((r) => r.key === profile.risk);
  const adjusted = bt.base.map((p, i) => p * risk.mult[i]);
  const sum = adjusted.reduce((a, b) => a + b, 0);
  return ahpWeights(adjusted.map((x) => x / sum));
}

function complementRaw(loc, profile) {
  const bt = BUSINESS_TYPES.find((b) => b.key === profile.businessType);
  const tm = TARGET_MARKETS.find((m) => m.key === profile.target);
  return Object.entries(bt.complement).reduce((s, [tag, w]) => s + w * (tm.boost[tag] ?? 1) * (loc.poi[tag] ?? 0), 0);
}

function rawCriteria(loc, profile) {
  return {
    pop: loc.pop,
    access: loc.access,
    comp: loc.comp[profile.businessType] ?? 0,
    compl: complementRaw(loc, profile),
    rent: loc.rent,
  };
}

function normalizeAll(rows) {
  const out = rows.map(() => ({}));
  for (const c of CRITERIA) {
    const vals = rows.map((r) => r[c.key]);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    rows.forEach((r, i) => {
      let x = max === min ? 0.5 : (r[c.key] - min) / (max - min);
      if (c.kind === 'cost') x = 1 - x;
      out[i][c.key] = x;
    });
  }
  return out;
}

export function applicableRules(regionKey, businessType) {
  return RULES.filter((r) => r.region === regionKey && r.appliesTo.includes(businessType));
}

function evaluateWisdom(loc, regionKey, profile, ctx) {
  const fired = [];
  let c = 1;
  let sum = 0;
  for (const rule of applicableRules(regionKey, profile.businessType)) {
    const res = rule.evaluate(loc, ctx);
    if (!res) continue;
    if (res.constraint) c = 0;
    const contribution = rule.weight * res.r;
    sum += contribution;
    fired.push({ rule, r: res.r, contribution, note: res.note });
  }
  const sLw = Math.min(1, Math.max(0, 0.5 + sum));
  return { c, sLw, sumVR: sum, fired };
}

function scoreSet(region, profile, ctx, { weights, lambda, useWisdom }) {
  const raws = region.candidates.map((l) => rawCriteria(l, profile));
  const norms = normalizeAll(raws);
  return region.candidates.map((loc, i) => {
    const contrib = CRITERIA.map((c, k) => ({
      ...c,
      raw: raws[i][c.key],
      x: norms[i][c.key],
      w: weights[k],
      value: weights[k] * norms[i][c.key],
    }));
    const sGeo = contrib.reduce((s, c) => s + c.value, 0);
    const lw = useWisdom ? evaluateWisdom(loc, region.key, profile, ctx) : { c: 1, sLw: 0.5, sumVR: 0, fired: [] };
    const lam = useWisdom ? lambda : 0;
    const score = lw.c * ((1 - lam) * sGeo + lam * lw.sLw);
    const budgetShare = profile.capital > 0 ? loc.rent / profile.capital : Infinity;
    return { loc, contrib, sGeo, ...lw, score, budgetShare, overBudget: budgetShare > 0.5 };
  });
}

const order = (rows) =>
  [...rows].sort((a, b) => b.c - a.c || b.score - a.score).map((r) => r.loc.id);

// Menjalankan tiga varian seperti pada desain evaluasi (Bagian 3.5):
//   A — baseline geospasial saja, bobot sama rata, tanpa kearifan lokal
//   C — ablation: bobot AHP terpersonalisasi, lapisan kearifan lokal dihapus
//   B — model TerraNus penuh
export function recommend(region, profile, ctx, lambda) {
  const ahp = profileWeights(profile);
  const equal = CRITERIA.map(() => 1 / CRITERIA.length);

  const full = scoreSet(region, profile, ctx, { weights: ahp.weights, lambda, useWisdom: true });
  const ablation = scoreSet(region, profile, ctx, { weights: ahp.weights, lambda, useWisdom: false });
  const baseline = scoreSet(region, profile, ctx, { weights: equal, lambda, useWisdom: false });

  const orderB = order(full);
  const orderC = order(ablation);
  const orderA = order(baseline);

  const ranked = orderB.map((id, i) => {
    const row = full.find((r) => r.loc.id === id);
    return {
      ...row,
      rank: i + 1,
      rankAblation: orderC.indexOf(id) + 1,
      rankBaseline: orderA.indexOf(id) + 1,
    };
  });

  const feasible = orderB.filter((id) => full.find((r) => r.loc.id === id).c === 1);
  return {
    ahp,
    ranked,
    variants: {
      A: { order: orderA, rho: spearman(feasible, orderA) },
      C: { order: orderC, rho: spearman(feasible, orderC) },
      B: { order: orderB, rho: 1 },
    },
  };
}

// Analisis sensitivitas λ: urutan teratas untuk beberapa nilai λ.
export function sensitivity(region, profile, ctx, steps = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6]) {
  const ahp = profileWeights(profile);
  return steps.map((lambda) => {
    const rows = scoreSet(region, profile, ctx, { weights: ahp.weights, lambda, useWisdom: true });
    return { lambda, order: order(rows) };
  });
}
