// src/pages/Login.jsx
import React, { useState } from 'react';

function Login({ setUser, navigateTo }) {
  const [isLogin, setIsLogin] = useState(true); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

 const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!username.trim() || !password.trim()) {
      return setErrorMsg("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
    }

    if (!isLogin) {
      // ================= LOGIC ĐĂNG KÝ (API) =================
      if (password !== confirmPassword) {
        return setErrorMsg("Mật khẩu nhập lại không khớp. Vui lòng kiểm tra lại!");
      }

      try {
        const res = await fetch('http://localhost:5000/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        
        if (data.success) {
          alert("🎉 Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
       
          setIsLogin(true); 
          setPassword('');
          setConfirmPassword('');
        } else {
          setErrorMsg(data.message || "Tài khoản đã tồn tại hoặc đăng ký thất bại!");
        }
      } catch (err) {
        setErrorMsg("Lỗi kết nối đến máy chủ Backend!");
      }

    } else {
      // ================= LOGIC ĐĂNG NHẬP (API) =================
      try {
        const res = await fetch('http://localhost:5000/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        
        if (data.success) {
          // 1. Tạo object chứa thông tin user
          const userInfo = { name: data.user.username, role: data.user.role };
          
          // 2. Cập nhật state
          setUser(userInfo);

          // 3. Lưu vào localStorage (phải chuyển thành chuỗi JSON)
          localStorage.setItem('user', JSON.stringify(userInfo));

          // 4. Console log object của người dùng ra để kiểm tra
          console.log("User Object đã lưu vào local:", JSON.parse(localStorage.getItem('user')));
          
          // 5. Điều hướng dựa vào quyền
          if (data.user.role === 'admin') {
            navigateTo('admin');
          } else {
            navigateTo('home');
          }
        } else {
          setErrorMsg(data.message || "Tài khoản không tồn tại hoặc sai mật khẩu.");
          
          // Xóa thông tin user trong localStorage nếu đăng nhập thất bại
          localStorage.removeItem('user'); 
        }
      } catch (err) {
        setErrorMsg("Lỗi kết nối đến máy chủ Backend!");
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