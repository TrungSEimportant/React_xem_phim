Hướng Dẫn Cài Đặt Netflux
1. Yêu cầu hệ thống

Node.js (v14.x trở lên).

MySQL (XAMPP/WAMP).

2. Cấu hình Cơ sở dữ liệu (MySQL)

Tạo database tên: netflux_db (Host: localhost | User: root | Password: '').

Khởi tạo 3 bảng dữ liệu chính: movies, users, bookings.

3. Khởi chạy Backend (Node.js/Express)
Mở terminal tại thư mục Backend và chạy:

Bash
npm install express mysql2 cors
node <tên-file-chính>.js  # Ví dụ: server.js
(Server sẽ chạy tại http://localhost:5000)

4. Khởi chạy Frontend (ReactJS)
Mở terminal mới tại thư mục Frontend và chạy:

Bash
npm install
npm start  # Hoặc npm run dev nếu dùng Vite
(Ứng dụng chạy tại http://localhost:3000 hoặc http://localhost:5173)

5. Lưu ý về Tài khoản

User (Khách hàng): Tự đăng ký trực tiếp trên giao diện web.

Admin (Quản trị viên): Cấp quyền thủ công trong MySQL bằng cách sửa cột role = 'admin' trong bảng users.
