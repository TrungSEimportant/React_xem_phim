import React from 'react';
import { MOCK_MOVIES } from '../data/mockMovies';
import VideoPlayer from '../components/VideoPlayer';

function MovieDetail({ movieId, user, navigateTo }) {
  // Tìm bộ phim tương ứng với ID được click
  const movie = MOCK_MOVIES.find(m => m.id === movieId);

  if (!movie) {
    return <h2 style={{ color: '#fff', textAlign: 'center', marginTop: '100px' }}>Không tìm thấy thông tin phim.</h2>;
  }

  return (
    <div style={{ padding: '0', color: '#fff', marginTop: '-20px' }}>
      
      {/* KHU VỰC 1: BANNER HÌNH ẢNH & THÔNG TIN (HERO SECTION) */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '65vh', 
        backgroundImage: `url(${movie.thumbnail})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        borderBottom: '1px solid #333'
      }}>
        {/* Nút quay lại */}
        <button 
          onClick={() => navigateTo('home')} 
          style={{ 
            position: 'absolute', top: '30px', left: '40px', zIndex: 10,
            background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid #fff', 
            padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
          }}
        >
          ← Quay lại Trang Chủ
        </button>

        {/* Lớp phủ Gradient mờ dần từ dưới lên để text dễ đọc hơn */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to top, #141414 0%, rgba(20,20,20,0.2) 60%, rgba(20,20,20,0.8) 100%)'
        }}></div>
        
        {/* Nội dung Tên phim & Mô tả */}
        <div style={{ position: 'absolute', bottom: '10%', left: '40px', maxWidth: '600px', zIndex: 2 }}>
          <h1 style={{ fontSize: '48px', margin: '0 0 10px 0', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            {movie.title}
          </h1>
          <p style={{ color: '#46d369', fontWeight: 'bold', margin: '0 0 15px 0', fontSize: '16px', textShadow: '1px 1px 2px #000' }}>
            98% Độ trùng khớp 
            <span style={{ color: '#fff', marginLeft: '15px', fontWeight: 'normal' }}>• Lứa tuổi 16+</span>
            <span style={{ color: '#fff', marginLeft: '15px', fontWeight: 'normal' }}>• {movie.category}</span>
          </p>
          <p style={{ fontSize: '16px', lineHeight: '1.6', textShadow: '1px 1px 3px rgba(0,0,0,0.9)', color: '#e5e5e5' }}>
            {movie.description}
          </p>
        </div>
      </div>

      {/* KHU VỰC 2: TRÌNH PHÁT VIDEO & CHECK LOGIN */}
      <div style={{ padding: '40px', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', borderLeft: '4px solid #E50914', paddingLeft: '10px' }}>
          Trình phát Video
        </h2>
        
        {user ? (
          // NẾU ĐÃ ĐĂNG NHẬP: Hiện Video
          <div style={{ animation: 'fadeIn 1s ease' }}>
            <p style={{ color: '#aaa', marginBottom: '15px' }}>
              Đang phát luồng video chất lượng cao cho tài khoản VIP: <strong style={{color: '#fff'}}>{user.name}</strong>
            </p>
            <VideoPlayer videoUrl={movie.videoUrl} />
          </div>
        ) : (
          // NẾU CHƯA ĐĂNG NHẬP: Báo lỗi và yêu cầu Login
          <div style={{ 
            height: '450px', 
            backgroundColor: '#0a0a0a', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            border: '1px solid #333', 
            borderRadius: '8px',
            backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${movie.thumbnail})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '28px', textShadow: '1px 1px 3px #000' }}>Bạn chưa đăng nhập!</h3>
            <p style={{ color: '#ccc', marginBottom: '25px', maxWidth: '450px', textAlign: 'center', lineHeight: '1.6', textShadow: '1px 1px 3px #000' }}>
              Vui lòng đăng nhập tài khoản để xem video và mở khóa toàn bộ nội dung của bộ phim <strong>{movie.title}</strong>.
            </p>
            <button 
              onClick={() => navigateTo('login')} 
              style={{ background: '#E50914', color: '#fff', border: 'none', padding: '14px 35px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', transition: '0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f40612'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E50914'}
            >
              Đăng nhập để xem ngay
            </button>
          </div>
        )}
      </div>
      
    </div>
  );
}

export default MovieDetail;