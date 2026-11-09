# TerraNus Web

Implementasi React dari paper *TerraNus: AI-Powered Personalized Geospatial Business Intelligence Based on Local Wisdom*.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # hasil di dist/ (PWA + Service Worker)
```

## Struktur
- `src/engine/ahp.js`: AHP (matriks berpasangan, eigenvector, CR)
- `src/engine/scoring.js`: persamaan (1)–(3), varian A/B/C, sensitivitas λ
- `src/engine/explain.js`: penjelasan templat (jalur fallback RAG)
- `src/engine/pasaran.js`: siklus pasaran Jawa / Pancawara Bali
- `src/data/regions.js`: kandidat lokasi Yogyakarta & Bali (**DATA DEMO**)
- `src/data/knowledgeBase.js`: aturan kearifan lokal (**CONTOH, belum divalidasi pakar**)

## Sebelum dipakai untuk keputusan nyata
1. Ganti `regions.js` dengan lapisan OSM/BPS hasil pipeline (Sprint 1).
2. Ganti aturan & bobot dengan hasil validasi Delphi (Sprint 2).
3. Opsional: sambungkan LLM + retrieval di server (jangan taruh API key di browser);
   `explain.js` tetap menjadi fallback.
