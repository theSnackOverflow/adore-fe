// src/components/PerfumeRecommendation/SurveyResultPerfumeCard.jsx
import React from 'react';
import './SurveyResultPerfumeCard.css';

const SurveyResultPerfumeCard = ({ perfume, isEven }) => {
  return (
    <div className={`survey-result-perfume-card ${isEven ? 'reverse' : ''}`}>
      <div className="survey-result-perfume-info">
        <h2>{perfume.name}</h2>
        <span>{perfume.brand}</span>
        <p>주요 노트 : {perfume.notes}</p>
      </div>
      <div className="survey-result-perfume-image-placeholder">이미지</div>
    </div>
  );
};

export default SurveyResultPerfumeCard;