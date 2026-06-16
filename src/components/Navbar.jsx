// src/components/Navbar.jsx
import React from 'react';

function Navbar({ user, setUser, setSearchQuery, navigateTo, activeSection, setActiveSection }) {
  
  // Hàm tiện ích để đổi tab nhanh
  const handleTabClick = (sectionName) => {
    setSearchQuery(''); // Xóa từ khóa tìm kiếm khi đổi tab
    setActiveSection(sectionName);
    navigateTo('home');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#000', borderBottom: '1px solid #222', position: 'sticky', top: 0, zIndex: 100 }}>
      
      {/* PHẦN 1: LOGO & MENU ĐIỀU HƯỚNG */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '30px' }}>
        <h1 
          onClick={() => {
            // Admin bấm vào logo không chuyển hướng về home, User bình thường thì có
            if(user?.role !== 'admin') handleTabClick('all');
          }} 
          style={{ color: '#E50914', cursor: 'pointer', margin: 0, fontSize: '28px', letterSpacing: '2px' }}
        >
          NETFLUX
        </h1>
        
        {/* THANH MENU ĐIỀU HƯỚNG: Chỉ hiển thị nếu KHÔNG PHẢI là Admin */}
        {user?.role !== 'admin' && (
          <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
            <span 
              onClick={() => handleTabClick('all')} 
              style={{ cursor: 'pointer', color: activeSection === 'all' ? '#fff' : '#aaa', fontWeight: activeSection === 'all' ? 'bold' : 'normal' }}
            >
              Trang Chủ
            </span>
            <span 
              onClick={() => handleTabClick('hot')} 
              style={{ cursor: 'pointer', color: activeSection === 'hot' ? '#fff' : '#aaa', fontWeight: activeSection === 'hot' ? 'bold' : 'normal' }}
            >
              Phim Hot
            </span>
            <span 
              onClick={() => handleTabClick('new')} 
              style={{ cursor: 'pointer', color: activeSection === 'new' ? '#fff' : '#aaa', fontWeight: activeSection === 'new' ? 'bold' : 'normal' }}
            >
              Phim Mới
            </span>
            <span 
              onClick={() => handleTabClick('upcoming')} 
              style={{ cursor: 'pointer', color: activeSection === 'upcoming' ? '#fff' : '#aaa', fontWeight: activeSection === 'upcoming' ? 'bold' : 'normal' }}
            >
              Sắp Chiếu
            </span>
          </div>
        )}
      </div>
      
      {/* PHẦN 2: THANH TÌM KIẾM: Chỉ hiển thị nếu KHÔNG PHẢI là Admin */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        {user?.role !== 'admin' && (
          <input 
            type="text" 
            placeholder="Tìm kiếm phim..." 
            onChange={(e) => {
              setSearchQuery(e.target.value);
              navigateTo('home');
            }}
            style={{ padding: '10px 20px', width: '100%', maxWidth: '350px', borderRadius: '20px', border: '1px solid #444', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
          />
        )}
      </div>

      {/* PHẦN 3: ĐĂNG NHẬP & THÔNG TIN TÀI KHOẢN */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span>Xin chào, <strong>{user.name}</strong></span>
            
            {/* Nút Lịch sử đặt vé (Chỉ hiện cho User bình thường) */}
            {user.role === 'user' && (
              <button 
                onClick={() => navigateTo('history')} 
                style={{ background: 'transparent', color: '#fff', border: '1px solid #fff', padding: '8px 16px', cursor: 'pointer', borderRadius: '4px' }}
              >
                📜 Lịch sử đặt vé
              </button>
            )}

            <button 
              onClick={() => {
                setUser(null);
                navigateTo('home'); // Đăng xuất xong điều hướng về lại trang chủ
              }} 
              style={{ background: '#333', color: '#fff', border: 'none', padding: '8px 16px', cursor: 'pointer', borderRadius: '4px' }}
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <button 
            onClick={() => navigateTo('login')} 
            style={{ background: '#E50914', color: '#fff', border: 'none', padding: '8px 16px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}
          >
            Đăng nhập
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;