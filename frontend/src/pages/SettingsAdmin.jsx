import { useState } from 'react';
// Kita tidak perlu useNavigate di sini, kecuali "Simpan" harus pindah halaman

function SettingsAdmin() {
  // State untuk text input (diisi data dummy dari gambar)
  const [formData, setFormData] = useState({
    namaSekolah: 'SMPN 1 KUTA UTARA',
    deskripsi: 'Perpustakaan Sekolah'
  });

  // State untuk file (hanya menyimpan file yg dipilih)
  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  
  // State untuk preview gambar logo
  const [logoPreview, setLogoPreview] = useState('https://via.placeholder.com/150/EEEEEE/999999?text=Logo'); // Placeholder

  // Handler untuk form text
  const handleTextChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handler untuk file logo
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setLogoFile(file);
      // Buat URL preview sementara untuk gambar yg baru dipilih
      setLogoPreview(URL.createObjectURL(file));
    } else {
      alert('Hanya file .jpg atau .png yang diizinkan!');
      e.target.value = null; // Reset input file
    }
  };
  
  // Handler untuk file favicon
  const handleFaviconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFaviconFile(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Ganti dengan API call untuk update settings
    // Anda perlu menggunakan 'FormData' untuk mengirim file
    console.log('Settings disubmit:', formData);
    if (logoFile) console.log('Logo baru:', logoFile.name);
    if (faviconFile) console.log('Favicon baru:', faviconFile.name);
    alert('Settings berhasil disimpan!');
  };

  return (
    <>
      {/* 1. Top Bar (Konsisten) */}
      <div style={styles.topBar}>
        <h1 style={styles.pageTitle}>Settings</h1>
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
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nama Sekolah</label>
            <input 
              type="text" 
              name="namaSekolah" 
              style={styles.input} 
              value={formData.namaSekolah} 
              onChange={handleTextChange} 
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Deskripsi</label>
            <textarea 
              name="deskripsi"
              style={styles.textarea} 
              rows="4"
              value={formData.deskripsi} 
              onChange={handleTextChange}
            ></textarea>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Logo (JPG, PNG)</label>
            <input 
              type="file" 
              name="logo" 
              style={styles.inputFile} 
              accept=".jpg, .jpeg, .png"
              onChange={handleLogoChange}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Logo saat ini:</label>
            <img src={logoPreview} alt="Logo preview" style={styles.logoPreview} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Favicon</label>
            <input 
              type="file" 
              name="favicon" 
              style={styles.inputFile} 
              accept="image/x-icon, .ico"
              onChange={handleFaviconChange}
            />
          </div>

          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.btnSimpan}>SIMPAN</button>
          </div>
        </form>
      </div>
    </>
  );
}

// 3. Styles (Konsisten dengan halaman admin lainnya)
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

  // Card & Form
  card: {
    background: 'white',
    borderRadius: '15px',
    padding: '30px 40px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    maxWidth: '800px', 
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
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1em',
    boxSizing: 'border-box',
    background: '#f8f9fa',
    color: '#333',
  },
  textarea: {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1em',
    boxSizing: 'border-box',
    background: '#f8f9fa',
    color: '#333',
    fontFamily: 'inherit', // Agar font sama
    resize: 'vertical', // Boleh resize vertikal
  },
  inputFile: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    background: '#f8f9fa',
    fontSize: '0.9em',
    boxSizing: 'border-box',
  },
  logoPreview: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    border: '1px solid #eee',
    borderRadius: '8px',
    marginTop: '10px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-start', 
    marginTop: '30px',
  },
  btnSimpan: {
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9em',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default SettingsAdmin;