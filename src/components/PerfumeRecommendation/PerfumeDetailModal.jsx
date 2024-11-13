// src/components/PerfumeRecommendation/PerfumeDetailModal.jsx
import React, { useState } from 'react';
import './PerfumeDetailModal.css';

const PerfumeDetailModal = ({ perfume, onClose }) => {
  const [isImageHovered, setIsImageHovered] = useState(false);

  return (
    <div className="perfume-detail-modal-overlay" onClick={onClose}>
      <div className="perfume-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="perfume-detail-modal-detail-header">
          <div className="perfume-detail-modal-info-box1">
            <h1>{perfume.perfume_nm || '향수 이름 없음'}</h1>  {/* 향수 이름 표시 */}
            <span className="perfume-detail-modal-brand">{perfume.brand}</span>
          </div>
          <div className="perfume-detail-modal-info-box2">
            <div className="perfume-detail-modal-rating">
              평점 : {[...Array(5)].map((_, i) => (
                <span key={i} className={i < perfume.rating_value ? "star filled" : "star"}>★</span>
              ))}
              <span>({perfume.rating_cnt}명)</span>
            </div>
            <p className="perfume-detail-modal-price">가격 : {perfume.price} 원</p>
            <p className="perfume-detail-modal-year">출시 연도 : {perfume.year}</p>
          </div>
        </div>
        <div className="perfume-detail-modal-info-box3">
          <div className="perfume-detail-modal-info-box4">
            <div className="perfume-detail-modal-notes">
              <p><strong>Top Note</strong>: {perfume.top}</p>
              <p><strong>Middle Note</strong>: {perfume.middle}</p>
              <p><strong>Base Note</strong>: {perfume.base}</p>
            </div>
            <p className="perfume-detail-modal-description"><strong>설명</strong>: {perfume.perfume_desc}</p>
          </div>
          <div 
            className="perfume-detail-modal-image-container"
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
          >
            <img 
              src={perfume.perfume_img || 'default_image_url.jpg'}  // 이미지가 없는 경우 기본 이미지 사용
              alt={`${perfume.perfume_nm || '향수 이름 없음'} 이미지`} 
              className="perfume-detail-modal-image"
            />
            {isImageHovered && (
              <div className="perfume-detail-modal-image-hover">
                <img 
                  src={perfume.perfume_img || 'default_image_url.jpg'} 
                  alt={`${perfume.perfume_nm || '향수 이름 없음'} 확대 이미지`} 
                  className="perfume-detail-modal-image-large"
                />
              </div>
            )}
          </div>
        </div>
        <div className="perfume-detail-modal-actions">
          <button className="perfume-detail-modal-view-reviews-btn">리뷰 보기</button>
          <button className="perfume-detail-modal-close-btn" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default PerfumeDetailModal;