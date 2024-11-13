// src/components/FriendRecommendation/FriendRecommendationResult.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FriendRecommendationSidebar from '../Sidebars/FriendRecommendationSidebar';
import SurveyResultPerfumeCard from '../PerfumeRecommendation/SurveyResultPerfumeCard';
import SurveyQuestionModal from '../PerfumeRecommendation/SurveyQuestionModal';
import './FriendResult.css';

const FriendResult = () => {
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const navigate = useNavigate(); // useNavigate 훅을 가져옵니다.

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

  const handleRefresh = () => {
    navigate('/friendrecommendation/friendinfoinput'); // 페이지 이동 경로를 설정합니다.
  };

  return (
    <div className="friend-recommendation-result-container">
      <FriendRecommendationSidebar />
      <div className="friend-recommendation-result-content">
        <div className="friend-recommendation-result-header">
          <p>
            추천 결과가 마음에 들지 않는다면?
            <br />
            다시 추천 받기!
          </p>
          <button
            className="friend-recommendation-refresh-button"
            onClick={handleRefresh}
          >
            ⟳
          </button>
        </div>
        <div className="friend-recommendation-recommended-perfumes">
          <h1>결과 확인</h1>
          {recommendedPerfumes.map((perfume, index) => (
            <SurveyResultPerfumeCard
              key={perfume.id}
              perfume={perfume}
              isEven={index % 2 === 1}
            />
          ))}
        </div>
      </div>
      {isSurveyModalOpen && <SurveyQuestionModal onClose={closeSurveyModal} />}
    </div>
  );
};

export default FriendResult;