// Siklus pasaran Jawa (dan Pancawara Bali). Jangkar: 17 Agustus 1945 = Jumat Legi.
export const PASARAN = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
export const PANCAWARA = { Legi: 'Umanis', Pahing: 'Paing', Pon: 'Pon', Wage: 'Wage', Kliwon: 'Kliwon' };
const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const ANCHOR = Date.UTC(1945, 7, 17);

export function pasaranOf(date = new Date()) {
  const d = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const days = Math.round((d - ANCHOR) / 86400000);
  return PASARAN[((days % 5) + 5) % 5];
}

export function wetonOf(date = new Date()) {
  return `${HARI[date.getDay()]} ${pasaranOf(date)}`;
}

// Tanggal berikutnya (termasuk hari ini) yang jatuh pada pasaran tertentu.
export function nextDates(pasaran, count = 3, from = new Date()) {
  const out = [];
  const d = new Date(from);
  while (out.length < count) {
    if (pasaranOf(d) === pasaran) out.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}
