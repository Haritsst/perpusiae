// controllers/returnController.js
const pool = require('../config/database');

// Fungsi untuk menghitung denda
function calculateFine(returnDate, plannedReturnDate) {
  const finePerDay = 2000;
  const planned = new Date(plannedReturnDate);
  const actual = new Date(returnDate);
  const diffTime = actual - planned;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays * finePerDay : 0;
}

// ========== CONTROLLERS ==========

// 1. Membuat pengembalian baru
exports.createReturn = async (req, res) => {
  const client = await pool.connect();
  try {
    const { loan_id, return_date, proof_url } = req.body;
    const user_id = req.user.user_id;

    if (!loan_id || !return_date) {
      return res.status(400).json({
        success: false,
        message: 'Loan ID dan tanggal pengembalian harus diisi'
      });
    }

    await client.query('BEGIN');

    const loanQuery = await client.query(
      `SELECT l.loan_id, l.user_id, l.book_id, l.borrow_date, l.planned_return_date, 
              l.status, b.title, b.author, b.year
       FROM loans l
       JOIN books b ON l.book_id = b.book_id
       WHERE l.loan_id = $1 AND l.user_id = $2`,
      [loan_id, user_id]
    );

    if (loanQuery.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Peminjaman tidak ditemukan atau bukan milik Anda'
      });
    }

    const loan = loanQuery.rows[0];
    if (['pending', 'selesai', 'ditolak'].includes(loan.status)) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Status peminjaman tidak valid untuk pengembalian'
      });
    }

    const existingReturn = await client.query(
      'SELECT return_id FROM returns WHERE loan_id = $1',
      [loan_id]
    );

    if (existingReturn.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Pengembalian untuk peminjaman ini sudah ada'
      });
    }

    const fine = calculateFine(return_date, loan.planned_return_date);
    const insertReturn = await client.query(
      `INSERT INTO returns (loan_id, return_date, proof_url, status, notes, created_at)
       VALUES ($1, $2, $3, 'pending', $4, NOW())
       RETURNING *`,
      [loan_id, return_date, proof_url || null, fine > 0 ? `Denda: Rp ${fine}` : null]
    );

    await client.query('COMMIT');
    res.status(201).json({
      success: true,
      message: 'Pengembalian berhasil diajukan. Menunggu verifikasi admin.',
      data: { ...insertReturn.rows[0], loan, fine }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create return error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  } finally {
    client.release();
  }
};

// 2. Mendapatkan semua pengembalian
exports.getAllReturns = async (req, res) => {
  try {
    const { title, borrower_name, status, page = 1, limit = 10 } = req.query;
    const user_id = req.user.user_id;
    const is_admin = req.user.role === 'admin';
    const offset = (page - 1) * limit;

    let query = `
      SELECT r.return_id, r.loan_id, r.return_date, r.proof_url, r.status, r.notes, r.created_at,
             l.borrow_date, l.planned_return_date, l.actual_return_date, l.fine,
             u.user_id, u.full_name as borrower_name, b.title
      FROM returns r
      JOIN loans l ON r.loan_id = l.loan_id
      JOIN users u ON l.user_id = u.user_id
      JOIN books b ON l.book_id = b.book_id
      WHERE 1=1`;
    const values = [];

    if (!is_admin) {
      query += ` AND l.user_id = $${values.length + 1}`;
      values.push(user_id);
    }
    if (title) {
      query += ` AND LOWER(b.title) LIKE LOWER($${values.length + 1})`;
      values.push(`%${title}%`);
    }
    if (borrower_name && is_admin) {
      query += ` AND LOWER(u.full_name) LIKE LOWER($${values.length + 1})`;
      values.push(`%${borrower_name}%`);
    }
    if (status) {
      query += ` AND r.status = $${values.length + 1}`;
      values.push(status);
    }

    query += ` ORDER BY r.created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get returns error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

// 3. Mendapatkan detail pengembalian
exports.getReturnById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.user_id;
    const is_admin = req.user.role === 'admin';

    let query = `
      SELECT r.return_id, r.loan_id, r.return_date, r.proof_url, r.status, r.notes,
             l.borrow_date, l.planned_return_date, l.actual_return_date,
             u.full_name as borrower_name, b.title
      FROM returns r
      JOIN loans l ON r.loan_id = l.loan_id
      JOIN users u ON l.user_id = u.user_id
      JOIN books b ON l.book_id = b.book_id
      WHERE r.return_id = $1`;
    const values = [id];

    if (!is_admin) {
      query += ` AND l.user_id = $2`;
      values.push(user_id);
    }

    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pengembalian tidak ditemukan' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Get return detail error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

// 4. Update status pengembalian (Admin only)
exports.updateReturnStatus = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const validStatuses = ['pending', 'acc', 'ditolak'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Status tidak valid' });
    }

    await client.query('BEGIN');
    const currentReturn = await client.query(
      `SELECT r.return_id, r.loan_id, r.status, r.return_date,
              l.book_id, l.planned_return_date
       FROM returns r
       JOIN loans l ON r.loan_id = l.loan_id
       WHERE r.return_id = $1`,
      [id]
    );

    if (currentReturn.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Pengembalian tidak ditemukan' });
    }

    const returnData = currentReturn.rows[0];
    if (status === 'acc' && returnData.status !== 'acc') {
      const fine = calculateFine(returnData.return_date, returnData.planned_return_date);
      await client.query(
        `UPDATE loans SET status = 'selesai', actual_return_date = $1, fine = $2 WHERE loan_id = $3`,
        [returnData.return_date, fine, returnData.loan_id]
      );
      await client.query(
        'UPDATE books SET available = available + 1 WHERE book_id = $1',
        [returnData.book_id]
      );
    }

    const updateReturn = await client.query(
      `UPDATE returns SET status = $1, notes = $2, updated_at = NOW()
       WHERE return_id = $3 RETURNING *`,
      [status, notes || null, id]
    );

    await client.query('COMMIT');
    res.json({ success: true, message: 'Status berhasil diupdate', data: updateReturn.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update return status error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  } finally {
    client.release();
  }
};

// 5. Hapus pengembalian (Admin only)
exports.deleteReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM returns WHERE return_id = $1 RETURNING return_id',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pengembalian tidak ditemukan' });
    }
    res.json({ success: true, message: 'Pengembalian berhasil dihapus' });
  } catch (error) {
    console.error('Delete return error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};
