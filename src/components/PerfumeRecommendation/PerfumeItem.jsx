import React from 'react';
import './PerfumeItem.css';

const PerfumeItem = ({ perfume, onClick }) => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<span key={i}>{i <= rating ? '★' : '☆'}</span>);
    }
    return stars;
  };

  // 이미지 경로 처리
  const imageSrc = perfume.perfumePhoto
    ? perfume.perfumePhoto.startsWith('http')
      ? perfume.perfumePhoto
      : `https://gachon-adore.duckdns.org${perfume.perfumePhoto}` // 상대 경로 처리
    : '/assets/images/default_image.jpg'; // 기본 이미지

  return (
    <div className="perfume-card" onClick={onClick}>
      <div className="perfume-card-content">
        <h2>{perfume.name}</h2>
        <p className="perfume-brand">{perfume.brand}</p>
        <div className="perfume-rating">{renderStars(perfume.detail?.rating || 0)}</div>
        <p className="perfume-desc">{perfume.detail?.perfumeDesc || '설명이 없습니다.'}</p>
        <div className="perfume-notes">
          <div className="note">
            <strong>Top:</strong> {perfume.detail?.top || '알 수 없음'}
          </div>
          <div className="note">
            <strong>Middle:</strong> {perfume.detail?.middle || '알 수 없음'}
          </div>
          <div className="note">
            <strong>Base:</strong> {perfume.detail?.base || '알 수 없음'}
          </div>
        </div>
      </div>
      {/* <div className="perfume-item-image-container">
        <img
          src={imageSrc}
          alt={`${perfume.name || '향수 이름 없음'} 이미지`}
          className="perfume-item-image"
        />
      </div> */}
    </div>
  );
};

export default PerfumeItem;