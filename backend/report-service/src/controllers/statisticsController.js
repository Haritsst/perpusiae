const pool = require('../config/database');

exports.getStatistics = async (req, res) => {
  try {
    const books = await pool.query('SELECT COUNT(*) as total_books FROM books WHERE deleted_at IS NULL');
    const users = await pool.query("SELECT COUNT(*) as total_users FROM users WHERE role='siswa'");
    const loans = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE status='pending') as pending,
        COUNT(*) FILTER (WHERE status='dipinjam') as active,
        COUNT(*) FILTER (WHERE status='selesai') as done
      FROM loans
    `);

    res.json({
      success: true,
      data: { books: books.rows[0], users: users.rows[0], loans: loans.rows[0] }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
