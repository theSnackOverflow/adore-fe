// src/components/PerfumeRecommendation/SurveyResultPerfumeCard.jsx
import React from 'react';
import './SurveyResultPerfumeCard.css';

const SurveyResultPerfumeCard = ({ perfume, isEven }) => {
  return (
    <div className={`survey-result-perfume-card ${isEven ? 'reverse' : ''}`}>
      <div className="survey-result-perfume-info">
        <h2>{perfume.name}</h2>
        <span>브랜드 : {perfume.brand}</span>
        <p>TOP : {perfume.top}</p>
        <p>MIDDLE : {perfume.middle}</p>
        <p>BASE : {perfume.base}</p>
      </div>
      <div className="survey-result-perfume-image-placeholder">
        <img 
          src={perfume.imageUrl || 'default_image_url.jpg'}  // 이미지가 없는 경우 기본 이미지 사용
          alt={`${perfume.name || '향수 이름 없음'} 이미지`} 
          // css 요소가 들어갈 자리
        />
      </div>
    </div>
  );
};

export default SurveyResultPerfumeCard;