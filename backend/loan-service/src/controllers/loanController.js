// controllers/loanController.js
const pool = require('../config/database');

// Fungsi menghitung denda
function calculateFine(returnDate, plannedReturnDate) {
  const fine_per_day = 2000; // Rp 2.000 per hari
  const planned = new Date(plannedReturnDate);
  const actual = new Date(returnDate);
  const diffTime = actual - planned;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays * fine_per_day : 0;
}

// ========== CONTROLLERS ==========

// POST /api/loans
exports.createLoan = async (req, res) => {
  const client = await pool.connect();
  try {
    const { book_id, borrow_date, planned_return_date } = req.body;
    const user_id = req.user.user_id;

    if (!book_id || !borrow_date || !planned_return_date) {
      return res.status(400).json({ success: false, message: 'Book ID, tanggal pinjam, dan tanggal rencana kembali harus diisi' });
    }

    const borrowDate = new Date(borrow_date);
    const returnDate = new Date(planned_return_date);
    if (returnDate <= borrowDate) {
      return res.status(400).json({ success: false, message: 'Tanggal rencana kembali harus setelah tanggal pinjam' });
    }

    await client.query('BEGIN');

    const bookQuery = await client.query(
      `SELECT book_id, title, author, year, available 
       FROM books 
       WHERE book_id = $1 AND deleted_at IS NULL FOR UPDATE`,
      [book_id]
    );

    if (bookQuery.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Buku tidak ditemukan' });
    }

    const book = bookQuery.rows[0];
    if (book.available <= 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Buku tidak tersedia untuk dipinjam' });
    }

    const existingLoan = await client.query(
      `SELECT loan_id FROM loans 
       WHERE user_id = $1 AND book_id = $2 AND status IN ('pending', 'dipinjam')`,
      [user_id, book_id]
    );

    if (existingLoan.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Anda sudah meminjam buku ini dan belum mengembalikannya' });
    }

    const insertLoan = await client.query(
      `INSERT INTO loans (user_id, book_id, borrow_date, planned_return_date, status, created_at)
       VALUES ($1, $2, $3, $4, 'pending', NOW())
       RETURNING loan_id, user_id, book_id, borrow_date, planned_return_date, status`,
      [user_id, book_id, borrow_date, planned_return_date]
    );

    await client.query(
      `UPDATE books SET available = available - 1, updated_at = NOW()
       WHERE book_id = $1`,
      [book_id]
    );

    await client.query('COMMIT');

    const userInfo = await pool.query('SELECT full_name FROM users WHERE user_id = $1', [user_id]);

    res.status(201).json({
      success: true,
      message: 'Peminjaman berhasil diajukan. Menunggu persetujuan admin.',
      data: {
        ...insertLoan.rows[0],
        book,
        borrower_name: userInfo.rows[0].full_name
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create loan error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  } finally {
    client.release();
  }
};

// GET /api/loans
exports.getLoans = async (req, res) => {
  try {
    const { title, borrower_name, status, page = 1, limit = 10 } = req.query;
    const user_id = req.user.user_id;
    const is_admin = req.user.role === 'admin';
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        l.loan_id, l.user_id, l.book_id, l.borrow_date, l.planned_return_date, 
        l.actual_return_date, l.status, l.fine, l.notes, l.created_at,
        u.full_name as borrower_name, u.nis, u.class,
        b.title, b.author, b.year
      FROM loans l
      JOIN users u ON l.user_id = u.user_id
      JOIN books b ON l.book_id = b.book_id
      WHERE 1=1
    `;
    const values = [];

    if (!is_admin) {
      query += ` AND l.user_id = $${values.length + 1}`;
      values.push(user_id);
    }

    if (title) {
      query += ` AND LOWER(b.title) LIKE LOWER($${values.length + 1})`;
      values.push(`%${title}%`);
    }

    if (borrower_name) {
      query += ` AND LOWER(u.full_name) LIKE LOWER($${values.length + 1})`;
      values.push(`%${borrower_name}%`);
    }

    if (status) {
      query += ` AND l.status = $${values.length + 1}`;
      values.push(status);
    }

    query += ` ORDER BY l.created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Get loans error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

// GET /api/loans/:id
exports.getLoanById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.user_id;
    const is_admin = req.user.role === 'admin';

    let query = `
      SELECT 
        l.loan_id, l.user_id, l.book_id, l.borrow_date, l.planned_return_date, 
        l.actual_return_date, l.status, l.fine, l.notes, l.created_at, l.updated_at,
        u.full_name as borrower_name, u.email, u.nis, u.class, u.phone,
        b.title, b.author, b.year
      FROM loans l
      JOIN users u ON l.user_id = u.user_id
      JOIN books b ON l.book_id = b.book_id
      WHERE l.loan_id = $1
    `;
    const values = [id];

    if (!is_admin) {
      query += ` AND l.user_id = $2`;
      values.push(user_id);
    }

    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Peminjaman tidak ditemukan' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Get loan detail error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

// PUT /api/loans/:id/status
exports.updateLoanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['pending', 'dipinjam', 'ditolak', 'selesai'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Status tidak valid' });
    }

    const currentLoan = await pool.query('SELECT loan_id, status, book_id FROM loans WHERE loan_id = $1', [id]);

    if (currentLoan.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Peminjaman tidak ditemukan' });
    }

    const loan = currentLoan.rows[0];

    if (loan.status === 'pending' && status === 'ditolak') {
      await pool.query('UPDATE books SET available = available + 1, updated_at = NOW() WHERE book_id = $1', [loan.book_id]);
    }

    const result = await pool.query(
      `UPDATE loans 
       SET status = $1, notes = $2, updated_at = NOW()
       WHERE loan_id = $3
       RETURNING loan_id, status, notes`,
      [status, notes || null, id]
    );

    res.json({ success: true, message: 'Status peminjaman berhasil diupdate', data: result.rows[0] });
  } catch (error) {
    console.error('Update loan status error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

// DELETE /api/loans/:id
exports.deleteLoan = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    await client.query('BEGIN');

    const loanQuery = await client.query('SELECT loan_id, book_id, status FROM loans WHERE loan_id = $1', [id]);
    if (loanQuery.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Peminjaman tidak ditemukan' });
    }

    const loan = loanQuery.rows[0];
    if (loan.status === 'pending' || loan.status === 'dipinjam') {
      await client.query('UPDATE books SET available = available + 1, updated_at = NOW() WHERE book_id = $1', [loan.book_id]);
    }

    await client.query('DELETE FROM loans WHERE loan_id = $1', [id]);
    await client.query('COMMIT');

    res.json({ success: true, message: 'Peminjaman berhasil dihapus' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Delete loan error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  } finally {
    client.release();
  }
};
