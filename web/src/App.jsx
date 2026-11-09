import { NavLink, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Planner from './pages/Planner.jsx';
import Knowledge from './pages/Knowledge.jsx';
import Research from './pages/Research.jsx';

const links = [
  ['/', 'Beranda'],
  ['/app', 'Cari Lokasi'],
  ['/kearifan', 'Basis Kearifan Lokal'],
  ['/riset', 'Riset'],
];

export default function App() {
  return (
    <div className="shell">
      <header className="topbar">
        <NavLink to="/" className="brand">
          <img src="./icon.svg" alt="" width="30" height="30" />
          <span>TerraNus</span>
        </NavLink>
        <nav>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/app" element={<Planner />} />
          <Route path="/kearifan" element={<Knowledge />} />
          <Route path="/riset" element={<Research />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <footer className="footer">
        TerraNus · Geospatial Business Intelligence berbasis AI &amp; kearifan lokal · Peta © kontributor OpenStreetMap ·{' '}
        <strong>Data &amp; aturan pada versi ini adalah contoh demonstrasi.</strong>
      </footer>
    </div>
  );
}
