import { explain } from '../engine/explain.js';
import { nextDates } from '../engine/pasaran.js';
import { BUSINESS_TYPES } from '../data/business.js';

const fmtDate = (d) => d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' });

// Ringkasan rekomendasi: menyusun saran dari hasil peringkat & aturan yang aktif.
// Semua kalimat diturunkan dari data skor — tidak ada fakta tambahan di luar model.
export default function AIRecommendation({ ranked, profile, region, onSelect }) {
  const feasible = ranked.filter((r) => r.c === 1);
  const affordable = feasible.filter((r) => !r.overBudget);
  const best = affordable[0] ?? feasible[0];
  if (!best) return <p className="muted">Tidak ada lokasi yang memenuhi kendala.</p>;

  const bt = BUSINESS_TYPES.find((b) => b.key === profile.businessType);
  const ex = explain(best, ranked, profile.lambda);
  const alts = affordable.filter((r) => r.loc.id !== best.loc.id).slice(0, 2);
  const skippedTop = feasible[0] && feasible[0].loc.id !== best.loc.id ? feasible[0] : null;
  const avoid = ranked.filter((r) => r.c === 0 || r.fired.some((f) => f.rule.effect === 'penalti' && f.contribution <= -0.15));

  const m = best.loc.market;
  const steps = [];
  if (m?.pasaran && m.distM <= 400) {
    steps.push(`Survei dan buka perdana pada hari ${m.pasaran} (${nextDates(m.pasaran, 2).map(fmtDate).join(' atau ')}) saat ${m.name} paling ramai.`);
  } else {
    steps.push(`Survei ${best.loc.name} pada jam ramai (pagi dan malam) untuk memastikan arus pengunjung.`);
  }
  best.fired.forEach((f) => {
    if (f.rule.id === 'YK-S1') steps.push('Urus izin fasad & papan nama kawasan cagar budaya sebelum renovasi.');
    if (f.rule.id === 'BL-S1') steps.push('Minta persetujuan desa adat (klian/bendesa) karena lokasi dekat pura.');
    if (f.rule.id === 'BL-So1') steps.push('Perkenalkan usaha lewat kegiatan balai banjar setempat.');
    if (f.rule.id === 'YK-So1') steps.push('Pertimbangkan jam buka sampai malam mengikuti ramainya ruang kumpul warga.');
    if (f.rule.id === 'BL-N1') steps.push('Masukkan hari Nyepi (tutup 24 jam) ke rencana stok dan arus kas.');
  });
  steps.push(`Pastikan sewa ±Rp${best.loc.rent} jt/thn (${Math.round(best.budgetShare * 100)}% modal) menyisakan modal kerja yang cukup.`);

  return (
    <div className="ai-reco">
      <div className="ai-hero">
        <span className="ai-badge">✦ Rekomendasi AI</span>
        <h3>
          Untuk {bt.label.toLowerCase()} Anda, pilih <button className="linkish" onClick={() => onSelect(best.loc.id)}>{best.loc.name}</button>
        </h3>
        <p>
          {ex.summary} Skor {Math.round(best.score * 100)}/100.
          {skippedTop && ` ${skippedTop.loc.name} sebenarnya skornya lebih tinggi, tetapi sewanya melebihi separuh modal Anda.`}
        </p>
      </div>

      <div className="ai-grid">
        <div className="ai-card">
          <h4>Alternatif</h4>
          {alts.length === 0 && <p className="muted small">Tidak ada alternatif dalam anggaran.</p>}
          {alts.map((a) => (
            <button key={a.loc.id} className="ai-item" onClick={() => onSelect(a.loc.id)}>
              <b>#{a.rank}</b> {a.loc.name}
              <small>{explain(a, ranked, profile.lambda).summary}</small>
            </button>
          ))}
        </div>
        <div className="ai-card">
          <h4>Sebaiknya dihindari</h4>
          {avoid.length === 0 && <p className="muted small">Tidak ada lokasi dengan kendala budaya berat.</p>}
          {avoid.map((a) => {
            const why = a.fired.find((f) => f.rule.effect === 'kendala') ?? a.fired.find((f) => f.rule.effect === 'penalti');
            return (
              <button key={a.loc.id} className="ai-item warn" onClick={() => onSelect(a.loc.id)}>
                <b>{a.c === 0 ? '×' : `#${a.rank}`}</b> {a.loc.name}
                <small>{why?.rule.title}</small>
              </button>
            );
          })}
        </div>
        <div className="ai-card wide">
          <h4>Langkah berikutnya</h4>
          <ol>
            {steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      </div>
      <p className="muted small">
        Disusun otomatis dari skor dan aturan kearifan lokal yang aktif di {region.label} (mode templat; siap disambungkan ke LLM berbasis
        retrieval).
      </p>
    </div>
  );
}
