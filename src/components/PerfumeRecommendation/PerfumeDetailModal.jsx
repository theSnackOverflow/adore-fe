// src/components/PerfumeRecommendation/PerfumeDetailModal.jsx
import React from 'react';
import './PerfumeDetailModal.css';

const PerfumeDetailModal = ({ perfume, onClose }) => {
  return (
    <div className="perfume-detail-modal-overlay" onClick={onClose}>
      <div className="perfume-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="perfume-detail-modal-detail-header">
          <div className="perfume-detail-modal-info-box1">
            <h1>{perfume.perfume_nm || '향수 이름 없음'}</h1>
            <span className="perfume-detail-modal-brand">{perfume.brand}</span>
            <div className="perfume-detail-modal-rating">
              평점 : {[...Array(5)].map((_, i) => (
                <span key={i} className={i < perfume.rating_value ? "star filled" : "star"}>★</span>
              ))}
              <span>({perfume.rating_cnt}명)</span>
            </div>
          </div>
          <div className="perfume-detail-modal-info-box2">
            <p className="perfume-detail-modal-price">가격 : {perfume.price} 원</p>
            <p className="perfume-detail-modal-year">출시 연도 : {perfume.year || '정보 없음'}</p>
            <span className="perfume-detail-modal-country">원산지 : {perfume.country || '정보 없음'}</span>
            <span className="perfume-detail-modal-gender">성별 : {perfume.gender || '정보 없음'}</span>
          </div>
        </div>
        <div className="perfume-detail-modal-info-box3">
          <div className="perfume-detail-modal-info-box4">
            <div className="perfume-detail-modal-notes">
              <p><strong>Top Note</strong>: {perfume.top || '정보 없음'}</p>
              <p><strong>Middle Note</strong>: {perfume.middle || '정보 없음'}</p>
              <p><strong>Base Note</strong>: {perfume.base || '정보 없음'}</p>
            </div>
            <p className="perfume-detail-modal-description"><strong>설명</strong>: {perfume.perfume_desc || '정보 없음'}</p>
          </div>
          <div className="perfume-detail-modal-image-container">
            <img 
              src={perfume.perfume_img || 'default_image_url.jpg'}  // 이미지가 없는 경우 기본 이미지 사용
              alt={`${perfume.perfume_nm || '향수 이름 없음'} 이미지`} 
              className="perfume-detail-modal-image"
            />
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