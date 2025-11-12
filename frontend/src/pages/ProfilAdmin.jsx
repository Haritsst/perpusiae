import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfilAdmin() {
  const navigate = useNavigate();

  // State untuk form 1: Profile Information (diisi data dummy dari gambar)
  const [profileData, setProfileData] = useState({
    name: 'Admin',
    alamat: 'Singaraja',
    noHp: '',
    nip: '11111', // Mengganti NIS/NIP
    kelas: '',
    email: 'admin@gmail.com'
  });

  // State untuk form 2: Update Password
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Handler untuk form profile
  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // TODO: Ganti dengan API call untuk update profile admin
    console.log('Profile admin disubmit:', profileData);
    alert('Profile berhasil diperbarui!');
  };

  // Handler untuk form password
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Validasi sederhana
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Password baru dan konfirmasi password tidak cocok!');
      return;
    }
    // TODO: Ganti dengan API call untuk ganti password
    console.log('Password data disubmit:', passwordData);
    alert('Password berhasil diperbarui!');
    // Kosongkan field setelah sukses
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <>
      {/* 1. Top Bar (Konsisten) */}
      <div style={styles.topBar}>
        <h1 style={styles.pageTitle}>Profile</h1>
        <div style={styles.adminInfo}>
          <div>
            <div style={styles.adminName}>Admin Perpustakaan</div>
            <div style={styles.adminEmail}>admin@sekolah.com</div>
          </div>
          <div style={styles.adminAvatar}>AP</div>
        </div>
      </div>

      {/* 2. Card 1: Profile Information */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Profile Information</h3>
        <p style={styles.cardSubtitle}>Update profile kamu</p>
        
        <form onSubmit={handleProfileSubmit}>
          {/* Kita pakai grid agar form rapi 2 kolom */}
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name</label>
              <input type="text" name="name" style={styles.input} value={profileData.name} onChange={handleProfileChange} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Alamat</label>
              <input type="text" name="alamat" style={styles.input} value={profileData.alamat} onChange={handleProfileChange} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>No HP</label>
              <input type="text" name="noHp" style={styles.input} value={profileData.noHp} onChange={handleProfileChange} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>NIS / NIP</label>
              <input type="text" name="nip" style={styles.input} value={profileData.nip} onChange={handleProfileChange} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Kelas</label>
              <input type="text" name="kelas" style={styles.input} value={profileData.kelas} onChange={handleProfileChange} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input type="email" name="email" style={styles.input} value={profileData.email} onChange={handleProfileChange} />
            </div>
          </div>
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.btnSimpan}>SAVE</button>
          </div>
        </form>
      </div>

      {/* 3. Card 2: Update Password */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Update Password</h3>
        <p style={styles.cardSubtitle}>Update password kamu</p>

        <form onSubmit={handlePasswordSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Current Password</label>
            <input type="password" name="currentPassword" style={styles.input} value={passwordData.currentPassword} onChange={handlePasswordChange} required />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>New Password</label>
            <input type="password" name="newPassword" style={styles.input} value={passwordData.newPassword} onChange={handlePasswordChange} required />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input type="password" name="confirmPassword" style={styles.input} value={passwordData.confirmPassword} onChange={handlePasswordChange} required />
          </div>
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.btnSimpan}>SAVE</button>
          </div>
        </form>
      </div>
    </>
  );
}

// 4. Styles (Menggunakan style dari ProfilSiswa & DashboardAdmin)
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

  // Card & Form (dari ProfilSiswa.jsx)
  card: {
    background: 'white',
    borderRadius: '15px',
    padding: '30px 40px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    marginBottom: '30px', 
    maxWidth: '800px', 
  },
  cardTitle: {
    color: '#333',
    margin: '0 0 5px 0',
    fontSize: '1.5em',
    fontWeight: '600',
  },
  cardSubtitle: {
    color: '#777',
    margin: '0 0 25px 0',
    fontSize: '0.9em',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr', // 2 kolom
    gap: '20px',
  },
  formGroup: {
    marginBottom: '10px',
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
    background: '#f8f9fa', // Latar input admin
    color: '#333',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-start', 
    marginTop: '25px',
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

export default ProfilAdmin;