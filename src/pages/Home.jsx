// src/pages/Home.jsx
import React from 'react';
import { MOCK_MOVIES } from '../data/mockMovies';

function Home({ searchQuery, navigateTo, activeSection }) {
  
  // 1. Xử lý bộ lọc tìm kiếm ưu tiên trước
  const searchedMovies = MOCK_MOVIES.filter(movie => 
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Hàm helper để render một thẻ phim (Card)
  const renderMovieCard = (movie) => (
    <div 
      key={movie.id} 
      onClick={() => navigateTo('detail', movie.id)}
      style={{ 
        flex: '0 0 240px', /* Giữ kích thước cố định để cuộn ngang */
        cursor: 'pointer', 
        backgroundColor: '#1a1a1a', 
        borderRadius: '6px', 
        overflow: 'hidden', 
        transition: 'transform 0.3s ease' 
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <img src={movie.thumbnail} alt={movie.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
      <div style={{ padding: '10px' }}>
        <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{movie.title}</h4>
        <span style={{ fontSize: '11px', color: '#aaa' }}>{movie.category}</span>
      </div>
    </div>
  );

  // Hàm helper để tạo ra một hàng phim cuộn ngang chuẩn Netflix
  const renderMovieRow = (title, moviesList) => (
    <div style={{ marginBottom: '40px' }}>
      <h2 style={{ fontSize: '22px', marginBottom: '15px', fontWeight: 'bold' }}>{title}</h2>
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        overflowX: 'auto', 
        paddingBottom: '15px',
        scrollbarWidth: 'none' /* Ẩn thanh cuộn trên Firefox */
      }}>
        {moviesList.map(movie => renderMovieCard(movie))}
      </div>
    </div>
  );

  // LUỒNG HIỂN THỊ 1: NẾU ĐANG TÌM KIẾM PHIM
  if (searchQuery) {
    return (
      <div>
        <h2>Kết quả tìm kiếm cho: "{searchQuery}"</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
          {searchedMovies.map(movie => renderMovieCard(movie))}
        </div>
      </div>
    );
  }

  // Phân loại phim theo mảng danh mục
  const hotMovies = MOCK_MOVIES.filter(m => m.section === 'hot');
  const newMovies = MOCK_MOVIES.filter(m => m.section === 'new');
  const upcomingMovies = MOCK_MOVIES.filter(m => m.section === 'upcoming');

  // LUỒNG HIỂN THỊ 2: XỬ LÝ THEO TAB ĐIỀU HƯỚNG
  return (
    <div>
      {(activeSection === 'all' || activeSection === 'hot') && renderMovieRow("Phim Đang Hot", hotMovies)}
      {(activeSection === 'all' || activeSection === 'new') && renderMovieRow("Phim Mới Phát Hành", newMovies)}
      {(activeSection === 'all' || activeSection === 'upcoming') && renderMovieRow("Phim Sắp Chiếu", upcomingMovies)}
    </div>
  );
}

export default Home;