import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function TambahBuku() {
  const navigate = useNavigate();

  // State untuk form
  const [formData, setFormData] = useState({
    judul: '',
    pengarang: '',
    tahun: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Ganti dengan API call ke backend
    console.log('Form Tambah Buku:', formData);
    alert('Buku berhasil ditambahkan!');
    navigate('/admin/data-buku'); // Arahkan ke daftar buku
  };

  const handleKembali = () => {
    navigate('/admin/dashboard'); // Kembali ke dashboard
  };

  return (
    // Ini akan dirender di dalam <main> oleh <Outlet />
    <>
      {/* 1. Top Bar (Sama seperti DashboardAdmin) */}
      <div style={styles.topBar}>
        <h1 style={styles.pageTitle}>Tambah Buku</h1>
        <div style={styles.adminInfo}>
          <div>
            <div style={styles.adminName}>Admin Perpustakaan</div>
            <div style={styles.adminEmail}>admin@sekolah.com</div>
          </div>
          <div style={styles.adminAvatar}>AP</div>
        </div>
      </div>

      {/* 2. Form Card (Light Mode) */}
      <div style={styles.card}>
        <form onSubmit={handleSubmit}>
          {/* Judul Buku */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Judul Buku</label>
            <input
              type="text"
              name="judul"
              style={styles.input}
              value={formData.judul}
              onChange={handleChange}
              required
            />
          </div>

          {/* Nama Pengarang */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Nama Pengarang</label>
            <input
              type="text"
              name="pengarang"
              style={styles.input}
              value={formData.pengarang}
              onChange={handleChange}
              required
            />
          </div>

          {/* Tahun Rilis */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Tahun Rilis</label>
            <input
              type="number" // Input angka
              name="tahun"
              style={styles.input}
              value={formData.tahun}
              onChange={handleChange}
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
    </>
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

// 3. Styles (Menggunakan style dari DashboardAdmin + Form)
const styles = {
  // Top Bar (Sama seperti DashboardAdmin)
  topBar: {
    background: 'white',
    padding: '20px 30px',
    borderRadius: '15px',
    marginBottom: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  pageTitle: {
    color: '#333',
    margin: 0,
  },
  adminInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  adminName: {
    fontWeight: '600',
  },
  adminEmail: {
    fontSize: '0.85em',
    color: '#999',
  },
  adminAvatar: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
  },

  // Card & Form Styles (Light Mode)
  card: {
    background: 'white',
    borderRadius: '15px',
    padding: '30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    maxWidth: '700px', // Batasi lebar form
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
    background: '#f8f9fa',
    color: '#333',
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

export default TambahBuku;