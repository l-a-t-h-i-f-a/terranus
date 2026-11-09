import { useEffect, useMemo, useState } from 'react';
import MapView, { MAP_LAYERS } from '../components/MapView.jsx';
import ProfileForm from '../components/ProfileForm.jsx';
import ExplanationPanel from '../components/ExplanationPanel.jsx';
import AIRecommendation from '../components/AIRecommendation.jsx';
import VariantsPanel from '../components/VariantsPanel.jsx';
import { REGIONS } from '../data/regions.js';
import { BUSINESS_TYPES } from '../data/business.js';
import { recommend } from '../engine/scoring.js';
import { pasaranOf } from '../engine/pasaran.js';
import { addLog } from '../engine/log.js';

const DEFAULT = {
  businessType: 'kuliner',
  capital: 100,
  target: 'umum',
  risk: 'sedang',
  region: 'yogyakarta',
  pasaranDay: pasaranOf(),
  lambda: 0.3,
};

export default function Planner() {
  const [profile, setProfile] = useState(DEFAULT);
  const [selectedId, setSelectedId] = useState(null);
  const [tab, setTab] = useState('ai');
  const [layers, setLayers] = useState({ markets: true, heritage: true, sacred: true, subak: true });

  const region = REGIONS[profile.region];
  const result = useMemo(
    () => recommend(region, profile, { pasaranDay: profile.pasaranDay }, profile.lambda),
    [region, profile]
  );
  const { ranked } = result;
  const selected = ranked.find((r) => r.loc.id === selectedId) ?? ranked[0];

  useEffect(() => setSelectedId(null), [profile.region]);

  const select = (id) => {
    setSelectedId(id);
    const r = ranked.find((x) => x.loc.id === id);
    addLog({ event: 'view', businessType: profile.businessType, region: profile.region, locationId: id, rank: r?.rank });
  };

  const bt = BUSINESS_TYPES.find((b) => b.key === profile.businessType);

  return (
    <div className="planner">
      <aside className="panel form-panel">
        <ProfileForm profile={profile} onChange={setProfile} ahp={result.ahp} />
      </aside>

      <section className="map-wrap">
        <MapView
          region={region}
          ranked={ranked}
          selectedId={selected?.loc.id}
          onSelect={select}
          pasaranDay={profile.pasaranDay}
          layers={layers}
        />
        <div className="map-head">
          <div className="feature-head">
            <span className="fnum">2</span>
            <div>
              <h2 className="ftitle">Peta Interaktif Berbasis Kearifan Lokal</h2>
              <p className="muted small">Klik penanda untuk melihat aturan budaya yang berlaku</p>
            </div>
          </div>
          <div className="layer-toggles">
            {MAP_LAYERS.filter((l) => l.key === 'markets' || region.zones.some((z) => z.kind === l.key)).map((l) => (
              <label key={l.key} className={`ltoggle ${layers[l.key] ? 'on' : ''}`}>
                <input
                  type="checkbox"
                  checked={layers[l.key]}
                  onChange={(e) => setLayers({ ...layers, [l.key]: e.target.checked })}
                />
                {l.label}
              </label>
            ))}
          </div>
        </div>
        <div className="legend">
          <span><i className="dot top" /> 3 teratas</span>
          <span><i className="dot" /> kandidat</span>
          <span><i className="dot excluded" /> dikeluarkan</span>
          <span><i className="dot market" /> pasar</span>
        </div>
      </section>

      <aside className="panel list-panel">
        <div className="panel-head feature-head">
          <span className="fnum">3</span>
          <div>
            <h2 className="ftitle">Ranking Lokasi</h2>
            <p className="muted small">
              {bt.icon} {bt.label} · {region.label}
            </p>
          </div>
        </div>
        <ol className="ranklist">
          {ranked.map((r) => {
            const delta = r.rankAblation - r.rank;
            return (
              <li key={r.loc.id}>
                <button
                  className={`rankitem ${r.loc.id === selected?.loc.id ? 'selected' : ''} ${r.c === 0 ? 'excluded' : ''}`}
                  onClick={() => select(r.loc.id)}
                >
                  <span className={`rankno ${r.rank <= 3 && r.c ? 'top' : ''}`}>{r.c === 0 ? '×' : r.rank}</span>
                  <span className="rankbody">
                    <strong>{r.loc.name}</strong>
                    <small>
                      {r.loc.area}
                      {r.overBudget && r.c === 1 && <em className="tag warn">di atas anggaran</em>}
                    </small>
                    <span className="bar">
                      <span className="bar-geo" style={{ width: `${(1 - profile.lambda) * r.sGeo * 100}%` }} />
                      <span className="bar-lw" style={{ width: `${profile.lambda * r.sLw * 100}%` }} />
                    </span>
                  </span>
                  <span className="rankscore">
                    {r.c === 0 ? '—' : Math.round(r.score * 100)}
                    {r.c === 1 && delta !== 0 && (
                      <small className={delta > 0 ? 'up' : 'down'} title="Perubahan peringkat karena lapisan kearifan lokal">
                        {delta > 0 ? `▲${delta}` : `▼${-delta}`}
                      </small>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <p className="muted small">
          Batang hijau = bagian geospasial (1−λ)·S<sub>geo</sub>, batang oranye = bagian kearifan lokal λ·S<sub>lw</sub>. ▲▼ =
          perubahan peringkat dibanding tanpa lapisan kearifan lokal.
        </p>
      </aside>

      <section className="panel detail-panel">
        <div className="feature-head">
          <span className="fnum">4</span>
          <div>
            <h2 className="ftitle">Rekomendasi AI</h2>
            <p className="muted small">Saran, alasan, dan catatan budaya untuk keputusan Anda</p>
          </div>
        </div>
        <div className="tabs">
          <button className={tab === 'ai' ? 'active' : ''} onClick={() => setTab('ai')}>
            Ringkasan rekomendasi
          </button>
          <button className={tab === 'explain' ? 'active' : ''} onClick={() => setTab('explain')}>
            Detail lokasi terpilih
          </button>
          <button className={tab === 'variants' ? 'active' : ''} onClick={() => setTab('variants')}>
            Varian &amp; sensitivitas λ
          </button>
        </div>
        {tab === 'ai' && (
          <AIRecommendation
            ranked={ranked}
            profile={profile}
            region={region}
            onSelect={(id) => {
              select(id);
              setTab('explain');
            }}
          />
        )}
        {tab === 'explain' && selected && (
          <ExplanationPanel item={selected} ranked={ranked} profile={profile} region={region} />
        )}
        {tab === 'variants' && <VariantsPanel result={result} region={region} profile={profile} />}
      </section>
    </div>
  );
}
