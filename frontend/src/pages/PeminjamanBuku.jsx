import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

function PeminjamanBuku() {
  const navigate = useNavigate();
  
  // State untuk user (dari localStorage)
  const [user, setUser] = useState(null);
  
  // State untuk books (dari API)
  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [booksError, setBooksError] = useState('');

  // State untuk form
  const [formData, setFormData] = useState({
    book_id: '',
    loan_date: '',
    return_date: '',
  });
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch user dari localStorage & books dari API saat mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          navigate('/login');
          return;
        }
        setUser(JSON.parse(storedUser));

        const token = localStorage.getItem('token');
        if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        try {
          const booksRes = await api.get('/api/books');
          console.log('[PeminjamanBuku] booksRes:', booksRes);

          // handle multiple possible response shapes
          const list = booksRes?.data?.data ?? booksRes?.data ?? [];
          setBooks(Array.isArray(list) ? list : []);
        } catch (err) {
          console.error('[PeminjamanBuku] error fetching /api/books:', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            headers: err.response?.headers,
            request: err.request
          });

          // fallback: coba langsung ke book-service (port 3002) untuk isolasi masalah gateway
          try {
            const direct = await fetch('http://localhost:3002/api/books', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
            if (direct.ok) {
              const json = await direct.json();
              console.log('[PeminjamanBuku] direct books:', json);
              const list = json?.data ?? json;
              setBooks(Array.isArray(list) ? list : []);
              setBooksError(''); // clear error since fallback succeeded
            } else {
              const txt = await direct.text();
              console.warn('[PeminjamanBuku] direct fetch failed:', direct.status, txt);
              setBooksError('Gagal memuat daftar buku (gateway dan direct fetch gagal)');
            }
          } catch (directErr) {
            console.error('[PeminjamanBuku] direct fetch error:', directErr);
            setBooksError('Gagal memuat daftar buku');
          }
        }

        setBooksLoading(false);
      } catch (err) {
        console.error('[PeminjamanBuku] unexpected error:', err);
        setBooksError('Terjadi kesalahan saat memuat data');
        setBooksLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    // Validasi form
    if (!formData.book_id || !formData.loan_date || !formData.return_date) {
      setSubmitError('Harap isi semua field!');
      return;
    }

    // Validasi tanggal
    if (new Date(formData.loan_date) >= new Date(formData.return_date)) {
      setSubmitError('Tanggal kembali harus setelah tanggal pinjam!');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      // Submit loan ke backend
      const payload = {
        book_id: formData.book_id,
        loan_date: formData.loan_date,
        return_date: formData.return_date,
      };

      const res = await api.post('/api/loans', payload);

      if (res.data.success) {
        alert('Peminjaman berhasil diajukan!');
        // Redirect ke dashboard (untuk refresh stats)
        navigate('/dashboard-siswa');
      } else {
        setSubmitError(res.data.message || 'Terjadi kesalahan');
      }
    } catch (err) {
      console.error('Submit loan error:', err);
      const msg = err.response?.data?.message || 'Gagal mengajukan peminjaman';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await api.post('/api/auth/logout');
      }
    } catch (err) {
      console.warn('Logout error:', err.message);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      api.defaults.headers.common['Authorization'] = '';
      navigate('/');
    }
  };

  const handleKembali = () => {
    navigate('/dashboard-siswa');
  };

  if (booksLoading) {
    return (
      <div style={styles.page}>
        <div style={styles.loading}>Memuat data...</div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navbarBrand}>📚 Perpustakaan Digital</div>
        <div style={styles.navbarMenu}>
          <Link to="/dashboard-siswa" style={styles.navLink}>Dashboard</Link>
          <Link to="/siswa/peminjaman" style={{...styles.navLink, ...styles.navLinkActive}}>Peminjaman</Link>
          <Link to="/siswa/riwayat" style={styles.navLink}>Riwayat</Link>
          <Link to="/siswa/profil" style={styles.navLink}>Profil</Link>
          <Link to="/siswa/pengembalian" style={styles.navLink}>Pengembalian</Link>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <span>{user?.full_name || 'User'}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Container */}
      <div style={styles.container}>
        {/* Form Card */}
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Ajukan Peminjaman Buku</h2>
          
          {submitError && (
            <div style={styles.errorBox}>{submitError}</div>
          )}

          {booksError && (
            <div style={styles.errorBox}>{booksError}</div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Nama Siswa */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Nama Siswa</label>
              <input
                type="text"
                style={{...styles.input, ...styles.inputDisabled}}
                value={user?.full_name || ''}
                disabled
              />
            </div>

            {/* NIS */}
            <div style={styles.formGroup}>
              <label style={styles.label}>NIS</label>
              <input
                type="text"
                style={{...styles.input, ...styles.inputDisabled}}
                value={user?.nis || ''}
                disabled
              />
            </div>

            {/* Pilih Buku */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Pilih Buku</label>
              <select
                name="book_id"
                style={styles.input}
                value={formData.book_id}
                onChange={handleChange}
                required
              >
                <option value="">-- Pilih buku --</option>
                {books.map(book => (
                  <option key={book.book_id} value={book.book_id}>
                    {book.title} (oleh {book.author || 'Penulis tidak diketahui'})
                  </option>
                ))}
              </select>
            </div>

            {/* Tanggal Pinjam */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Tanggal Meminjam</label>
              <input
                type="date"
                name="loan_date"
                style={styles.input}
                value={formData.loan_date}
                onChange={handleChange}
                required
              />
            </div>

            {/* Tanggal Kembali */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Tanggal Mengembalikan</label>
              <input
                type="date"
                name="return_date"
                style={styles.input}
                value={formData.return_date}
                onChange={handleChange}
                required
              />
            </div>

            {/* Tombol Aksi */}
            <div style={styles.buttonGroup}>
              <button 
                type="submit" 
                style={styles.btnSimpan}
                disabled={submitting}
              >
                {submitting ? 'Memproses...' : 'SIMPAN'}
              </button>
              <button 
                type="button" 
                onClick={handleKembali} 
                style={styles.btnKembali}
              >
                KEMBALI
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

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
  navbarBrand: {
    fontSize: '1.5em',
    fontWeight: '700',
  },
  navbarMenu: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
  },
  navLinkActive: {
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
    fontSize: '14px',
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
  errorBox: {
    background: '#f8d7da',
    color: '#721c24',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #f5c6cb',
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
    background: '#f5f7fa',
    color: '#777',
    cursor: 'not-allowed',
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
  },
  loading: {
    padding: '40px 20px',
    textAlign: 'center',
    color: '#6b7280',
  },
};

export default PeminjamanBuku;