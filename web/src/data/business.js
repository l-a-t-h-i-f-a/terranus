// Profil bisnis, kriteria geospasial, dan bobot prioritas dasar untuk AHP (Bagian 3.3 paper).

export const CRITERIA = [
  { key: 'pop', label: 'Kepadatan penduduk', unit: 'jiwa/km²', kind: 'benefit' },
  { key: 'access', label: 'Aksesibilitas', unit: 'indeks 0–100', kind: 'benefit' },
  { key: 'comp', label: 'Kepadatan pesaing', unit: 'usaha sejenis ≤500 m', kind: 'cost' },
  { key: 'compl', label: 'POI komplementer', unit: 'skor tertimbang', kind: 'benefit' },
  { key: 'rent', label: 'Proksi sewa', unit: 'Rp juta/tahun', kind: 'cost' },
];

// Prioritas dasar per jenis usaha (urutan: pop, access, comp, compl, rent).
// Vektor ini dipakai untuk membangun matriks perbandingan berpasangan skala Saaty,
// lalu bobot akhir dihitung ulang dengan metode eigenvector AHP.
export const BUSINESS_TYPES = [
  {
    key: 'kuliner',
    label: 'Warung makan / kuliner',
    icon: '🍛',
    base: [0.3, 0.25, 0.15, 0.2, 0.1],
    complement: { kampus: 0.3, kantor: 0.3, wisata: 0.2, permukiman: 0.2 },
  },
  {
    key: 'kopi',
    label: 'Kedai kopi',
    icon: '☕',
    base: [0.15, 0.25, 0.15, 0.3, 0.15],
    complement: { kampus: 0.5, kantor: 0.3, wisata: 0.2 },
  },
  {
    key: 'kelontong',
    label: 'Toko kelontong',
    icon: '🛒',
    base: [0.35, 0.15, 0.25, 0.1, 0.15],
    complement: { permukiman: 0.6, sekolah: 0.2, pasar: 0.2 },
  },
  {
    key: 'laundry',
    label: 'Laundry kiloan',
    icon: '🧺',
    base: [0.3, 0.1, 0.25, 0.25, 0.1],
    complement: { kampus: 0.5, permukiman: 0.3, wisata: 0.2 },
  },
  {
    key: 'oleholeh',
    label: 'Oleh-oleh & kerajinan',
    icon: '🎁',
    base: [0.1, 0.3, 0.15, 0.35, 0.1],
    complement: { wisata: 0.8, pasar: 0.2 },
  },
  {
    key: 'fotokopi',
    label: 'Fotokopi & ATK',
    icon: '🖨️',
    base: [0.15, 0.2, 0.2, 0.35, 0.1],
    complement: { kampus: 0.5, sekolah: 0.3, kantor: 0.2 },
  },
];

export const TARGET_MARKETS = [
  { key: 'umum', label: 'Umum', boost: {} },
  { key: 'mahasiswa', label: 'Mahasiswa', boost: { kampus: 1.6 } },
  { key: 'keluarga', label: 'Keluarga / warga', boost: { permukiman: 1.5, sekolah: 1.5 } },
  { key: 'wisatawan', label: 'Wisatawan', boost: { wisata: 1.6 } },
  { key: 'pekerja', label: 'Pekerja kantoran', boost: { kantor: 1.6 } },
];

// Preferensi risiko menggeser prioritas sebelum matriks AHP dibangun.
export const RISK_PREFS = [
  { key: 'rendah', label: 'Hati-hati', hint: 'hindari pesaing & sewa mahal', mult: [1, 1, 1.4, 1, 1.4] },
  { key: 'sedang', label: 'Seimbang', hint: 'bobot dasar', mult: [1, 1, 1, 1, 1] },
  { key: 'tinggi', label: 'Berani', hint: 'kejar keramaian', mult: [1.25, 1.25, 0.7, 1, 0.7] },
];

export const POI_TAGS = {
  kampus: 'Kampus',
  sekolah: 'Sekolah',
  kantor: 'Perkantoran',
  wisata: 'Objek wisata',
  permukiman: 'Permukiman / kos',
  pasar: 'Pasar',
};
