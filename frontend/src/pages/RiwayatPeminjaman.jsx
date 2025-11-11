import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function RiwayatPeminjaman() {
  const navigate = useNavigate();
  
  // Data user (bisa diambil dari context/global state nanti)
  const [user] = useState({ name: 'Harris Caine' }); 

  // State untuk filter pencarian
  const [filters, setFilters] = useState({
    judul: '',
    nama: '',
    status: 'Semua Status'
  });

  // Data dummy untuk tabel (nanti ini dari API)
  const [peminjaman] = useState([
    {
      id: 1,
      nomor: 'PEMINJAMAN-BUKU/20250614/0057',
      nama: 'Harris Caine',
      judul: 'Putri Salju dan 7 Kurcaci',
      keterangan: 'lambat sehari dikembalikan',
      status: 'returned' // 'returned', 'pending', 'approved'
    },
    {
      id: 2,
      nomor: 'PEMINJAMAN-BUKU/20250615/0627',
      nama: 'Harris Caine',
      judul: 'Nabi Muhammad Sang Pengasih',
      keterangan: 'Menunggu Persetujuan Admin',
      status: 'pending'
    },
    // ... data dummy lainnya ...
  ]);

  const handleLogout = () => {
    navigate('/');
  };

  // Handler untuk mengubah state filter
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  // Handler untuk tombol "Cari"
  const handleSearch = () => {
    // TODO: Implementasi logika filter data 'peminjaman' berdasarkan state 'filters'
    // Untuk sekarang, kita hanya log filternya
    console.log('Mencari dengan filter:', filters);
  };
  
  // Handler untuk tombol "Tambah"
  const handleTambah = () => {
    navigate('/siswa/peminjaman');
  };

  // Handler untuk tombol "Detail"
  const handleDetail = (id) => {
    // Nanti kita akan buat halaman detailnya
    navigate(`/siswa/detail-peminjaman/${id}`); 
  };

  // Fungsi Badge Status (dipindah dari Dashboard)
  const getStatusBadge = (status) => {
    const config = {
      pending: { bg: '#fff3cd', color: '#856404', text: 'PENDING' },
      approved: { bg: '#d4edda', color: '#155724', text: 'Dipinjam' },
      returned: { bg: '#d1ecf1', color: '#0c5460', text: 'Dikembalikan' }
    };
    
    const s = config[status] || config.pending;
    return (
      <span style={{
        padding: '5px 15px',
        borderRadius: '20px',
        fontSize: '0.85em',
        fontWeight: '600',
        background: s.bg,
        color: s.color
      }}>
        {s.text}
      </span>
    );
  };

  return (
    <div style={styles.page}>
      {/* 1. Navbar (Sama, tapi 'Riwayat' yang aktif) */}
      <nav style={styles.navbar}>
        <div style={styles.navbarBrand}>📚 Perpustakaan Digital</div>
        <div style={styles.navbarMenu}>
          <Link to="/dashboard-siswa" style={styles.navLink}>Dashboard</Link>
          <Link to="/siswa/peminjaman" style={styles.navLink}>Peminjaman</Link>
          <Link to="/siswa/riwayat" style={{...styles.navLink, ...styles.navLinkActive}}>Riwayat</Link>
          <Link to="/siswa/profil" style={styles.navLink}>Profil</Link>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>{user.name?.charAt(0) || 'H'}</div>
            <span>{user.name}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </div>
        </div>
      </nav>

      {/* 2. Konten Halaman (Card & Tabel) */}
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.pageTitle}>Peminjaman Buku</h2>

          {/* 3. Filter Section */}
          <div style={styles.filterContainer}>
            <button onClick={handleTambah} style={styles.btnTambah}>
              TAMBAH
            </button>
            <div style={styles.filterInputs}>
              <input
                type="text"
                name="judul"
                placeholder="Cari judul buku..."
                style={styles.inputFilter}
                value={filters.judul}
                onChange={handleFilterChange}
              />
              <input
                type="text"
                name="nama"
                placeholder="Cari nama peminjam..."
                style={styles.inputFilter}
                value={filters.nama}
                onChange={handleFilterChange}
              />
              <select
                name="status"
                style={styles.inputFilter}
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option>Semua Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Dipinjam</option>
                <option value="returned">Dikembalikan</option>
              </select>
              <button onClick={handleSearch} style={styles.btnCari}>
                Cari
              </button>
            </div>
          </div>

          {/* 4. Tabel Riwayat */}
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>NOMOR PEMINJAMAN</th>
                  <th style={styles.th}>NAMA PEMINJAM</th>
                  <th style={styles.th}>JUDUL BUKU</th>
                  <th style={styles.th}>KETERANGAN</th>
                  <th style={styles.th}>STATUS</th>
                  <th style={styles.th}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {peminjaman.map(item => (
                  <tr key={item.id}>
                    <td style={styles.td}>{item.nomor}</td>
                    <td style={styles.td}>{item.nama}</td>
                    <td style={styles.td}>{item.judul}</td>
                    <td style={styles.td}>{item.keterangan}</td>
                    <td style={styles.td}>{getStatusBadge(item.status)}</td>
                    <td style={styles.td}>
                      <button 
                        onClick={() => handleDetail(item.id)} 
                        style={styles.btnDetail}
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
    </div>
  );
}

// 5. Styles (Menyalin dari halaman lain + style Tabel)
const styles = {
  // Styles Halaman & Navbar (Sama seperti PeminjamanBuku.jsx)
  page: { 
    background: '#f5f7fa',
    minHeight: '100vh',
  },
  navbar: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  navbarBrand: { fontSize: '1.5em', fontWeight: '700' },
  navbarMenu: { display: 'flex', gap: '20px', alignItems: 'center' },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
  },
  navLinkActive: { background: 'rgba(255, 255, 255, 0.2)' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#667eea',
    fontWeight: '700',
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  container: {
    maxWidth: '1200px',
    margin: '30px auto',
    padding: '0 20px',
  },

  // Style baru untuk Card, Filter, dan Tabel
  card: {
    background: 'white',
    borderRadius: '15px',
    padding: '30px 40px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  pageTitle: {
    color: '#333',
    marginBottom: '20px',
    fontSize: '1.75em',
    fontWeight: '600',
  },
  filterContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
  },
  filterInputs: {
    display: 'flex',
    gap: '10px',
  },
  inputFilter: {
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '0.9em',
  },
  btnTambah: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9em',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnCari: {
    padding: '10px 20px',
    background: '#667eea', // Warna biru primer
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9em',
    fontWeight: '600',
    cursor: 'pointer',
  },
  tableWrapper: {
    overflowX: 'auto', // Agar tabel bisa di-scroll di HP
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px 15px',
    borderBottom: '2px solid #eee',
    color: '#666',
    fontSize: '0.85em',
    textTransform: 'uppercase',
  },
  td: {
    textAlign: 'left',
    padding: '15px',
    borderBottom: '1px solid #eee',
    color: '#333',
  },
  btnDetail: {
    background: 'none',
    border: 'none',
    color: '#667eea', // Warna link
    fontWeight: '600',
    cursor: 'pointer',
    padding: 0,
  }
};

export default RiwayatPeminjaman;