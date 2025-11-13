import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

function ProfilSiswa() {
  const navigate = useNavigate();

  // Data user (navbar)
  const [user] = useState({ name: 'Harris Caine' }); 

  // State untuk form 1: Profile Information (diisi data dummy dari gambar)
  const [profileData, setProfileData] = useState({
    name: 'Harris Caine',
    alamat: 'Jalan Cibaduyut 1',
    noHp: '08976555421',
    nis: '1098',
    kelas: 'VII A',
    email: 'harriscaine@gmail.com'
  });

  // State untuk form 2: Update Password
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleLogout = () => {
    navigate('/');
  };

  // Handler untuk form profile
  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // TODO: Ganti dengan API call untuk update profile
    console.log('Profile data disubmit:', profileData);
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
    <div style={styles.page}>
      {/* 1. Navbar (Sama, tapi 'Profil' yang aktif) */}
      <nav style={styles.navbar}>
        <div style={styles.navbarBrand}>📚 Perpustakaan Digital</div>
        <div style={styles.navbarMenu}>
          <Link to="/dashboard-siswa" style={styles.navLink}>Dashboard</Link>
          <Link to="/siswa/peminjaman" style={styles.navLink}>Peminjaman</Link>
          <Link to="/siswa/riwayat" style={styles.navLink}>Riwayat</Link>
          <Link to="/siswa/pengembalian" style={styles.navLink}>Pengembalian</Link>
          <Link to="/siswa/profil" style={{...styles.navLink, ...styles.navLinkActive}}>Profil</Link>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>{user.name?.charAt(0) || 'H'}</div>
            <span>{user.name}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </div>
        </div>
      </nav>

      {/* 2. Konten Halaman */}
      <div style={styles.container}>
        <h2 style={styles.pageTitle}>Profile</h2>

        {/* 3. Card 1: Profile Information */}
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
                <input type="text" name="nis" style={styles.input} value={profileData.nis} onChange={handleProfileChange} />
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

        {/* 4. Card 2: Update Password */}
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

// 5. Styles (Menyalin + style baru)
const styles = {
  // Styles Halaman & Navbar (Sama)
  page: { 
    background: '#f5f7fa',
    minHeight: '100vh',
    paddingBottom: '30px' // Beri jarak di bawah
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
  navbarBrand: { fontSize: '1.5em', fontWeight: '700' },
  navbarMenu: { display: 'flex', gap: '20px', alignItems: 'center' },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
  },
  navLinkActive: { background: 'rgba(255, 255, 255, 0.2)' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
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
  pageTitle: {
    color: '#333',
    marginBottom: '20px',
    fontSize: '1.75em',
    fontWeight: '600',
  },

  // Style baru untuk Card & Form
  card: {
    background: 'white',
    borderRadius: '15px',
    padding: '30px 40px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    marginBottom: '30px', // Jarak antar card
    maxWidth: '800px', // Batasi lebar card
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
    marginBottom: '10px', // Jarak lebih rapat
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
    background: '#fff',
    color: '#333',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-start', // Tombol di kiri
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

export default ProfilSiswa;