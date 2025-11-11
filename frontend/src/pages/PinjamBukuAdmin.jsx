import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PinjamBukuAdmin() {
  const navigate = useNavigate();

  // State untuk filter
  const [filters, setFilters] = useState({
    judul: '',
    nama: '',
    status: 'Semua Status'
  });

  // Data dummy peminjaman (diperbarui dengan data detail)
  const [peminjamanList, setPeminjamanList] = useState([
    { id: 1, nomor: 'PEMINJAMAN-BUKU/20250522/0627', nama: 'Komang Diah', judul: 'Laskar Pelangi', pengarang: 'Andrea Hirata', tahun: 2005, tglPinjam: '2025-05-22', tglKembali: '2025-05-29', keterangan: 'mohon dikembalikan sesuai tanggal', denda: '0.00', status: 'ACC' },
    { id: 2, nomor: 'PEMINJAMAN-BUKU/20250614/0057', nama: 'Harris Caine', judul: 'Putri Salju dan 7 Kurcaci', pengarang: 'Grimms', tahun: 2010, tglPinjam: '2025-06-14', tglKembali: '2025-06-21', keterangan: 'lambat sehari dikembalikan', denda: '0.00', status: 'Dikembalikan' },
    { id: 3, nomor: 'PEMINJAMAN-BUKU/20250615/0627', nama: 'Harris Caine', judul: 'Nabi Muhammad Sang Pengasih', pengarang: 'Nurmaningsih', tahun: 2017, tglPinjam: '2025-06-15', tglKembali: '2025-06-18', keterangan: 'Menunggu Persetujuan Admin', denda: '0.00', status: 'PENDING' },
  ]);

  // --- STATE UNTUK 3 MODAL ---
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHapusModal, setShowHapusModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // State untuk form modal edit
  const [editFormData, setEditFormData] = useState({
    status: '',
    denda: 0,
    keterangan: ''
  });
  
  // State untuk item yang sedang dipilih (dipakai oleh 3 modal)
  const [currentItem, setCurrentItem] = useState(null);

  // --- Filter Handlers ---
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  const handleSearch = () => {
    console.log('Mencari dengan filter:', filters);
  };

  // --- Edit Modal Handlers ---
  const openEditModal = (item) => {
    setCurrentItem(item);
    setEditFormData({
      status: item.status,
      denda: item.denda || 0,
      keterangan: item.keterangan
    });
    setShowEditModal(true);
  };
  const closeEditModal = () => setShowEditModal(false);
  const handleEditFormChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = (e) => {
    e.preventDefault();
    console.log('Update Peminjaman:', currentItem.id, editFormData);
    setPeminjamanList(peminjamanList.map(item => 
      item.id === currentItem.id ? { ...item, ...editFormData } : item
    ));
    closeEditModal();
  };

  // --- Hapus Modal Handlers ---
  const openHapusModal = (item) => {
    setCurrentItem(item);
    setShowHapusModal(true);
  };
  const closeHapusModal = () => setShowHapusModal(false);
  const handleHapusConfirm = () => {
    console.log('Hapus Peminjaman:', currentItem.id);
    setPeminjamanList(peminjamanList.filter(item => item.id !== currentItem.id));
    closeHapusModal();
  };
  
  // --- Detail Modal Handlers ---
  const openDetailModal = (item) => {
    setCurrentItem(item); 
    setShowDetailModal(true); 
  };
  const closeDetailModal = () => setShowDetailModal(false);

  // --- Status Badge ---
  const getStatusBadge = (status) => {
    let style;
    if (status === 'PENDING') {
      style = styles.statusPending;
    } else if (status === 'ACC') {
      style = styles.statusApproved;
    } else {
      style = styles.statusReturned;
    }
    return <span style={style}>{status}</span>;
  };


  return (
    <>
      {/* 1. Top Bar */}
      <div style={styles.topBar}>
        <h1 style={styles.pageTitle}>Peminjaman Buku</h1>
        <div style={styles.adminInfo}>
          <div>
            <div style={styles.adminName}>Admin Perpustakaan</div>
            <div style={styles.adminEmail}>admin@sekolah.com</div>
          </div>
          <div style={styles.adminAvatar}>AP</div>
        </div>
      </div>

      {/* 2. Card Konten Utama */}
      <div style={styles.card}>
        {/* 3. Filter Bar */}
        <div style={styles.filterContainer}>
          <input
            type="text" name="judul"
            placeholder="Cari judul buku..."
            style={styles.inputFilter}
            value={filters.judul}
            onChange={handleFilterChange}
          />
          <input
            type="text" name="nama"
            placeholder="Cari nama peminjam..."
            style={styles.inputFilter}
            value={filters.nama}
            onChange={handleFilterChange}
          />
          <select
            name="status"
            style={styles.inputFilter}
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option>Semua Status</option>
            <option value="PENDING">Pending</option>
            <option value="ACC">ACC</option>
            <option value="Dikembalikan">Dikembalikan</option>
          </select>
          <button onClick={handleSearch} style={styles.btnCari}>
            Cari
          </button>
        </div>

        {/* 4. Tabel Peminjaman */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>NOMOR PEMINJAMAN</th>
                <th style={styles.th}>NAMA PEMINJAM</th>
                <th style={styles.th}>JUDUL BUKU</th>
                <th style={styles.th}>KETERANGAN</th>
                <th style={styles.th}>STATUS</th>
                <th style={styles.th}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {peminjamanList.map(item => (
                <tr key={item.id}>
                  <td style={styles.td}>{item.nomor}</td>
                  <td style={styles.td}>{item.nama}</td>
                  <td style={styles.td}>{item.judul}</td>
                  <td style={styles.td}>{item.keterangan}</td>
                  <td style={styles.td}>{getStatusBadge(item.status)}</td>
                  <td style={styles.tdAction}>
                    <button onClick={() => openEditModal(item)} style={styles.btnEdit}>Edit</button>
                    <button onClick={() => openHapusModal(item)} style={styles.btnHapus}>Hapus</button>
                    <button onClick={() => openDetailModal(item)} style={styles.btnDetail}>Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Modal Edit Status */}
      {showEditModal && (
        <div style={styles.modalOverlay} onClick={closeEditModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Edit Status Peminjaman Buku</h3>
            <form onSubmit={handleEditSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <select 
                  name="status" 
                  style={styles.input} 
                  value={editFormData.status} 
                  onChange={handleEditFormChange}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="ACC">ACC (Dipinjam)</option>
                  <option value="Dikembalikan">Dikembalikan</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Jumlah Denda (Masukan 0 jika tidak ada)</label>
                <input 
                  type="number" name="denda"
                  style={styles.input}
                  value={editFormData.denda}
                  onChange={handleEditFormChange}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Keterangan</label>
                <input 
                  type="text" name="keterangan"
                  style={styles.input}
                  value={editFormData.keterangan}
                  onChange={handleEditFormChange}
                />
              </div>
              <div style={styles.modalActions}>
                <button type="button" onClick={closeEditModal} style={styles.btnBatal}>KEMBALI</button>
                <button type="submit" style={styles.btnSimpan}>SIMPAN</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Modal Konfirmasi Hapus */}
      {showHapusModal && (
        <div style={styles.modalOverlay} onClick={closeHapusModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Konfirmasi Hapus</h3>
            <p style={styles.modalText}>
              Apakah Anda yakin ingin menghapus data peminjaman ini?
            </p>
            <p style={styles.modalBookTitle}>{currentItem?.nomor}</p>
            <div style={styles.modalActions}>
              <button onClick={closeHapusModal} style={styles.btnBatal}>BATAL</button>
              <button onClick={handleHapusConfirm} style={styles.btnHapusConfirm}>HAPUS</button>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL DETAIL */}
      {showDetailModal && currentItem && (
        <div style={styles.modalOverlay} onClick={closeDetailModal}>
          <div style={{...styles.modalContent, maxWidth: '600px'}} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Detail Pinjaman Buku</h3>
            
            <div style={styles.detailList}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>NOMOR PEMINJAMAN</span>
                <span style={styles.detailValue}>{currentItem.nomor}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>PEMINJAM</span>
                <span style={styles.detailValue}>{currentItem.nama}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>JUDUL BUKU</span>
                <span style={styles.detailValue}>{currentItem.judul}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>PENGARANG</span>
                <span style={styles.detailValue}>{currentItem.pengarang}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>TAHUN TERBIT</span>
                <span style={styles.detailValue}>{currentItem.tahun}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>TANGGAL PINJAM</span>
                <span style={styles.detailValue}>{currentItem.tglPinjam}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>TANGGAL KEMBALI</span>
                <span style={styles.detailValue}>{currentItem.tglKembali}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>STATUS</span>
                <span style={styles.detailValue}>{currentItem.status}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>KETERANGAN</span>
                <span style={styles.detailValue}>{currentItem.keterangan}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>DENDA</span>
                <span style={styles.detailValue}>Rp {currentItem.denda}</span>
              </div>
            </div>

            <div style={styles.modalActions}>
              <button onClick={closeDetailModal} style={styles.btnBatal}>
                KEMBALI
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
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
  
  // Filter
  filterContainer: {
    display: 'flex', justifyContent: 'flex-start',
    gap: '10px', alignItems: 'center', marginBottom: '25px',
  },
  inputFilter: {
    padding: '10px 15px', border: '1px solid #ddd',
    borderRadius: '8px', fontSize: '0.9em',
  },
  btnCari: {
    padding: '10px 20px', background: '#667eea', color: 'white',
    border: 'none', borderRadius: '8px', fontSize: '0.9em',
    fontWeight: '600', cursor: 'pointer',
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
  
  // Aksi
  tdAction: {
    padding: '12px 15px', borderBottom: '1px solid #f0f0f0',
    display: 'flex', gap: '10px',
  },
  btnEdit: {
    background: 'none', border: 'none', color: '#667eea',
    fontWeight: '600', cursor: 'pointer', padding: 0,
  },
  btnHapus: {
    background: 'none', border: 'none', color: '#E53E3E',
    fontWeight: '600', cursor: 'pointer', padding: 0,
  },
  btnDetail: {
    background: 'none', border: 'none', color: '#6c757d',
    fontWeight: '600', cursor: 'pointer', padding: 0,
  },
  
  // Badge Status
  statusPending: {
    padding: '5px 12px', borderRadius: '20px', fontSize: '0.8em',
    fontWeight: '600', background: '#fff3cd', color: '#856404',
  },
  statusApproved: {
    padding: '5px 12px', borderRadius: '20px', fontSize: '0.8em',
    fontWeight: '600', background: '#d4edda', color: '#155724',
  },
  statusReturned: {
    padding: '5px 12px', borderRadius: '20px', fontSize: '0.8em',
    fontWeight: '600', background: '#d1ecf1', color: '#0c5460',
  },

  // Modal
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 1000,
  },
  modalContent: {
    background: 'white', padding: '25px 30px', borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)', maxWidth: '500px', width: '100%',
  },
  modalTitle: { color: '#333', margin: '0 0 20px 0' },
  modalText: { color: '#555', fontSize: '1em' },
  modalBookTitle: {
    fontWeight: 600, color: '#333', background: '#f8f9fa',
    padding: '10px', borderRadius: '8px', marginTop: '15px',
  },
  modalActions: {
    display: 'flex', justifyContent: 'flex-end',
    gap: '10px', marginTop: '25px',
  },
  btnBatal: {
    padding: '10px 18px', background: '#6c757d', color: 'white',
    border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer',
  },
  btnHapusConfirm: {
    padding: '10px 18px', background: '#E53E3E', color: 'white',
    border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer',
  },
  btnSimpan: {
    padding: '10px 18px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white', border: 'none', borderRadius: '8px',
    fontWeight: '600', cursor: 'pointer',
  },
  
  // Form
  formGroup: { marginBottom: '15px' },
  label: {
    display: 'block', marginBottom: '8px',
    color: '#333', fontWeight: '600',
  },
  input: {
    width: '100%', padding: '12px 15px', border: '1px solid #ddd',
    borderRadius: '8px', fontSize: '1em', boxSizing: 'border-box',
    background: '#f8f9fa', color: '#333',
  },

  // Modal Detail
  detailList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px', 
  },
  detailItem: {
    display: 'flex',
    padding: '10px 12px',
    background: '#f8f9fa', 
    borderBottom: '1px solid #eee',
  },
  detailLabel: {
    color: '#666',
    fontWeight: '600',
    width: '180px', 
    textTransform: 'uppercase',
    fontSize: '0.8em',
  },
  detailValue: {
    color: '#333',
    fontWeight: '500',
    flex: 1, 
    fontSize: '0.9em',
  },
};

export default PinjamBukuAdmin;