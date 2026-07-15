// src/pages/Admin.jsx
import React, { useState, useEffect } from 'react';
import AdminUsers from './AdminUsers';

function Admin({ user, movies, setMovies, navigateTo }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState([]);
  const [editingShowtimes, setEditingShowtimes] = useState({});

  const [newMovie, setNewMovie] = useState({ 
    title: '', 
    category: '', 
    section: 'new', 
    videoUrl: '',
    thumbnail: '',
    description: '',
    showtimes: '10:00, 14:00, 18:00, 21:00' 
  });

  // Tải lịch sử đặt vé từ API phục vụ Dashboard
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/bookings');
        const data = await res.json();
        if (Array.isArray(data)) {
          setBookings(data);
        } else if (data && data.bookings) {
          setBookings(data.bookings);
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách đặt vé từ API:", err);
        const localData = localStorage.getItem('movie_bookings');
        if (localData) setBookings(JSON.parse(localData));
      }
    };
    fetchBookings();
  }, [activeTab]);

  if (!user || user.role !== 'admin') {
    return <h2 style={{ textAlign: 'center', marginTop: '50px', fontFamily: "'Segoe UI', Roboto, sans-serif", color: '#fff' }}>Bạn không có quyền truy cập trang này.</h2>;
  }

  const getSafeShowtimes = (st) => {
    if (!st) return [];
    if (Array.isArray(st)) return st;
    if (typeof st === 'string') {
      try { 
        const parsed = JSON.parse(st);
        if (Array.isArray(parsed)) return parsed;
      } catch { 
        return st.split(',').map(x => x.trim()).filter(Boolean); 
      }
    }
    return [];
  };

  // ================= XỬ LÝ DUYỆT TRẠNG THÁI THANH TOÁN (MỚI) =================
  const handleConfirmPayment = async (bookingId) => {
    if (window.confirm("Bạn có chắc chắn muốn duyệt vé này thành 'Thành công'?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Thành công' })
        });
        const data = await res.json();

        if (data.success || res.ok) {
          // Cập nhật state ở Frontend
          const updatedBookings = bookings.map(b => 
            b.id === bookingId ? { ...b, status: 'Thành công' } : b
          );
          setBookings(updatedBookings);
          alert("Duyệt trạng thái thành công!");
        } else {
          alert("Lỗi server: " + data.message);
        }
      } catch (err) {
        alert("Lỗi kết nối API duyệt thanh toán!");
      }
    }
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    if (!newMovie.title || !newMovie.category || !newMovie.thumbnail) {
      return alert("Vui lòng nhập đầy đủ các thông tin bắt buộc (*): Tên phim, Thể loại, Thumbnail!");
    }
    
    const rawShowtimes = newMovie.showtimes || "10:00, 14:00, 18:00, 21:00";
    const showtimesArray = rawShowtimes.split(',').map(time => time.trim()).filter(Boolean);
    
    const movieDataToSend = {
      title: newMovie.title,
      category: newMovie.category,
      section: newMovie.section || 'new',
      videoUrl: newMovie.videoUrl || '',
      thumbnail: newMovie.thumbnail,
      description: newMovie.description || '',
      showtimes: showtimesArray 
    };

    try {
      const res = await fetch('http://localhost:5000/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movieDataToSend)
      });
      const data = await res.json();

      if (data.success || res.ok) {
        const serverGeneratedId = data.id || data.insertId || String(Date.now());
        const completedNewMovie = { ...movieDataToSend, id: serverGeneratedId, showtimes: showtimesArray };

        const updatedMovies = [completedNewMovie, ...movies];
        setMovies(updatedMovies);
        localStorage.setItem('app_movies', JSON.stringify(updatedMovies));

        alert("🎬 Thêm phim mới và đồng bộ lên Database thành công!");
        setNewMovie({ 
          title: '', category: '', section: 'new', videoUrl: '', 
          thumbnail: '', description: '', showtimes: '10:00, 14:00, 18:00, 21:00' 
        });
      } else {
        alert("Server báo lỗi: " + (data.message || "Không thể thêm phim"));
      }
    } catch (err) {
      console.error("Lỗi kết nối POST phim:", err);
      alert("Lỗi kết nối API Server. Hãy đảm bảo NodeJS Backend (cổng 5000) đang chạy!");
    }
  };

  const handleDeleteMovie = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bộ phim này khỏi hệ thống không?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/movies/${id}`, { method: 'DELETE' });
        const data = await res.json();
        
        if (data.success || res.ok) {
          const updated = movies.filter(m => m.id !== id);
          setMovies(updated);
          localStorage.setItem('app_movies', JSON.stringify(updated));
          alert("Xóa phim thành công khỏi Database!");
        } else {
          alert("Lỗi xóa: " + data.message);
        }
      } catch (err) {
        const updated = movies.filter(m => m.id !== id);
        setMovies(updated);
        localStorage.setItem('app_movies', JSON.stringify(updated));
        alert("Lỗi kết nối Server, hệ thống đã tạm xóa cục bộ!");
      }
    }
  };

  const handleShowtimeChange = (id, value) => {
    setEditingShowtimes(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveShowtimes = async (movie) => {
    const val = editingShowtimes[movie.id] !== undefined ? editingShowtimes[movie.id] : getSafeShowtimes(movie.showtimes).join(', ');
    const updatedShowtimesArray = val.split(',').map(s => s.trim()).filter(Boolean);
    
    try {
      const res = await fetch(`http://localhost:5000/api/movies/${movie.id}/showtimes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showtimes: updatedShowtimesArray })
      });
      const data = await res.json();

      if (data.success || res.ok) {
        const updatedMovies = movies.map(m => m.id === movie.id ? { ...m, showtimes: updatedShowtimesArray } : m);
        setMovies(updatedMovies);
        localStorage.setItem('app_movies', JSON.stringify(updatedMovies));
        alert(`Cập nhật lịch chiếu thành công vào Database!`);
      } else {
        alert("Lỗi server: " + data.message);
      }
    } catch (err) {
      alert("Lỗi kết nối API cập nhật giờ chiếu!");
    }
  };

  const totalSales = bookings.reduce((sum, item) => sum + (Number(item.totalPrice) || 0), 0);
  const totalTickets = bookings.reduce((sum, item) => {
    let seatCount = 0;
    if (item && item.seats) {
      if (Array.isArray(item.seats)) {
        seatCount = item.seats.length;
      } else if (typeof item.seats === 'string') {
        try { 
          const parsed = JSON.parse(item.seats); 
          seatCount = Array.isArray(parsed) ? parsed.length : item.seats.split(',').length;
        } catch { 
          seatCount = item.seats.split(',').filter(Boolean).length; 
        }
      }
    }
    return sum + (seatCount || 1);
  }, 0);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#141414', color: '#fff', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      {/* THANH SIDEBAR BÊN TRÁI */}
      <div style={{ width: '260px', background: '#000', borderRight: '1px solid #222', padding: '20px 0' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {[
            { id: 'dashboard', label: ' Dashboard tổng quan' },
            { id: 'movies', label: ' Quản lý phim' },
            { id: 'users', label: ' Quản lý người dùng' },
            { id: 'showtimes', label: ' Quản lý lịch chiếu' }
          ].map(tab => (
            <li key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ padding: '16px 25px', cursor: 'pointer', color: activeTab === tab.id ? '#fff' : '#aaa', background: activeTab === tab.id ? '#222' : 'transparent', borderLeft: activeTab === tab.id ? '4px solid #E50914' : '4px solid transparent', fontWeight: activeTab === tab.id ? 'bold' : 'normal', transition: 'all 0.2s' }}>
              {tab.label}
            </li>
          ))}
        </ul>
      </div>

      {/* KHU VỰC HIỂN THỊ NỘI DUNG CHÍNH */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 style={{ margin: '0 0 30px 0' }}> Báo Cáo Doanh Thu Hệ Thống</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              <div style={{ background: '#1c1c1c', padding: '25px', borderRadius: '8px', border: '1px solid #333' }}>
                <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>Tổng Doanh Thu</p>
                <h2 style={{ margin: '10px 0 0 0', color: '#E50914', fontSize: '28px' }}>{totalSales.toLocaleString('vi-VN')} đ</h2>
              </div>
              <div style={{ background: '#1c1c1c', padding: '25px', borderRadius: '8px', border: '1px solid #333' }}>
                <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>Tổng Số Vé Bán Được</p>
                <h2 style={{ margin: '10px 0 0 0', color: '#4CAF50', fontSize: '28px' }}>{totalTickets} vé</h2>
              </div>
              <div style={{ background: '#1c1c1c', padding: '25px', borderRadius: '8px', border: '1px solid #333' }}>
                <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>Tổng Đơn Đặt Hàng</p>
                <h2 style={{ margin: '10px 0 0 0', color: '#2196F3', fontSize: '28px' }}>{bookings.length} đơn</h2>
              </div>
            </div>

            <h3 style={{ marginBottom: '15px' }}>Nhật Ký Đặt Vé Mới Nhất</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: '#1c1c1c', borderRadius: '8px', overflow: 'hidden' }}>
              <thead>
                <tr style={{ color: '#aaa', borderBottom: '2px solid #333', background: '#111' }}>
                  <th style={{ padding: '15px' }}>Tên Khách</th>
                  <th style={{ padding: '15px' }}>Phim</th>
                  <th style={{ padding: '15px' }}>Giờ Chiếu</th>
                  <th style={{ padding: '15px' }}>Tổng Tiền</th>
                  <th style={{ padding: '15px' }}>Trạng Thái</th> {/* CỘT MỚI */}
                  <th style={{ padding: '15px' }}>Hành Động</th>  {/* CỘT MỚI */}
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Chưa có giao dịch nào từ API.</td></tr>
                ) : bookings.map((item, idx) => (
                  <tr key={item.id || idx} style={{ borderBottom: '1px solid #252525' }}>
                    <td style={{ padding: '15px', fontWeight: 'bold', color: '#2196F3' }}>{item.username}</td>
                    <td style={{ padding: '15px' }}>{item.movieTitle}</td>
                    <td style={{ padding: '15px', color: '#ff9800' }}>{item.showtime}</td>
                    <td style={{ padding: '15px', fontWeight: 'bold', color: '#E50914' }}>{(Number(item.totalPrice) || 0).toLocaleString('vi-VN')} đ</td>
                    
                    {/* CỘT TRẠNG THÁI HIỂN THỊ */}
                    <td style={{ padding: '15px', fontWeight: 'bold', color: item.status === 'Thành công' ? '#4CAF50' : '#FF9800' }}>
                      {item.status || 'Đang xử lý...'}
                    </td>
                    
                    {/* CỘT HÀNH ĐỘNG */}
                    <td style={{ padding: '15px' }}>
                      {item.status !== 'Thành công' ? (
                        <button 
                          onClick={() => handleConfirmPayment(item.id)}
                          style={{ background: '#4CAF50', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          ✔ Duyệt
                        </button>
                      ) : (
                        <span style={{ color: '#aaa', fontSize: '13px' }}>Hoàn tất</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: QUẢN LÝ PHIM (FORM ĐÃ ĐỒNG BỘ API TOÀN DIỆN) */}
        {activeTab === 'movies' && (
          <div>
            <h2 style={{ margin: '0 0 25px 0' }}> Quản Lý Kho Phim </h2>
            
            <form onSubmit={handleAddMovie} style={{ background: '#1c1c1c', padding: '25px', borderRadius: '8px', border: '1px solid #333', marginBottom: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ gridColumn: '1 / -1' }}><h3 style={{ margin: '0 0 10px 0', color: '#E50914' }}>Thêm phim mới</h3></div>
              <input type="text" placeholder="Tên phim (*)" value={newMovie.title} onChange={e => setNewMovie({...newMovie, title: e.target.value})} style={inputStyle} required/>
              <input type="text" placeholder="Thể loại (*)" value={newMovie.category} onChange={e => setNewMovie({...newMovie, category: e.target.value})} style={inputStyle} required/>
              <input type="text" placeholder="ID Youtube Trailer (Ví dụ: dQw4w9WgXcQ)" value={newMovie.videoUrl} onChange={e => setNewMovie({...newMovie, videoUrl: e.target.value})} style={inputStyle} />
              <input type="text" placeholder="Link ảnh Thumbnail (*)" value={newMovie.thumbnail} onChange={e => setNewMovie({...newMovie, thumbnail: e.target.value})} style={inputStyle} required/>
              <select value={newMovie.section} onChange={e => setNewMovie({...newMovie, section: e.target.value})} style={inputStyle}>
                <option value="hot">Phim Đang Hot</option>
                <option value="new">Phim Mới Phát Hành</option>
                <option value="upcoming">Phim Sắp Chiếu</option>
              </select>
              <input type="text" placeholder="Khung giờ chiếu (* tách bằng dấu phẩy)" value={newMovie.showtimes} onChange={e => setNewMovie({...newMovie, showtimes: e.target.value})} style={inputStyle} required />
              <input type="text" placeholder="Mô tả nội dung phim ngắn..." value={newMovie.description} onChange={e => setNewMovie({...newMovie, description: e.target.value})} style={{ gridColumn: '1 / -1', ...inputStyle }} />
              <button type="submit" style={{ gridColumn: '1 / -1', background: '#E50914', color: '#fff', border: 'none', padding: '14px', fontSize: '16px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}>
                 Lưu Phim Mới 
              </button>
            </form>

            <h3>Danh sách phim hiện tại ({movies.length} phim)</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: '#1c1c1c', borderRadius: '8px', marginTop: '15px' }}>
              <thead>
                <tr style={{ color: '#aaa', borderBottom: '2px solid #333', background: '#111' }}>
                  <th style={{ padding: '15px' }}>Poster</th>
                  <th style={{ padding: '15px' }}>Tên Phim</th>
                  <th style={{ padding: '15px' }}>Thể Loại</th>
                  <th style={{ padding: '15px' }}>Lịch Chiếu</th>
                  <th style={{ padding: '15px' }}>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {movies.map(movie => (
                  <tr key={movie.id} style={{ borderBottom: '1px solid #252525' }}>
                    <td style={{ padding: '10px 15px' }}><img src={movie.thumbnail} alt="" style={{ width: '45px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{movie.title}</td>
                    <td style={{ padding: '15px', color: '#ccc' }}>{movie.category}</td>
                    <td style={{ padding: '15px' }}>
                      {getSafeShowtimes(movie.showtimes).map(t => (
                        <span key={t} style={{ background: '#444', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', margin: '2px', display: 'inline-block' }}>{t}</span>
                      ))}
                    </td>
                    <td style={{ padding: '15px' }}>
                      <button onClick={() => handleDeleteMovie(movie.id)} style={{ background: 'transparent', color: '#E50914', border: '1px solid #E50914', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Xóa </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: QUẢN LÝ NGƯỜI DÙNG */}
        {activeTab === 'users' && <AdminUsers />}

        {/* TAB 4: QUẢN LÝ LỊCH CHIẾU */}
        {activeTab === 'showtimes' && (
          <div>
            <h2 style={{ margin: '0 0 25px 0' }}>Cấu Hình Khung Giờ </h2>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: '#1c1c1c', borderRadius: '8px' }}>
              <thead>
                <tr style={{ color: '#aaa', borderBottom: '2px solid #333', background: '#111' }}>
                  <th style={{ padding: '15px' }}>Tên Phim</th>
                  <th style={{ padding: '15px', width: '50%' }}>Các Khung Giờ Đang Chiếu</th>
                  <th style={{ padding: '15px' }}>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {movies.map(movie => (
                  <tr key={movie.id} style={{ borderBottom: '1px solid #252525' }}>
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{movie.title}</td>
                    <td style={{ padding: '15px' }}>
                      <input 
                        type="text" 
                        value={editingShowtimes[movie.id] !== undefined ? editingShowtimes[movie.id] : getSafeShowtimes(movie.showtimes).join(', ')}
                        onChange={(e) => handleShowtimeChange(movie.id, e.target.value)}
                        style={{ width: '100%', padding: '10px', background: '#333', color: '#fff', border: '1px solid #555', borderRadius: '4px', outline: 'none' }}
                      />
                    </td>
                    <td style={{ padding: '15px' }}>
                      <button onClick={() => handleSaveShowtimes(movie)} style={{ background: '#4CAF50', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Lưu
                      </button>
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

const inputStyle = {
  width: '100%', padding: '12px', background: '#333', color: '#fff', 
  border: 'none', borderRadius: '4px', outline: 'none'
};

export default Admin;