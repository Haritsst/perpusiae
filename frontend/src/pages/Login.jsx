// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Email dan password harus diisi!');
      return;
    }

    try {
      // TODO: Ganti dengan API call ke backend Anda
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      // const data = await response.json();

      // Demo: Langsung redirect
      console.log('Login dengan:', formData);
      
      // Simulasi login
      if (formData.email.includes('admin')) {
        navigate('/dashboard-admin');
      } else {
        navigate('/dashboard-siswa');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  return (
    <div style={styles.loginPage}>
      <div style={styles.loginContainer}>
        <div style={styles.loginHeader}>
          <h1 style={styles.headerTitle}>📚 Login Siswa</h1>
          <p style={styles.headerSubtitle}>Masuk ke akun perpustakaan Anda</p>
        </div>

        <form style={styles.loginForm} onSubmit={handleSubmit}>
          {error && (
            <div style={styles.alertError}>
              {error}
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Email atau NIS</label>
            <input
              style={styles.input}
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email atau NIS"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan password"
              required
            />
          </div>

          <div style={styles.forgotPassword}>
            <a href="#" style={styles.forgotLink} onClick={(e) => {
              e.preventDefault();
              alert('Hubungi admin untuk reset password');
            }}>
              Lupa password?
            </a>
          </div>

          <button type="submit" style={styles.btnLogin}>
            Masuk
          </button>

          <div style={styles.registerLink}>
            Belum punya akun? <Link to="/register" style={styles.link}>Daftar sekarang</Link>
          </div>

          <div style={styles.backLink}>
            <Link to="/" style={styles.backLinkText}>← Kembali ke halaman utama</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  loginPage: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  loginContainer: {
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    overflow: 'hidden',
    maxWidth: '450px',
    width: '100%',
  },
  loginHeader: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px',
    textAlign: 'center',
    color: 'white',
  },
  headerTitle: {
    fontSize: '2em',
    margin: '0 0 10px 0',
  },
  headerSubtitle: {
    margin: 0,
    opacity: 0.9,
  },
  loginForm: {
    padding: '40px',
  },
  formGroup: {
    marginBottom: '25px',
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
  },
  forgotPassword: {
    textAlign: 'right',
    marginBottom: '20px',
  },
  forgotLink: {
    color: '#667eea',
    textDecoration: 'none',
    fontSize: '0.9em',
  },
  btnLogin: {
    width: '100%',
    padding: '15px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1.1em',
    fontWeight: '600',
    cursor: 'pointer',
  },
  registerLink: {
    textAlign: 'center',
    marginTop: '25px',
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
  alertError: {
    padding: '12px 15px',
    borderRadius: '8px',
    marginBottom: '20px',
    background: '#fee',
    color: '#c33',
    borderLeft: '4px solid #c33',
  },
};

export default Login;