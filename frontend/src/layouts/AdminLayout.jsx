import React from 'react';
// 1. Import 'Link' dan 'Outlet'
import { useNavigate, Link, Outlet } from 'react-router-dom';

function AdminLayout() { // Ganti nama
  const navigate = useNavigate();

  const handleLogout = (e) => { // Tambah 'e'
    e.preventDefault(); // Cegah <a href="#">
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2>📚 Admin Panel</h2>
          <p style={styles.sidebarSubtitle}>Perpustakaan Digital</p>
        </div>

        {/* 2. Perbarui Sidebar Sesuai Permintaan Anda */}
        <ul style={styles.sidebarMenu}>
          {/* Ini permintaan Anda: Ganti Dashboard -> Tambah Buku */}
          {/* Ganti <a> jadi <Link> dan tambahkan link Dashboard kembali */}
          <li><Link to="/admin/dashboard" style={styles.menuLink}>📊 Dashboard</Link></li>
        <li>
            <Link to="/admin/tambah-buku" style={{...styles.menuLink, ...styles.menuLinkActive}}>
              ➕ Tambah Buku
            </Link>
          </li>
          <li><Link to="/admin/data-buku" style={styles.menuLink}>📚 Data Buku</Link></li>
          <li><Link to="/admin/pinjam-buku" style={styles.menuLink}>📖 Pinjam Buku</Link></li>
          <li><Link to="/admin/laporan" style={styles.menuLink}>📄 Laporan</Link></li>
          <li><Link to="/admin/profil" style={styles.menuLink}>👤 Profil</Link></li>
          <li><Link to="/admin/settings" style={styles.menuLink}>⚙️ Settings</Link></li>
          <li style={{marginTop: '20px'}}>
            <a href="#" onClick={handleLogout} style={{...styles.menuLink, background: 'rgba(255,255,255,0.1)'}}>
              🚪 Logout
            </a>
          </li>
        </ul>
      </aside>

      {/* 3. Ganti seluruh <main> dengan <Outlet /> */}
      <main style={styles.mainContent}>
        <Outlet /> 
        {/* <Outlet /> adalah tempat halaman (Dashboard, TambahBuku) akan muncul */}
      </main>
    </div>
  );
}

// 4. Salin HANYA style container, sidebar, dan mainContent
const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f5f7fa',
  },
  sidebar: {
    width: '260px',
    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    minHeight: '100vh',
    padding: '20px',
    position: 'fixed',
  },
  sidebarHeader: {
    padding: '20px 0',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
    marginBottom: '30px',
  },
  sidebarSubtitle: {
    fontSize: '0.85em',
    opacity: 0.8,
    marginTop: '5px',
  },
  sidebarMenu: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  menuLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '12px 15px',
    display: 'block',
    borderRadius: '10px',
    marginBottom: '10px',
    fontWeight: '500', // Saya tambahkan agar tebal
  },
  menuLinkActive: {
    background: 'rgba(255,255,255,0.2)',
  },
  mainContent: {
    marginLeft: '260px',
    flex: 1,
    padding: '30px',
  },
};

export default AdminLayout;