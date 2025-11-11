import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function PengembalianBuku() {
  const navigate = useNavigate();
  const [user] = useState({ name: 'Harris Caine' }); 

  // Data dummy untuk dropdown (hanya tampilkan buku yang sedang dipinjam)
  const [activeLoans] = useState([
    { id: 1, nomor: 'PEMINJAMAN-BUKU/20250614/0057', judul: 'Putri Salju dan 7 Kurcaci' },
    { id: 2, nomor: 'PEMINJAMAN-BUKU/20250615/0627', judul: 'Nabi Muhammad Sang Pengasih' },
  ]);

  // State untuk form
  const [peminjamanId, setPeminjamanId] = useState('');
  const [bukti, setBukti] = useState(null); // State untuk menyimpan file

  const handleLogout = () => {
    navigate('/');
  };

  // Handler untuk file input
  const handleFileChange = (e) => {
    setBukti(e.target.files[0]); // Ambil file pertama yang dipilih
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!peminjamanId || !bukti) {
      alert('Harap pilih peminjaman dan unggah bukti!');
      return;
    }
    
    // TODO: Ganti dengan API call untuk upload file (bukti)
    console.log('Form disubmit:', {
      peminjamanId: peminjamanId,
      file: bukti.name
    });

    alert('Bukti pengembalian berhasil diunggah!');
    
    // Arahkan ke halaman detail PENGEMBALIAN
    // Kita kirim 'id' dari peminjaman yang baru dikembalikan
    navigate(`/siswa/detail-pengembalian/${peminjamanId}`); 
  };

  const handleKembali = () => {
    navigate('/dashboard-siswa'); 
  };

  return (
    <div style={styles.page}>
      {/* 1. Navbar (Sama, tapi 'Pengembalian' yang aktif) */}
      <nav style={styles.navbar}>
        <div style={styles.navbarBrand}>📚 Perpustakaan Digital</div>
        <div style={styles.navbarMenu}>
          <Link to="/dashboard-siswa" style={styles.navLink}>Dashboard</Link>
          <Link to="/siswa/peminjaman" style={styles.navLink}>Peminjaman</Link>
          <Link to="/siswa/riwayat" style={styles.navLink}>Riwayat</Link>
          {/* Tambahkan link ke /siswa/pengembalian */}
          <Link to="/siswa/pengembalian" style={{...styles.navLink, ...styles.navLinkActive}}>Pengembalian</Link>
          <Link to="/siswa/profil" style={styles.navLink}>Profil</Link>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>{user.name?.charAt(0) || 'H'}</div>
            <span>{user.name}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </div>
        </div>
      </nav>

      {/* 2. Konten Halaman (Form Card) */}
      <div style={styles.container}>
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Tambah Pengembalian Buku</h2>
          
          <form onSubmit={handleSubmit}>
            {/* Form Group: Peminjaman Buku (Dropdown) */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Peminjaman Buku</label>
              <select
                name="peminjamanId"
                style={styles.input}
                value={peminjamanId}
                onChange={(e) => setPeminjamanId(e.target.value)}
                required
              >
                <option value="">-- Pilih peminjaman yang akan dikembalikan --</option>
                {activeLoans.map(loan => (
                  <option key={loan.id} value={loan.id}>
                    {loan.nomor} - {loan.judul}
                  </option>
                ))}
              </select>
            </div>

            {/* Form Group: Bukti Pengembalian (File Input) */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Bukti Pengembalian</label>
              <input
                type="file"
                name="bukti"
                style={{...styles.input, ...styles.inputFile}}
                onChange={handleFileChange}
                accept="image/*" // Hanya terima file gambar
                required
              />
            </div>

            {/* Tombol Aksi */}
            <div style={styles.buttonGroup}>
              <button type="submit" style={styles.btnSimpan}>
                SIMPAN
              </button>
              <button type="button" onClick={handleKembali} style={styles.btnKembali}>
                KEMBALI
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// 3. Styles (Menyalin dari PeminjamanBuku.jsx)
const styles = {
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
  formCard: {
    background: 'white',
    borderRadius: '15px',
    padding: '30px 40px', 
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    maxWidth: '700px',
    margin: '0 auto', 
  },
  formTitle: {
    color: '#333',
    marginBottom: '30px', 
    textAlign: 'center',
    fontSize: '1.75em',
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#333',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1em',
    boxSizing: 'border-box',
    background: '#fff',
    color: '#333',
  },
  inputFile: {
    padding: '9px 12px', // Sesuaikan padding untuk input file
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    marginTop: '30px',
  },
  btnSimpan: {
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9em',
    fontWeight: '600',
    cursor: 'pointer',
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

export default PengembalianBuku;