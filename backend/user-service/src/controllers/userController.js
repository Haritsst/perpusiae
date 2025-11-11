// controllers/userController.js
const pool = require('../config/database');

// ========== 1. Profil User Login ==========
exports.getProfile = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const result = await pool.query(`
      SELECT user_id, full_name, email, nis, nip, phone, class, address, role, is_active, last_login, created_at
      FROM users
      WHERE user_id = $1 AND deleted_at IS NULL
    `, [user_id]);

    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

// ========== 2. Update Profil ==========
exports.updateProfile = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { full_name, phone, class: userClass, address, nis, nip } = req.body;

    if (!full_name)
      return res.status(400).json({ success: false, message: 'Nama lengkap harus diisi' });

    const updates = [];
    const values = [];
    let i = 1;

    if (full_name) { updates.push(`full_name=$${i++}`); values.push(full_name); }
    if (phone !== undefined) { updates.push(`phone=$${i++}`); values.push(phone || null); }
    if (userClass !== undefined) { updates.push(`class=$${i++}`); values.push(userClass || null); }
    if (address !== undefined) { updates.push(`address=$${i++}`); values.push(address || null); }
    if (nis !== undefined) { updates.push(`nis=$${i++}`); values.push(nis || null); }
    if (nip !== undefined) { updates.push(`nip=$${i++}`); values.push(nip || null); }

    updates.push(`updated_at=NOW()`);
    values.push(user_id);

    const query = `
      UPDATE users SET ${updates.join(', ')}
      WHERE user_id=$${i} AND deleted_at IS NULL
      RETURNING user_id, full_name, email, nis, nip, phone, class, address, role
    `;
    const result = await pool.query(query, values);

    if (!result.rows.length)
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });

    res.json({ success: true, message: 'Profil berhasil diupdate', data: result.rows[0] });

  } catch (error) {
    console.error('Update profile error:', error);
    if (error.code === '23505') {
      return res.status(400).json({ success: false, message: 'NIS atau NIP sudah digunakan' });
    }
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

// ====== (3–8) Endpoint Admin dan Lainnya ======
exports.getUsers = async (req, res) => { /* ... */ };
exports.getUserById = async (req, res) => { /* ... */ };
exports.updateUser = async (req, res) => { /* ... */ };
exports.deleteUser = async (req, res) => { /* ... */ };
exports.toggleUserActive = async (req, res) => { /* ... */ };
exports.getUserLoans = async (req, res) => { /* ... */ };
