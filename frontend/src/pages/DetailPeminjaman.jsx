import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';

function DetailPeminjaman() {
  const navigate = useNavigate();
  const { id } = useParams(); // Mengambil 'id' dari URL

  // Data user (navbar)
  const [user] = useState({ name: 'Harris Caine' }); 

  // State untuk data detail (nantinya di-fetch dari API)
  const [detail, setDetail] = useState(null);

  // --- Data Dummy ---
  // Di aplikasi nyata, Anda akan fetch data dari API menggunakan 'id'
  useEffect(() => {
    // Simulasi pencarian data berdasarkan 'id'
    const dummyData = {
      id: 2, // Cocokkan dengan ID dari riwayat
      nomor: 'PEMINJAMAN-BUKU/20250615/0627',
      nama: 'Harris Caine',
      judul: 'Nabi Muhammad Sang Pengasih',
      pengarang: 'Nurmaningsih',
      tahunTerbit: '2017',
      tanggalPinjam: '2025-06-15',
      tanggalKembali: '2025-06-18',
      status: 'PENDING',
      keterangan: 'Menunggu Persetujuan Admin',
      denda: '0.00'
    };
    
    // Set data (disini kita pakai data dummy)
    setDetail(dummyData);
    
  }, [id]); // Effect ini berjalan saat 'id' berubah
  // ------------------

  const handleLogout = () => {
    navigate('/');
  };

  const handleKembali = () => {
    navigate('/siswa/riwayat'); // Kembali ke halaman riwayat
  };

  // Tampilkan loading jika data belum siap
  if (!detail) {
    return <div style={styles.page}>Loading...</div>;
  }

  return (
    <div style={styles.page}>
      {/* 1. Navbar (Sama) */}
      <nav style={styles.navbar}>
        <div style={styles.navbarBrand}>📚 Perpustakaan Digital</div>
        <div style={styles.navbarMenu}>
          <Link to="/dashboard-siswa" style={styles.navLink}>Dashboard</Link>
          <Link to="/siswa/peminjaman" style={styles.navLink}>Peminjaman</Link>
          <Link to="/siswa/riwayat" style={styles.navLink}>Riwayat</Link>
          <Link to="/siswa/profil" style={styles.navLink}>Profil</Link>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>{user.name?.charAt(0) || 'H'}</div>
            <span>{user.name}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </div>
        </div>
      </nav>

      {/* 2. Konten Halaman (Card Detail) */}
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.pageTitle}>Detail Pinjaman Buku</h2>

          {/* 3. Daftar Detail */}
          <div style={styles.detailList}>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>NOMOR PEMINJAMAN</span>
              <span style={styles.detailValue}>{detail.nomor}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>PEMINJAM</span>
              <span style={styles.detailValue}>{detail.nama}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>JUDUL BUKU</span>
              <span style={styles.detailValue}>{detail.judul}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>PENGARANG</span>
              <span style={styles.detailValue}>{detail.pengarang}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>TAHUN TERBIT</span>
              <span style={styles.detailValue}>{detail.tahunTerbit}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>TANGGAL PINJAM</span>
              <span style={styles.detailValue}>{detail.tanggalPinjam}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>TANGGAL KEMBALI</span>
              <span style={styles.detailValue}>{detail.tanggalKembali}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>STATUS</span>
              <span style={styles.detailValue}>{detail.status}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>KETERANGAN</span>
              <span style={styles.detailValue}>{detail.keterangan}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>DENDA</span>
              <span style={styles.detailValue}>Rp {detail.denda}</span>
            </div>
          </div>

          {/* 4. Tombol Kembali */}
          <div style={styles.buttonGroup}>
            <button type="button" onClick={handleKembali} style={styles.btnKembali}>
              KEMBALI
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}

// 5. Styles (Menyalin + style Detail List)
const styles = {
  // Styles Halaman & Navbar (Sama)
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
  card: {
    background: 'white',
    borderRadius: '15px',
    padding: '30px 40px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    maxWidth: '800px', // Sedikit lebih lebar
    margin: '0 auto', // Center card
  },
  pageTitle: {
    color: '#333',
    marginBottom: '20px',
    fontSize: '1.75em',
    fontWeight: '600',
  },

  // Style baru untuk Detail
  detailList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px', // Garis pemisah tipis
  },
  detailItem: {
    display: 'flex',
    padding: '12px 15px',
    background: '#f5f7fa', // Latar belakang abu-abu
    borderBottom: '1px solid #eee',
  },
  detailLabel: {
    color: '#666',
    fontWeight: '600',
    width: '200px', // Lebar tetap untuk label
    textTransform: 'uppercase',
    fontSize: '0.85em',
  },
  detailValue: {
    color: '#333',
    fontWeight: '500',
    flex: 1, // Mengisi sisa ruang
  },
  
  // Style Tombol
  buttonGroup: {
    display: 'flex',
    marginTop: '30px',
  },
  btnKembali: {
    padding: '12px 20px',
    background: '#6c757d', 
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9em',
    fontWeight: '600',
    cursor: 'pointer',
  }
};

export default DetailPeminjaman;