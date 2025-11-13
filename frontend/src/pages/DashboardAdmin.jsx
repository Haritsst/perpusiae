import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';


function DashboardAdmin() {
  // State Anda (stats, recentBorrows) tetap di sini
  const [stats] = useState({
    totalBooks: 450,
    totalMembers: 150,
    borrowed: 45,
    pending: 8
  });
  const [recentBorrows] = useState([
    { id: 1, borrower: 'Ahmad Fauzi', book: 'Laskar Pelangi', date: '11 Nov 2025', status: 'pending' },
    { id: 2, borrower: 'Siti Nurhaliza', book: 'Bumi Manusia', date: '10 Nov 2025', status: 'approved' },
    { id: 3, borrower: 'Budi Santoso', book: 'Negeri 5 Menara', date: '10 Nov 2025', status: 'approved' },
    { id: 4, borrower: 'Rina Wijaya', book: 'Sang Pemimpi', date: '9 Nov 2025', status: 'pending' },
  ]);

  return (
    // Gunakan React Fragment (<>) sebagai pembungkus
    <> 
        <div style={styles.topBar}>
          <h1 style={styles.pageTitle}>Dashboard Admin</h1>
          <div style={styles.adminInfo}>
            <div>
              <div style={styles.adminName}>Admin Perpustakaan</div>
              <div style={styles.adminEmail}>admin@sekolah.com</div>
            </div>
            <div style={styles.adminAvatar}>AP</div>
          </div>
        </div>

      {/* Hapus 1 baris <div style={styles.statsGrid}> yang duplikat */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📚</div>
            <div style={styles.statTitle}>Total Buku</div>
            <div style={styles.statValue}>{stats.totalBooks}</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>👥</div>
            <div style={styles.statTitle}>Total Anggota</div>
            <div style={styles.statValue}>{stats.totalMembers}</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>📖</div>
            <div style={styles.statTitle}>Sedang Dipinjam</div>
            <div style={styles.statValue}>{stats.borrowed}</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>⏰</div>
            <div style={styles.statTitle}>Pending Approval</div>
            <div style={styles.statValue}>{stats.pending}</div>
          </div>
        </div>

        <div style={styles.cardsRow}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Peminjaman Terbaru</h2>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Peminjam</th>
                    <th style={styles.th}>Judul Buku</th>
                    <th style={styles.th}>Tanggal</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBorrows.map(item => (
                    <tr key={item.id}>
                      <td style={styles.td}>{item.borrower}</td>
                      <td style={styles.td}>{item.book}</td>
                      <td style={styles.td}>{item.date}</td>
                      <td style={styles.td}>
                        <span style={item.status === 'pending' ? styles.statusPending : styles.statusApproved}>
                          {item.status === 'pending' ? 'Pending' : 'Approved'}
                        </span>
                      </td>
                    </tr>
                  ))}
                 </tbody>
    _         </table>
      _     </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Menu Cepat</h2>
            <ul style={styles.quickLinks}>
              <li><Link to="/admin/tambah-buku" style={styles.quickLink}>➕ Tambah Buku</Link></li>
              <li><Link to="/admin/pinjam-buku" style={styles.quickLink}>✅ Approve Peminjaman</Link></li>
              <li><Link to="/admin/laporan" style={styles.quickLink}>📊 Cetak Laporan</Link></li>
              <li><Link to="/admin/settings" style={styles.quickLink}>⚙️ Pengaturan Sistem</Link></li>
            </ul>
          </div>
        </div>

    {/* Hapus tag </main> dan </div> dari sini */}
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

// Sisakan HANYA style yang digunakan di atas.
const styles = {
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    background: 'white',
    borderRadius: '15px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    borderLeft: '5px solid #667eea',
  },
  statIcon: {
    fontSize: '2em',
    marginBottom: '10px',
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
  cardsRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '20px',
  },
  card: {
    background: 'white',
    borderRadius: '15px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  cardTitle: {
    color: '#333',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '2px solid #f0f0f0',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    background: '#f8f9fa',
    padding: '12px',
    textAlign: 'left',
    color: '#666',
    fontWeight: '600',
    fontSize: '0.9em',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #f0f0f0',
    color: '#333',
  },
  statusPending: {
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '0.8em',
    fontWeight: '600',
    background: '#fff3cd',
    color: '#856404',
  },
  statusApproved: {
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '0.8em',
    fontWeight: '600',
    background: '#d4edda',
    color: '#155724',
  },
  quickLinks: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  quickLink: {
    display: 'block',
    padding: '12px',
    background: '#f8f9fa',
    borderRadius: '10px',
    textDecoration: 'none',
    color: '#333',
    marginBottom: '15px',
  },
};

export default DashboardAdmin;