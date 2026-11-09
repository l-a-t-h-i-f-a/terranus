import { useState } from 'react';
import { clearLog, readLog } from '../engine/log.js';

const FIGS = [
  ['fig1-rich-picture.png', 'Gambar 1. Rich picture situasi masalah dan pemangku kepentingan.'],
  ['fig2-framework.png', 'Gambar 2. Kerangka konseptual penelitian.'],
  ['fig3-4d.png', 'Gambar 3. Alur penelitian model 4D.'],
  ['fig4-scrum.png', 'Gambar 4. Sprint Agile Scrum dalam tahap Develop.'],
  ['fig5-architecture.png', 'Gambar 5. Arsitektur sistem TerraNus.'],
  ['fig6-flow.png', 'Gambar 6. Dari profil pengguna ke rekomendasi yang dijelaskan.'],
];

const SPRINTS = [
  ['1', 'Pipeline data', 'Lapisan POI, jalan, demografi yang bersih', 'Dosen GIS / mentor'],
  ['2', 'Basis kearifan lokal', 'Aturan, bobot, kendala', 'Pakar budaya'],
  ['3', 'Mesin skoring', 'Model peringkat terpersonalisasi', 'Pakar, uji baseline'],
  ['4', 'Antarmuka & penjelasan', 'Peta, alasan, catatan budaya', 'Pemilik UMKM'],
  ['5', 'Pengujian & perbaikan', 'Release candidate, laporan uji', 'Pengguna & penguji'],
];

const REQS = [
  ['R1', 'Kearifan lokal sebagai pengetahuan tervalidasi yang dapat dibaca mesin', 'Basis aturan bertipe, berbobot, bertag wilayah'],
  ['R2', 'Kriteria geospasial dari data terbuka', 'Lima kriteria (data demo; target OSM + BPS)'],
  ['R3', 'Personalisasi sesuai profil usaha', 'Bobot AHP per jenis usaha & risiko, CR < 0,10'],
  ['R4', 'Rekomendasi yang dapat dijelaskan', 'Alasan geospasial + catatan budaya terpisah, fallback templat'],
  ['R5', 'Aplikasi web ringan dengan log penggunaan', 'PWA + Service Worker, log anonim lokal'],
];

const REFS = [
  'J. Malczewski, GIS and Multicriteria Decision Analysis, Wiley, 1999.',
  'J. Malczewski, GIS-based multicriteria decision analysis: a survey of the literature, IJGIS 20 (2006) 703–726.',
  'T. L. Saaty, The Analytic Hierarchy Process, McGraw-Hill, 1980.',
  'C. L. Hwang & K. Yoon, Multiple Attribute Decision Making: Methods and Applications, Springer, 1981.',
  'M. Haklay & P. Weber, OpenStreetMap: user-generated street maps, IEEE Pervasive Computing 7 (2008) 12–18.',
  'R. Eglash et al., Culturally situated design tools: ethnocomputing from field site to classroom, American Anthropologist 108 (2006) 347–362.',
  'F. Ricci, L. Rokach & B. Shapira (eds.), Recommender Systems Handbook, 2nd ed., Springer, 2015.',
  'P. Lewis et al., Retrieval-augmented generation for knowledge-intensive NLP tasks, NeurIPS 33 (2020) 9459–9474.',
  'T. Miller, Explanation in artificial intelligence: insights from the social sciences, Artificial Intelligence 267 (2019) 1–38.',
  'A. R. Hevner et al., Design science in information systems research, MIS Quarterly 28 (2004) 75–105.',
  'K. Peffers et al., A design science research methodology for information systems research, JMIS 24 (2007) 45–77.',
  'S. Thiagarajan, D. S. Semmel & M. I. Semmel, Instructional Development for Training Teachers of Exceptional Children, Indiana University, 1974.',
  'P. Checkland & J. Scholes, Soft Systems Methodology in Action, Wiley, 1990.',
  'K. Beck et al., Manifesto for Agile Software Development, 2001.',
  'K. Schwaber & J. Sutherland, The Scrum Guide, 2020.',
  'H. A. Linstone & M. Turoff (eds.), The Delphi Method: Techniques and Applications, Addison-Wesley, 1975.',
  'K. Järvelin & J. Kekäläinen, Cumulated gain-based evaluation of IR techniques, ACM TOIS 20 (2002) 422–446.',
  'J. Brooke, SUS: a quick and dirty usability scale, in: Usability Evaluation in Industry, Taylor & Francis, 1996, 189–194.',
  'F. D. Davis, Perceived usefulness, perceived ease of use, and user acceptance of information technology, MIS Quarterly 13 (1989) 319–340.',
  'J. R. Landis & G. G. Koch, The measurement of observer agreement for categorical data, Biometrics 33 (1977) 159–174.',
];

