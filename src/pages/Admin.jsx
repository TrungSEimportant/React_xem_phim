// src/pages/Admin.jsx
import React, { useState, useEffect } from 'react';

function Admin({ user, movies, setMovies, navigateTo }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState([]);
  
  // SỬA Ở ĐÂY: Khởi tạo thêm trường thumbnail và description cho khớp với mockMovies
  const [newMovie, setNewMovie] = useState({ 
    title: '', 
    category: '', 
    section: 'new', 
    videoUrl: '',
    thumbnail: '',
    description: '' 
  });
  
  // State phục vụ việc chọn xem chi tiết một Người dùng cụ thể
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const localData = localStorage.getItem('movie_bookings');
    if (localData) {
      setBookings(JSON.parse(localData));
    }
  }, []);

  if (!user || user.role !== 'admin') {
    return <h2 style={{ textAlign: 'center', marginTop: '50px', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>Bạn không có quyền truy cập trang này.</h2>;
  }

  const handleSaveMovies = (updatedMovies) => {
    setMovies(updatedMovies);
    localStorage.setItem('app_movies', JSON.stringify(updatedMovies));
  };

  // --- THỐNG KÊ DASHBOARD ---
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const totalTickets = bookings.reduce((sum, b) => sum + (b.seats?.length || 0), 0);

  // --- LẤY DANH SÁCH USER TỪ DANH SÁCH ĐẶT VÉ ---
  const uniqueUsers = [...new Set(bookings.map(b => b.username))];

  // ==================== 1. RENDER DASHBOARD ====================
  const renderDashboard = () => (
    <div style={{ fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>📊 Thống Kê Tổng Quan Hệ Thống</h2>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={{ flex: 1, background: '#222', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #E50914' }}>
          <p style={{ margin: 0, color: '#aaa' }}>Tổng Doanh Thu</p>
          <h3 style={{ margin: '10px 0 0 0', fontSize: '28px', color: '#4CAF50' }}>{totalRevenue.toLocaleString()} đ</h3>
        </div>
        <div style={{ flex: 1, background: '#222', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #2196F3' }}>
          <p style={{ margin: 0, color: '#aaa' }}>Vé Đã Bán</p>
          <h3 style={{ margin: '10px 0 0 0', fontSize: '28px' }}>{totalTickets} vé</h3>
        </div>
        <div style={{ flex: 1, background: '#222', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #FF9800' }}>
          <p style={{ margin: 0, color: '#aaa' }}>Tổng Số Phim</p>
          <h3 style={{ margin: '10px 0 0 0', fontSize: '28px' }}>{movies.length} phim</h3>
        </div>
      </div>
    </div>
  );

  // ==================== 2. RENDER QUẢN LÝ PHIM (ĐÃ CHỈNH SỬA) ====================
  const renderMovies = () => {
    const handleAddMovie = () => {
      // Yêu cầu nhập ít nhất tên phim và ID Youtube
      if (!newMovie.title || !newMovie.videoUrl) return alert('Vui lòng nhập ít nhất tên phim và ID YouTube!');
      
      const movieToAdd = { 
        ...newMovie, 
        id: Date.now().toString(), 
        showtimes: ["10:00", "14:00", "19:00"] 
      };
      
      handleSaveMovies([movieToAdd, ...movies]);
      // Reset lại form
      setNewMovie({ title: '', category: '', section: 'new', videoUrl: '', thumbnail: '', description: '' });
    };

    const handleDelete = (id) => {
      if (window.confirm('Bạn có chắc muốn xóa phim này?')) {
        handleSaveMovies(movies.filter(m => m.id !== id));
      }
    };

    const inputStyle = { padding: '8px 12px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', flex: 1, fontFamily: 'inherit' };

    return (
      <div style={{ fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
        <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>🎬 Quản Lý Thông Tin Phim</h2>
        
        {/* KHUNG NHẬP LIỆU THÊM PHIM MỚI */}
        <div style={{ background: '#222', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Dòng 1 */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input placeholder="Tên phim..." value={newMovie.title} onChange={e => setNewMovie({...newMovie, title: e.target.value})} style={inputStyle} />
            <input placeholder="Thể loại..." value={newMovie.category} onChange={e => setNewMovie({...newMovie, category: e.target.value})} style={inputStyle} />
            <input placeholder="ID YouTube Trailer..." value={newMovie.videoUrl} onChange={e => setNewMovie({...newMovie, videoUrl: e.target.value})} style={inputStyle} />
            <input placeholder="Link Ảnh bìa (Thumbnail)..." value={newMovie.thumbnail} onChange={e => setNewMovie({...newMovie, thumbnail: e.target.value})} style={inputStyle} />
          </div>

          {/* Dòng 2 */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input placeholder="Mô tả phim..." value={newMovie.description} onChange={e => setNewMovie({...newMovie, description: e.target.value})} style={{ ...inputStyle, flex: 2 }} />
            <select value={newMovie.section} onChange={e => setNewMovie({...newMovie, section: e.target.value})} style={{ padding: '8px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', fontFamily: 'inherit' }}>
              <option value="hot">Phim Hot</option>
              <option value="new">Phim Mới</option>
              <option value="upcoming">Sắp Chiếu</option>
            </select>
            <button onClick={handleAddMovie} style={{ padding: '8px 20px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'inherit' }}>+ Thêm Phim</button>
          </div>
          
        </div>

        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #444', color: '#aaa', background: '#111' }}>
              <th style={{ padding: '14px 16px', width: '100px' }}>Hình ảnh</th>
              <th style={{ padding: '14px 16px' }}>Tên Phim</th>
              <th style={{ padding: '14px 16px' }}>Thể loại</th>
              <th style={{ padding: '14px 16px' }}>Chuyên mục</th>
              <th style={{ padding: '14px 16px' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {movies.map(m => (
              <tr key={m.id} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ padding: '14px 16px' }}>
                  <img src={m.thumbnail || 'https://via.placeholder.com/80x45?text=No+Image'} alt={m.title} style={{ width: '80px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} />
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 'bold', color: '#fff' }}>{m.title}</td>
                <td style={{ padding: '14px 16px' }}>{m.category}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ background: '#333', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>
                    {m.section === 'hot' ? '🔥 HOT' : m.section === 'upcoming' ? '⏳ SẮP CHIẾU' : '✨ MỚI'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <button onClick={() => handleDelete(m.id)} style={{ background: '#E50914', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'inherit' }}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // ==================== 3. RENDER QUẢN LÝ NGƯỜI DÙNG ====================
  const renderUsers = () => {
    if (selectedUser) {
      const userBookings = bookings.filter(b => b.username === selectedUser);

      return (
        <div style={{ fontFamily: "'Segoe UI', Roboto, Arial, sans-serif" }}>
          <button 
            onClick={() => setSelectedUser(null)} 
            style={{ background: 'transparent', color: '#aaa', border: '1px solid #555', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', marginBottom: '25px', fontFamily: 'inherit' }}
          >
            ⬅ Quay lại danh sách Người dùng
          </button>

          {/* KHỐI 1: THÔNG TIN TÀI KHOẢN */}
          <div style={{ background: '#222', padding: '25px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#E50914', borderBottom: '1px solid #333', paddingBottom: '10px', fontSize: '20px' }}>👤 Thông Tin Tài Khoản</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '15px', lineHeight: '1.6' }}>
              <p style={{ margin: 0 }}><strong>Tên tài khoản (Username):</strong> <span style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>{selectedUser}</span></p>
              <p style={{ margin: 0 }}><strong>Vai trò:</strong> <span style={{ background: selectedUser === 'admin' ? '#E50914' : '#2196F3', padding: '3px 10px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>{selectedUser === 'admin' ? 'Admin' : 'User'}</span></p>
              <p style={{ margin: 0 }}><strong>Ngày đăng ký tài khoản:</strong> 15/01/2026</p>
              <p style={{ margin: 0 }}><strong>Ngày đăng nhập gần nhất:</strong> {new Date().toLocaleDateString('vi-VN')}</p>
              <p style={{ margin: 0 }}><strong>Trạng thái tài khoản:</strong> <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>● Hoạt động</span></p>
            </div>
          </div>

          {/* KHỐI 2: LỊCH SỬ ĐẶT VÉ CHI TIẾT */}
          <div style={{ background: '#222', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#E50914', borderBottom: '1px solid #333', paddingBottom: '10px', fontSize: '20px' }}>🎟️ Lịch Sử Đặt Vé</h3>
            {userBookings.length === 0 ? (
              <p style={{ color: '#aaa', fontStyle: 'italic' }}>Người dùng này chưa thực hiện giao dịch đặt vé nào.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #444', color: '#aaa', background: '#111' }}>
                      <th style={{ padding: '14px 16px' }}>Mã đơn đặt vé</th>
                      <th style={{ padding: '14px 16px' }}>Tên phim</th>
                      <th style={{ padding: '14px 16px' }}>Rạp chiếu</th>
                      <th style={{ padding: '14px 16px' }}>Suất chiếu</th>
                      <th style={{ padding: '14px 16px' }}>Ghế đã đặt</th>
                      <th style={{ padding: '14px 16px' }}>Số lượng</th>
                      <th style={{ padding: '14px 16px' }}>Tổng tiền</th>
                      <th style={{ padding: '14px 16px' }}>Phương thức</th>
                      <th style={{ padding: '14px 16px' }}>Ngày đặt</th>
                      <th style={{ padding: '14px 16px' }}>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userBookings.map((b, index) => (
                      <tr key={b.id || index} style={{ borderBottom: '1px solid #333', transition: 'background 0.2s' }}>
                        <td style={{ padding: '14px 16px', color: '#bbb', fontWeight: '500' }}>{b.id || `HD${Date.now() - index}`}</td>
                        <td style={{ padding: '14px 16px', fontWeight: 'bold', color: '#fff' }}>{b.movieTitle || 'Chưa cập nhật'}</td>
                        <td style={{ padding: '14px 16px', color: '#ccc' }}>{b.theater || 'Rạp 1 - Netflux Cinema'}</td>
                        <td style={{ padding: '14px 16px', color: '#FF9800', fontWeight: 'bold' }}>{b.showtime}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ background: '#444', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold', color: '#fff' }}>
                            {Array.isArray(b.seats) ? b.seats.join(', ') : b.seats}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#ccc' }}>{b.seats ? b.seats.length : 0} vé</td>
                        <td style={{ padding: '14px 16px', color: '#4CAF50', fontWeight: 'bold' }}>{(b.totalPrice || 0).toLocaleString('vi-VN')} đ</td>
                        <td style={{ padding: '14px 16px', color: '#2196F3', fontWeight: 'bold' }}>
                          {b.paymentMethod || 'Chuyển khoản'}
                        </td>
                        <td style={{ padding: '14px 16px', color: '#ccc' }}>{b.bookingDate || new Date().toLocaleDateString('vi-VN')}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ backgroundColor: 'rgba(76, 175, 80, 0.15)', color: '#4CAF50', border: '1px solid #4CAF50', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' }}>
                            ● {b.status || 'Đã thanh toán'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div style={{ fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
        <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>👥 Quản Lý Danh Sách Người Dùng</h2>
        <p style={{ color: '#aaa', marginBottom: '20px' }}>Danh sách thành viên đăng ký hệ thống (Bấm vào hàng bất kỳ để xem chi tiết thông tin & hóa đơn):</p>
        
        <div style={{ background: '#222', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #444', background: '#111', color: '#aaa' }}>
                <th style={{ padding: '15px 20px' }}>Tên người dùng</th>
                <th style={{ padding: '15px 20px' }}>Vai trò</th>
                <th style={{ padding: '15px 20px' }}>Trạng thái tài khoản</th>
                <th style={{ textAlign: 'right', paddingRight: '20px', padding: '15px 20px' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {uniqueUsers.map((uname, idx) => (
                <tr 
                  key={idx} 
                  onClick={() => setSelectedUser(uname)}
                  style={{ borderBottom: '1px solid #333', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#2a2a2a'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', color: '#fff' }}>
                    <span style={{ fontSize: '18px' }}>👤</span> {uname}
                  </td>
                  <td style={{ padding: '15px 20px' }}>
                    <span style={{ background: uname === 'admin' ? '#E50914' : '#444', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                      {uname === 'admin' ? 'ADMIN' : 'USER'}
                    </span>
                  </td>
                  <td style={{ padding: '15px 20px' }}><span style={{ color: '#4CAF50', fontWeight: '500' }}>● Hoạt động</span></td>
                  <td style={{ textAlign: 'right', paddingRight: '20px', padding: '15px 20px' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedUser(uname); }}
                      style={{ background: '#2196F3', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', fontFamily: 'inherit' }}
                    >
                      Xem Chi Tiết ➔
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ==================== 4. RENDER LỊCH CHIẾU ====================
  const renderShowtimes = () => {
    const handleUpdateShowtime = (id, showtimeStr) => {
      const times = showtimeStr.split(',').map(t => t.trim()).filter(t => t !== '');
      const updatedMovies = movies.map(m => m.id === id ? { ...m, showtimes: times } : m);
      handleSaveMovies(updatedMovies);
      alert('🎉 Đã cập nhật lịch chiếu mới thành công!');
    };

    return (
      <div style={{ fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
        <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>⏰ Quản Lý Thiết Lập Lịch Chiếu</h2>
        <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
          {movies.map(m => (
            <div key={m.id} style={{ background: '#222', padding: '20px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#fff' }}>{m.title}</h4>
                <input 
                  type="text" 
                  defaultValue={(m.showtimes || []).join(', ')} 
                  id={`showtime-${m.id}`}
                  placeholder="Ví dụ: 09:00, 13:30, 16:45, 21:00"
                  style={{ width: '80%', padding: '10px', background: '#333', border: '1px solid #444', color: '#fff', borderRadius: '4px', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>
              <button 
                onClick={() => handleUpdateShowtime(m.id, document.getElementById(`showtime-${m.id}`).value)} 
                style={{ background: '#2196F3', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'inherit' }}>
                Lưu Lịch Chiếu
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      {/* THANH SIDEBAR BÊN TRÁI */}
      <div style={{ width: '260px', background: '#000', borderRight: '1px solid #222', padding: '20px 0' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {[
            { id: 'dashboard', label: '📊 Dashboard tổng quan' },
            { id: 'movies', label: '🎬 Quản lý phim' },
            { id: 'users', label: '👥 Quản lý người dùng' },
            { id: 'showtimes', label: '⏰ Quản lý lịch chiếu' }
          ].map(tab => (
            <li 
              key={tab.id} 
              onClick={() => { setActiveTab(tab.id); setSelectedUser(null); }}
              style={{ padding: '16px 25px', cursor: 'pointer', color: activeTab === tab.id ? '#fff' : '#aaa', background: activeTab === tab.id ? '#222' : 'transparent', borderLeft: activeTab === tab.id ? '4px solid #E50914' : '4px solid transparent', fontWeight: activeTab === tab.id ? 'bold' : 'normal', transition: 'all 0.2s' }}
            >
              {tab.label}
            </li>
          ))}
        </ul>
      </div>

      {/* KHU VỰC HIỂN THỊ NỘI DUNG CHÍNH */}
      <div style={{ flex: 1, padding: '40px', background: '#141414', color: '#fff' }}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'movies' && renderMovies()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'showtimes' && renderShowtimes()}
      </div>
    </div>
  );
}

export default Admin;