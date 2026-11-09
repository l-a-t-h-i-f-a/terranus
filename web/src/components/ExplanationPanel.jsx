import { useState, useEffect } from 'react';
import { explain } from '../engine/explain.js';
import { addLog } from '../engine/log.js';
import { EFFECTS, RULE_TYPES } from '../data/knowledgeBase.js';
import { nextDates } from '../engine/pasaran.js';

const pct = (x) => Math.round(x * 100);

export default function ExplanationPanel({ item, ranked, profile, region }) {
  const [fb, setFb] = useState(null);
  useEffect(() => setFb(null), [item.loc.id]);
  const ex = explain(item, ranked, profile.lambda);

  const sendFeedback = (value) => {
    setFb(value);
    addLog({ event: 'feedback', businessType: profile.businessType, region: profile.region, locationId: item.loc.id, rank: item.rank, feedback: value });
  };

  const market = item.loc.market;

  return (
    <div className="explain">
      <div className="explain-head">
        <div>
          <h3>{ex.headline}</h3>
          <p className="lead">{ex.summary}</p>
          {ex.contrast && <p className="contrast">↔ {ex.contrast}</p>}
        </div>
        {item.c === 1 && (
          <div className="scorebox">
            <div className="ring" style={{ '--p': pct(item.score) }}>
              <span>{pct(item.score)}</span>
            </div>
            <small>
              = {item.c} · [(1−{profile.lambda.toFixed(2)})·{item.sGeo.toFixed(2)} + {profile.lambda.toFixed(2)}·{item.sLw.toFixed(2)}]
            </small>
          </div>
        )}
      </div>

      <div className="explain-grid">
        <div className="card">
          <h4>
            <span className="swatch geo" /> Alasan geospasial
          </h4>
          {item.contrib.map((c) => (
            <div key={c.key} className="crit">
              <div className="crit-top">
                <span>{c.label}</span>
                <span className="muted">
                  {typeof c.raw === 'number' ? c.raw.toLocaleString('id-ID', { maximumFractionDigits: 1 }) : c.raw} {c.unit}
                </span>
              </div>
              <div className="crit-bar" title={`x=${c.x.toFixed(2)} · w=${c.w.toFixed(2)}`}>
                <span style={{ width: `${c.x * 100}%` }} />
              </div>
              <small className="muted">
                x = {c.x.toFixed(2)} {c.kind === 'cost' ? '(biaya, dibalik)' : ''} · w = {c.w.toFixed(2)} → {(c.value * 100).toFixed(1)} poin
              </small>
            </div>
          ))}
          <p className="sum">
            S<sub>geo</sub> = {item.sGeo.toFixed(3)}
          </p>
        </div>

        <div className="card wisdom">
          <h4>
            <span className="swatch lw" /> Catatan kearifan lokal <small className="muted">({region.culture})</small>
          </h4>
          {item.fired.length === 0 && <p className="muted">Tidak ada aturan kearifan lokal yang aktif untuk lokasi dan jenis usaha ini.</p>}
          {item.fired.map((f) => (
            <div key={f.rule.id} className={`rule ${EFFECTS[f.rule.effect].tone}`}>
              <div className="rule-top">
                <span className={`tag ${EFFECTS[f.rule.effect].tone}`}>{EFFECTS[f.rule.effect].label}</span>
                <span className="muted small">
                  {f.rule.id} · {RULE_TYPES[f.rule.type].label}
                </span>
                {f.rule.weight !== 0 && (
                  <b className="rule-val">
                    {f.contribution > 0 ? '+' : ''}
                    {f.contribution.toFixed(2)}
                  </b>
                )}
              </div>
              <strong>{f.rule.title}</strong>
              <p>{f.note}</p>
            </div>
          ))}
          {market?.pasaran && (
            <p className="muted small">
              {market.pasaran} berikutnya:{' '}
              {nextDates(market.pasaran, 3)
                .map((d) => d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }))
                .join(', ')}
            </p>
          )}
          <p className="sum">
            Σ v·r = {item.sumVR.toFixed(2)} → S<sub>lw</sub> = {item.sLw.toFixed(2)} · c(l) = {item.c}
          </p>
        </div>
      </div>

      {ex.risks.length > 0 && (
        <div className="card risks">
          <h4>Risiko yang perlu diperhatikan</h4>
          <ul>
            {ex.risks.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="explain-foot">
        <span className="muted small">
          Penjelasan dibuat dari templat (jalur fallback) hanya dengan kriteria &amp; aturan yang aktif — tidak ada klaim di luar data. Aturan berstatus{' '}
          <em>contoh</em>, belum divalidasi pakar.
        </span>
        <span className="feedback">
          Rekomendasi ini membantu?
          <button className={fb === 'up' ? 'on' : ''} onClick={() => sendFeedback('up')} aria-label="Membantu">
            👍
          </button>
          <button className={fb === 'down' ? 'on' : ''} onClick={() => sendFeedback('down')} aria-label="Tidak membantu">
            👎
          </button>
        </span>
      </div>
    </div>
  );
}
