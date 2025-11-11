import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function PeminjamanBuku() {
  const navigate = useNavigate();

  // Data user (sesuai gambar)
  const [user] = useState({ name: 'Harris Caine' }); 
  
  // Data dummy untuk dropdown buku (nanti ini dari API)
  const [books] = useState([
    { id: 1, title: 'Nabi Muhammad Sang Pengasih' },
    { id: 2, title: 'Laskar Pelangi' },
    { id: 3, title: 'Bumi Manusia' },
    { id: 4, title: 'Negeri 5 Menara' },
  ]);

  // State untuk form (diisi default sesuai gambar)
  const [formData, setFormData] = useState({
    bukuId: '', // Tadinya '1'
    tanggalPinjam: '', // Tadinya '2025-06-15'
    tanggalKembali: '', // Tadinya '2025-06-18'
  });

  const handleLogout = () => {
    navigate('/');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.bukuId || !formData.tanggalPinjam || !formData.tanggalKembali) {
      alert('Harap isi semua field!');
      return;
    }
    // TODO: Ganti dengan API call ke backend Anda (perpusiae)
    console.log('Form disubmit:', {
      siswa: user.name,
      ...formData
    });
    alert('Peminjaman berhasil diajukan!');
    // Arahkan ke halaman riwayat atau dashboard
    navigate('/siswa/riwayat'); 
  };

  const handleKembali = () => {
    navigate('/dashboard-siswa'); // Tombol "KEMBALI"
  };

  return (
    <div style={styles.page}>
      {/* 1. Navbar (Sama persis dengan DashboardSiswa) */}
      <nav style={styles.navbar}>
        <div style={styles.navbarBrand}>📚 Perpustakaan Digital</div>
        <div style={styles.navbarMenu}>
          <Link to="/dashboard-siswa" style={styles.navLink}>Dashboard</Link>
          <Link to="/siswa/peminjaman" style={{...styles.navLink, ...styles.navLinkActive}}>Peminjaman</Link>
          <Link to="/siswa/riwayat" style={styles.navLink}>Riwayat</Link>
          <Link to="/siswa/profil" style={styles.navLink}>Profil</Link>
          <Link to="/siswa/riwayat" style={styles.navLink}>Riwayat</Link>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>
              {user.name?.charAt(0) || 'H'}
            </div>
            <span>{user.name}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Konten Halaman (Container & Card Form) */}
      <div style={styles.container}>
        {/* Card untuk Form */}
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Tambah Peminjaman Buku</h2>
          
          <form onSubmit={handleSubmit}>
            {/* Form Group: Nama Siswa */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Nama Siswa</label>
              <input
                type="text"
                style={{...styles.input, ...styles.inputDisabled}}
                value={user.name}
                disabled // Nama siswa tidak bisa diubah
              />
            </div>

            {/* Form Group: Pilih Buku (Dropdown) */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Pilih Buku</label>
              <select
                name="bukuId"
                style={styles.input} // Kita pakai style input yang sama
                value={formData.bukuId}
                onChange={handleChange}
                required
              >
                {/* <option value="">-- Pilih buku --</option> */}
                <option value="">-- Pilih buku --</option>
                {books.map(book => (
                  <option key={book.id} value={book.id}>
                    {book.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Form Group: Tanggal Meminjam */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Tanggal Meminjam</label>
              <input
                type="date" // Atribut ini yang memunculkan kalender
                name="tanggalPinjam"
                style={styles.input}
                value={formData.tanggalPinjam}
                onChange={handleChange}
                onClick={(e) => e.target.showPicker()}
                required
              />
            </div>

            {/* Form Group: Tanggal Mengembalikan */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Tanggal Mengembalikan</label>
              <input
                type="date" // Atribut ini yang memunculkan kalender
                name="tanggalKembali"
                style={styles.input}
                value={formData.tanggalKembali}
                onChange={handleChange}
                onClick={(e) => e.target.showPicker()}
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

// 3. Styles (Menyalin dari DashboardSiswa + Menambah style form)
const styles = {
  // Styles yang disalin dari DashboardSiswa.jsx
  page: { // Mengganti nama 'dashboardPage'
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
  navbarBrand: {
    fontSize: '1.5em',
    fontWeight: '700',
  },
  navbarMenu: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
  },
  navLinkActive: { // Style untuk menandai link aktif
    background: 'rgba(255, 255, 255, 0.2)',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
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
  
  // Style baru untuk Form Card (mirip welcomeCard / quickActions)
  formCard: {
    background: 'white',
    borderRadius: '15px',
    padding: '30px 40px', // Padding lebih tebal
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    maxWidth: '700px', // Batasi lebar form
    margin: '0 auto', // Center form card
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
  inputDisabled: {
    background: '#f5f7fa', // Warna abu-abu (sama dg background page)
    color: '#777',
    cursor: 'not-allowed',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    marginTop: '30px',
  },
  // Tombol Simpan (menggunakan style gradient)
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
  // Tombol Kembali (abu-abu)
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

export default PeminjamanBuku;