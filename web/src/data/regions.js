// DATA DEMONSTRASI.
// Koordinat diperkirakan; angka penduduk, pesaing, POI, sewa dan hari pasaran pasar
// (kecuali Pasar Legi Kotagede) adalah contoh ilustratif, BUKAN hasil pengukuran.
// Ganti dengan lapisan OpenStreetMap / BPS hasil pipeline Sprint 1 sebelum dipakai untuk keputusan nyata.

const c = (kuliner, kopi, kelontong, laundry, oleholeh, fotokopi) => ({ kuliner, kopi, kelontong, laundry, oleholeh, fotokopi });
const t = (kampus, sekolah, kantor, wisata, permukiman, pasar) => ({ kampus, sekolah, kantor, wisata, permukiman, pasar });

export const REGIONS = {
  yogyakarta: {
    key: 'yogyakarta',
    label: 'D.I. Yogyakarta',
    culture: 'Jawa',
    center: [-7.8, 110.375],
    zoom: 12,
    zones: [
      { name: 'Kawasan Jeron Beteng (cagar budaya, perkiraan)', center: [-7.8075, 110.3635], radius: 900, kind: 'heritage' },
      { name: 'Kawasan Cagar Budaya Kotagede (perkiraan)', center: [-7.829, 110.3995], radius: 600, kind: 'heritage' },
    ],
    markets: [
      { name: 'Pasar Legi Kotagede', pos: [-7.8282, 110.3986], pasaran: 'Legi' },
      { name: 'Pasar Beringharjo', pos: [-7.7988, 110.3654], pasaran: null },
      { name: 'Pasar tradisional Godean (contoh)', pos: [-7.7686, 110.2945], pasaran: 'Pahing' },
      { name: 'Pasar tradisional Bantul (contoh)', pos: [-7.8878, 110.3288], pasaran: 'Pon' },
    ],
    candidates: [
      { id: 'Y1', name: 'Jl. Kaliurang Km 5', area: 'Sleman (dekat kampus)', pos: [-7.765, 110.381], pop: 9800, access: 85, comp: c(14, 11, 6, 9, 1, 7), poi: t(9, 2, 3, 0, 6, 0), rent: 45, market: { name: 'Pasar Kolombo', distM: 900, pasaran: null }, gathering: ['angkringan'], heritage: false },
      { id: 'Y2', name: 'Jl. Mondorakan, Kotagede', area: 'Kotagede', pos: [-7.8279, 110.3975], pop: 8200, access: 60, comp: c(7, 3, 8, 2, 6, 2), poi: t(0, 3, 1, 7, 8, 3), rent: 22, market: { name: 'Pasar Legi Kotagede', distM: 150, pasaran: 'Legi' }, gathering: ['angkringan'], heritage: true },
      { id: 'Y3', name: 'Jl. Pasar Kembang–Malioboro', area: 'Malioboro', pos: [-7.7925, 110.3655], pop: 7000, access: 95, comp: c(25, 12, 10, 1, 30, 3), poi: t(1, 2, 7, 10, 3, 4), rent: 120, market: { name: 'Pasar Beringharjo', distM: 650, pasaran: null }, gathering: ['angkringan'], heritage: true },
      { id: 'Y4', name: 'Jl. Prawirotaman', area: 'Mergangsan', pos: [-7.8195, 110.368], pop: 6500, access: 70, comp: c(15, 14, 4, 6, 5, 1), poi: t(0, 1, 1, 8, 5, 1), rent: 70, market: { name: 'Pasar Prawirotaman', distM: 300, pasaran: null }, gathering: [], heritage: false },
      { id: 'Y5', name: 'Jl. Affandi (Gejayan)', area: 'Depok, Sleman', pos: [-7.772, 110.3895], pop: 10500, access: 88, comp: c(18, 9, 7, 10, 0, 8), poi: t(8, 2, 2, 0, 7, 1), rent: 55, market: { name: 'Pasar Demangan', distM: 350, pasaran: null }, gathering: ['angkringan'], heritage: false },
      { id: 'Y6', name: 'Jl. Seturan Raya', area: 'Depok, Sleman', pos: [-7.768, 110.41], pop: 9000, access: 75, comp: c(20, 16, 5, 12, 0, 6), poi: t(7, 1, 2, 0, 7, 0), rent: 50, market: { name: 'Pasar Condongcatur', distM: 1500, pasaran: null }, gathering: [], heritage: false },
      { id: 'Y7', name: 'Sekitar Alun-alun Kidul', area: 'Kraton', pos: [-7.8115, 110.363], pop: 8800, access: 65, comp: c(12, 6, 5, 2, 4, 1), poi: t(0, 3, 1, 6, 7, 1), rent: 35, market: { name: 'Pasar Ngasem', distM: 700, pasaran: null }, gathering: ['alun-alun', 'angkringan'], heritage: true },
      { id: 'Y8', name: 'Jl. Godean Km 10', area: 'Godean, Sleman', pos: [-7.769, 110.2965], pop: 4200, access: 70, comp: c(5, 2, 6, 1, 1, 2), poi: t(0, 3, 1, 0, 9, 2), rent: 15, market: { name: 'Pasar tradisional Godean (contoh)', distM: 220, pasaran: 'Pahing' }, gathering: [], heritage: false },
      { id: 'Y9', name: 'Jl. Jenderal Sudirman, Bantul', area: 'Bantul', pos: [-7.8868, 110.3305], pop: 5200, access: 72, comp: c(6, 3, 7, 1, 2, 2), poi: t(0, 4, 3, 0, 8, 2), rent: 18, market: { name: 'Pasar tradisional Bantul (contoh)', distM: 250, pasaran: 'Pon' }, gathering: ['alun-alun'], heritage: false },
      { id: 'Y10', name: 'Ring Road Utara, Condongcatur', area: 'Depok, Sleman', pos: [-7.757, 110.396], pop: 8600, access: 80, comp: c(13, 10, 6, 8, 0, 6), poi: t(6, 2, 3, 0, 6, 1), rent: 48, market: { name: 'Pasar Condongcatur', distM: 200, pasaran: null }, gathering: ['angkringan'], heritage: false },
    ],
  },
  bali: {
    key: 'bali',
    label: 'Bali (Denpasar–Badung–Gianyar)',
    culture: 'Bali',
    center: [-8.63, 115.215],
    zoom: 11,
    zones: [
      { name: 'Pura Agung Jagatnatha — zona kesucian (contoh 50 m)', center: [-8.6567, 115.2174], radius: 50, kind: 'sacred' },
      { name: 'Pura Taman Saraswati — zona kesucian (contoh 50 m)', center: [-8.5065, 115.2617], radius: 50, kind: 'sacred' },
      { name: 'Hamparan sawah / subak (perkiraan)', center: [-8.4955, 115.255], radius: 450, kind: 'subak' },
      { name: 'Sisa sawah Kerobokan (perkiraan)', center: [-8.656, 115.166], radius: 350, kind: 'subak' },
    ],
    markets: [
      { name: 'Pasar Badung', pos: [-8.6555, 115.2115], pasaran: null },
      { name: 'Pasar Ubud', pos: [-8.5066, 115.2633], pasaran: null },
      { name: 'Pasar desa Peguyangan (contoh)', pos: [-8.611, 115.2065], pasaran: 'Kliwon' },
    ],
    candidates: [
      { id: 'B1', name: 'Jl. Gajah Mada', area: 'Denpasar Barat', pos: [-8.6565, 115.2095], pop: 9000, access: 90, comp: c(18, 8, 12, 2, 14, 4), poi: t(1, 3, 6, 5, 5, 5), rent: 90, market: { name: 'Pasar Badung', distM: 150, pasaran: null }, sacred: { name: 'Pura desa', distM: 220 }, gathering: ['balai banjar'], subak: false },
      { id: 'B2', name: 'Jl. Surapati (sisi Lapangan Puputan)', area: 'Denpasar', pos: [-8.6564, 115.2178], pop: 7000, access: 85, comp: c(10, 7, 4, 1, 8, 3), poi: t(0, 2, 8, 6, 3, 2), rent: 80, market: { name: 'Pasar Badung', distM: 650, pasaran: null }, sacred: { name: 'Pura Agung Jagatnatha', distM: 35 }, gathering: [], subak: false },
      { id: 'B3', name: 'Jl. Raya Puputan, Renon', area: 'Denpasar Timur', pos: [-8.675, 115.232], pop: 6500, access: 80, comp: c(12, 9, 4, 3, 2, 4), poi: t(1, 2, 9, 2, 5, 0), rent: 75, market: { name: 'Pasar Renon', distM: 900, pasaran: null }, sacred: { name: 'Pura banjar', distM: 400 }, gathering: [], subak: false },
      { id: 'B4', name: 'Jl. Tukad Yeh Aya, Panjer', area: 'Denpasar Selatan', pos: [-8.68, 115.22], pop: 9500, access: 75, comp: c(14, 8, 6, 7, 1, 5), poi: t(6, 3, 3, 0, 8, 1), rent: 45, market: { name: 'Pasar Panjer', distM: 600, pasaran: null }, sacred: { name: 'Pura banjar', distM: 120 }, gathering: ['balai banjar'], subak: false },
      { id: 'B5', name: 'Jl. Danau Tamblingan, Sanur', area: 'Sanur', pos: [-8.69, 115.262], pop: 5500, access: 78, comp: c(22, 15, 5, 6, 18, 1), poi: t(0, 1, 2, 9, 4, 1), rent: 110, market: { name: 'Pasar Sindhu', distM: 500, pasaran: null }, sacred: { name: 'Pura desa', distM: 300 }, gathering: [], subak: false },
      { id: 'B6', name: 'Jl. Raya Ubud', area: 'Ubud, Gianyar', pos: [-8.5072, 115.2622], pop: 4800, access: 82, comp: c(24, 18, 4, 5, 28, 1), poi: t(0, 1, 1, 10, 3, 3), rent: 130, market: { name: 'Pasar Ubud', distM: 100, pasaran: null }, sacred: { name: 'Pura Taman Saraswati', distM: 80 }, gathering: ['balai banjar'], subak: false },
      { id: 'B7', name: 'Jl. Subak Sok Wayah', area: 'Ubud, Gianyar', pos: [-8.4955, 115.256], pop: 2500, access: 45, comp: c(6, 5, 1, 1, 4, 0), poi: t(0, 0, 0, 6, 2, 0), rent: 60, market: { name: 'Pasar Ubud', distM: 1300, pasaran: null }, sacred: { name: 'Pura subak', distM: 500 }, gathering: [], subak: true },
      { id: 'B8', name: 'Jl. Kampus Unud, Jimbaran', area: 'Kuta Selatan', pos: [-8.798, 115.17], pop: 5000, access: 68, comp: c(9, 6, 4, 6, 1, 4), poi: t(8, 1, 1, 2, 6, 0), rent: 40, market: { name: 'Pasar Jimbaran', distM: 1800, pasaran: null }, sacred: { name: 'Pura desa', distM: 600 }, gathering: ['balai banjar'], subak: false },
      { id: 'B9', name: 'Jl. Ahmad Yani Utara, Peguyangan', area: 'Denpasar Utara', pos: [-8.61, 115.2055], pop: 8000, access: 70, comp: c(8, 3, 7, 2, 1, 2), poi: t(0, 4, 1, 0, 9, 2), rent: 25, market: { name: 'Pasar desa Peguyangan (contoh)', distM: 300, pasaran: 'Kliwon' }, sacred: { name: 'Pura banjar', distM: 200 }, gathering: ['balai banjar'], subak: false },
      { id: 'B10', name: 'Jl. Raya Kerobokan', area: 'Kuta Utara, Badung', pos: [-8.655, 115.168], pop: 6000, access: 76, comp: c(16, 12, 5, 6, 6, 2), poi: t(0, 2, 2, 4, 6, 1), rent: 65, market: { name: 'Pasar Kerobokan', distM: 700, pasaran: null }, sacred: { name: 'Pura desa', distM: 250 }, gathering: [], subak: true },
    ],
  },
};

export const REGION_LIST = Object.values(REGIONS);
