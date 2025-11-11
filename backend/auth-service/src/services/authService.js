const pool = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } = require('../utils/jwt');

// Token blacklist (gunakan Redis untuk production)
const tokenBlacklist = new Set();

// Login
async function Login(call, callback) {
  try {
    const { email, password, remember_me } = call.request;

    if (!email || !password) {
      return callback(null, {
        success: false,
        message: 'Email dan password harus diisi'
      });
    }

    const query = `
      SELECT user_id, email, full_name, password, role, nis, class 
      FROM users 
      WHERE email = $1 AND is_active = true AND deleted_at IS NULL
    `;
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return callback(null, {
        success: false,
        message: 'Email atau password salah'
      });
    }

    const user = result.rows[0];
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      return callback(null, {
        success: false,
        message: 'Email atau password salah'
      });
    }

    const tokenExpiry = remember_me ? '7d' : '24h';
    const accessToken = generateAccessToken(
      { 
        user_id: user.user_id, 
        email: user.email, 
        role: user.role 
      },
      tokenExpiry
    );

    const refreshToken = generateRefreshToken({ user_id: user.user_id });

    await pool.query(
      'UPDATE users SET last_login = NOW() WHERE user_id = $1',
      [user.user_id]
    );

    callback(null, {
      success: true,
      message: 'Login berhasil',
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        user_id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        nis: user.nis || '',
        class: user.class || ''
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    callback(null, {
      success: false,
      message: 'Terjadi kesalahan pada server'
    });
  }
}

// Register
async function Register(call, callback) {
  try {
    const { full_name, email, nis, phone, class: userClass, address, password, role } = call.request;

    if (!full_name || !email || !password) {
      return callback(null, {
        success: false,
        message: 'Nama, email, dan password harus diisi'
      });
    }

    const checkEmail = await pool.query(
      'SELECT user_id FROM users WHERE email = $1',
      [email]
    );

    if (checkEmail.rows.length > 0) {
      return callback(null, {
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    const hashedPassword = await hashPassword(password);

    const insertQuery = `
      INSERT INTO users (full_name, email, nis, phone, class, address, password, role, is_active, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW())
      RETURNING user_id
    `;

    const values = [
      full_name,
      email,
      nis || null,
      phone || null,
      userClass || null,
      address || null,
      hashedPassword,
      role || 'siswa'
    ];

    const result = await pool.query(insertQuery, values);

    callback(null, {
      success: true,
      message: 'Registrasi berhasil',
      user_id: result.rows[0].user_id
    });

  } catch (error) {
    console.error('Register error:', error);
    callback(null, {
      success: false,
      message: 'Terjadi kesalahan pada server'
    });
  }
}

// ValidateToken
async function ValidateToken(call, callback) {
  try {
    const { token } = call.request;

    if (tokenBlacklist.has(token)) {
      return callback(null, {
        valid: false,
        message: 'Token tidak valid'
      });
    }

    const decoded = verifyAccessToken(token);

    callback(null, {
      valid: true,
      user_id: decoded.user_id,
      email: decoded.email,
      role: decoded.role,
      message: 'Token valid'
    });

  } catch (error) {
    callback(null, {
      valid: false,
      message: 'Token tidak valid atau sudah kadaluarsa'
    });
  }
}

// RefreshToken
async function RefreshToken(call, callback) {
  try {
    const { refresh_token } = call.request;
    const decoded = verifyRefreshToken(refresh_token);

    const result = await pool.query(
      'SELECT user_id, email, role FROM users WHERE user_id = $1 AND is_active = true AND deleted_at IS NULL',
      [decoded.user_id]
    );

    if (result.rows.length === 0) {
      return callback(null, {
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    const user = result.rows[0];
    const newAccessToken = generateAccessToken(
      { 
        user_id: user.user_id, 
        email: user.email, 
        role: user.role 
      }
    );

    const newRefreshToken = generateRefreshToken({ user_id: user.user_id });

    callback(null, {
      success: true,
      access_token: newAccessToken,
      refresh_token: newRefreshToken
    });

  } catch (error) {
    callback(null, {
      success: false,
      message: 'Refresh token tidak valid'
    });
  }
}

// Logout
async function Logout(call, callback) {
  try {
    const { token } = call.request;
    tokenBlacklist.add(token);

    callback(null, {
      success: true,
      message: 'Logout berhasil'
    });

  } catch (error) {
    callback(null, {
      success: false,
      message: 'Terjadi kesalahan saat logout'
    });
  }
}

// ChangePassword
async function ChangePassword(call, callback) {
  try {
    const { user_id, current_password, new_password } = call.request;

    const result = await pool.query(
      'SELECT password FROM users WHERE user_id = $1',
      [user_id]
    );

    if (result.rows.length === 0) {
      return callback(null, {
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    const isValid = await comparePassword(current_password, result.rows[0].password);
    
    if (!isValid) {
      return callback(null, {
        success: false,
        message: 'Password lama tidak sesuai'
      });
    }

    const hashedPassword = await hashPassword(new_password);

    await pool.query(
      'UPDATE users SET password = $1, updated_at = NOW() WHERE user_id = $2',
      [hashedPassword, user_id]
    );

    callback(null, {
      success: true,
      message: 'Password berhasil diubah'
    });

  } catch (error) {
    console.error('Change password error:', error);
    callback(null, {
      success: false,
      message: 'Terjadi kesalahan pada server'
    });
  }
}

module.exports = {
  Login,
  Register,
  ValidateToken,
  RefreshToken,
  Logout,
  ChangePassword
};