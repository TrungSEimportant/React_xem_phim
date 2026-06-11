import React, { useState } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import Booking from './Booking'; 

function MovieDetail({ movieId, user, navigateTo , movies }) {
  const [isBooking, setIsBooking] = useState(false);

  const movie = movies.find(m => m.id === movieId);

  if (!movie) {
    return <h2 style={{ color: '#fff', textAlign: 'center', marginTop: '100px' }}>Không tìm thấy thông tin phim.</h2>;
  }

  // NẾU ĐANG Ở CHẾ ĐỘ ĐẶT VÉ -> TRẢ VỀ COMPONENT BOOKING
  if (isBooking && user) {
    return (
      <Booking 
        movie={movie} 
        user={user} 
        onCancel={() => setIsBooking(false)} 
        onSuccess={() => navigateTo('history')} // Sửa lại: Thanh toán xong chuyển thẳng sang Lịch sử
      />
    );
  }

  // NẾU KHÔNG ĐẶT VÉ -> TRẢ VỀ CHI TIẾT PHIM BÌNH THƯỜNG
  return (
    <div style={{ padding: '0', color: '#fff', marginTop: '-20px', backgroundColor: '#141414', minHeight: '100vh', paddingBottom: '50px' }}>
      
      {/* KHU VỰC 1: BANNER HÌNH ẢNH & THÔNG TIN (HERO SECTION) */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        minHeight: '75vh', /* SỬA LỖI Ở ĐÂY: Đổi height thành minHeight */
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end', /* Đẩy nội dung xuống dưới cùng */
        padding: '100px 40px 50px 40px', /* Tạo không gian an toàn cho chữ */
        boxSizing: 'border-box',
        backgroundImage: `url(${movie.thumbnail})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        borderBottom: '1px solid #333'
      }}>
        {/* Lớp phủ đen Gradient để dễ đọc chữ */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(20,20,20,1) 0%, rgba(20,20,20,0.3) 50%, rgba(20,20,20,0.8) 100%)' }}></div>

        {/* Nút quay lại */}
        <button 
          onClick={() => navigateTo('home')} 
          style={{ 
            position: 'absolute', top: '30px', left: '40px', zIndex: 10,
            background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid #555', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', transition: '0.2s'
          }}
        >
          ⬅ Quay lại Trang chủ
        </button>

        {/* Thông tin phim (Chuyển sang relative để nằm an toàn trong Flexbox) */}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '800px' }}>
          <h1 style={{ fontSize: '56px', margin: '0 0 15px 0', textShadow: '2px 2px 5px rgba(0,0,0,0.8)' }}>{movie.title}</h1>
          <p style={{ fontSize: '20px', color: '#bbb', marginBottom: '20px', fontWeight: 'bold' }}>Thể loại: {movie.category}</p>
          <p style={{ fontSize: '18px', lineHeight: '1.6', marginBottom: '35px', textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
            {movie.description}
          </p>

          {/* Kiểm tra đăng nhập để hiển thị cụm nút tương ứng */}
          {user ? (
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setIsBooking(true)} 
                style={{ background: '#E50914', color: '#fff', border: 'none', padding: '15px 40px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', fontSize: '18px' }}
              >
                🎫 Đặt vé ngay
              </button>
              <button 
                onClick={() => window.scrollTo({ top: window.innerHeight * 0.7, behavior: 'smooth' })} 
                style={{ background: 'rgba(109, 109, 110, 0.7)', color: '#fff', border: 'none', padding: '15px 40px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', fontSize: '18px' }}
              >
                ▶ Xem Trailer
              </button>
            </div>
          ) : (
             <div style={{ background: 'rgba(0,0,0,0.8)', padding: '25px', borderRadius: '8px', display: 'inline-block', border: '1px solid #333' }}>
               <h3 style={{ margin: '0 0 10px 0', color: '#fff' }}>Bạn chưa đăng nhập!</h3>
               <p style={{ color: '#ccc', marginBottom: '20px' }}>Vui lòng đăng nhập tài khoản để xem trailer và đặt vé.</p>
               <button 
                 onClick={() => navigateTo('login')} 
                 style={{ background: '#E50914', color: '#fff', border: 'none', padding: '12px 30px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
               >
                 Đăng nhập ngay
               </button>
             </div>
          )}
        </div>
      </div>

      {/* KHU VỰC 2: VIDEO TRAILER (Chỉ hiện khi đã đăng nhập) */}
      {user && (
        <div style={{ padding: '40px', maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '25px', borderLeft: '5px solid #E50914', paddingLeft: '15px' }}>Trailer Phim</h2>
          <VideoPlayer videoUrl={movie.videoUrl} />
        </div>
      )}

    </div>
  );
}

export default MovieDetail;