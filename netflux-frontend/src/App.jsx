// src/App.jsx
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Login from './pages/Login';
import BookingHistory from './pages/BookingHistory';
import Admin from './pages/Admin'; 

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('all'); 
  
  // State quản lý danh sách phim toàn cục
  const [movies, setMovies] = useState([]);

  // FETCH API: Khởi tạo dữ liệu phim từ Database Backend
  useEffect(() => {
    fetch('http://localhost:5000/api/movies')
      .then(res => res.json())
      .then(data => {
        setMovies(data);
      })
      .catch(err => console.error("Lỗi khi tải danh sách phim:", err));
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
            movies={movies} 
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