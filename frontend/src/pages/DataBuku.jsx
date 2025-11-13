import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

function DataBuku() {
  const navigate = useNavigate();

  // State untuk filter pencarian
  const [filter, setFilter] = useState('');
  
  // State untuk modal
  const [showModal, setShowModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null); // Menyimpan buku yg akan dihapus

  // Data dummy buku (nanti ini dari API)
  const [books, setBooks] = useState([
    { id: 1, nama: 'Where the Wild Things Are', penulis: 'Maurice Sendak', tahun: 1963 },
    { id: 2, nama: 'Laskar Pelangi', penulis: 'Andrea Hirata', tahun: 2005 },
    { id: 3, nama: 'Putri Salju dan 7 Kurcaci', penulis: 'Grimms', tahun: 2010 },
    { id: 4, nama: 'Nabi Muhammad Sang Pengasih', penulis: 'Nurmaningsih', tahun: 2017 },
    { id: 5, nama: 'Toto-chan: Gadis Cilik di Jendela', penulis: 'Tetsuko Kuroyanagi', tahun: 1981 },
    { id: 6, nama: 'Gadis Kecil Penjual Korek Api', penulis: 'Hans Christian Andersen', tahun: 1845 },
  ]);

  // Handler untuk tombol "Cari"
  const handleSearch = () => {
    // TODO: Implementasi logika filter data 'books' berdasarkan 'filter'
    console.log('Mencari dengan filter:', filter);
  };

  // Handler untuk membuka modal
  const openDeleteModal = (book) => {
    setBookToDelete(book);
    setShowModal(true);
  };

  // Handler untuk menutup modal
  const closeDeleteModal = () => {
    setShowModal(false);
    setBookToDelete(null);
  };

  // Handler untuk konfirmasi hapus
  const handleDelete = () => {
    // TODO: Panggil API untuk hapus 'bookToDelete.id'
    console.log('Menghapus buku:', bookToDelete.id);
    
    // Hapus buku dari state (untuk demo)
    setBooks(books.filter(b => b.id !== bookToDelete.id));
    
    // Tutup modal
    closeDeleteModal();
  };

  return (
    <>
      {/* 1. Top Bar (Konsisten) */}
      <div style={styles.topBar}>
        <h1 style={styles.pageTitle}>Daftar Buku</h1>
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
        {/* 3. Filter/Action Bar */}
        <div style={styles.filterContainer}>
          <Link to="/admin/tambah-buku" style={styles.btnTambah}>
            TAMBAH
          </Link>
          <div style={styles.searchGroup}>
            <input
              type="text"
              placeholder="Cari judul atau pengarang..."
              style={styles.inputFilter}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <button onClick={handleSearch} style={styles.btnCari}>
              Cari
            </button>
          </div>
        </div>

        {/* 4. Tabel Daftar Buku */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>NAMA</th>
                <th style={styles.th}>PENULIS</th>
                <th style={styles.th}>TAHUN RILIS</th>
                <th style={styles.th}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.id}>
                  <td style={styles.td}>{book.nama}</td>
                  <td style={styles.td}>{book.penulis}</td>
                  <td style={styles.td}>{book.tahun}</td>
                  <td style={styles.td}>
                    <button 
                      onClick={() => openDeleteModal(book)} 
                      style={styles.btnHapus}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Modal Konfirmasi Hapus (Light Mode) */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={closeDeleteModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Konfirmasi Hapus</h3>
            <p style={styles.modalText}>
              Apakah Anda yakin ingin menghapus buku ini?
            </p>
            <p style={styles.modalBookTitle}>{bookToDelete?.nama}</p>
            
            <div style={styles.modalActions}>
              <button onClick={closeDeleteModal} style={styles.btnBatal}>
                BATAL
              </button>
              <button onClick={handleDelete} style={styles.btnHapusConfirm}>
                HAPUS
              </button>
            </div>
          </div>
        </div>
      )}
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

// 6. Styles (Gaya yang konsisten)
const styles = {
  // Top Bar (Sama seperti DashboardAdmin)
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
  pageTitle: { color: '#333', margin: 0 },
  adminInfo: { display: 'flex', alignItems: 'center', gap: '15px' },
  adminName: { fontWeight: '600' },
  adminEmail: { fontSize: '0.85em', color: '#999' },
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

  // Card
  card: {
    background: 'white',
    borderRadius: '15px',
    padding: '30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  
  // Filter/Action Bar
  filterContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
  },
  btnTambah: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9em',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  searchGroup: {
    display: 'flex',
    gap: '10px',
  },
  inputFilter: {
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '0.9em',
    width: '250px',
  },
  btnCari: {
    padding: '10px 20px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9em',
    fontWeight: '600',
    cursor: 'pointer',
  },

  // Tabel (Sama seperti DashboardAdmin)
  tableContainer: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    background: '#f8f9fa',
    padding: '12px 15px',
    textAlign: 'left',
    color: '#666',
    fontWeight: '600',
    fontSize: '0.9em',
    textTransform: 'uppercase',
  },
  td: {
    padding: '12px 15px',
    borderBottom: '1px solid #f0f0f0',
    color: '#333',
  },
  btnHapus: {
    background: 'none',
    border: 'none',
    color: '#E53E3E', // Merah
    fontWeight: '600',
    cursor: 'pointer',
    padding: 0,
  },

  // Modal Pop-up
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: 'white',
    padding: '25px 30px',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    maxWidth: '400px',
    width: '100%',
  },
  modalTitle: {
    color: '#333',
    margin: '0 0 10px 0',
  },
  modalText: {
    color: '#555',
    fontSize: '1em',
  },
  modalBookTitle: {
    fontWeight: 600,
    color: '#333',
    background: '#f8f9fa',
    padding: '10px',
    borderRadius: '8px',
    marginTop: '15px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '25px',
  },
  btnBatal: {
    padding: '10px 18px',
    background: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnHapusConfirm: {
    padding: '10px 18px',
    background: '#E53E3E',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  }
};

export default DataBuku;