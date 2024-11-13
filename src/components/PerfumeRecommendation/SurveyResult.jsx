// src/components/PerfumeRecommendation/SurveyResult.jsx
import React, { useState } from 'react';
import PerfumeSidebar from '../Sidebars/PerfumeSidebar';
import SurveyResultPerfumeCard from './SurveyResultPerfumeCard';
import SurveyQuestionModal from './SurveyQuestionModal';
import './SurveyResult.css';

const SurveyResult = () => {
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);

  const recommendedPerfumes = [
    { id: 1, name: '추천 향수 1', brand: 'brand 1', notes: 'Top / Middle / Base' },
    { id: 2, name: '추천 향수 2', brand: 'brand 2', notes: 'Top / Middle / Base' },
    { id: 3, name: '추천 향수 3', brand: 'brand 3', notes: 'Top / Middle / Base' },
    { id: 4, name: '추천 향수 4', brand: 'brand 4', notes: 'Top / Middle / Base' },
    { id: 5, name: '추천 향수 5', brand: 'brand 5', notes: 'Top / Middle / Base' },
  ];

  const openSurveyModal = () => {
    setIsSurveyModalOpen(true);
  };

  const closeSurveyModal = () => {
    setIsSurveyModalOpen(false);
  };

  return (
    <div className="survey-result-container">
      <PerfumeSidebar />
      <div className="survey-result-content">
        <div className="survey-result-header">
          <p>
            추천 결과가 마음에 들지 않는다면?
            <br />
            다시 추천 받기!
          </p>
          <button className="survey-result-refresh-button" onClick={openSurveyModal}>
            ⟳
          </button>
        </div>
        <div className="survey-result-recommended-perfumes">
          <h1>결과 확인</h1>
          {recommendedPerfumes.map((perfume, index) => (
            <SurveyResultPerfumeCard
              key={perfume.id}
              perfume={perfume}
              isEven={index % 2 === 1} // 짝수 인덱스에만 `isEven`을 true로 전달
            />
          ))}
        </div>
      </div>
      {isSurveyModalOpen && <SurveyQuestionModal onClose={closeSurveyModal} />}
    </div>
  );
};

export default SurveyResult;