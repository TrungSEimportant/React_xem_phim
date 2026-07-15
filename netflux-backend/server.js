const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors()); // Cho phép React (cổng 3000/5173) gọi API (cổng 5000)
app.use(express.json()); // Để đọc dữ liệu JSON từ req.body

// Thiết lập kết nối MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Thay bằng user MySQL của bạn (thường là root)
    password: '',      // Thay bằng mật khẩu MySQL của bạn (XAMPP mặc định là rỗng)
    database: 'netflux_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Đã kết nối MySQL thành công!');
});

// ================= CÁC API ENDPOINTS =================

// 1. API Lấy danh sách Phim (ĐÃ SỬA LỖI: Tự động chuẩn hóa showtimes thành Mảng tránh trắng màn hình)
app.get('/api/movies', (req, res) => {
    db.query('SELECT * FROM movies', (err, results) => {
        if (err) return res.status(500).json(err);
        
        // Duyệt qua từng bộ phim để ép kiểu dữ liệu showtimes từ Chuỗi sang Mảng chuẩn
        const formattedMovies = results.map(movie => {
            let safeShowtimes = [];
            if (movie.showtimes) {
                try {
                    // Thử giải mã nếu dữ liệu là chuỗi JSON dạng '["10:00","14:00"]'
                    const parsed = JSON.parse(movie.showtimes);
                    if (Array.isArray(parsed)) {
                        safeShowtimes = parsed;
                    } else if (typeof parsed === 'string') {
                        safeShowtimes = parsed.split(',').map(t => t.trim()).filter(Boolean);
                    }
                } catch (e) {
                    // Nếu là chuỗi thường dạng "10:00, 14:00" thì cắt theo dấu phẩy
                    if (typeof movie.showtimes === 'string') {
                        safeShowtimes = movie.showtimes.split(',').map(t => t.trim()).filter(Boolean);
                    }
                }
            }
            return {
                ...movie,
                showtimes: safeShowtimes // Trả về mảng sạch để Frontend .map() không bị crash
            };
        });

        res.json(formattedMovies);
    });
});

// 2. API Đăng nhập
app.post('/api/users/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length > 0) {
            res.json({ success: true, user: results[0] });
        } else {
            res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' });
        }
    });
});

// 3. API Đăng ký
app.post('/api/users/register', (req, res) => {
    const { username, password } = req.body;
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(sql, [username, password], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Tên đăng nhập đã tồn tại' });
        res.json({ success: true, message: 'Đăng ký thành công' });
    });
});

// 4. API Đặt vé (Lưu vào DB kèm trường Status)
app.post('/api/bookings', (req, res) => {
    // Đã thêm trường status
    const { username, movieId, movieTitle, showtime, seats, comboCount, totalPrice, paymentMethod, status } = req.body;
    
    // Cập nhật câu SQL thêm trường status
    const sql = 'INSERT INTO bookings (username, movieId, movieTitle, showtime, seats, comboCount, totalPrice, paymentMethod, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
    // Cung cấp giá trị status hoặc default
    db.query(sql, [username, movieId, movieTitle, showtime, JSON.stringify(seats), comboCount, totalPrice, paymentMethod, status || 'Đang xử lý...'], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true, message: 'Đặt vé thành công' });
    });
});

// 5. API Lấy Lịch sử Đặt vé của một User (Dành cho trang Lịch sử của Khách)
app.get('/api/bookings/:username', (req, res) => {
    const sql = 'SELECT * FROM bookings WHERE username = ? ORDER BY created_at DESC';
    db.query(sql, [req.params.username], (err, results) => {
        if (err) return res.status(500).json(err);
        // Parse lại cột seats từ JSON string sang mảng Array để React dễ dùng
        const formattedResults = results.map(item => ({
            ...item,
            seats: item.seats ? JSON.parse(item.seats) : []
        }));
        res.json(formattedResults);
    });
});

