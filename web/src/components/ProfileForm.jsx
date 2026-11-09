import { useState } from 'react';
import { BUSINESS_TYPES, CRITERIA, RISK_PREFS, TARGET_MARKETS } from '../data/business.js';
import { REGION_LIST } from '../data/regions.js';
import { PANCAWARA, PASARAN, pasaranOf, wetonOf } from '../engine/pasaran.js';

export default function ProfileForm({ profile, onChange, ahp }) {
  const [showMatrix, setShowMatrix] = useState(false);
  const set = (k) => (e) => {
    const v = e?.target ? e.target.value : e;
    onChange({ ...profile, [k]: k === 'capital' || k === 'lambda' ? Number(v) : v });
  };
  const today = pasaranOf();
  const isBali = profile.region === 'bali';

  return (
    <div className="form">
      <div className="feature-head"><span className="fnum">1</span><div><h2 className="ftitle">Profil Usaha</h2><p className="muted small">Ceritakan usaha Anda</p></div></div>
      <h2>Usaha</h2>

      <label className="field">
        <span>Jenis usaha</span>
        <div className="chips">
          {BUSINESS_TYPES.map((b) => (
            <button
              key={b.key}
              type="button"
              className={`chip ${profile.businessType === b.key ? 'on' : ''}`}
              onClick={() => set('businessType')(b.key)}
            >
              <span aria-hidden>{b.icon}</span> {b.label}
            </button>
          ))}
        </div>
      </label>

      <label className="field">
        <span>
          Modal awal <b>Rp{profile.capital.toLocaleString('id-ID')} juta</b>
        </span>
        <input type="range" min="10" max="500" step="10" value={profile.capital} onChange={set('capital')} />
      </label>

      <label className="field">
        <span>Pasar sasaran</span>
        <select value={profile.target} onChange={set('target')}>
          {TARGET_MARKETS.map((m) => (
            <option key={m.key} value={m.key}>
              {m.label}
            </option>
          ))}
        </select>
      </label>

      <div className="field">
        <span>Preferensi risiko</span>
        <div className="seg">
          {RISK_PREFS.map((r) => (
            <button key={r.key} type="button" className={profile.risk === r.key ? 'on' : ''} onClick={() => set('risk')(r.key)} title={r.hint}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <h2>Area</h2>
      <div className="seg">
        {REGION_LIST.map((r) => (
          <button key={r.key} type="button" className={profile.region === r.key ? 'on' : ''} onClick={() => set('region')(r.key)}>
            {r.label.split(' (')[0]}
          </button>
        ))}
      </div>

      <label className="field">
        <span>
          Hari pasaran {isBali && <em className="muted">(Pancawara)</em>}
          <small className="muted"> · hari ini {wetonOf()}</small>
        </span>
        <div className="seg five">
          {PASARAN.map((p) => (
            <button key={p} type="button" className={profile.pasaranDay === p ? 'on' : ''} onClick={() => set('pasaranDay')(p)}>
              {isBali ? PANCAWARA[p] : p}
              {p === today && <i className="today" title="hari ini" />}
            </button>
          ))}
        </div>
      </label>

      <h2>Pengaturan model</h2>
      <label className="field">
        <span>
          Pengaruh kearifan lokal λ = <b>{profile.lambda.toFixed(2)}</b>
        </span>
        <input type="range" min="0" max="0.6" step="0.05" value={profile.lambda} onChange={set('lambda')} />
        <small className="muted">λ = 0 berarti hanya geospasial. Nilai final ditetapkan lewat analisis sensitivitas.</small>
      </label>

      <div className="weights">
        <div className="weights-head">
          <span>Bobot AHP w<sub>k</sub>(u)</span>
          <span className={`tag ${ahp.CR < 0.1 ? 'good' : 'bad'}`}>CR {ahp.CR.toFixed(3)}</span>
        </div>
        {CRITERIA.map((c, i) => (
          <div key={c.key} className="wrow">
            <span>{c.label}</span>
            <span className="wbar">
              <span style={{ width: `${ahp.weights[i] * 100 * 2}%` }} />
            </span>
            <b>{(ahp.weights[i] * 100).toFixed(0)}%</b>
          </div>
        ))}
        <button type="button" className="linkbtn" onClick={() => setShowMatrix((s) => !s)}>
          {showMatrix ? 'Sembunyikan' : 'Lihat'} matriks perbandingan berpasangan
        </button>
        {showMatrix && (
          <table className="matrix">
            <thead>
              <tr>
                <th />
                {CRITERIA.map((c) => (
                  <th key={c.key}>{c.key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ahp.matrix.map((row, i) => (
                <tr key={i}>
                  <th>{CRITERIA[i].key}</th>
                  {row.map((a, j) => (
                    <td key={j}>{a >= 1 ? a : `1/${Math.round(1 / a)}`}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
