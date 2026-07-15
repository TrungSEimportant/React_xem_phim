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
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '15px 40px', 
      backgroundColor: '#000', 
      borderBottom: '1px solid #222', 
      position: 'sticky', 
      top: 0, 
      zIndex: 100 
    }}>
      
      {/* PHẦN 1: LOGO & MENU ĐIỀU HƯỚNG */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '30px' }}>
        <h1 
          onClick={() => {
            // Admin bấm vào logo không chuyển hướng về home, User bình thường thì có
            if(user?.role !== 'admin') handleTabClick('all');
          }} 
          style={{ color: '#E50914', cursor: 'pointer', margin: 0, fontSize: '28px', letterSpacing: '2px', whiteSpace: 'nowrap' }}
        >
          NETFLUX
        </h1>
        
        {/* THANH MENU ĐIỀU HƯỚNG: Chỉ hiển thị nếu KHÔNG PHẢI là Admin */}
        {user?.role !== 'admin' && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center', 
            gap: '20px', 
            fontSize: '15px',
            flexWrap: 'nowrap' 
          }}>
            <span 
              onClick={() => handleTabClick('all')} 
              style={{ 
                whiteSpace: 'nowrap', 
                padding: '5px', 
                cursor: 'pointer', 
                color: activeSection === 'all' ? '#fff' : '#aaa', 
                fontWeight: activeSection === 'all' ? 'bold' : 'normal',
                transition: 'color 0.2s'
              }}
            >
              Trang Chủ
            </span>
            <span 
              onClick={() => handleTabClick('hot')} 
              style={{ 
                whiteSpace: 'nowrap', 
                padding: '5px', 
                cursor: 'pointer', 
                color: activeSection === 'hot' ? '#fff' : '#aaa', 
                fontWeight: activeSection === 'hot' ? 'bold' : 'normal',
                transition: 'color 0.2s'
              }}
            >
              Phim Hot
            </span>
            <span 
              onClick={() => handleTabClick('new')} 
              style={{ 
                whiteSpace: 'nowrap', 
                padding: '5px', 
                cursor: 'pointer', 
                color: activeSection === 'new' ? '#fff' : '#aaa', 
                fontWeight: activeSection === 'new' ? 'bold' : 'normal',
                transition: 'color 0.2s'
              }}
            >
              Phim Mới
            </span>
            <span 
              onClick={() => handleTabClick('upcoming')} 
              style={{ 
                whiteSpace: 'nowrap', 
                padding: '5px', 
                cursor: 'pointer', 
                color: activeSection === 'upcoming' ? '#fff' : '#aaa', 
                fontWeight: activeSection === 'upcoming' ? 'bold' : 'normal',
                transition: 'color 0.2s'
              }}
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
            style={{ 
              padding: '10px 20px', 
              width: '100%', 
              maxWidth: '350px', 
              borderRadius: '20px', 
              border: '1px solid #444', 
              backgroundColor: 'rgba(255,255,255,0.1)', 
              color: '#fff', 
              outline: 'none' 
            }}
          />
        )}
      </div>

      {/* PHẦN 3: ĐĂNG NHẬP & THÔNG TIN TÀI KHOẢN */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        {user ? (
          // Đã tăng gap lên 20px và thêm paddingLeft để tách xa thanh tìm kiếm
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', whiteSpace: 'nowrap', paddingLeft: '20px' }}>
            <span style={{ fontSize: '15px' }}>
              Xin chào, <strong style={{ color: '#fff', marginLeft: '4px' }}>{user.name}</strong>
            </span>
            
            {/* Nút Lịch sử đặt vé */}
            {user.role === 'user' && (
              <button 
                onClick={() => navigateTo('history')} 
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#050505';
                  e.target.style.color = '#fd0505';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#fff';
                }}
                style={{
                  whiteSpace: 'nowrap', 
                  background: 'transparent', 
                  color: '#fff', 
                  border: '1px solid #fff', 
                  padding: '8px 16px', 
                  cursor: 'pointer', 
                  borderRadius: '4px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease' // Thêm transition để hover mượt mà
                }}
              >
                 Lịch sử đặt vé
              </button>
            )}

            {/* Nút Đăng xuất */}
            <button 
              onClick={() => {
                setUser(null);
                navigateTo('home');
              }} 
              onMouseEnter={(e) => e.target.style.backgroundColor = '#fa0808'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#333'}
              style={{ 
                whiteSpace: 'nowrap',
                background: '#333', 
                color: '#fff', 
                border: 'none', 
                padding: '8px 16px', 
                cursor: 'pointer', 
                borderRadius: '4px',
                fontWeight: '500',
                transition: 'all 0.3s ease' // Thêm transition để hover mượt mà
              }}
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <button 
            onClick={() => navigateTo('login')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f40612'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#333'} 
            style={{ 
              whiteSpace: 'nowrap',
              background: '#333', 
              color: '#fff', 
              border: 'none', 
              padding: '8px 20px', 
              cursor: 'pointer', 
              borderRadius: '4px', 
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease'
            }}
          >
            Đăng nhập
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;