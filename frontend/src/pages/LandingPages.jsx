// src/pages/LandingPage.jsx
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div style={styles.landingContainer}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>📚 Perpustakaan Digital</h1>
          <p style={styles.headerSubtitle}>Sistem Informasi Perpustakaan Sekolah</p>
        </div>

        <div style={styles.content}>
          <div style={styles.welcomeText}>
            <h2 style={styles.welcomeTitle}>Selamat Datang</h2>
            <p style={styles.welcomeDesc}>
              Kelola peminjaman dan pengembalian buku dengan mudah, akses katalog 
              kapan saja, dan nikmati layanan perpustakaan digital yang efisien.
            </p>
          </div>

          <div style={styles.buttonGroup}>
            <Link to="/login" style={{...styles.btn, ...styles.btnPrimary}}>
              Masuk
            </Link>
            <Link to="/register" style={{...styles.btn, ...styles.btnSecondary}}>
              Daftar
            </Link>
          </div>

          <div style={styles.features}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📖</div>
              <h3 style={styles.featureTitle}>Katalog Digital</h3>
              <p style={styles.featureDesc}>Akses koleksi buku secara real-time</p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>⚡</div>
              <h3 style={styles.featureTitle}>Proses Cepat</h3>
              <p style={styles.featureDesc}>Peminjaman dan pengembalian otomatis</p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📊</div>
              <h3 style={styles.featureTitle}>Riwayat Lengkap</h3>
              <p style={styles.featureDesc}>Pantau aktivitas peminjaman Anda</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  landingContainer: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  container: {
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    overflow: 'hidden',
    maxWidth: '900px',
    width: '100%',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px',
    textAlign: 'center',
    color: 'white',
  },
  headerTitle: {
    fontSize: '2.5em',
    marginBottom: '10px',
    margin: 0,
  },
  headerSubtitle: {
    fontSize: '1.1em',
    opacity: 0.9,
    margin: '10px 0 0 0',
  },
  content: {
    padding: '60px 40px',
    textAlign: 'center',
  },
  welcomeText: {
    marginBottom: '40px',
  },
  welcomeTitle: {
    color: '#333',
    fontSize: '2em',
    marginBottom: '15px',
  },
  welcomeDesc: {
    color: '#666',
    fontSize: '1.1em',
    lineHeight: '1.6',
  },
  buttonGroup: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  btn: {
    padding: '15px 50px',
    fontSize: '1.1em',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  btnSecondary: {
    background: 'white',
    color: '#667eea',
    border: '2px solid #667eea',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '30px',
    marginTop: '50px',
    padding: '0 20px',
  },
  featureCard: {
    padding: '20px',
    textAlign: 'center',
  },
  featureIcon: {
    fontSize: '3em',
    marginBottom: '15px',
  },
  featureTitle: {
    color: '#333',
    marginBottom: '10px',
  },
  featureDesc: {
    color: '#666',
    fontSize: '0.9em',
  },
};

export default LandingPage;