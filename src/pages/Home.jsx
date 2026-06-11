import React, { useMemo } from 'react';
function Home({ movies, searchQuery, navigateTo, activeSection }) {
  const searchedMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchQuery?.toLowerCase() || '')
  );

  const hotMovies = movies.filter(m => m.section === 'hot');
  const newMovies = movies.filter(m => m.section === 'new');
  const upcomingMovies = movies.filter(m => m.section === 'upcoming');

  const featuredMovie = useMemo(() => {
    if (hotMovies.length > 0) return hotMovies[0];
    return movies[0];
  }, [hotMovies, movies]);

  // 2. THIẾT KẾ HERO BANNER TOÀN MÀN HÌNH (Style Ảnh 2)
  const renderHeroBanner = () => {
    if (!featuredMovie) return null;

    return (
      <div style={{
        position: 'relative',
        width: '100%',
        height: '75vh', // Chiếm 75% chiều cao màn hình hiển thị
        backgroundColor: '#000',
        // Layer gradient thông minh bọc quanh ảnh thumbnail để nổi bật text
        backgroundImage: `
          linear-gradient(to top, #141414 5%, rgba(20, 20, 20, 0) 40%, rgba(20, 20, 20, 0.6) 100%),
          linear-gradient(to right, #141414 15%, rgba(20, 20, 20, 0.4) 45%, transparent 80%),
          url(${featuredMovie.thumbnail})
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 4%',
        boxSizing: 'border-box',
        marginBottom: '20px'
      }}>
        
        {/* Khối nội dung trên Banner */}
        <div style={{ maxWidth: '650px', zIndex: 2, marginTop: '80px' }}>
          
          {/* Metadata nhỏ trên đầu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px', fontSize: '14px', color: '#aaaaaa', fontWeight: '500' }}>
            <span style={{ color: '#46d369', fontWeight: 'bold' }}>Độ trùng khớp 98%</span>
            <span>2026</span>
            <span style={{ border: '1px solid #777', padding: '1px 5px', borderRadius: '3px', fontSize: '11px', color: '#fff' }}>18+</span>
            <span>{featuredMovie.category}</span>
          </div>

          {/* Tiêu đề phim kích thước lớn */}
          <h1 style={{
            color: '#ffffff',
            fontSize: 'clamp(32px, 5vw, 56px)', // Co giãn mượt mà theo kích thước màn hình
            fontWeight: '900',
            margin: '0 0 20px 0',
            lineHeight: '1.1',
            textShadow: '2px 2px 10px rgba(0,0,0,0.9)'
          }}>
            {featuredMovie.title}
          </h1>

          {/* Tóm tắt nội dung phim */}
          <p style={{
            color: '#e5e5e5',
            fontSize: '16px',
            lineHeight: '1.5',
            margin: '0 0 30px 0',
            textShadow: '1px 1px 5px rgba(0,0,0,0.8)',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {featuredMovie.description || "Hành trình nghẹt thở đối đầu với những thử thách sinh tử khốc liệt nhất. Đón xem siêu phẩm điện ảnh bom tấn độc quyền với độ phân giải siêu nét chỉ có trên Netflux ngay hôm nay."}
          </p>

          {/* Cặp nút hành động */}
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => navigateTo('detail', featuredMovie.id)}
              style={{
                backgroundColor: '#ffffff',
                color: '#000000',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e6e6e6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
            >
              <span style={{ fontSize: '18px' }}>▶</span> Xem Ngay
            </button>
          </div>

        </div>
      </div>
    );
  };

  // 3. THIẾT KẾ THẺ PHIM TIÊU CHUẨN
  const renderMovieCard = (movie) => (
    <div 
      key={movie.id} 
      onClick={() => navigateTo('detail', movie.id)}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        width: '100%',
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
        backgroundColor: '#1a1a1a',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16 / 10',
        backgroundColor: '#000',
        overflow: 'hidden'
      }}>
        {/* LOGO CHỮ N LỚN */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '12px',
          color: '#E50914',
          fontSize: '34px',
          fontWeight: '900',
          fontFamily: "'Impact', 'Arial Black', sans-serif",
          textShadow: '0px 2px 5px rgba(0, 0, 0, 0.9)',
          zIndex: 10,
          userSelect: 'none',
          transform: 'scaleY(1.15)',
        }}>
          N
        </div>

        <img 
          src={movie.thumbnail} 
          alt={movie.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>
      
      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ 
          margin: '0 0 6px 0', 
          fontSize: '15px', 
          color: '#ffffff',
          fontWeight: 'bold',
          whiteSpace: 'nowrap', 
          overflow: 'hidden',   
          textOverflow: 'ellipsis' 
        }}>
          {movie.title}
        </h3>
        <span style={{ fontSize: '13px', color: '#aaaaaa' }}>
          {movie.category}
        </span>
      </div>
    </div>
  );

  // 4. VÙNG CHỨA DANH SÁCH PHIM (Grid)
  const renderMovieRow = (title, moviesList) => {
    if (!moviesList || moviesList.length === 0) return null;
    
    return (
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '22px', color: '#fff', marginBottom: '20px', fontWeight: 'bold' }}>
          {title}
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
          gap: '20px'
        }}>
          {moviesList.map(movie => renderMovieCard(movie))}
        </div>
      </div>
    );
  };

  // COMPONENT FOOTER
  const renderFooter = () => (
    <footer style={{
      marginTop: '70px',
      padding: '50px 40px 30px 40px',
      borderTop: '1px solid #222222',
      backgroundColor: '#141414',
      color: '#757575',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '30px',
        maxWidth: '1200px',
        margin: '0 auto',
        marginBottom: '40px'
      }}>
        
        {/* Cột 1: Giới thiệu thương hiệu */}
        <div style={{ flex: '1 1 250px', minWidth: '200px' }}>
          <h4 style={{ color: '#E50914', fontSize: '20px', fontWeight: 'bold', margin: '0 0 15px 0', letterSpacing: '1px' }}>
            NETFLUX
          </h4>
          <p style={{ lineHeight: '1.6', margin: 0 }}>
            Trải nghiệm nền tảng xem phim trực tuyến độ phân giải cao hàng đầu. Cập nhật liên tục các bom tấn điện ảnh trong và ngoài nước với tốc độ cao nhất.
          </p>
        </div>

        {/* Cột 2: Khám phá */}
        <div style={{ flex: '1 1 180px', minWidth: '150px' }}>
          <h5 style={{ color: '#ffffff', fontSize: '15px', fontWeight: 'bold', margin: '0 0 15px 0' }}>
            Khám Phá
          </h5>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '2.2' }}>
            <li><span style={{ cursor: 'pointer' }} onClick={() => navigateTo('home')}>Trang chủ</span></li>
            <li><span style={{ cursor: 'pointer' }}>Phim Mới Phát Hành</span></li>
            <li><span style={{ cursor: 'pointer' }}>Phim Sắp Chiếu</span></li>
            <li><span style={{ cursor: 'pointer' }}>Danh sách của tôi</span></li>
          </ul>
        </div>

        {/* Cột 3: Hỗ trợ */}
        <div style={{ flex: '1 1 180px', minWidth: '150px' }}>
          <h5 style={{ color: '#ffffff', fontSize: '15px', fontWeight: 'bold', margin: '0 0 15px 0' }}>
            Hỗ Trợ & Pháp Lý
          </h5>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '2.2' }}>
            <li><span style={{ cursor: 'pointer' }}>Trung tâm trợ giúp</span></li>
            <li><span style={{ cursor: 'pointer' }}>Điều khoản sử dụng</span></li>
            <li><span style={{ cursor: 'pointer' }}>Chính sách bảo mật</span></li>
            <li><span style={{ cursor: 'pointer' }}>Tùy chọn cookie</span></li>
          </ul>
        </div>

        {/* Cột 4: Liên hệ */}
        <div style={{ flex: '1 1 280px', minWidth: '220px', lineHeight: '1.8' }}>
          <h5 style={{ color: '#ffffff', fontSize: '15px', fontWeight: 'bold', margin: '0 0 15px 0' }}>
            Thông Tin Liên Hệ
          </h5>
          <p style={{ margin: '0 0 8px 0' }}>📍 <strong>Địa chỉ:</strong> Quận Hải Châu, Thành phố Đà Nẵng, Việt Nam</p>
          <p style={{ margin: '0 0 8px 0' }}>📞 <strong>Hotline:</strong> 0905123127</p>
          <p style={{ margin: '0 0 8px 0' }}>✉️ <strong>Email:</strong> Netfluxchuyennghiep@gmail.com</p>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid #222222',
        paddingTop: '20px',
        textAlign: 'center',
        fontSize: '13px',
        maxWidth: '1200px',
        margin: '0 auto',
        lineHeight: '1.6'
      }}>
        <p style={{ margin: '0 0 5px 0' }}>© 2026 NETFLUX Entertainment Inc. Bản quyền đã được bảo hộ.</p>
      </div>
    </footer>
  );

  // 5. PHẦN RENDER CHÍNH CỦA TRANG HOME
  return (
    <div style={{ 
      backgroundColor: '#141414', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      
      {/* 5.1. Hiển thị Banner tràn lề khi không tìm kiếm và đang ở chuyên mục "Tất cả" */}
      {!searchQuery && activeSection === 'all' && renderHeroBanner()}

      {/* 5.2. Khối chứa danh sách lưới các phim */}
      <div style={{ padding: '0 4% 20px 4%', flex: '1' }}>
        {searchQuery ? (
          <div>
            <h2 style={{ fontSize: '22px', color: '#fff', marginBottom: '20px' }}>
              Kết quả tìm kiếm cho: "{searchQuery}"
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {searchedMovies.map(movie => renderMovieCard(movie))}
            </div>
          </div>
        ) : (
          <>
            {(activeSection === 'all' || activeSection === 'hot') && renderMovieRow("Phim Đang Hot", hotMovies)}
            {(activeSection === 'all' || activeSection === 'new') && renderMovieRow("Phim Mới Phát Hành", newMovies)}
            {(activeSection === 'all' || activeSection === 'upcoming') && renderMovieRow("Phim Sắp Chiếu", upcomingMovies)}
          </>
        )}
      </div>

      {/* 5.3. Footer */}
      {renderFooter()}
    </div>
  );
}

export default Home;