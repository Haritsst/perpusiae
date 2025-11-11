-- database_schema.sql
-- Schema database untuk Sistem Informasi Perpustakaan Sekolah

-- Database: perpustakaan_db

-- Table: users
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    nis VARCHAR(50) UNIQUE,
    nip VARCHAR(50) UNIQUE,
    phone VARCHAR(20),
    class VARCHAR(50),
    address TEXT,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('siswa', 'admin')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Index untuk users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_nis ON users(nis);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);

-- Table: books
CREATE TABLE books (
    book_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    available INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Index untuk books
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_books_deleted_at ON books(deleted_at);
CREATE INDEX idx_books_available ON books(available);

-- Table: loans
CREATE TABLE loans (
    loan_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    book_id UUID NOT NULL REFERENCES books(book_id),
    borrow_date DATE NOT NULL,
    planned_return_date DATE NOT NULL,
    actual_return_date DATE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'dipinjam', 'ditolak', 'selesai')),
    fine DECIMAL(10, 2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk loans
CREATE INDEX idx_loans_user_id ON loans(user_id);
CREATE INDEX idx_loans_book_id ON loans(book_id);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_loans_borrow_date ON loans(borrow_date);
CREATE INDEX idx_loans_planned_return_date ON loans(planned_return_date);

-- Table: returns
CREATE TABLE returns (
    return_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID NOT NULL REFERENCES loans(loan_id),
    return_date DATE NOT NULL,
    proof_url TEXT,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'acc', 'ditolak')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk returns
CREATE INDEX idx_returns_loan_id ON returns(loan_id);
CREATE INDEX idx_returns_status ON returns(status);
CREATE INDEX idx_returns_return_date ON returns(return_date);

-- Table: settings
CREATE TABLE settings (
    setting_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_name VARCHAR(255) NOT NULL,
    school_description TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO settings (school_name, school_description) 
VALUES ('SMPN 1 Kuta Utara', 'Sistem Informasi Perpustakaan SMPN 1 Kuta Utara');

-- Table: audit_logs (untuk tracking perubahan data)
CREATE TABLE audit_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk audit_logs
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Function untuk auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger untuk auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loans_updated_at BEFORE UPDATE ON loans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_returns_updated_at BEFORE UPDATE ON returns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function untuk menghitung denda otomatis
CREATE OR REPLACE FUNCTION calculate_loan_fine()
RETURNS TRIGGER AS $$
DECLARE
    days_late INTEGER;
    fine_per_day DECIMAL(10, 2) := 2000.00;
BEGIN
    -- Jika actual_return_date diisi dan lebih dari planned_return_date
    IF NEW.actual_return_date IS NOT NULL THEN
        days_late := NEW.actual_return_date - NEW.planned_return_date;
        
        IF days_late > 0 THEN
            NEW.fine := days_late * fine_per_day;
        ELSE
            NEW.fine := 0;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger untuk auto-calculate fine
CREATE TRIGGER calculate_fine_on_return BEFORE UPDATE ON loans
    FOR EACH ROW
    WHEN (NEW.actual_return_date IS NOT NULL AND OLD.actual_return_date IS NULL)
    EXECUTE FUNCTION calculate_loan_fine();

-- View untuk laporan peminjaman
CREATE VIEW v_loan_report AS
SELECT 
    l.loan_id,
    l.borrow_date,
    l.planned_return_date,
    l.actual_return_date,
    l.status,
    l.fine,
    u.full_name as borrower_name,
    u.nis,
    u.class,
    b.title as book_title,
    b.author as book_author,
    b.year as book_year,
    CASE 
        WHEN l.actual_return_date IS NULL AND l.planned_return_date < CURRENT_DATE 
        THEN true 
        ELSE false 
    END as is_late
FROM loans l
JOIN users u ON l.user_id = u.user_id
JOIN books b ON l.book_id = b.book_id;

-- View untuk statistik perpustakaan
CREATE VIEW v_library_stats AS
SELECT 
    (SELECT COUNT(*) FROM books WHERE deleted_at IS NULL) as total_books,
    (SELECT SUM(stock) FROM books WHERE deleted_at IS NULL) as total_stock,
    (SELECT SUM(available) FROM books WHERE deleted_at IS NULL) as total_available,
    (SELECT COUNT(*) FROM users WHERE role = 'siswa' AND deleted_at IS NULL) as total_students,
    (SELECT COUNT(*) FROM loans WHERE status = 'pending') as pending_loans,
    (SELECT COUNT(*) FROM loans WHERE status = 'dipinjam') as active_loans,
    (SELECT COUNT(*) FROM loans WHERE status = 'selesai') as completed_loans;

-- Sample data untuk testing

-- Insert admin user (password: admin123)
INSERT INTO users (full_name, email, nip, phone, role, password, is_active)
VALUES (
    'Administrator',
    'admin@smpn1kutautara.sch.id',
    '199001012020011001',
    '081234567890',
    'admin',
    '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', -- admin123
    true
);

-- Insert sample student (password: siswa123)
INSERT INTO users (full_name, email, nis, phone, class, address, role, password, is_active)
VALUES (
    'Ahmad Ridwan',
    'ahmad.ridwan@student.smpn1kutautara.sch.id',
    '2024001',
    '081234567891',
    '8A',
    'Jl. Raya Kuta No. 123',
    'siswa',
    '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', -- siswa123
    true
);

-- Insert sample books
INSERT INTO books (title, author, year, stock, available) VALUES
('Laskar Pelangi', 'Andrea Hirata', 2005, 5, 5),
('Bumi Manusia', 'Pramoedya Ananta Toer', 1980, 3, 3),
('Sang Pemimpi', 'Andrea Hirata', 2006, 4, 4),
('Harry Potter and the Philosopher''s Stone', 'J.K. Rowling', 1997, 6, 6),
('The Hunger Games', 'Suzanne Collins', 2008, 4, 4),
('Matematika Kelas 8', 'Kemendikbud', 2021, 10, 10),
('IPA Terpadu Kelas 8', 'Kemendikbud', 2021, 10, 10),
('Bahasa Indonesia Kelas 8', 'Kemendikbud', 2021, 10, 10);

-- Grant permissions (sesuaikan dengan user database Anda)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO perpustakaan_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO perpustakaan_user;