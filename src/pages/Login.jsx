import React, { useState } from 'react';

function Login({ setUser, navigateTo }) {
  const [isLogin, setIsLogin] = useState(true); 

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // State mới để lưu câu thông báo lỗi hiển thị trên form
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Reset lại lỗi mỗi lần bấm nút
    setErrorMsg('');
    
    // 1. Kiểm tra không được để trống
    if (!username.trim() || !password.trim()) {
      return setErrorMsg("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
    }

    if (!isLogin) {
      // 2. Xử lý logic ĐĂNG KÝ
      if (password !== confirmPassword) {
        return setErrorMsg("Mật khẩu nhập lại không khớp. Vui lòng kiểm tra lại!");
      }
      
      // Nếu thành công, có thể dùng alert báo hỉ 1 lần rồi chuyển trang
      alert("🎉 Đăng ký thành công! Hệ thống sẽ tự động đăng nhập.");
      setUser({ name: username });
      navigateTo('home');
      
    } else {
      // 3. Xử lý logic ĐĂNG NHẬP
      setUser({ name: username });
      navigateTo('home');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '40px', backgroundColor: '#1a1a1a', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
      
      <h2 style={{ marginBottom: '30px', color: '#fff' }}>
        {isLogin ? 'Đăng Nhập Hệ Thống' : 'Đăng Ký Tài Khoản'}
      </h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* KHU VỰC HIỂN THỊ LỖI */}
        {errorMsg && (
          <div style={{ 
            color: '#ff4d4f', 
            backgroundColor: 'rgba(255, 77, 79, 0.1)', 
            padding: '12px', 
            borderRadius: '4px', 
            border: '1px solid #ff4d4f',
            fontSize: '14px',
            textAlign: 'left'
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <input 
          type="text" 
          placeholder="Tên đăng nhập..." 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '14px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#333', color: '#fff', outline: 'none' }}
        />
        
        <input 
          type="password" 
          placeholder="Mật khẩu..." 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '14px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#333', color: '#fff', outline: 'none' }}
        />

        {!isLogin && (
          <input 
            type="password" 
            placeholder="Nhập lại mật khẩu..." 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ padding: '14px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#333', color: '#fff', outline: 'none' }}
          />
        )}

        <button type="submit" style={{ background: '#E50914', color: '#fff', border: 'none', padding: '14px', fontSize: '16px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
          {isLogin ? 'Xác nhận Đăng nhập' : 'Xác nhận Đăng ký'}
        </button>
      </form>

      <div style={{ marginTop: '20px', color: '#aaa', fontSize: '14px' }}>
        {isLogin ? "Bạn chưa có tài khoản? " : "Bạn đã có tài khoản? "}
        <span 
          onClick={() => {
            setIsLogin(!isLogin);
            // Reset toàn bộ thông tin và lỗi khi chuyển qua lại giữa Đăng nhập/Đăng ký
            setUsername('');
            setPassword('');
            setConfirmPassword('');
            setErrorMsg(''); 
          }} 
          style={{ color: '#fff', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
        >
          {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
        </span>
      </div>

    </div>
  );
}

export default Login;