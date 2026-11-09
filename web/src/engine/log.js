// Log penggunaan anonim (R5, Bagian 3.2): timestamp, tipe profil, area, peringkat dilihat, umpan balik.
// Disimpan hanya di browser pengguna.
const KEY = 'terranus-log-v1';

export function readLog() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function addLog(entry) {
  try {
    const all = readLog();
    all.push({ ts: new Date().toISOString(), ...entry });
    localStorage.setItem(KEY, JSON.stringify(all.slice(-500)));
  } catch {
    /* penyimpanan tidak tersedia: abaikan */
  }
}

export function clearLog() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* abaikan */
  }
}
