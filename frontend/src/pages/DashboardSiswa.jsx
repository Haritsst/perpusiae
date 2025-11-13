// src/pages/DashboardSiswa.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

function DashboardSiswa() {
  const navigate = useNavigate();
  const [user] = useState({ name: 'John Siswa' });
  const [stats] = useState({
    borrowed: 3,
    total: 15,
    pending: 1,
    fine: 0
  });
  const [activities] = useState([
    {
      id: 1,
      title: 'Laskar Pelangi - Andrea Hirata',
      borrowDate: '5 Nov 2025',
      returnDate: '12 Nov 2025',
      status: 'approved'
    },
    {
      id: 2,
      title: 'Bumi Manusia - Pramoedya Ananta Toer',
      borrowDate: '1 Nov 2025',
      returnDate: '8 Nov 2025',
      status: 'pending'
    },
    {
      id: 3,
      title: 'Negeri 5 Menara - Ahmad Fuadi',
      borrowDate: '25 Okt 2025',
      returnDate: '1 Nov 2025',
      status: 'returned'
    }
  ]);

  const [formData, setFormData] = useState({
    bukuId: '', // Tadinya '1'
    tanggalPinjam: '', // Tadinya '2025-06-15'
    tanggalKembali: '', // Tadinya '2025-06-18'
  });

  const handleLogout = () => {
    navigate('/');
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { bg: '#fff3cd', color: '#856404', text: 'Pending' },
      approved: { bg: '#d4edda', color: '#155724', text: 'Dipinjam' },
      returned: { bg: '#d1ecf1', color: '#0c5460', text: 'Dikembalikan' }
    };
    
    const s = config[status] || config.pending;
    return (
      <span style={{
        padding: '5px 15px',
        borderRadius: '20px',
        fontSize: '0.85em',
        fontWeight: '600',
        background: s.bg,
        color: s.color
      }}>
        {s.text}
      </span>
    );
  };

  return (
    <div style={styles.dashboardPage}>
      <nav style={styles.navbar}>
        <div style={styles.navbarBrand}>📚 Perpustakaan Digital</div>
        <div style={styles.navbarMenu}>
          <Link to="/dashboard-siswa" style={styles.navLink}>Dashboard</Link>
          <Link to="/siswa/peminjaman" style={styles.navLink}>Peminjaman</Link>
          <Link to="/siswa/riwayat" style={styles.navLink}>Riwayat</Link>
          <Link to="/siswa/profil" style={styles.navLink}>Profil</Link>
          <Link to="/siswa/riwayat" style={styles.navLink}>Riwayat</Link>
          <Link to="/siswa/pengembalian" style={styles.navLink}>Pengembalian</Link>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>
              {user.name?.charAt(0) || 'U'}
            </div>
            <span>{user.name}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div style={styles.container}>
        <div style={styles.welcomeCard}>
          <h1 style={styles.welcomeTitle}>Selamat Datang, {user.name}! 👋</h1>
          <p style={styles.welcomeDesc}>Kelola peminjaman buku dan akses layanan perpustakaan dengan mudah</p>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📚</div>
            <div style={styles.statTitle}>Buku Dipinjam</div>
            <div style={styles.statValue}>{stats.borrowed}</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>✅</div>
            <div style={styles.statTitle}>Total Peminjaman</div>
            <div style={styles.statValue}>{stats.total}</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>⏰</div>
            <div style={styles.statTitle}>Sedang Pending</div>
            <div style={styles.statValue}>{stats.pending}</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>💰</div>
            <div style={styles.statTitle}>Total Denda</div>
            <div style={styles.statValue}>Rp {stats.fine.toLocaleString()}</div>
          </div>
        </div>

        <div style={styles.quickActions}>
          <h2 style={styles.sectionTitle}>Menu Cepat</h2>
          <div style={styles.actionButtons}>
            <button 
              style={styles.actionBtn}
              onClick={() => navigate('/siswa/peminjaman')}
            >
              <span>📖</span>
              <span>Pinjam Buku</span>
            </button>
            <button 
              style={styles.actionBtn}
              onClick={() => navigate('/siswa/pengembalian')} // <-- Navigasi
            >
              <span>↩️</span>
              <span>Kembalikan Buku</span>
            </button>
            <button 
              style={styles.actionBtn}
              onClick={() => navigate('/siswa/profil')} // <-- Navigasi
            >
              <span>👤</span>
              <span>Ubah Profil</span>
            </button>
          </div>
        </div>

        <div style={styles.recentActivity}>
          <h2 style={styles.sectionTitle}>Aktivitas Terbaru</h2>
          <ul style={styles.activityList}>
            {activities.map(activity => (
              <li key={activity.id} style={styles.activityItem}>
                <div style={styles.activityInfo}>
                  <h4 style={styles.activityTitle}>{activity.title}</h4>
                  <p style={styles.activityDate}>
                    Dipinjam: {activity.borrowDate} | 
                    {activity.status === 'returned' ? ' Dikembalikan' : ' Kembali'}: {activity.returnDate}
                  </p>
                </div>
                {getStatusBadge(activity.status)}
              </li>
            ))}
          </ul>
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

const styles = {
  dashboardPage: {
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
  welcomeCard: {
    background: 'white',
    borderRadius: '15px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  welcomeTitle: {
    color: '#333',
    margin: '0 0 10px 0',
  },
  welcomeDesc: {
    color: '#666',
    margin: 0,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    background: 'white',
    borderRadius: '15px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  statIcon: {
    fontSize: '2.5em',
    marginBottom: '15px',
  },
  statTitle: {
    color: '#666',
    fontSize: '0.9em',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '2em',
    fontWeight: '700',
    color: '#333',
  },
  quickActions: {
    background: 'white',
    borderRadius: '15px',
    padding: '30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    marginBottom: '30px',
  },
  sectionTitle: {
    color: '#333',
    marginBottom: '20px',
  },
  actionButtons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
  },
  actionBtn: {
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1em',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  recentActivity: {
    background: 'white',
    borderRadius: '15px',
    padding: '30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  activityList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  activityItem: {
    padding: '15px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityInfo: {},
  activityTitle: {
    color: '#333',
    margin: '0 0 5px 0',
  },
  activityDate: {
    color: '#999',
    fontSize: '0.9em',
    margin: 0,
  },
};

export default DashboardSiswa;