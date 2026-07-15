# Hướng Dẫn Cài Đặt Netflux

## 1. Yêu cầu hệ thống
* Node.js (v14.x trở lên).
* MySQL (XAMPP/WAMP).

---

## 2. Cấu hình Cơ sở dữ liệu (MySQL)
* Tạo database tên: `netflux_db` (Host: `localhost` | User: `root` | Password: `''`).
* Khởi tạo 3 bảng dữ liệu chính: `movies`, `users`, `bookings`.

---

## 3. Khởi chạy Backend (Node.js/Express)
Mở terminal tại thư mục Backend và chạy:
``npm install express mysql2 cors
node <tên-file-chính>.js  # Ví dụ: server.js``

---

## 4. Khởi chạy Frontend (ReactJS)
Mở terminal mới tại thư mục Frontend và chạy:
`npm install`
`npm start ` `Hoặc npm run dev nếu dùng Vite`
