import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import { Circle, MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet';
import { EFFECTS } from '../data/knowledgeBase.js';

function rankIcon(rank, selected, excluded) {
  const cls = excluded ? 'pin excluded' : rank <= 3 ? 'pin top' : 'pin';
  return L.divIcon({
    className: '',
    html: `<div class="${cls}${selected ? ' selected' : ''}">${excluded ? '×' : rank}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

function marketIcon(active) {
  return L.divIcon({
    className: '',
    html: `<div class="pin market${active ? ' active' : ''}">P</div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

const ZONE_STYLE = {
  heritage: { color: '#1d4ed8', fillColor: '#60a5fa', fillOpacity: 0.12, dashArray: '6 4', weight: 1.5 },
  sacred: { color: '#b23a2e', fillColor: '#ec7b6e', fillOpacity: 0.35, weight: 1.5 },
  subak: { color: '#2f8f5b', fillColor: '#86d19f', fillOpacity: 0.2, dashArray: '4 4', weight: 1.5 },
};

export const MAP_LAYERS = [
  { key: 'markets', label: 'Pasar & hari pasaran' },
  { key: 'heritage', label: 'Kawasan cagar budaya' },
  { key: 'sacred', label: 'Zona kesucian pura' },
  { key: 'subak', label: 'Lahan subak' },
];

function Fly({ region, selected }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(region.center, region.zoom, { duration: 0.8 });
  }, [region.key]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (selected) map.flyTo(selected.loc.pos, Math.max(map.getZoom(), 14), { duration: 0.6 });
  }, [selected?.loc.id]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

export default function MapView({ region, ranked, selectedId, onSelect, pasaranDay, layers }) {
  const selected = useMemo(() => ranked.find((r) => r.loc.id === selectedId), [ranked, selectedId]);
  return (
    <MapContainer center={region.center} zoom={region.zoom} className="map" scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Fly region={region} selected={selected} />
      {region.zones
        .filter((z) => layers[z.kind])
        .map((z) => (
          <Circle key={z.name} center={z.center} radius={z.radius} pathOptions={ZONE_STYLE[z.kind]}>
            <Tooltip>{z.name}</Tooltip>
          </Circle>
        ))}
      {layers.markets &&
        region.markets.map((m) => (
          <Marker key={m.name} position={m.pos} icon={marketIcon(m.pasaran === pasaranDay)}>
            <Tooltip>
              <strong>{m.name}</strong>
              <br />
              {m.pasaran ? `Ramai tiap ${m.pasaran}${m.pasaran === pasaranDay ? ' — hari terpilih!' : ''}` : 'Pasar harian'}
            </Tooltip>
          </Marker>
        ))}
      {ranked.map((r) => (
        <Marker
          key={r.loc.id}
          position={r.loc.pos}
          icon={rankIcon(r.rank, r.loc.id === selectedId, r.c === 0)}
          zIndexOffset={r.loc.id === selectedId ? 1000 : r.c === 0 ? -100 : 200 - r.rank}
          eventHandlers={{ click: () => onSelect(r.loc.id) }}
        >
          <Popup>
            <div className="popup">
              <strong>{r.loc.name}</strong>
              <div className="muted">{r.loc.area}</div>
              <div className="popup-score">
                {r.c === 0 ? 'Dikeluarkan (kendala keras)' : `Peringkat #${r.rank} · skor ${Math.round(r.score * 100)}`}
              </div>
              {r.fired.length > 0 && (
                <ul>
                  {r.fired.map((f) => (
                    <li key={f.rule.id} className={EFFECTS[f.rule.effect].tone}>
                      {f.rule.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
