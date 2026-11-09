import { useMemo, useState } from 'react';
import { EFFECTS, RULES, RULE_TYPES } from '../data/knowledgeBase.js';
import { BUSINESS_TYPES } from '../data/business.js';
import { REGIONS } from '../data/regions.js';

export default function Knowledge() {
  const [region, setRegion] = useState('all');
  const [type, setType] = useState('all');
  const [q, setQ] = useState('');

  const rows = useMemo(
    () =>
      RULES.filter(
        (r) =>
          (region === 'all' || r.region === region) &&
          (type === 'all' || r.type === type) &&
          (!q || `${r.title} ${r.text} ${r.id}`.toLowerCase().includes(q.toLowerCase()))
      ),
    [region, type, q]
  );

  const summary = Object.keys(RULE_TYPES).map((t) => ({
    t,
    n: RULES.filter((r) => r.type === t).length,
    hard: RULES.filter((r) => r.type === t && r.effect === 'kendala').length,
  }));

  return (
    <div className="page">
      <header className="page-head">
        <h1>Basis Kearifan Lokal</h1>
        <p className="lead">
          Setiap aturan adalah rekaman terstruktur — teks, wilayah berlaku, tipe, efek, bobot, sumber, dan validator — sehingga
          pengetahuan budaya bisa diaudit, bukan tersembunyi. Aturan hanya diterapkan di wilayah tag-nya.
        </p>
        <div className="notice">
          Semua aturan di versi ini berstatus <b>contoh</b>: bobot dan radius belum divalidasi pakar. Validasi dilakukan lewat
          proses Delphi 2–3 putaran; aturan tanpa kesepakatan pakar dihapus atau ditandai.
        </div>
      </header>

      <div className="kb-summary">
        {summary.map((s) => (
          <div key={s.t} className="stat">
            <b>{s.n}</b>
            <span>
              aturan {RULE_TYPES[s.t].label.toLowerCase()}
              {s.hard > 0 && ` · ${s.hard} kendala keras`}
            </span>
            <small className="muted">{RULE_TYPES[s.t].desc}</small>
          </div>
        ))}
      </div>

      <div className="filters">
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="all">Semua wilayah</option>
          {Object.values(REGIONS).map((r) => (
            <option key={r.key} value={r.key}>
              {r.label}
            </option>
          ))}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="all">Semua tipe</option>
          {Object.entries(RULE_TYPES).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
        <input type="search" placeholder="Cari aturan…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="rules-grid">
        {rows.map((r) => (
          <article key={r.id} className={`rulecard ${EFFECTS[r.effect].tone}`}>
            <div className="rule-top">
              <span className={`tag ${EFFECTS[r.effect].tone}`}>{EFFECTS[r.effect].label}</span>
              <span className="tag plain">{RULE_TYPES[r.type].label}</span>
              <span className="muted small">{r.id}</span>
            </div>
            <h3>{r.title}</h3>
            <p>{r.text}</p>
            <dl>
              <dt>Wilayah</dt>
              <dd>{REGIONS[r.region].label}</dd>
              <dt>Bobot v</dt>
              <dd>{r.effect === 'kendala' ? 'filter c(l) ∈ {0,1}' : r.weight.toFixed(2)}</dd>
              <dt>Berlaku untuk</dt>
              <dd>{r.appliesTo.map((k) => BUSINESS_TYPES.find((b) => b.key === k).icon).join(' ')}</dd>
              <dt>Sumber</dt>
              <dd>{r.source}</dd>
              <dt>Validasi</dt>
              <dd>
                <span className="tag warn">{r.validation.label}</span>
              </dd>
            </dl>
          </article>
        ))}
        {rows.length === 0 && <p className="muted">Tidak ada aturan yang cocok.</p>}
      </div>
    </div>
  );
}
