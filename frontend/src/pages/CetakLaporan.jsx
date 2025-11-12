import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function CetakLaporan() {
  const location = useLocation();
  const navigate = useNavigate();

  // Ambil data yang dikirim dari halaman laporan
  const { filteredData, dates } = location.state || { filteredData: [], dates: {} };

  // Jika tidak ada data (misal, user refresh halaman cetak),
  // kembalikan ke halaman laporan
  useEffect(() => {
    if (!location.state) {
      alert("Tidak ada data untuk dicetak. Mengarahkan kembali ke laporan.");
      navigate('/admin/laporan');
    }
  }, [location.state, navigate]);

  // Trigger print dialog saat komponen dimuat
  useEffect(() => {
    if (location.state) {
      window.print(); // Buka dialog cetak
      
      // Opsional: kembali ke halaman laporan setelah cetak
      window.onafterprint = () => navigate(-1); // navigate(-1) = kembali
    }
  }, [location.state, navigate]);

  // Fungsi untuk format tanggal (15 Jun 2025)
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00'); // Atasi timezone
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Jika tidak ada data, tampilkan loading
  if (!location.state) {
    return <div>Loading data...</div>;
  }

  return (
    <div style={styles.printPage}>
      <h1 style={styles.title}>SMPN 1 KUTA UTARA</h1>
      <p style={styles.periode}>
        Periode: {formatDate(dates.mulai)} - {formatDate(dates.sampai)}
      </p>
      
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Nomor Peminjaman</th>
            <th style={styles.th}>Nama Peminjam</th>
            <th style={styles.th}>Judul Buku</th>
            <th style={styles.th}>Tanggal Pinjam</th>
            <th style={styles.th}>Tanggal Kembali</th>
            <th style={styles.th}>Total Denda</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(item => (
            <tr key={item.id}>
              <td style={styles.td}>{item.nomor}</td>
              <td style={styles.td}>{item.nama}</td>
              <td style={styles.td}>{item.judul}</td>
              <td style={styles.td}>{item.tglPinjam}</td>
              <td style={styles.td}>{item.tglKembali}</td>
              <td style={styles.td}>Rp. {item.denda}</td>
              <td style={styles.td}>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Styles khusus untuk Halaman Cetak
const styles = {
  printPage: {
    padding: '2rem',
    color: '#000',
    background: '#fff',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    fontSize: '1.5rem',
    margin: 0,
    marginBottom: '5px',
  },
  periode: {
    textAlign: 'center',
    fontSize: '1rem',
    margin: '0 0 2rem 0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    border: '1px solid #999',
    padding: '8px',
    textAlign: 'left',
    fontSize: '0.9rem',
    background: '#f0f0f0',
    fontWeight: 'bold',
  },
  td: {
    border: '1px solid #999',
    padding: '8px',
    fontSize: '0.9rem',
  },
};

export default CetakLaporan;