// ================= CÁC API DÀNH CHO QUẢN TRỊ VIÊN (ADMIN) =================

// 6. API Lấy Toàn bộ Danh sách Người dùng (Dành cho Dashboard)
app.get('/api/users', (req, res) => {
    const sql = 'SELECT id, username, role, status FROM users'; 
    db.query(sql, (err, results) => {
        if (err) {
            const fallbackSql = 'SELECT id, username FROM users';
            db.query(fallbackSql, (err2, fallbackResults) => {
                if (err2) return res.status(500).json({ success: false, message: 'Lỗi server khi lấy users' });
                return res.json({ success: true, users: fallbackResults });
            });
        } else {
            res.json({ success: true, users: results });
        }
    });
});

// 7. API Lấy Toàn bộ Đơn Đặt Vé (Dành cho Dashboard)
app.get('/api/bookings', (req, res) => {
    const sql = 'SELECT * FROM bookings ORDER BY created_at DESC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách đặt vé' });
        
        const formattedBookings = results.map(item => {
            let parsedSeats = [];
            try {
                parsedSeats = item.seats ? JSON.parse(item.seats) : [];
            } catch (e) {
                parsedSeats = item.seats; 
            }
            return { ...item, seats: parsedSeats };
        });

        res.json({ success: true, bookings: formattedBookings });
    });
});

// 8. API MỚI: ADMIN CẬP NHẬT TRẠNG THÁI THANH TOÁN THÀNH CÔNG
app.put('/api/bookings/:id/status', (req, res) => {
    const { status } = req.body;
    const sql = 'UPDATE bookings SET status = ? WHERE id = ?';
    db.query(sql, [status, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Lỗi Database: ' + err.message });
        res.json({ success: true, message: 'Cập nhật trạng thái thành công!' });
    });
});

// 9. API Thêm phim mới vào Database
app.post('/api/movies', (req, res) => {
    const { title, category, section, videoUrl, thumbnail, description, showtimes } = req.body;
    const sql = 'INSERT INTO movies (title, category, section, videoUrl, thumbnail, description, showtimes) VALUES (?, ?, ?, ?, ?, ?, ?)';
    // Ép mảng thành JSON an toàn
    const showtimesStr = Array.isArray(showtimes) ? JSON.stringify(showtimes) : JSON.stringify([]); 
    db.query(sql, [title, category, section, videoUrl, thumbnail, description, showtimesStr], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Lỗi Database: ' + err.message });
        res.json({ success: true, message: 'Thêm phim thành công!', id: result.insertId });
    });
});

// 10. API Cập nhật lại lịch chiếu phim
app.put('/api/movies/:id/showtimes', (req, res) => {
    const { showtimes } = req.body;
    const sql = 'UPDATE movies SET showtimes = ? WHERE id = ?';
    db.query(sql, [JSON.stringify(showtimes), req.params.id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Lỗi Database: ' + err.message });
        res.json({ success: true, message: 'Cập nhật lịch chiếu thành công!' });
    });
});

// 11. API Xóa phim khỏi hệ thống
app.delete('/api/movies/:id', (req, res) => {
    const sql = 'DELETE FROM movies WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Lỗi Database: ' + err.message });
        res.json({ success: true, message: 'Xóa phim thành công!' });
    });
});

// 12. API Xóa User
app.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const sqlDelete = "DELETE FROM users WHERE id = ?";

    db.query(sqlDelete, [userId], (err, result) => {
        if (err) {
            console.error("Lỗi khi xóa user trong MySQL:", err);
            return res.status(500).json({ error: "Lỗi máy chủ khi xóa user." });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy user để xóa." });
        }

        res.status(200).json({ message: "Xóa tài khoản thành công!" });
    });
});

// ================= KHỞI ĐỘNG SERVER =================
app.listen(5000, () => {
    console.log('🚀 Backend Server đang chạy tại http://localhost:5000');
});