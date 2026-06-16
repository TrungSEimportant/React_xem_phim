// src/pages/Login.jsx
import React, { useState } from 'react';

function Login({ setUser, navigateTo }) {
  const [isLogin, setIsLogin] = useState(true); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!username.trim() || !password.trim()) {
      return setErrorMsg("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
    }

    // Lấy danh sách người dùng đã đăng ký (lưu tạm trong localStorage)
    const existingUsers = JSON.parse(localStorage.getItem('netflix_users')) || [];

    if (!isLogin) {
      // ================= LOGIC ĐĂNG KÝ =================
      if (password !== confirmPassword) {
        return setErrorMsg("Mật khẩu nhập lại không khớp. Vui lòng kiểm tra lại!");
      }

      // Kiểm tra xem user này đã tồn tại chưa
      const isUserExist = existingUsers.some(u => u.username === username);
      if (isUserExist) {
        return setErrorMsg("Tên đăng nhập này đã tồn tại. Vui lòng chọn tên khác!");
      }

      // Lưu tài khoản mới
      existingUsers.push({ username, password });
      localStorage.setItem('netflix_users', JSON.stringify(existingUsers));

      alert("🎉 Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
      setIsLogin(true); // Chuyển giao diện về form đăng nhập
      setPassword('');
      setConfirmPassword('');

    } else {
      // ================= LOGIC ĐĂNG NHẬP =================
      
      // KIỂM TRA QUYỀN ADMIN (Giữ nguyên theo yêu cầu của bạn)
      if (username === 'admin' && password === 'admin') {
        setUser({ name: 'Quản Trị Viên', role: 'admin' });
        navigateTo('admin');
        return; // Dừng hàm tại đây để không chạy xuống phần check user
      } 
      
      // KIỂM TRA QUYỀN USER BÌNH THƯỜNG (Đối chiếu với localStorage)
      const matchedUser = existingUsers.find(
        u => u.username === username && u.password === password
      );

      if (matchedUser) {
        setUser({ name: username, role: 'user' });
        navigateTo('home');
      } else {
        setErrorMsg("Tài khoản không tồn tại hoặc sai mật khẩu. Vui lòng đăng ký trước!");
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <div style={{ background: '#000', padding: '60px', borderRadius: '8px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
        <h2 style={{ color: '#fff', fontSize: '32px', marginBottom: '30px' }}>
          {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
        </h2>

        {errorMsg && (
          <div style={{ background: '#E50914', color: '#fff', padding: '10px', borderRadius: '4px', marginBottom: '20px', fontSize: '14px' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
              setUsername(''); setPassword(''); setConfirmPassword(''); setErrorMsg(''); 
            }} 
            style={{ color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
            {isLogin ? "Đăng ký ngay." : "Đăng nhập ngay."}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;