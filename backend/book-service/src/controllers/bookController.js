const pool = require('../config/database');

// Get all books
async function getAllBooks(req, res) {
  try {
    const query = 'SELECT book_id, title, author FROM books WHERE deleted_at IS NULL ORDER BY title ASC';
    const result = await pool.query(query);
    return res.status(200).json({
      success: true,
      message: 'Data buku berhasil diambil',
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching books:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
}

// Get book by ID
async function getBookById(req, res) {
  try {
    const { id } = req.params;
    const query = 'SELECT book_id, title, author FROM books WHERE book_id = $1 AND deleted_at IS NULL';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Buku tidak ditemukan' });
    }

    return res.status(200).json({
      success: true,
      message: 'Data buku berhasil diambil',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error fetching book:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
}

// Add book (Admin only)
exports.addBook = async (req, res) => {
  try {
    const { title, author, year, stock } = req.body;

    if (!title || !author || !year || !stock) {
      return res.status(400).json({ 
        success: false, 
        message: 'Judul, pengarang, tahun, dan stok harus diisi' 
      });
    }

    const query = `
      INSERT INTO books (title, author, year, stock, available, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING book_id, title, author, year, stock, available
    `;
    const values = [title, author, year, stock, stock];

    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Buku berhasil ditambahkan',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan pada server' 
    });
  }
};

// Update book (Admin only)
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, year, stock } = req.body;

    const checkBook = await pool.query(
      'SELECT book_id, stock, available FROM books WHERE book_id = $1 AND deleted_at IS NULL',
      [id]
    );

    if (checkBook.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Buku tidak ditemukan' 
      });
    }

    const currentBook = checkBook.rows[0];
    const borrowed = (currentBook.stock || 0) - (currentBook.available || 0);
    const newAvailable = (stock || currentBook.stock) - borrowed;

    const query = `
      UPDATE books 
      SET title = COALESCE($1, title),
          author = COALESCE($2, author),
          year = COALESCE($3, year),
          stock = COALESCE($4, stock),
          available = $5,
          updated_at = NOW()
      WHERE book_id = $6
      RETURNING book_id, title, author, year, stock, available
    `;
    const values = [title, author, year, stock, newAvailable, id];

    const result = await pool.query(query, values);

    res.json({
      success: true,
      message: 'Buku berhasil diupdate',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan pada server' 
    });
  }
};

// Delete book (Admin only)
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const checkLoan = await pool.query(
      `SELECT loan_id FROM loans 
       WHERE book_id = $1 AND status IN ('pending', 'dipinjam')`,
      [id]
    );

    if (checkLoan.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tidak dapat menghapus buku yang sedang dipinjam' 
      });
    }

    const query = `
      UPDATE books 
      SET deleted_at = NOW()
      WHERE book_id = $1 AND deleted_at IS NULL
      RETURNING book_id
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Buku tidak ditemukan' 
      });
    }

    res.json({
      success: true,
      message: 'Buku berhasil dihapus'
    });

  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan pada server' 
    });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  addBook: exports.addBook,
  updateBook: exports.updateBook,
  deleteBook: exports.deleteBook
};