import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import api from '../utils/api';

function DetailPengembalian() {
  const navigate = useNavigate();
  const { id } = useParams(); // Mengambil 'id' dari URL

  const [user] = useState({ name: 'Harris Caine' }); 
  const [detail, setDetail] = useState(null);

  // --- Data Dummy ---
  // Di aplikasi nyata, Anda akan fetch data dari API menggunakan 'id'
  useEffect(() => {
    // Simulasi pencarian data berdasarkan 'id'
    // Kita akan gunakan data yang sesuai dengan ID 1 dari form sebelumnya
    const dummyData = {
      id: 1, 
      nomor: 'PEMINJAMAN-BUKU/20250614/0057',
      nama: 'Harris Caine',
      judul: 'Putri Salju dan 7 Kurcaci',
      pengarang: 'Grimms',
      tahunTerbit: '2010',
      tanggalPinjam: '2025-06-14',
      tanggalKembali: '2025-06-21',
      // Karena ini halaman detail *pengembalian*, statusnya sudah 'returned'
      status: 'Dikembalikan', 
      keterangan: 'Telah dikembalikan',
      denda: '0.00',
      // URL gambar bukti (kita pakai placeholder)
      buktiGambar: 'https://cdn.gramedia.com/uploads/items/9786020330541_putri-salju.jpg' 
    };
    
    setDetail(dummyData);
    
  }, [id]);
  // ------------------

  const handleLogout = () => {
    navigate('/');
  };

  const handleKembali = () => {
    navigate('/siswa/riwayat'); // Kembali ke halaman riwayat
  };

  if (!detail) {
    return <div style={styles.page}>Loading...</div>;
  }

  return (
    <div style={styles.page}>
      {/* 1. Navbar (Sama) */}
      <nav style={styles.navbar}>
        <div style={styles.navbarBrand}>📚 Perpustakaan Digital</div>
        <div style={styles.navbarMenu}>
          {/* ... (link navbar seperti halaman lain) ... */}
          <Link to="/dashboard-siswa" style={styles.navLink}>Dashboard</Link>
          <Link to="/siswa/peminjaman" style={styles.navLink}>Peminjaman</Link>
          <Link to="/siswa/riwayat" style={styles.navLink}>Riwayat</Link>
          <Link to="/siswa/pengembalian" style={styles.navLink}>Pengembalian</Link>
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
          <h2 style={styles.pageTitle}>
            Detail Pengembalian Buku - {detail.nomor}
          </h2>

          {/* 3. Layout Grid (Bukti + Info) */}
          <div style={styles.detailGrid}>
            
            {/* Kolom Kiri: Bukti Gambar */}
            <div style={styles.buktiSection}>
              <h4 style={styles.detailSubTitle}>BUKTI PENGEMBALIAN</h4>
              <img 
                src={detail.buktiGambar} 
                alt="Bukti Pengembalian" 
                style={styles.buktiImage}
              />
            </div>

            {/* Kolom Kanan: Info Peminjaman */}
            <div style={styles.infoSection}>
               <h4 style={styles.detailSubTitle}>INFORMASI PEMINJAMAN</h4>
               {/* Kita gunakan style list dari DetailPeminjaman */}
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
                    <span style={styles.detailLabel}>RENCANA KEMBALI</span>
                    <span style={styles.detailValue}>{detail.tanggalKembali}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>STATUS</span>
                    <span style={styles.detailValue}>{detail.status}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>DENDA</span>
                    <span style={styles.detailValue}>Rp {detail.denda}</span>
                  </div>
                </div>
            </div>
          </div>
          
          <div style={styles.buttonGroup}>
            <button type="button" onClick={handleKembali} style={styles.btnKembali}>
              KEMBALI KE RIWAYAT
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}

async function handleSubmit(e) {
  e.preventDefault();
  try {
    const res = await api.post('/auth/login', { username, password }); // sesuaikan field body jika berbeda
    const { token, user } = res.data;
    if (token) localStorage.setItem('token', token);
    if (user) localStorage.setItem('user', JSON.stringify(user));
    // TODO: redirect ke halaman yang sesuai, mis. navigate('/dashboard')
  } catch (err) {
    console.error(err);
    // TODO: tampilkan pesan error ke user, mis. setError(err.response?.data?.message || err.message)
  }
}

// 4. Styles
const styles = {
  // Styles Halaman & Navbar (Sama)
  page: { background: '#f5f7fa', minHeight: '100vh' },
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
  },
  pageTitle: {
    color: '#333',
    marginBottom: '20px',
    fontSize: '1.75em',
    fontWeight: '600',
  },
  
  // Style baru untuk Grid Detail
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr', // Kolom kiri 1 bagian, kolom kanan 2 bagian
    gap: '40px',
    marginTop: '20px',
  },
  buktiSection: {},
  infoSection: {},
  detailSubTitle: {
    fontSize: '0.9em',
    fontWeight: '700',
    color: '#555',
    textTransform: 'uppercase',
    marginBottom: '15px',
    borderBottom: '2px solid #eee',
    paddingBottom: '10px',
  },
  buktiImage: {
    width: '100%',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  
  // Style Detail List (disalin dari DetailPeminjaman.jsx)
  detailList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  detailItem: {
    display: 'flex',
    padding: '12px 15px',
    background: '#f5f7fa',
    borderBottom: '1px solid #eee',
  },
  detailLabel: {
    color: '#666',
    fontWeight: '600',
    width: '200px',
    textTransform: 'uppercase',
    fontSize: '0.85em',
  },
  detailValue: {
    color: '#333',
    fontWeight: '500',
    flex: 1,
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

export default DetailPengembalian;