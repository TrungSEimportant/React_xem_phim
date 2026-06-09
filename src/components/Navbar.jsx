// src/components/Navbar.jsx
import React from 'react';

function Navbar({ user, setUser, setSearchQuery, navigateTo, activeSection, setActiveSection }) {
  
  const handleTabClick = (sectionName) => {
    setSearchQuery(''); 
    setActiveSection(sectionName);
    navigateTo('home');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#000', borderBottom: '1px solid #222', position: 'sticky', top: 0, zIndex: 100 }}>
      
      {/* PHẦN 1: LOGO & MENU ĐIỀU HƯỚNG */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '30px' }}>
        <h1 
          onClick={() => handleTabClick('all')} 
          style={{ color: '#E50914', cursor: 'pointer', margin: 0, fontSize: '28px', letterSpacing: '2px' }}
        >
          NETFLUX
        </h1>
        
        <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
          <span 
            onClick={() => handleTabClick('all')} 
            style={{ color: activeSection === 'all' ? '#fff' : '#aaa', cursor: 'pointer', fontWeight: activeSection === 'all' ? 'bold' : 'normal' }}
          >
            Trang Chủ
          </span>
          <span 
            onClick={() => handleTabClick('hot')} 
            style={{ color: activeSection === 'hot' ? '#fff' : '#aaa', cursor: 'pointer', fontWeight: activeSection === 'hot' ? 'bold' : 'normal' }}
          >
            Phim Hot
          </span>
          <span 
            onClick={() => handleTabClick('new')} 
            style={{ color: activeSection === 'new' ? '#fff' : '#aaa', cursor: 'pointer', fontWeight: activeSection === 'new' ? 'bold' : 'normal' }}
          >
            Phim Mới
          </span>
          <span 
            onClick={() => handleTabClick('upcoming')} 
            style={{ color: activeSection === 'upcoming' ? '#fff' : '#aaa', cursor: 'pointer', fontWeight: activeSection === 'upcoming' ? 'bold' : 'normal' }}
          >
            Sắp Chiếu
          </span>
        </div>
      </div>
      
      {/* PHẦN 2: THANH TÌM KIẾM */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <input 
          type="text" 
          placeholder="Tìm kiếm phim..." 
          onChange={(e) => {
            setSearchQuery(e.target.value);
            navigateTo('home');
          }}
          style={{ padding: '10px 20px', width: '100%', maxWidth: '350px', borderRadius: '20px', border: '1px solid #444', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
        />
      </div>

      {/* PHẦN 3: ĐĂNG NHẬP & LỊCH SỬ VÉ */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ color: '#fff' }}>Xin chào, <strong>{user.name}</strong></span>
            
            {/* NÚT XEM LỊCH SỬ MỚI THÊM VÀO */}
            <button 
              onClick={() => navigateTo('history')} 
              style={{ background: '#444', color: '#fff', border: 'none', padding: '8px 16px', cursor: 'pointer', borderRadius: '4px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              📜 Lịch sử đặt vé
            </button>

            <button onClick={() => setUser(null)} style={{ background: '#333', color: '#fff', border: 'none', padding: '8px 16px', cursor: 'pointer', borderRadius: '4px' }}>Đăng xuất</button>
          </div>
        ) : (
          <button onClick={() => navigateTo('login')} style={{ background: '#E50914', color: '#fff', border: 'none', padding: '8px 18px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>Đăng nhập</button>
        )}
      </div>

    </nav>
  );
}

export default Navbar;