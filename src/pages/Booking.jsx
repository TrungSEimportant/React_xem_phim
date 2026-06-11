// src/pages/Booking.jsx
import React, { useState } from 'react';

const TICKET_PRICE = 85000;
const COMBO_PRICE = 65000;

function Booking({ movie, user, onCancel, onSuccess }) {
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [comboCount, setComboCount] = useState(0);
  // State lưu phương thức thanh toán được chọn
  const [paymentMethod, setPaymentMethod] = useState('Chuyển khoản');

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
    
    // Tạo đối tượng hóa đơn đặt vé thành công bao gồm cả Phương thức thanh toán
    const newBooking = {
      id: 'HD' + Date.now(),
      username: user ? user.name : 'Khách vãng lai',
      movieTitle: movie.title,
      showtime: selectedTime,
      seats: selectedSeats,
      comboCount: comboCount,
      totalPrice: totalPrice,
      paymentMethod: paymentMethod, // Đã đẩy dữ liệu phương thức thanh toán vào đây
      bookingDate: new Date().toLocaleDateString('vi-VN'),
      status: 'Đã thanh toán'
    };

    // Đọc và cập nhật localStorage
    const localData = localStorage.getItem('movie_bookings');
    const currentBookings = localData ? JSON.parse(localData) : [];
    currentBookings.unshift(newBooking);
    localStorage.setItem('movie_bookings', JSON.stringify(currentBookings));

    alert(`🎉 Đặt vé thành công! Quý khách đã thanh toán bằng: ${paymentMethod}`);
    onSuccess();
  };

  return (
    <div style={{ display: 'flex', gap: '40px', padding: '20px 0', color: '#fff', backgroundColor: '#141414', minHeight: '80vh', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      {/* CỘT BÊN TRÁI: CHỌN SUẤT, GHẾ & COMBO */}
      <div style={{ flex: 2, background: '#1c1c1c', padding: '30px', borderRadius: '8px' }}>
        <button 
          onClick={onCancel}
          style={{ background: 'transparent', color: '#aaa', border: '1px solid #444', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px', fontFamily: 'inherit' }}
        >
          ⬅ Quay lại chi tiết phim
        </button>

        <h2 style={{ margin: '0 0 10px 0', color: '#fff' }}>{movie.title}</h2>
        <p style={{ color: '#aaa', margin: '0 0 25px 0' }}>Thể loại: {movie.category}</p>

        {/* 1. CHỌN SUẤT CHIẾU */}
        <h3 style={{ fontSize: '16px', borderBottom: '1px solid #333', paddingBottom: '8px', color: '#E50914' }}>1. Chọn suất chiếu</h3>
        <div style={{ display: 'flex', gap: '12px', margin: '15px 0 30px 0' }}>
          {(movie.showtimes || ["10:00", "14:00", "19:00"]).map(time => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              style={{
                padding: '10px 24px',
                background: selectedTime === time ? '#E50914' : '#333',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontFamily: 'inherit'
              }}
            >
              {time}
            </button>
          ))}
        </div>

        {/* 2. SƠ ĐỒ CHỌN GHẾ NGỒI */}
        <h3 style={{ fontSize: '16px', borderBottom: '1px solid #333', paddingBottom: '8px', color: '#E50914' }}>2. Chọn vị trí ghế (Đồng giá: 85.000đ / ghế)</h3>
        
        {/* Màn hình giả lập */}
        <div style={{ width: '80%', height: '4px', background: '#555', margin: '40px auto 10px auto', boxShadow: '0 0 10px #fff', borderRadius: '2px' }}></div>
        <p style={{ textAlign: 'center', color: '#777', fontSize: '12px', letterSpacing: '4px', marginBottom: '30px' }}>MÀN HÌNH CHIẾU</p>

        {/* Lưới ghế */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', marginBottom: '40px' }}>
          {rows.map(row => (
            <div key={row} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ width: '20px', color: '#666', fontWeight: 'bold' }}>{row}</span>
              {cols.map(col => {
                const seatCode = `${row}${col}`;
                const isSelected = selectedSeats.includes(seatCode);
                return (
                  <button
                    key={col}
                    onClick={() => toggleSeat(seatCode)}
                    style={{
                      width: '36px',
                      height: '36px',
                      background: isSelected ? '#E50914' : '#444',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      transition: 'all 0.1s'
                    }}
                  >
                    {col}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Chú thích ghế */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '13px', color: '#aaa', marginBottom: '4px' }}>
          <div><span style={{ display: 'inline-block', width: '15px', height: '15px', background: '#444', borderRadius: '3px', marginRight: '6px', verticalAlign: 'middle' }}></span> Ghế trống</div>
          <div><span style={{ display: 'inline-block', width: '15px', height: '15px', background: '#E50914', borderRadius: '3px', marginRight: '6px', verticalAlign: 'middle' }}></span> Ghế đang chọn</div>
        </div>

        {/* 3. CHỌN COMBO BẮP NƯỚC */}
        <h3 style={{ fontSize: '16px', borderBottom: '1px solid #333', paddingBottom: '8px', color: '#E50914', marginTop: '40px' }}>3. Chọn bắp & nước kèm theo</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#262626', padding: '15px 20px', borderRadius: '6px', marginTop: '15px' }}>
          <div>
            <p style={{ margin: 0, fontWeight: 'bold' }}>🍿 Combo Siêu Hời (1 Bắp Lớn + 1 Nước Ngọt)</p>
            <span style={{ fontSize: '13px', color: '#aaa' }}>Giá ưu đãi mua kèm: 65.000đ / combo</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button 
              onClick={() => setComboCount(Math.max(0, comboCount - 1))}
              style={{ width: '32px', height: '32px', background: '#444', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              -
            </button>
            <span style={{ fontSize: '18px', fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{comboCount}</span>
            <button 
              onClick={() => setComboCount(comboCount + 1)}
              style={{ width: '32px', height: '32px', background: '#444', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* CỘT BÊN PHẢI: CHI TIẾT HÓA ĐƠN & PHƯƠNG THỨC THANH TOÁN */}
      <div style={{ flex: 1, background: '#1c1c1c', padding: '30px', borderRadius: '8px', height: 'fit-content', border: '1px solid #292929' }}>
        <h3 style={{ margin: '0 0 20px 0', textAlign: 'center', letterSpacing: '1px', borderBottom: '2px solid #333', paddingBottom: '15px', color: '#fff' }}>💳 HÓA ĐƠN ĐẶT VÉ</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#ccc' }}>
          <span>Phim:</span> <span style={{ fontWeight: 'bold', color: '#fff', textAlign: 'right', maxWidth: '180px' }}>{movie.title}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#ccc' }}>
          <span>Suất chiếu:</span> <span style={{ fontWeight: 'bold', color: '#FF9800' }}>{selectedTime || 'Chưa chọn'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#ccc' }}>
          <span>Ghế đã chọn ({selectedSeats.length}):</span> <span style={{ fontWeight: 'bold', color: '#fff' }}>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Chưa chọn'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#ccc' }}>
          <span>Tiền vé:</span> <span style={{ color: '#fff' }}>{totalTickets.toLocaleString('vi-VN')} đ</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#ccc' }}>
          <span>Combo Bắp Nước ({comboCount}):</span> <span style={{ color: '#fff' }}>{totalCombos.toLocaleString('vi-VN')} đ</span>
        </div>

        {/* ===== THÀNH PHẦN MỚI THÊM: CHỌN PHƯƠNG THỨC THANH TOÁN ===== */}
        <div style={{ borderTop: '1px dashed #333', paddingTop: '20px', marginBottom: '15px' }}>
          <label style={{ color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '10px', fontWeight: '500' }}>
            💵 CHỌN PHƯƠNG THỨC THANH TOÁN:
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setPaymentMethod('Chuyển khoản')}
              style={{
                flex: 1,
                background: paymentMethod === 'Chuyển khoản' ? '#E50914' : '#2d2d2d',
                color: '#fff',
                border: paymentMethod === 'Chuyển khoản' ? '1px solid #E50914' : '1px solid #444',
                padding: '12px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s',
                fontFamily: 'inherit'
              }}
            >
               Chuyển khoản
            </button>
            <button
              onClick={() => setPaymentMethod('Tiền mặt')}
              style={{
                flex: 1,
                background: paymentMethod === 'Tiền mặt' ? '#E50914' : '#2d2d2d',
                color: '#fff',
                border: paymentMethod === 'Tiền mặt' ? '1px solid #E50914' : '1px solid #444',
                padding: '12px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s',
                fontFamily: 'inherit'
              }}
            >
              Tiền mặt
            </button>
          </div>
        </div>
        {/* ========================================================= */}

        <hr style={{ borderColor: '#333', margin: '20px 0' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <span style={{ fontSize: '16px', color: '#aaa' }}>Tổng thanh toán:</span>
          <span style={{ fontSize: '26px', fontWeight: 'bold', color: '#E50914' }}>{totalPrice.toLocaleString('vi-VN')} đ</span>
        </div>

        <button 
          onClick={handleConfirm}
          style={{ 
            width: '100%', 
            background: '#E50914', 
            color: '#fff', 
            border: 'none', 
            padding: '16px', 
            borderRadius: '6px', 
            cursor: 'pointer', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            boxShadow: '0 4px 12px rgba(229, 9, 20, 0.4)',
            transition: 'background 0.2s',
            fontFamily: 'inherit'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#ff1523'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#E50914'}
        >
          XÁC NHẬN THANH TOÁN
        </button>
      </div>

    </div>
  );
}

export default Booking;