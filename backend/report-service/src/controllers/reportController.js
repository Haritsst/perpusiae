const PDFDocument = require('pdfkit');
const pool = require('../config/database');

// Helper functions
function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Jakarta' });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

async function generatePDFReport(loans, startDate, endDate) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margins: { top: 50, bottom: 50, left: 50, right: 50 } });
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(18).font('Helvetica-Bold').text('LAPORAN PEMINJAMAN BUKU', { align: 'center' });
      doc.fontSize(14).text('SMPN 1 Kuta Utara', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).text(`Periode: ${formatDate(startDate)} s/d ${formatDate(endDate)}`, { align: 'center' });
      doc.moveDown().moveTo(50, doc.y).lineTo(545, doc.y).stroke().moveDown();

      const totalLoans = loans.length;
      const totalFines = loans.reduce((sum, loan) => sum + (loan.fine || 0), 0);
      const pendingLoans = loans.filter(l => l.status === 'pending').length;
      const activeLoans = loans.filter(l => l.status === 'dipinjam').length;
      const completedLoans = loans.filter(l => l.status === 'selesai').length;

      doc.fontSize(11).font('Helvetica-Bold').text('Ringkasan:', { underline: true });
      doc.fontSize(10)
        .font('Helvetica')
        .text(`Total Peminjaman: ${totalLoans}`)
        .text(`Pending: ${pendingLoans} | Dipinjam: ${activeLoans} | Selesai: ${completedLoans}`)
        .text(`Total Denda: ${formatCurrency(totalFines)}`)
        .moveDown();

      // Tabel
      const colWidths = { no: 30, date: 70, borrower: 100, book: 150, returnDate: 70, status: 60, fine: 65 };
      let x = 50, y = doc.y;
      doc.fontSize(9).font('Helvetica-Bold');
      ['No', 'Tgl Pinjam', 'Peminjam', 'Judul Buku', 'Tgl Kembali', 'Status', 'Denda'].forEach((h, i) => {
        const width = Object.values(colWidths)[i];
        doc.text(h, x, y, { width });
        x += width;
      });
      doc.moveDown().moveTo(50, doc.y).lineTo(545, doc.y).stroke().moveDown(0.5);

      doc.font('Helvetica').fontSize(8);
      loans.forEach((loan, index) => {
        if (doc.y > 700) doc.addPage();
        const borrowDate = new Date(loan.borrow_date).toLocaleDateString('id-ID');
        const returnDate = loan.actual_return_date || loan.planned_return_date;
        const returnDateStr = returnDate ? new Date(returnDate).toLocaleDateString('id-ID') : '-';
        const fineText = loan.fine > 0 ? formatCurrency(loan.fine) : '-';

        let x = 50;
        [index + 1, borrowDate, loan.borrower_name, loan.title, returnDateStr, loan.status, fineText]
          .forEach((text, i) => {
            const width = Object.values(colWidths)[i];
            doc.text(text, x, doc.y, { width });
            x += width;
          });
        doc.moveDown(0.8);
      });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

exports.getLoanReport = async (req, res) => {
  try {
    const { start_date, end_date, format = 'json' } = req.query;
    if (!start_date || !end_date)
      return res.status(400).json({ success: false, message: 'Tanggal mulai dan akhir harus diisi' });

    const query = `
      SELECT l.*, u.full_name as borrower_name, b.title
      FROM loans l
      JOIN users u ON l.user_id = u.user_id
      JOIN books b ON l.book_id = b.book_id
      WHERE l.borrow_date BETWEEN $1 AND $2
      ORDER BY l.borrow_date DESC
    `;

    const result = await pool.query(query, [start_date, end_date]);
    const loans = result.rows;

    if (format === 'pdf') {
      const pdf = await generatePDFReport(loans, start_date, end_date);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=laporan-${start_date}-${end_date}.pdf`);
      return res.send(pdf);
    }

    res.json({ success: true, data: loans });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};
