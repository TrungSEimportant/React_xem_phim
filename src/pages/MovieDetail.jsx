import React from 'react';
import { MOCK_MOVIES } from '../data/mockMovies';
import VideoPlayer from '../components/VideoPlayer';

function MovieDetail({ movieId, user, navigateTo }) {
  // Mô phỏng tải chi tiết phim từ API dựa trên ID
  const movie = MOCK_MOVIES.find(m => m.id === movieId);

  if (!movie) {
    return <p>Không tìm thấy thông tin phim.</p>;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <button onClick={() => navigateTo('home')} style={{ background: 'none', color: '#aaa', border: 'none', cursor: 'pointer', marginBottom: '20px' }}>
        ← Quay lại trang chủ
      </button>

      {/* LUỒNG XỬ LÝ QUAN TRỌNG: KIỂM TRA ĐĂNG NHẬP (AUTH CHECK) */}
      <div style={{ marginBottom: '30px' }}>
        {user ? (
          // YES: Đã đăng nhập -> Cho phép xem phim bằng VideoPlayer Component
          <div>
            <h3 style={{ color: '#4CAF50', marginBottom: '10px' }}>✓ Bạn đang xem phim với tài khoản VIP của: {user.name}</h3>
            <VideoPlayer videoUrl={movie.videoUrl} />
          </div>
        ) : (
          // NO: Chưa đăng nhập -> Hiện khung chặn hiển thị nội dung video
          <div style={{ height: '400px', backgroundColor: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '2px dashed #E50914', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Bạn chưa đăng nhập!</h3>
            <p style={{ color: '#aaa', marginBottom: '20px' }}>Vui lòng đăng nhập để mở khóa luồng phát (Streaming Token) của bộ phim này.</p>
            <button 
              onClick={() => navigateTo('login')} 
              style={{ background: '#E50914', color: '#fff', border: 'none', padding: '10px 20px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}
            >
              Đăng nhập ngay
            </button>
          </div>
        )}
      </div>

      <h2>{movie.title}</h2>
      <p style={{ color: '#e50914', fontWeight: 'bold' }}>Thể loại: {movie.category}</p>
      <p style={{ color: '#ccc', lineHeight: '1.6' }}>{movie.description}</p>
    </div>
  );
}

export default MovieDetail;