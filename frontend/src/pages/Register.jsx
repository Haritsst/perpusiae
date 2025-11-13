// src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: '',
    nis: '',
    email: '',
    no_hp: '',
    kelas: '',
    jurusan: '',
    alamat: '',
    password: '',
    confirm_password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      alert('Password tidak cocok!');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password minimal 6 karakter!');
      return;
    }

    // TODO: Kirim ke API backend
    console.log('Data registrasi:', formData);
    alert('Pendaftaran berhasil! Silakan login.');
    navigate('/login');
  };

  return (
    <div style={styles.registerPage}>
      <div style={styles.registerContainer}>
        <div style={styles.registerHeader}>
          <h1 style={styles.headerTitle}>📝 Daftar Akun Siswa</h1>
          <p style={styles.headerSubtitle}>Lengkapi data diri untuk membuat akun</p>
        </div>

        <form style={styles.registerForm} onSubmit={handleSubmit}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nama Lengkap <span style={styles.required}>*</span></label>
              <input
                style={styles.input}
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Nama lengkap"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>NIS <span style={styles.required}>*</span></label>
              <input
                style={styles.input}
                type="text"
                name="nis"
                value={formData.nis}
                onChange={handleChange}
                placeholder="Nomor Induk Siswa"
                required
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email <span style={styles.required}>*</span></label>
              <input
                style={styles.input}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>No. HP <span style={styles.required}>*</span></label>
              <input
                style={styles.input}
                type="tel"
                name="no_hp"
                value={formData.no_hp}
                onChange={handleChange}
                placeholder="08xxxxxxxxxx"
                required
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Kelas <span style={styles.required}>*</span></label>
              <select
                style={styles.input}
                name="kelas"
                value={formData.kelas}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Kelas</option>
                <option value="X">X</option>
                <option value="XI">XI</option>
                <option value="XII">XII</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Jurusan</label>
              <select
                style={styles.input}
                name="jurusan"
                value={formData.jurusan}
                onChange={handleChange}
              >
                <option value="">Pilih Jurusan</option>
                <option value="IPA">IPA</option>
                <option value="IPS">IPS</option>
                <option value="Bahasa">Bahasa</option>
              </select>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Alamat</label>
            <textarea
              style={{...styles.input, minHeight: '80px', resize: 'vertical'}}
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              placeholder="Alamat lengkap"
            />
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Password <span style={styles.required}>*</span></label>
              <input
                style={styles.input}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Konfirmasi Password <span style={styles.required}>*</span></label>
              <input
                style={styles.input}
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="Ulangi password"
                required
              />
            </div>
          </div>

          <button type="submit" style={styles.btnRegister}>
            Daftar
          </button>

          <div style={styles.loginLink}>
            Sudah punya akun? <Link to="/login" style={styles.link}>Login di sini</Link>
          </div>

          <div style={styles.backLink}>
            <Link to="/" style={styles.backLinkText}>← Kembali ke halaman utama</Link>
          </div>
        </form>
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

const styles = {
  registerPage: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  registerContainer: {
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    overflow: 'hidden',
    maxWidth: '600px',
    width: '100%',
    margin: '20px 0',
  },
  registerHeader: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '30px',
    textAlign: 'center',
    color: 'white',
  },
  headerTitle: {
    fontSize: '2em',
    margin: '0 0 10px 0',
  },
  headerSubtitle: {
    margin: 0,
  },
  registerForm: {
    padding: '40px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '20px',
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
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '1em',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  required: {
    color: '#c33',
  },
  btnRegister: {
    width: '100%',
    padding: '15px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1.1em',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
  },
  loginLink: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#666',
  },
  link: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
  },
  backLink: {
    textAlign: 'center',
    marginTop: '15px',
  },
  backLinkText: {
    color: '#999',
    textDecoration: 'none',
    fontSize: '0.9em',
  },
};

export default Register;