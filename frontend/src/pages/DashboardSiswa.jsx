import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

function DashboardSiswa() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    borrowed: 0,
    total: 0,
    pending: 0,
    fine: 0
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Set header authorization
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Fetch user profile dari localStorage dulu (quick load)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // Fetch loan statistics
        try {
          const statsRes = await api.get('/api/loans/stats');
          setStats({
            borrowed: statsRes.data.data?.active_loans || 0,
            total: statsRes.data.data?.total_loans || 0,
            pending: statsRes.data.data?.pending_loans || 0,
            fine: statsRes.data.data?.total_fine || 0
          });
        } catch (statsErr) {
          console.warn('Stats endpoint tidak tersedia:', statsErr.message);
          // Set default jika endpoint belum ready
          setStats({
            borrowed: 0,
            total: 0,
            pending: 0,
            fine: 0
          });
        }

        // Fetch recent activities
        try {
          const activitiesRes = await api.get('/api/loans/recent');
          setActivities(activitiesRes.data.data || []);
        } catch (actErr) {
          console.warn('Activities endpoint tidak tersedia:', actErr.message);
          setActivities([]);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Gagal memuat data dashboard');
        setLoading(false);

        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // Call logout endpoint jika ada
        await api.post('/api/auth/logout');
      }
    } catch (err) {
      console.warn('Logout API error:', err.message);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      api.defaults.headers.common['Authorization'] = '';
      navigate('/');
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { bg: '#fff3cd', color: '#856404', text: 'Pending' },
      approved: { bg: '#d4edda', color: '#155724', text: 'Dipinjam' },
      returned: { bg: '#d1ecf1', color: '#0c5460', text: 'Dikembalikan' },
      overdue: { bg: '#f8d7da', color: '#721c24', text: 'Overdue' }
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

  if (loading) {
    return <div style={styles.loading}>Memuat data...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.dashboardPage}>
      <nav style={styles.navbar}>
        <div style={styles.navbarBrand}>📚 Perpustakaan Digital</div>
        <div style={styles.navbarMenu}>
          <Link to="/dashboard-siswa" style={styles.navLink}>Dashboard</Link>
          <Link to="/siswa/peminjaman" style={styles.navLink}>Peminjaman</Link>
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

      <div style={styles.container}>
        <div style={styles.welcomeCard}>
          <h1 style={styles.welcomeTitle}>Selamat Datang, {user?.full_name}! 👋</h1>
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
            <div style={styles.statValue}>Rp {stats.fine.toLocaleString('id-ID')}</div>
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
              onClick={() => navigate('/siswa/pengembalian')}
            >
              <span>↩️</span>
              <span>Kembalikan Buku</span>
            </button>
            <button 
              style={styles.actionBtn}
              onClick={() => navigate('/siswa/profil')}
            >
              <span>👤</span>
              <span>Ubah Profil</span>
            </button>
          </div>
        </div>

        <div style={styles.recentActivity}>
          <h2 style={styles.sectionTitle}>Aktivitas Terbaru</h2>
          {activities.length > 0 ? (
            <ul style={styles.activityList}>
              {activities.map(activity => (
                <li key={activity.loan_id} style={styles.activityItem}>
                  <div style={styles.activityInfo}>
                    <h4 style={styles.activityTitle}>{activity.book_title}</h4>
                    <p style={styles.activityDate}>
                      Dipinjam: {new Date(activity.loan_date).toLocaleDateString('id-ID')} | 
                      Kembali: {new Date(activity.return_date).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  {getStatusBadge(activity.status)}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#999' }}>Tidak ada aktivitas peminjaman</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ...existing code...
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