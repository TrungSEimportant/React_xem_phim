// src/pages/AdminUsers.jsx
import React, { useState, useEffect } from 'react';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUsersAndBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      let rawUsers = [];
      let rawBookings = [];

      // 1. Gọi API lấy dữ liệu toàn bộ thành viên từ MySQL
      const userRes = await fetch('http://localhost:5000/api/users');
      if (!userRes.ok) throw new Error(`Lỗi kết nối API Users: ${userRes.status}`);
      const userData = await userRes.json();

      if (userData && userData.success && Array.isArray(userData.users)) {
        rawUsers = userData.users;
      } else if (Array.isArray(userData)) {
        rawUsers = userData;
      }

      // 2. Gọi API lấy dữ liệu danh sách vé để đếm đơn cho từng người dùng
      try {
        const bookingRes = await fetch('http://localhost:5000/api/bookings');
        if (bookingRes.ok) {
          const bookingData = await bookingRes.json();
          rawBookings = bookingData.bookings || (Array.isArray(bookingData) ? bookingData : []);
        }
      } catch (bErr) {
        console.warn("Không thể đếm số đơn đặt vé do lỗi kết nối API Bookings:", bErr);
      }

      // 3. Chuẩn hóa dữ liệu: Đếm số lượng đơn của từng user, thêm trường role, status mặc định
      const mappedUsers = rawUsers.map(u => {
        const userBookings = rawBookings.filter(b => b.username === u.username);
        return {
          ...u,
          role: u.role || 'user',
          status: u.status || 'Đang hoạt động',
          totalBookings: userBookings.length
        };
      });

      // Lọc bỏ tài khoản quản trị viên 'admin' ra khỏi danh sách quản lý
      const childUsers = mappedUsers.filter(u => u.username !== 'admin');

      // Cập nhật state hiển thị lên bảng
      setUsers(childUsers);

      // Lưu trữ đồng bộ vào LocalStorage để theo dõi trên Tab Application
      localStorage.setItem('managedUsers', JSON.stringify(childUsers));

      // ĐÚNG ĐỊNH DẠNG LOG YÊU CẦU: Trích xuất tên ra chuỗi dạng "main, vipmain"
      const namesString = childUsers.map(u => u.username).join(', ');
      console.log(`👑 admin ({${namesString}})`);

    } catch (err) {
      console.error("Lỗi đồng bộ dữ liệu API hệ thống:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsersAndBookings();
  }, []);

  // --- HÀM MỚI: XỬ LÝ XÓA USER ---
  const handleDeleteUser = async (id, username) => {
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa tài khoản [${username}] khỏi CSDL MySQL không?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Lỗi khi xóa tài khoản từ server!');
      }

      // Cập nhật lại UI sau khi xóa thành công (không cần reload trang)
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
      
      // Đồng bộ lại vào LocalStorage
      localStorage.setItem('managedUsers', JSON.stringify(updatedUsers));
      
      alert(`Đã xóa tài khoản [${username}] thành công!`);
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      alert("Không thể xóa tài khoản. Vui lòng kiểm tra lại kết nối Backend.");
    }
  };

  if (loading) return <div style={{ color: '#aaa', fontSize: '15px', textAlign: 'center', padding: '30px' }}>⏳ Đang đồng bộ hóa dữ liệu từ MySQL Database...</div>;
  if (error) return <div style={{ color: '#E50914', padding: '20px', background: 'rgba(229,9,20,0.1)', borderRadius: '6px' }}>❌ Lỗi hệ thống: {error}</div>;

  return (
    <div style={{ fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}> Quản Lý Danh Sách Thành Viên ({users.length} người)</h2>
        <button 
          onClick={loadUsersAndBookings} 
          style={{ background: '#222', color: '#fff', border: '1px solid #444', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#333'}
          onMouseLeave={e => e.currentTarget.style.background = '#222'}
        >
           Đồng bộ API MySQL
        </button>
      </div>

      <p style={{ color: '#aaa', margin: '0 0 25px 0', fontSize: '14px' }}>
        Thông tin thành viên được lấy trực tiếp từ bảng dữ liệu người dùng và bảng lịch sử đặt vé trên MySQL Server.
      </p>

      {/* BẢNG THÀNH VIÊN */}
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: '#1c1c1c', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ color: '#aaa', borderBottom: '2px solid #333', background: '#111' }}>
            <th style={{ padding: '15px' }}>Tên người dùng</th>
            <th style={{ padding: '15px' }}>Vai trò</th>
            <th style={{ padding: '15px' }}>Số đơn đã mua</th>
            <th style={{ padding: '15px' }}>Trạng thái tài khoản</th>
            <th style={{ padding: '15px' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Hệ thống chưa có tài khoản thành viên nào đăng ký.</td>
            </tr>
          ) : (
            users.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #252525', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#222'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '15px', fontWeight: 'bold', color: '#fff' }}>{item.username}</td>
                <td style={{ padding: '15px' }}>
                  <span style={{ 
                    background: item.role === 'vip' ? '#ff9800' : '#444', 
                    color: '#fff',
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '11px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {item.role}
                  </span>
                </td>
                <td style={{ padding: '15px', color: '#2196F3', fontWeight: 'bold' }}>
                  {item.totalBookings} đơn đặt vé
                </td>
                <td style={{ padding: '15px', color: '#4CAF50' }}>● {item.status}</td>
                <td style={{ padding: '15px' }}>
                  {/* --- ĐÃ CHỈNH SỬA NÚT THÀNH "XÓA TÀI KHOẢN" --- */}
                  <button 
                    onClick={() => handleDeleteUser(item.id, item.username)}
                    style={{ background: '#E50914', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                  >
                    Xóa tài khoản
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;