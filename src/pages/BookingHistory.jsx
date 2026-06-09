import React, { useEffect, useState } from 'react';

function BookingHistory({ user, navigateTo }) {
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    // Đọc toàn bộ danh sách vé từ localStorage
    const localData = localStorage.getItem('movie_bookings');
    if (localData && user) {
      const allBookings = JSON.parse(localData);
      // Lọc danh sách: Chỉ lấy vé thuộc về tài khoản đang đăng nhập hiện tại
      const userBookings = allBookings.filter(item => item.username === user.name);
      setHistoryList(userBookings);
    }
  }, [user]);

  return (
    <div style={{ padding: '40px', color: '#fff', backgroundColor: '#141414', minHeight: '100vh', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Nút quay về trang chủ */}
      <button 
        onClick={() => navigateTo('home')} 
        style={{ background: 'transparent', color: '#aaa', border: '1px solid #555', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px' }}>
        ⬅ Quay lại Trang chủ
      </button>

      <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '15px', color: '#fff', fontSize: '28px' }}>
         Lịch Sử Đặt Vé & Thanh Toán
      </h2>

      {historyList.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '80px', padding: '40px', background: '#222', borderRadius: '8px' }}>
          <p style={{ color: '#aaa', fontSize: '18px', margin: '0 0 20px 0' }}>Bạn chưa có lịch sử giao dịch đặt vé nào.</p>
          <button 
            onClick={() => navigateTo('home')} 
            style={{ background: '#E50914', color: '#fff', border: 'none', padding: '12px 30px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}
          >
            Đặt vé phim ngay
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
          {historyList.map((ticket) => (
            <div 
              key={ticket.id} 
              style={{ display: 'flex', gap: '20px', background: '#222', padding: '20px', borderRadius: '8px', border: '1px solid #333', alignItems: 'center', flexWrap: 'wrap' }}
            >
              {/* Ảnh thu nhỏ phim */}
              <img 
                src={ticket.thumbnail} 
                alt={ticket.movieTitle} 
                style={{ width: '120px', height: '160px', objectFit: 'cover', borderRadius: '6px', background: '#333' }}
              />

              {/* Thông tin chi tiết vé */}
              <div style={{ flex: '1', minWidth: '250px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#E50914', fontSize: '22px' }}>{ticket.movieTitle}</h3>
                <p style={{ margin: '5px 0', color: '#ccc' }}>🔖 Mã hóa đơn: <strong style={{ color: '#fff' }}>{ticket.id}</strong></p>
                <p style={{ margin: '5px 0', color: '#ccc' }}>Ngày thanh toán: <span>{ticket.bookingDate}</span></p>
                <p style={{ margin: '5px 0', color: '#ccc' }}>Suất chiếu: <span style={{ color: '#fff', fontWeight: 'bold' }}>{ticket.showtime}</span></p>
                <p style={{ margin: '5px 0', color: '#ccc' }}>Số ghế đã chọn: <span style={{ color: '#fff', fontWeight: 'bold', background: '#333', padding: '2px 8px', borderRadius: '4px' }}>{ticket.seats.join(', ')}</span></p>
                <p style={{ margin: '5px 0', color: '#ccc' }}>Bắp & Nước: <span>{ticket.comboCount > 0 ? `${ticket.comboCount} Combo` : 'Không kèm combo'}</span></p>
              </div>

              {/* Trạng thái thanh toán và số tiền tổng */}
              <div style={{ textAlign: 'right', minWidth: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
                <div>
                  <span style={{ backgroundColor: 'rgba(46, 125, 50, 0.2)', color: '#4CAF50', border: '1px solid #4CAF50', padding: '6px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
                    ● {ticket.status}
                  </span>
                </div>
                <div style={{ marginTop: '10px' }}>
                  <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>Tổng tiền thanh toán</p>
                  <h3 style={{ margin: '5px 0 0 0', color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>
                    {ticket.totalPrice.toLocaleString('vi-VN')} đ
                  </h3>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default BookingHistory;