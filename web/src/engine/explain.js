// Modul penjelasan. Paper memakai LLM berbasis retrieval atas basis kearifan lokal,
// dengan templat sebagai fallback. Versi web ini menjalankan jalur templat:
// ia HANYA memakai kriteria dan aturan yang benar-benar aktif untuk lokasi tersebut,
// sehingga tidak ada klaim yang tidak didukung data. Penjelasan bersifat kontrastif
// (dibanding lokasi pembanding) dan selektif (2–3 alasan teratas) mengikuti Miller (2019).

const pct = (x) => `${Math.round(x * 100)}`;

function describeCriterion(c) {
  const good = c.x >= 0.66;
  const bad = c.x <= 0.33;
  switch (c.key) {
    case 'pop':
      return good ? `penduduk padat (${c.raw.toLocaleString('id-ID')} jiwa/km²)` : bad ? 'kepadatan penduduk rendah' : 'kepadatan penduduk sedang';
    case 'access':
      return good ? `akses jalan sangat baik (indeks ${c.raw})` : bad ? `akses jalan terbatas (indeks ${c.raw})` : 'akses jalan cukup';
    case 'comp':
      return good ? `pesaing sejenis sedikit (${c.raw} dalam 500 m)` : bad ? `pesaing sejenis banyak (${c.raw} dalam 500 m)` : `pesaing sejenis sedang (${c.raw})`;
    case 'compl':
      return good ? 'banyak titik pendukung pasar sasaran di sekitar' : bad ? 'sedikit titik pendukung pasar sasaran' : 'titik pendukung pasar sasaran cukup';
    case 'rent':
      return good ? `sewa relatif murah (±Rp${c.raw} jt/thn)` : bad ? `sewa mahal (±Rp${c.raw} jt/thn)` : `sewa menengah (±Rp${c.raw} jt/thn)`;
    default:
      return c.label;
  }
}

export function explain(item, ranked, lambda) {
  const byValue = [...item.contrib].sort((a, b) => b.value - a.value);
  const strengths = byValue.slice(0, 2);
  const weakest = [...item.contrib].sort((a, b) => a.x * a.w - b.x * b.w || a.x - b.x)[0];

  if (item.c === 0) {
    const why = item.fired.find((f) => f.rule.effect === 'kendala');
    return {
      headline: `${item.loc.name} dikeluarkan dari peringkat.`,
      summary: why?.note ?? 'Lokasi melanggar kendala keras kearifan lokal.',
      geo: [],
      risks: [],
      contrast: null,
    };
  }

  const others = ranked.filter((r) => r.loc.id !== item.loc.id && r.c === 1);
  const rival = item.rank === 1 ? others[0] : ranked.find((r) => r.rank === item.rank - 1);
  let contrast = null;
  if (rival) {
    const diffs = item.contrib
      .map((c, k) => ({ c, d: c.value - rival.contrib[k].value }))
      .sort((a, b) => (item.rank === 1 ? b.d - a.d : a.d - b.d));
    const top = diffs[0];
    const lwDiff = lambda * (item.sLw - rival.sLw);
    if (item.rank === 1) {
      contrast =
        lwDiff > Math.abs(top.d) * (1 - lambda)
          ? `Unggul atas ${rival.loc.name} terutama karena faktor kearifan lokal (S_lw ${pct(item.sLw)} vs ${pct(rival.sLw)}).`
          : `Unggul atas ${rival.loc.name} terutama pada ${top.c.label.toLowerCase()}.`;
    } else {
      contrast =
        -lwDiff > Math.abs(top.d) * (1 - lambda)
          ? `Tertinggal dari ${rival.loc.name} (#${rival.rank}) terutama karena faktor kearifan lokal.`
          : `Tertinggal dari ${rival.loc.name} (#${rival.rank}) terutama pada ${top.c.label.toLowerCase()}.`;
    }
  }

  const risks = [];
  if (weakest.x < 0.5) risks.push(`Titik lemah: ${describeCriterion(weakest)}.`);
  if (item.overBudget) risks.push(`Sewa ±Rp${item.loc.rent} jt/thn = ${Math.round(item.budgetShare * 100)}% modal Anda; pertimbangkan modal kerja yang tersisa.`);
  item.fired.filter((f) => f.rule.effect === 'penalti').forEach((f) => risks.push(f.note));

  const moved = item.rankAblation - item.rank;
  const movedText =
    moved > 0
      ? ` Lapisan kearifan lokal menaikkan lokasi ini ${moved} peringkat.`
      : moved < 0
      ? ` Lapisan kearifan lokal menurunkan lokasi ini ${-moved} peringkat.`
      : '';

  return {
    headline: `#${item.rank} ${item.loc.name} — skor ${pct(item.score)}/100`,
    summary: `Cocok karena ${strengths.map(describeCriterion).join(' dan ')}.${movedText}`,
    geo: strengths.map((c) => `${c.label}: ${describeCriterion(c)} (kontribusi ${pct(c.value)} poin geospasial).`),
    risks,
    contrast,
  };
}
