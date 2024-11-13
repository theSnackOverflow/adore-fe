// src/components/PerfumeRecommendation/SurveyIntro.jsx
import React, { useState } from 'react';
import './SurveyIntro.css';
import PerfumeSidebar from '../Sidebars/PerfumeSidebar';
import SurveyQuestionModal from './SurveyQuestionModal';

const SurveyIntro = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStartSurvey = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="survey-intro-container">
      <PerfumeSidebar />
      <div className="survey-intro-content">
        <div className="survey-intro-text">
          <h1>설문 조사를 통해<br />당신만의 취향을 발견해보세요!</h1>
          <button className="survey-start-button" onClick={handleStartSurvey}>
            설문조사 시작
          </button>
        </div>
        <div className="survey-intro-image">
          📝
        </div>
      </div>
      {isModalOpen && (
        <SurveyQuestionModal onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default SurveyIntro;