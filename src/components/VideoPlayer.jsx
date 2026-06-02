import React from 'react';

function VideoPlayer({ videoUrl }) {
  // Kiểm tra nếu videoUrl là mã ID YouTube (thường không chứa đuôi .mp4 và ngắn)
  const isYouTube = videoUrl && !videoUrl.endsWith('.mp4');

  return (
    <div style={{ 
      width: '100%', 
      aspectRatio: '16/9', 
      backgroundColor: '#000', 
      borderRadius: '8px', 
      overflow: 'hidden', 
      boxShadow: '0 8px 24px rgba(0,0,0,0.6)' 
    }}>
      {isYouTube ? (
        /* Phát Trailer gốc từ YouTube */
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoUrl}?autoplay=1&mute=0&rel=0`}
          title="Movie Trailer Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ border: 'none' }}
        ></iframe>
      ) : (
        /* Dự phòng nếu sau này bạn có link mp4 thường */
        <video 
          src={videoUrl} 
          controls 
          autoPlay
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      )}
    </div>
  );
}

export default VideoPlayer;