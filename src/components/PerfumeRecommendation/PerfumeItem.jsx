// src/components/PerfumeRecommendation/PerfumeItem.jsx
import React from 'react';
import './PerfumeItem.css';

const PerfumeItem = ({ perfume, onClick }) => {
  // 평점 렌더링 함수
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<span key={i}>{i <= rating ? '★' : '☆'}</span>);
    }
    return stars;
  };

  return (
    <div className="perfume-card" onClick={onClick}>
      <div className="perfume-card-content">
        <h2>{perfume.name}</h2>
        <p className="perfume-brand">{perfume.brand}</p>
        <p className="perfume-desc">{perfume.detail.perfumeDesc}</p>  
        {/* 향수 노트 추가 */}
        <div className="perfume-notes">
          <div className="note">
            <strong>Top:</strong> {perfume.detail.top}
          </div>
          <div className="note">
            <strong>Middle:</strong> {perfume.detail.middle}
          </div>
          <div className="note">
            <strong>Base:</strong> {perfume.detail.base}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfumeItem;