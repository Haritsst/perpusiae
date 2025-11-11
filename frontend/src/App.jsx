// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPages';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardSiswa from './pages/DashboardSiswa';
import PeminjamanBuku from './pages/PeminjamanBuku';
import RiwayatPeminjaman from './pages/RiwayatPeminjaman';
import DetailPeminjaman from './pages/DetailPeminjaman';
import PengembalianBuku from './pages/PengembalianBuku'; 
import DetailPengembalian from './pages/DetailPengembalian';
import ProfilSiswa from './pages/ProfilSiswa';
import AdminLayout from './layouts/AdminLayout'; // 1. Import Layout BARU
import DashboardAdmin from './pages/DashboardAdmin'; // 2. Ini masih kita pakai
import TambahBuku from './pages/TambahBuku';
import DataBuku from './pages/DataBuku';
import PinjamBukuAdmin from './pages/PinjamBukuAdmin';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard-siswa" element={<DashboardSiswa />} />
        <Route path="/siswa/peminjaman" element={<PeminjamanBuku />} />
        <Route path="/siswa/riwayat" element={<RiwayatPeminjaman />} />
        <Route path="/siswa/detail-peminjaman/:id" element={<DetailPeminjaman />} />
        <Route path="/siswa/pengembalian" element={<PengembalianBuku />} />
        <Route path="/siswa/detail-pengembalian/:id" element={<DetailPengembalian />} />
        <Route path="/siswa/profil" element={<ProfilSiswa />} />
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
          <Route path="/admin/tambah-buku" element={<TambahBuku />} />
          <Route path="/admin/data-buku" element={<DataBuku />} />
          <Route path="/admin/pinjam-buku" element={<PinjamBukuAdmin />} />
          {/* <Route path="/admin/pengembalian" element={...} /> */}
          {/* <Route path="/admin/laporan" element={...} /> */}
          {/* <Route path="/admin/profil" element={...} /> */}
          {/* <Route path="/admin/settings" element={...} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;