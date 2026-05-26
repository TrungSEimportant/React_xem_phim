import React from 'react';

function VideoPlayer({ videoUrl }) {
  return (
    <div style={{ width: '100%', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
      <video 
        controls 
        autoPlay
        src={videoUrl} 
        /* Đã xóa maxHeight: '450px' và đặt height: 'auto' để video tự động scale to nhất có thể */
        style={{ width: '100%', height: 'auto', display: 'block', aspectRatio: '16/9' }}
      >
        Trình duyệt của bạn không hỗ trợ định dạng video streaming này.
      </video>
    </div>
  );
}

export default VideoPlayer;