import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function LaporanPeminjaman() {
  const navigate = useNavigate();

  // State untuk filter tanggal
  const [dates, setDates] = useState({
    mulai: '2025-06-15',
    sampai: '2025-07-12'
  });

  // Data dummy laporan
  const [laporanList, setLaporanList] = useState([
    { id: 1, nomor: 'PEMINJAMAN-BUKU/20250614/0057', nama: 'Harris Caine', judul: 'Putri Salju dan 7 Kurcaci', tglPinjam: '14 Jun 2025', tglKembali: '21 Jun 2025', status: 'Dikembalikan', denda: '0.00' },
    { id: 2, nomor: 'PEMINJAMAN-BUKU/20250615/0627', nama: 'Harris Caine', judul: 'Nabi Muhammad Sang Pengasih', tglPinjam: '15 Jun 2025', tglKembali: '18 Jun 2025', status: 'Dipinjam', denda: '0.00' },
    { id: 3, nomor: 'PEMINJAMAN-BUKU/20250615/0319', nama: 'Harris Caine', judul: 'Where the Wild Things Are', tglPinjam: '15 Jun 2025', tglKembali: '25 Jun 2025', status: 'Dipinjam', denda: '0.00' },
    { id: 4, nomor: 'PEMINJAMAN-BUKU/20250615/4123', nama: 'Harris Caine', judul: 'Gadis Kecil Penjual Korek Api', tglPinjam: '20 Jun 2025', tglKembali: '02 Jul 2025', status: 'Dipinjam', denda: '0.00' },
  ]);

  // Handler untuk mengubah state tanggal
  const handleDateChange = (e) => {
    setDates({
      ...dates,
      [e.target.name]: e.target.value
    });
  };

  // Fungsi ini (handleCetak) sudah benar
  const handleCetak = () => {
    // TODO: Filter 'laporanList' berdasarkan 'dates'
    const filteredData = laporanList; 

    navigate('/admin/laporan/cetak', { 
      state: { 
        filteredData: filteredData, 
        dates: dates 
      } 
    });
  };

  // --- Status Badge ---
  const getStatusBadge = (status) => {
    const style = status === 'Dipinjam' ? styles.statusDipinjam : styles.statusDikembalikan;
    return <span style={style}>{status}</span>;
  };

  return (
    <>
      {/* 1. Top Bar */}
      <div style={styles.topBar}>
        <h1 style={styles.pageTitle}>Laporan Peminjaman</h1>
        <div style={styles.adminInfo}>
          <div>
            <div style={styles.adminName}>Admin Perpustakaan</div>
            <div style={styles.adminEmail}>admin@sekolah.com</div>
          </div>
          <div style={styles.adminAvatar}>AP</div>
        </div>
      </div>

      {/* 2. Card Filter Tanggal */}
      <div style={styles.card}>
        <div style={styles.filterContainer}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Mulai Tanggal</label>
            <input
              type="date"
              name="mulai"
              style={styles.inputDate}
              value={dates.mulai}
              onChange={handleDateChange}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Sampai Tanggal</label>
            <input
              type="date"
              name="sampai"
              style={styles.inputDate}
              value={dates.sampai}
              onChange={handleDateChange}
            />
          </div>
          {/* --- PERBAIKAN DI SINI --- */}
          <button onClick={handleCetak} style={styles.btnCetak}>
            Cetak
          </button>
        </div>
      </div>

      {/* 3. Card Tabel Laporan */}
      <div style={{...styles.card, marginTop: '20px'}}>
        <h3 style={styles.cardTitle}>Peminjaman Terakhir</h3>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>NOMOR PEMINJAMAN</th>
                <th style={styles.th}>NAMA PEMINJAM</th>
                <th style={styles.th}>JUDUL BUKU</th>
                <th style={styles.th}>TANGGAL PINJAM</th>
                <th style={styles.th}>TANGGAL KEMBALI</th>
                <th style={styles.th}>TOTAL DENDA</th>
                <th style={styles.th}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {laporanList.map(item => (
                <tr key={item.id}>
                  <td style={styles.td}>{item.nomor}</td>
                  <td style={styles.td}>{item.nama}</td>
                  <td style={styles.td}>{item.judul}</td>
                  <td style={styles.td}>{item.tglPinjam}</td>
                  <td style={styles.td}>{item.tglKembali}</td>
                  <td style={styles.td}>Rp. {item.denda}</td>
                  <td style={styles.td}>{getStatusBadge(item.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

// Styles
const styles = {
  // Top Bar
  topBar: {
    background: 'white', padding: '20px 30px', borderRadius: '15px',
    marginBottom: '30px', display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  pageTitle: { color: '#333', margin: 0 },
  adminInfo: { display: 'flex', alignItems: 'center', gap: '15px' },
  adminName: { fontWeight: '600' },
  adminEmail: { fontSize: '0.85em', color: '#999' },
  adminAvatar: {
    width: '45px', height: '45px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontWeight: '700',
  },

  // Card
  card: {
    background: 'white', borderRadius: '15px',
    padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  cardTitle: {
    color: '#333',
    margin: '0 0 20px 0',
    paddingBottom: '15px',
    borderBottom: '2px solid #f0f0f0',
  },
  
  // Filter Tanggal
  filterContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    display: 'block', marginBottom: '8px',
    color: '#333', fontWeight: '600', fontSize: '0.9em',
  },
  inputDate: {
    padding: '10px 15px', border: '1px solid #ddd',
    borderRadius: '8px', fontSize: '0.9em',
  },
  btnCetak: {
    padding: '10px 20px', background: '#667eea', color: 'white',
    border: 'none', borderRadius: '8px', fontSize: '0.9em',
    fontWeight: '600', cursor: 'pointer',
    height: '42px',
  },

  // Tabel
  tableContainer: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    background: '#f8f9fa', padding: '12px 15px', textAlign: 'left',
    color: '#666', fontWeight: '600', fontSize: '0.85em',
    textTransform: 'uppercase',
  },
  td: {
    padding: '12px 15px', borderBottom: '1px solid #f0f0f0', color: '#333',
  },
  
  // Badge Status
  statusDikembalikan: {
    padding: '5px 12px', borderRadius: '20px', fontSize: '0.8em',
    fontWeight: '600', background: '#d1ecf1', color: '#0c5460',
  },
    statusDipinjam: {
    padding: '5px 12px', borderRadius: '20px', fontSize: '0.8em',
    fontWeight: '600', background: '#d4edda', color: '#155724',
  },
};

export default LaporanPeminjaman;