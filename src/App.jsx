// src/App.jsx
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Login from './pages/Login';
import BookingHistory from './pages/BookingHistory';
import Admin from './pages/Admin'; // Import file Admin mới
import { MOCK_MOVIES } from './data/mockMovies'; // Lấy dữ liệu gốc để khởi tạo

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('all'); 
  
  // State quản lý danh sách phim toàn cục
  const [movies, setMovies] = useState([]);

  // Khởi tạo dữ liệu phim từ localStorage (để Admin sửa thì Home cũng tự cập nhật)
  useEffect(() => {
    const localMovies = localStorage.getItem('app_movies');
    if (!localMovies) {
      localStorage.setItem('app_movies', JSON.stringify(MOCK_MOVIES));
      setMovies(MOCK_MOVIES);
    } else {
      setMovies(JSON.parse(localMovies));
    }
  }, []);

  const navigateTo = (page, movieId = null) => {
    setCurrentPage(page);
    if (movieId) setSelectedMovieId(movieId);
  };

  return (
    <div style={{ backgroundColor: '#141414', color: '#fff', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <Navbar 
        user={user} 
        setUser={setUser} 
        setSearchQuery={setSearchQuery} 
        navigateTo={navigateTo} 
        activeSection={activeSection}
        setActiveSection={setActiveSection} 
      />
      
      <main style={currentPage === 'admin' ? {} : { padding: '20px 40px' }}>
        {currentPage === 'home' && (
          <Home 
            movies={movies} // Truyền movies vào Home
            searchQuery={searchQuery} 
            navigateTo={navigateTo} 
            activeSection={activeSection} 
          />
        )}
        
        {currentPage === 'detail' && (
          <MovieDetail movies={movies} movieId={selectedMovieId} user={user} navigateTo={navigateTo} />
        )}
        
        {currentPage === 'login' && (
          <Login setUser={setUser} navigateTo={navigateTo} />
        )}

        {currentPage === 'history' && (
          <BookingHistory user={user} navigateTo={navigateTo} />
        )}

        {/* TRANG QUẢN TRỊ ADMIN */}
        {currentPage === 'admin' && (
          <Admin 
            user={user} 
            movies={movies} 
            setMovies={setMovies} 
            navigateTo={navigateTo} 
          />
        )}
      </main>
    </div>
  );
}

export default App;