function UsageLog() {
  const [log, setLog] = useState(readLog);
  const download = () => {
    const blob = new Blob([JSON.stringify(log, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'terranus-usage-log.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const up = log.filter((l) => l.feedback === 'up').length;
  const down = log.filter((l) => l.feedback === 'down').length;
  return (
    <div className="card">
      <h3>Log penggunaan anonim (R5)</h3>
      <p className="muted">
        Setiap sesi menulis catatan anonim (waktu, tipe profil, area, peringkat yang dilihat, umpan balik) — disimpan hanya di browser
        ini untuk evaluasi Bagian 3.6.
      </p>
      <p>
        <b>{log.length}</b> entri · 👍 {up} · 👎 {down}
      </p>
      <div className="cta">
        <button className="btn ghost" onClick={download} disabled={!log.length}>
          Unduh JSON
        </button>
        <button
          className="btn ghost"
          onClick={() => {
            clearLog();
            setLog([]);
          }}
          disabled={!log.length}
        >
          Hapus log
        </button>
      </div>
    </div>
  );
}

export default function Research() {
  return (
    <div className="page research">
      <header className="page-head">
        <p className="eyebrow">Paper penelitian · 2026</p>
        <h1>TerraNus: AI-Powered Personalized Geospatial Business Intelligence Based on Local Wisdom for Location Decision-Making</h1>
      </header>

      <section>
        <h2>Abstrak</h2>
        <p>
          Memilih lokasi usaha adalah salah satu keputusan paling menentukan bagi UMKM Indonesia, tetapi alat pemilihan lokasi yang ada
          mahal, generik, dan buta terhadap pengetahuan budaya lokal yang membentuk di mana orang berdagang, berkumpul, dan berbelanja.
          Penelitian ini merancang, membangun, dan mengevaluasi TerraNus — aplikasi web yang menggabungkan data geospasial terbuka,
          basis pengetahuan kearifan lokal yang tervalidasi, dan mesin rekomendasi AI untuk memeringkat calon lokasi bagi profil usaha
          tertentu serta menjelaskan setiap rekomendasi. Pendekatan Research &amp; Development (model 4D) digunakan, dengan tahap
          Develop dalam lima sprint Agile Scrum.
        </p>
        <p className="muted small">
          Kata kunci: geospatial business intelligence; local wisdom; location decision-making; MSME; personalised recommendation;
          explainable AI; Agile; web application
        </p>
      </section>

      <section>
        <h2>Pertanyaan penelitian</h2>
        <ol className="rq">
          <li>Bagaimana kearifan lokal direpresentasikan sebagai pengetahuan tervalidasi yang dapat diproses sistem web?</li>
          <li>Apakah lapisan kearifan lokal mengubah peringkat lokasi dibanding baseline geospasial, dan apakah pakar setuju?</li>
          <li>Apakah implementasi andal di perangkat murah, dan bagaimana kegunaannya bagi UMKM harus diuji?</li>
        </ol>
      </section>

      <section>
        <h2>Model rekomendasi</h2>
        <div className="equations">
          <div className="eq">
            <code>S_geo(l,u) = Σ_k w_k(u) · x_k(l)</code>
            <span>(1)</span>
          </div>
          <div className="eq">
            <code>S_lw(l) = Σ_j v_j · r_j(l) &nbsp;&nbsp; c(l) ∈ &#123;0, 1&#125;</code>
            <span>(2)</span>
          </div>
          <div className="eq">
            <code>Score(l,u) = c(l) · [ (1 − λ) · S_geo(l,u) + λ · S_lw(l) ]</code>
            <span>(3)</span>
          </div>
        </div>
        <p>
          Lima kriteria x (kepadatan penduduk, aksesibilitas, kepadatan pesaing, POI komplementer, proksi sewa) dinormalisasi min–max ke
          [0,1]. Bobot w bergantung pada jenis usaha dan preferensi risiko, diturunkan dengan AHP dengan syarat rasio konsistensi &lt;
          0,10. Aturan budaya r dengan bobot tervalidasi v membentuk S<sub>lw</sub>, sedangkan kendala keras c (mis. jarak terlarang ke
          situs suci) bertindak sebagai filter. Modul penjelasan hanya menerima kriteria dan aturan yang benar-benar aktif; jika retrieval
          kosong, dipakai penjelasan templat.
        </p>
        <p className="muted small">
          Catatan implementasi web ini: agar sebanding dengan S<sub>geo</sub>, S<sub>lw</sub> dihitung sebagai 0,5 + Σ v·r yang dipotong ke
          [0,1] (0,5 = netral).
        </p>
      </section>

      <section>
        <h2>Metode</h2>
        <p>
          Research &amp; Development model 4D (Define, Design, Develop, Disseminate), sejalan dengan design science. Rich picture dari
          Soft Systems Methodology menghasilkan lima kebutuhan desain:
        </p>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Kebutuhan</th>
                <th>Deskripsi</th>
                <th>Wujud di aplikasi ini</th>
              </tr>
            </thead>
            <tbody>
              {REQS.map((r) => (
                <tr key={r[0]}>
                  <td>
                    <b>{r[0]}</b>
                  </td>
                  <td>{r[1]}</td>
                  <td>{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3>Rencana sprint (Tabel 2)</h3>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Sprint</th>
                <th>Fokus</th>
                <th>Keluaran</th>
                <th>Ditinjau oleh</th>
              </tr>
            </thead>
            <tbody>
              {SPRINTS.map((s) => (
                <tr key={s[0]}>
                  {s.map((c, i) => (
                    <td key={i}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Gambar</h2>
        <div className="figs">
          {FIGS.map(([f, cap]) => (
            <figure key={f}>
              <img src={`./figures/${f}`} alt={cap} loading="lazy" />
              <figcaption>{cap}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section>
        <h2>Evaluasi</h2>
        <div className="cards3">
          <div className="card">
            <h3>Kualitas rekomendasi</h3>
            <p>
              Tiga varian — A baseline geospasial, B TerraNus penuh, C ablation tanpa kearifan lokal — dibandingkan dengan peringkat
              rujukan pakar memakai Spearman ρ dan NDCG@3; kesepakatan pakar diukur dengan Cohen's κ.
            </p>
          </div>
          <div className="card">
            <h3>Fungsional &amp; performa</h3>
            <p>
              Uji end-to-end di Chromium via Playwright. Waktu muat diukur di desktop dan ponsel murah teremulasi (1,6 Mbps, latensi 150
              ms, CPU 4× lebih lambat): cache kosong, dengan Service Worker, dan offline.
            </p>
          </div>
          <div className="card">
            <h3>Rencana uji pengguna</h3>
            <p>
              Pemilik UMKM menyelesaikan tugas pemilihan lokasi lalu mengisi System Usability Scale dan butir Technology Acceptance Model,
              dengan persetujuan etik. Hasilnya belum dilaporkan.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>Keterbatasan</h2>
        <ul>
          <li>Basis pengetahuan hanya berlaku untuk wilayah tempat ia dibangun.</li>
          <li>Peringkat pakar, bukan hasil usaha, dipakai sebagai rujukan.</li>
          <li>Kesegaran dan kelengkapan data terbuka berbeda antarwilayah.</li>
          <li>Menyajikan budaya sebagai skor berisiko menyederhanakan — karena itu setiap aturan dapat ditelusuri ke sumber dan validatornya.</li>
          <li>Kegunaan dan dampak bagi pengguna belum diukur.</li>
        </ul>
      </section>

      <section>
        <UsageLog />
      </section>

      <section>
        <h2>Referensi</h2>
        <ol className="refs">
          {REFS.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}
