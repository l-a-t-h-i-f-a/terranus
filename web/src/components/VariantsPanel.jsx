import { useMemo } from 'react';
import { sensitivity } from '../engine/scoring.js';

const name = (region, id) => region.candidates.find((c) => c.id === id)?.name ?? id;

export default function VariantsPanel({ result, region, profile }) {
  const { ranked, variants } = result;
  const sens = useMemo(() => sensitivity(region, profile, { pasaranDay: profile.pasaranDay }), [region, profile]);
  const fmt = (x) => (x == null ? '—' : x.toFixed(2));

  return (
    <div className="variants">
      <p className="muted">
        Tiga varian dari desain evaluasi (Bagian 3.5). Pada paper, ketiganya dibandingkan dengan peringkat rujukan pakar; di sini ρ
        hanya menunjukkan seberapa jauh urutan tiap varian <strong>berbeda dari model penuh</strong> — ini bukan ukuran akurasi.
      </p>
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Lokasi</th>
              <th>A · Geospasial saja (bobot rata)</th>
              <th>C · Tanpa kearifan lokal (AHP)</th>
              <th>B · TerraNus penuh</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((r) => (
              <tr key={r.loc.id} className={r.c === 0 ? 'excluded' : ''}>
                <td>{r.loc.name}</td>
                <td>#{r.rankBaseline}</td>
                <td>#{r.rankAblation}</td>
                <td>
                  <b>{r.c === 0 ? 'dikeluarkan' : `#${r.rank}`}</b>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Spearman ρ terhadap B</td>
              <td>{fmt(variants.A.rho)}</td>
              <td>{fmt(variants.C.rho)}</td>
              <td>1.00</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <h4>Sensitivitas λ — tiga teratas</h4>
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>λ</th>
              <th>#1</th>
              <th>#2</th>
              <th>#3</th>
            </tr>
          </thead>
          <tbody>
            {sens.map((s) => (
              <tr key={s.lambda} className={Math.abs(s.lambda - profile.lambda) < 1e-9 ? 'current' : ''}>
                <td>{s.lambda.toFixed(1)}</td>
                {s.order.slice(0, 3).map((id) => (
                  <td key={id}>{name(region, id)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
