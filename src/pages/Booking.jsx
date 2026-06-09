import React, { useState } from 'react';

const TICKET_PRICE = 85000;
const COMBO_PRICE = 65000;

function Booking({ movie, user, onCancel, onSuccess }) {
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [comboCount, setComboCount] = useState(0);

  const rows = ['A', 'B', 'C', 'D', 'E'];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];

  const toggleSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const totalTickets = selectedSeats.length * TICKET_PRICE;
  const totalCombos = comboCount * COMBO_PRICE;
  const totalPrice = totalTickets + totalCombos;

  // XỬ LÝ XÁC NHẬN THANH TOÁN & LƯU LỊCH SỬ
  const handleConfirm = () => {
    if (!selectedTime) return alert('⚠️ Vui lòng chọn suất chiếu!');
    if (selectedSeats.length === 0) return alert('⚠️ Vui lòng chọn ít nhất 1 ghế ngồi!');
    
    // Tạo đối tượng hóa đơn đặt vé thành công
    const newBooking = {
      id: 'HD-' + Date.now(), // Mã hóa đơn ngẫu nhiên dựa trên thời gian
      username: user.name,   // Lưu theo tên tài khoản đang đăng nhập
      movieTitle: movie.title,
      thumbnail: movie.thumbnail,
      showtime: selectedTime,
      seats: selectedSeats,
      comboCount: comboCount,
      totalPrice: totalPrice,
      bookingDate: new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }),
      status: 'Thành công'
    };

    // Lấy danh sách lịch sử cũ từ localStorage (nếu có) và push vé mới vào
    const localData = localStorage.getItem('movie_bookings');
    const currentBookings = localData ? JSON.parse(localData) : [];
    currentBookings.unshift(newBooking); // Đưa vé mới lên đầu danh sách
    localStorage.setItem('movie_bookings', JSON.stringify(currentBookings));

    alert(`🎉 CHÚC MỪNG ${user.name.toUpperCase()}!\n\n🎬 Phim: ${movie.title}\n⏰ Suất chiếu: ${selectedTime}\n💺 Ghế: ${selectedSeats.join(', ')}\n🍿 Combo: ${comboCount} phần\n💰 Đã thanh toán thành công: ${totalPrice.toLocaleString('vi-VN')} VNĐ`);
    
    // Chuyển hướng về trang lịch sử đặt vé để kiểm tra ngay lập tức
    onSuccess(); 
  };

  return (
    <div style={{ padding: '40px', color: '#fff', maxWidth: '900px', margin: '0 auto', backgroundColor: '#141414', minHeight: '100vh', borderRadius: '8px' }}>
      <button 
        onClick={onCancel} 
        style={{ background: 'transparent', color: '#aaa', border: '1px solid #555', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px' }}>
        ⬅ Quay lại chi tiết phim
      </button>

      <h2 style={{ color: '#E50914', borderBottom: '1px solid #333', paddingBottom: '10px', marginTop: 0 }}>
        🎫 Đặt vé: {movie.title}
      </h2>

      {/* Chọn suất chiếu */}
      <div style={{ marginTop: '30px' }}>
        <h3 style={{ marginBottom: '15px' }}>1. Chọn suất chiếu (Hôm nay)</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {movie.showtimes?.map(time => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              style={{
                background: selectedTime === time ? '#E50914' : '#333',
                color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold'
              }}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Sơ đồ chọn ghế */}
      <div style={{ marginTop: '40px' }}>
        <h3 style={{ marginBottom: '15px' }}>2. Chọn ghế ngồi ({TICKET_PRICE.toLocaleString('vi-VN')} VNĐ/ghế)</h3>
        <div style={{ background: '#222', padding: '30px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ background: '#555', height: '8px', width: '80%', margin: '0 auto 30px auto', borderRadius: '50%', boxShadow: '0 15px 20px rgba(255,255,255,0.15)' }}></div>
          <p style={{ color: '#888', marginBottom: '30px', fontSize: '12px', letterSpacing: '2px' }}>MÀN HÌNH CHÍNH</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
            {rows.map(row => (
              <div key={row} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ width: '25px', fontWeight: 'bold', color: '#aaa' }}>{row}</span>
                {cols.map(col => {
                  const seatId = `${row}${col}`;
                  const isSelected = selectedSeats.includes(seatId);
                  return (
                    <button
                      key={seatId}
                      onClick={() => toggleSeat(seatId)}
                      style={{
                        width: '42px', height: '42px',
                        background: isSelected ? '#E50914' : '#444',
                        color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
                      }}
                    >
                      {col}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Thêm Bắp nước */}
      <div style={{ marginTop: '40px' }}>
        <h3 style={{ marginBottom: '15px' }}>3. Thêm Bắp & Nước ({COMBO_PRICE.toLocaleString('vi-VN')} VNĐ/combo)</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: '#222', padding: '20px', borderRadius: '8px' }}>
          <div style={{ fontSize: '35px' }}>🍿🥤</div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>Combo Tiêu Chuẩn</h4>
            <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>1 Bắp rang bơ lớn + 1 Nước ngọt cỡ vừa</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => setComboCount(Math.max(0, comboCount - 1))} style={{ width: '40px', height: '40px', background: '#444', color: '#fff', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '20px' }}>-</button>
            <span style={{ fontSize: '22px', fontWeight: 'bold', width: '25px', textAlign: 'center' }}>{comboCount}</span>
            <button onClick={() => setComboCount(comboCount + 1)} style={{ width: '40px', height: '40px', background: '#E50914', color: '#fff', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '20px' }}>+</button>
          </div>
        </div>
      </div>

      {/* Tổng kết đơn hàng */}
      <div style={{ marginTop: '40px', background: '#111', border: '1px solid #333', padding: '25px', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🛒 Tóm tắt đơn hàng</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#ccc' }}>
          <span>Suất chiếu:</span> <span style={{ fontWeight: 'bold', color: '#fff' }}>{selectedTime || 'Chưa chọn'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#ccc' }}>
          <span>Ghế đã chọn ({selectedSeats.length}):</span> <span style={{ fontWeight: 'bold', color: '#fff' }}>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Chưa chọn'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#ccc' }}>
          <span>Tiền vé:</span> <span>{totalTickets.toLocaleString('vi-VN')} đ</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#ccc' }}>
          <span>Combo Bắp Nước ({comboCount}):</span> <span>{totalCombos.toLocaleString('vi-VN')} đ</span>
        </div>
        <hr style={{ borderColor: '#333', margin: '20px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '20px' }}>Tổng thanh toán:</span>
          <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#E50914' }}>{totalPrice.toLocaleString('vi-VN')} đ</span>
        </div>
        <button 
          onClick={handleConfirm}
          style={{ width: '100%', background: '#E50914', color: '#fff', border: 'none', padding: '16px', borderRadius: '4px', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold', marginTop: '25px' }}
        >
          Xác nhận thanh toán thành công
        </button>
      </div>
    </div>
  );
}

export default Booking;