// src/App.jsx
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Login from './pages/Login';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State mới điều khiển việc chuyển đổi giữa các tab danh mục
  const [activeSection, setActiveSection] = useState('all'); 

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
        setActiveSection={setActiveSection} // Truyền xuống Navbar để bấm chuyển tab
      />
      
      <main style={{ padding: '20px 40px' }}>
        {currentPage === 'home' && (
          <Home 
            searchQuery={searchQuery} 
            navigateTo={navigateTo} 
            activeSection={activeSection} // Truyền xuống Home để lọc giao diện
          />
        )}
        
        {currentPage === 'detail' && (
          <MovieDetail movieId={selectedMovieId} user={user} navigateTo={navigateTo} />
        )}
        
        {currentPage === 'login' && (
          <Login setUser={setUser} navigateTo={navigateTo} />
        )}
      </main>
    </div>
  );
}

export default App;