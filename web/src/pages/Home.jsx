import { Link } from 'react-router-dom';
import { pasaranOf, wetonOf } from '../engine/pasaran.js';
import { recommend } from '../engine/scoring.js';
import { REGIONS } from '../data/regions.js';

function buildPreview() {
  const day = pasaranOf();
  const profile = { businessType: 'kuliner', capital: 100, target: 'umum', risk: 'sedang' };
  const { ranked } = recommend(REGIONS.yogyakarta, profile, { pasaranDay: day }, 0.3);
  return { day, top: ranked.slice(0, 4) };
}

const FEATURES = [
  ['🏪', 'Profil Usaha', 'Isi jenis usaha, modal, pasar sasaran, dan preferensi risiko. Bobot kriteria menyesuaikan otomatis lewat AHP.'],
  ['🗺️', 'Peta Interaktif Berbasis Kearifan Lokal', 'Lihat pasar dan hari pasarannya, kawasan cagar budaya, zona kesucian pura, dan lahan subak langsung di peta.'],
  ['🏆', 'Ranking Lokasi', 'Calon lokasi diurutkan dengan skor geospasial plus kearifan lokal, lengkap dengan perubahan peringkat akibat faktor budaya.'],
  ['✦', 'Rekomendasi AI', 'Saran lokasi terbaik, alternatif, lokasi yang perlu dihindari, dan langkah berikutnya, dengan alasan yang bisa diperiksa.'],
];

const STEPS = [
  ['Profil', 'Jenis usaha, modal, pasar sasaran, preferensi risiko.'],
  ['Area', 'Pilih kota / wilayah budaya.'],
  ['Skoring', 'Kriteria geospasial + aturan kearifan lokal.'],
  ['Peringkat', 'Lokasi teratas beserta skornya.'],
  ['Penjelasan', 'Alasan, catatan budaya, dan risiko.'],
  ['Log', 'Umpan balik anonim untuk evaluasi.'],
];

const COMPARE = [
  ['Perlu keahlian GIS', 'Ya', 'Sebagian', 'Tidak'],
  ['Personal sesuai profil usaha', 'Manual', 'Sebagian', 'Ya'],
  ['Kriteria kearifan lokal', 'Tidak', 'Tidak', 'Bawaan'],
  ['Penjelasan bahasa sehari-hari', 'Tidak', 'Bervariasi', 'Ya'],
  ['Gratis & ramah ponsel', 'Bervariasi', 'Tidak', 'Ya'],
];

export default function Home() {
  const preview = buildPreview();
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">Geospatial Business Intelligence · Kearifan Lokal · AI</p>
          <h1>
            Pilih lokasi usaha dengan data <em>dan</em> dengan pengetahuan warganya.
          </h1>
          <p className="lead">
            TerraNus memeringkat calon lokasi untuk profil usaha Anda dengan menggabungkan data geospasial terbuka, basis aturan
            kearifan lokal, dan penjelasan yang bisa diperiksa — gratis dan ringan di ponsel.
          </p>
          <div className="cta">
            <Link to="/app" className="btn primary">
              Cari lokasi sekarang
            </Link>
            <Link to="/riset" className="btn ghost">
              Baca risetnya
            </Link>
          </div>
          <p className="muted small">Hari ini: {wetonOf()} — pasaran memengaruhi keramaian pasar tradisional.</p>
        </div>
        <div className="hero-card">
          <p className="muted small cap">Contoh langsung · warung makan di Yogyakarta, hari {preview.day}</p>
          <div className="mini-rank">
            {preview.top.map((r) => (
              <div key={r.loc.id} className={`mini-row ${r.rank === 1 ? 'top' : ''}`}>
                <b>{r.rank}</b>
                <span>{r.loc.name}</span>
                <i>{Math.round(r.score * 100)}</i>
              </div>
            ))}
          </div>
          <p className="formula">
            Score = c(l) · [(1−λ)·S<sub>geo</sub> + λ·S<sub>lw</sub>]
          </p>
        </div>
      </section>

      <section className="section">
        <h2>Fitur TerraNus</h2>
        <div className="features4">
          {FEATURES.map(([icon, title, desc], i) => (
            <Link to="/app" key={title}>
              <div className="card">
                <div className="feature-head">
                  <span className="fnum">{i + 1}</span>
                  <span style={{ fontSize: '1.5rem' }} aria-hidden>
                    {icon}
                  </span>
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Masalahnya</h2>
        <div className="cards3">
          <div className="card">
            <h3>Keputusan yang sulit dibatalkan</h3>
            <p>Sewa, renovasi, dan stok dibayar sebelum pembeli pertama datang. Lokasi yang buruk bisa menutup usaha dalam hitungan bulan.</p>
          </div>
          <div className="card">
            <h3>Alat yang mahal dan generik</h3>
            <p>GIS dan analisis multikriteria (AHP, TOPSIS) butuh keahlian dan lisensi — banyak UMKM akhirnya memilih lokasi dengan intuisi.</p>
          </div>
          <div className="card">
            <h3>Buta budaya</h3>
            <p>Siklus pasaran, kawasan suci pura, dan ruang kumpul warga tidak terlihat di lapisan peta mana pun.</p>
          </div>
        </div>
      </section>

      <section className="section alt">
        <h2>Tiga bentuk kearifan lokal yang dikodekan</h2>
        <div className="cards3">
          <div className="card accent-t">
            <span className="tag info">Temporal</span>
            <h3>Siklus & musim</h3>
            <p>Pasaran Legi–Pahing–Pon–Wage–Kliwon, Pancawara Bali, musim perayaan.</p>
          </div>
          <div className="card accent-s">
            <span className="tag bad">Spasial</span>
            <h3>Norma & kendala ruang</h3>
            <p>Zona kesucian pura, Asta Kosala Kosali, kawasan cagar budaya, lahan subak.</p>
          </div>
          <div className="card accent-o">
            <span className="tag good">Sosial</span>
            <h3>Ruang kumpul</h3>
            <p>Angkringan, alun-alun, balai banjar — tempat warga berkumpul dan berdagang.</p>
          </div>
        </div>
        <p className="center">
          <Link to="/kearifan" className="btn ghost">
            Jelajahi basis aturan
          </Link>
        </p>
      </section>

      <section className="section">
        <h2>Cara kerja</h2>
        <ol className="steps">
          {STEPS.map(([t, d], i) => (
            <li key={t}>
              <b>{i + 1}</b>
              <strong>{t}</strong>
              <span>{d}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="section alt">
        <h2>Dibanding pendekatan lain</h2>
        <div className="table-wrap">
          <table className="data compare">
            <thead>
              <tr>
                <th>Fitur</th>
                <th>GIS desktop + MCDA</th>
                <th>Alat lokasi komersial</th>
                <th>TerraNus</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((row) => (
                <tr key={row[0]}>
                  {row.map((c, i) => (i === 3 ? <td key={i}><b>{c}</b></td> : <td key={i}>{c}</td>))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted small">Tabel 1 paper — karakteristik umum.</p>
      </section>
    </div>
  );
}
