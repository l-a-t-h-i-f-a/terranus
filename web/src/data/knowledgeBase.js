// Basis pengetahuan kearifan lokal (Bagian 3.4 paper).
// Setiap aturan adalah rekaman terstruktur: teks aturan, wilayah berlaku, tipe
// (temporal / spasial / sosial), efek (bonus / penalti / kendala keras / catatan),
// bobot v, sumber, dan validator. Aturan HANYA diterapkan di wilayah tag-nya.
//
// STATUS: semua aturan di bawah adalah CONTOH untuk demonstrasi. Bobot dan radius
// belum melalui validasi pakar (Delphi). Ganti dengan hasil Sprint 2.

const ALL = ['kuliner', 'kopi', 'kelontong', 'laundry', 'oleholeh', 'fotokopi'];
const UNVALIDATED = { status: 'contoh', label: 'Contoh — belum divalidasi pakar' };

export const RULES = [
  // ---------------- Yogyakarta (Jawa) ----------------
  {
    id: 'YK-T1',
    region: 'yogyakarta',
    type: 'temporal',
    effect: 'bonus',
    weight: 0.35,
    appliesTo: ['kuliner', 'kelontong', 'oleholeh', 'kopi'],
    title: 'Siklus pasaran lima hari',
    text: 'Pasar tradisional Jawa ramai pada hari pasarannya (Legi, Pahing, Pon, Wage, Kliwon). Lokasi ≤400 m dari pasar berpasaran mendapat bonus penuh pada hari pasaran dan bonus kecil pada hari lain.',
    source: 'Kalender Jawa; wawancara pedagang pasar (rencana)',
    evaluate: (loc, ctx) => {
      const m = loc.market;
      if (!m?.pasaran || m.distM > 400) return null;
      const hit = ctx.pasaranDay === m.pasaran;
      return {
        r: hit ? 1 : 0.25,
        note: hit
          ? `Hari ini ${ctx.pasaranDay} = hari pasaran ${m.name} (${m.distM} m): puncak keramaian.`
          : `${m.name} (${m.distM} m) ramai tiap ${m.pasaran}; hari pasaran yang dipilih ${ctx.pasaranDay}, jadi bonus kecil saja.`,
      };
    },
  },
  {
    id: 'YK-T2',
    region: 'yogyakarta',
    type: 'temporal',
    effect: 'bonus',
    weight: 0.15,
    appliesTo: ['kuliner', 'kelontong'],
    title: 'Arus pagi pasar harian',
    text: 'Pasar harian ≤400 m memberi arus pengunjung pagi yang stabil setiap hari.',
    source: 'Observasi lapangan (rencana)',
    evaluate: (loc) => {
      const m = loc.market;
      if (!m || m.pasaran || m.distM > 400) return null;
      return { r: 1, note: `${m.name} berjarak ${m.distM} m dan buka setiap hari; arus pagi stabil.` };
    },
  },
  {
    id: 'YK-S1',
    region: 'yogyakarta',
    type: 'spasial',
    effect: 'penalti',
    weight: -0.2,
    appliesTo: ALL,
    title: 'Kawasan cagar budaya',
    text: 'Di kawasan cagar budaya (mis. Jeron Beteng, Kotagede, Sumbu Filosofi) fasad, papan nama dan renovasi diatur ketat sehingga biaya dan waktu perizinan naik.',
    source: 'Regulasi kawasan cagar budaya DIY (perlu dikonfirmasi)',
    evaluate: (loc) =>
      loc.heritage ? { r: 1, note: 'Berada di kawasan cagar budaya: siapkan izin fasad/papan nama dan jaga karakter bangunan.' } : null,
  },
  {
    id: 'YK-So1',
    region: 'yogyakarta',
    type: 'sosial',
    effect: 'bonus',
    weight: 0.25,
    appliesTo: ['kopi', 'kuliner'],
    title: 'Budaya nongkrong angkringan',
    text: 'Titik angkringan dan alun-alun adalah ruang kumpul warga yang menghidupkan jam malam; usaha makan-minum di sekitarnya ikut ramai.',
    source: 'Studi budaya angkringan (rencana)',
    evaluate: (loc) => {
      const g = loc.gathering?.filter((x) => x === 'angkringan' || x === 'alun-alun') ?? [];
      if (!g.length) return null;
      return { r: g.length > 1 ? 1 : 0.7, note: `Dekat ruang kumpul warga (${g.join(', ')}): ramai di malam hari.` };
    },
  },
  {
    id: 'YK-T3',
    region: 'yogyakarta',
    type: 'temporal',
    effect: 'bonus',
    weight: 0.1,
    appliesTo: ['kuliner', 'oleholeh'],
    title: 'Musim perayaan di alun-alun',
    text: 'Perayaan tahunan di sekitar alun-alun (mis. Sekaten, Grebeg) menaikkan kunjungan musiman.',
    source: 'Kalender budaya Kraton (rencana)',
    evaluate: (loc) =>
      loc.gathering?.includes('alun-alun') ? { r: 1, note: 'Dekat alun-alun: ada lonjakan musiman saat perayaan tahunan.' } : null,
  },

  // ---------------- Bali ----------------
  {
    id: 'BL-C1',
    region: 'bali',
    type: 'spasial',
    effect: 'kendala',
    weight: 0,
    appliesTo: ALL,
    title: 'Zona kesucian pura',
    text: 'Bangunan usaha tidak didirikan di dalam radius kesucian pura. Nilai contoh 50 m; radius sebenarnya berbeda per jenis pura dan diatur desa adat.',
    source: 'Bhisama kesucian pura; pararem desa adat (perlu dikonfirmasi)',
    evaluate: (loc) =>
      loc.sacred && loc.sacred.distM < 50
        ? { r: 1, constraint: true, note: `Hanya ${loc.sacred.distM} m dari ${loc.sacred.name}: di dalam zona kesucian, lokasi dikeluarkan.` }
        : null,
  },
  {
    id: 'BL-S1',
    region: 'bali',
    type: 'spasial',
    effect: 'penalti',
    weight: -0.15,
    appliesTo: ['kuliner', 'kopi', 'laundry'],
    title: 'Jarak hormat dari pura (Asta Kosala Kosali)',
    text: 'Usaha yang bising, berasap atau beraroma sebaiknya menjaga jarak dari pura dan perlu persetujuan desa adat. Penalti menurun linear dari 50 m ke 150 m.',
    source: 'Asta Kosala Kosali; wawancara pemangku (rencana)',
    evaluate: (loc) => {
      const d = loc.sacred?.distM;
      if (d == null || d < 50 || d >= 150) return null;
      const r = +(1 - (d - 50) / 100).toFixed(2);
      return { r, note: `${d} m dari ${loc.sacred.name}: jaga kebisingan/asap dan minta persetujuan desa adat.` };
    },
  },
  {
    id: 'BL-S2',
    region: 'bali',
    type: 'spasial',
    effect: 'penalti',
    weight: -0.3,
    appliesTo: ALL,
    title: 'Lahan subak (Tri Hita Karana — palemahan)',
    text: 'Alih fungsi sawah/subak bertentangan dengan keseimbangan manusia–alam (palemahan) dan sering ditolak krama; risiko sosial dan perizinan tinggi.',
    source: 'Tri Hita Karana; kebijakan perlindungan subak (perlu dikonfirmasi)',
    evaluate: (loc) =>
      loc.subak ? { r: 1, note: 'Berada di/berbatasan lahan subak: pertimbangkan bangunan yang tidak mengalihfungsikan sawah.' } : null,
  },
  {
    id: 'BL-So1',
    region: 'bali',
    type: 'sosial',
    effect: 'bonus',
    weight: 0.2,
    appliesTo: ['kelontong', 'kuliner', 'laundry'],
    title: 'Dekat balai banjar',
    text: 'Balai banjar adalah pusat kegiatan sosial krama; usaha kebutuhan harian di dekatnya lebih cepat dipercaya warga.',
    source: 'Struktur sosial banjar (rencana wawancara klian banjar)',
    evaluate: (loc) =>
      loc.gathering?.includes('balai banjar') ? { r: 1, note: 'Dekat balai banjar: kenalkan usaha lewat kegiatan banjar.' } : null,
  },
  {
    id: 'BL-T1',
    region: 'bali',
    type: 'temporal',
    effect: 'bonus',
    weight: 0.2,
    appliesTo: ['kelontong', 'oleholeh'],
    title: 'Pancawara & pasar desa',
    text: 'Bali memakai siklus lima hari Pancawara (Umanis, Paing, Pon, Wage, Kliwon) yang sejajar dengan pasaran Jawa; pasar desa ramai pada hari tertentu.',
    source: 'Kalender Bali (wariga)',
    evaluate: (loc, ctx) => {
      const m = loc.market;
      if (!m?.pasaran || m.distM > 400) return null;
      const hit = ctx.pasaranDay === m.pasaran;
      return { r: hit ? 1 : 0.25, note: `${m.name} ramai tiap ${m.pasaran}${hit ? ' — cocok dengan hari yang dipilih.' : '.'}` };
    },
  },
  {
    id: 'BL-N1',
    region: 'bali',
    type: 'temporal',
    effect: 'catatan',
    weight: 0,
    appliesTo: ALL,
    title: 'Nyepi',
    text: 'Saat Nyepi seluruh kegiatan usaha berhenti 24 jam; masukkan dalam perencanaan arus kas dan stok.',
    source: 'Kalender Saka',
    evaluate: () => ({ r: 1, note: 'Hari Nyepi: usaha tutup 24 jam, rencanakan stok dan arus kas.' }),
  },
].map((r) => ({ ...r, validation: UNVALIDATED }));

export const RULE_TYPES = {
  temporal: { label: 'Temporal', desc: 'siklus pasar, musim perayaan' },
  spasial: { label: 'Spasial', desc: 'kawasan suci, batas adat, aturan jarak' },
  sosial: { label: 'Sosial', desc: 'ruang kumpul, tempat dagang terpercaya' },
};

export const EFFECTS = {
  bonus: { label: 'Bonus', tone: 'good' },
  penalti: { label: 'Penalti', tone: 'warn' },
  kendala: { label: 'Kendala keras', tone: 'bad' },
  catatan: { label: 'Catatan', tone: 'info' },
};
