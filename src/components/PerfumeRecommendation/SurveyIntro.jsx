// src/components/PerfumeRecommendation/SurveyIntro.jsx
import React, { useState } from 'react';
import './SurveyIntro.css';
import PerfumeSidebar from '../Sidebars/PerfumeSidebar';
import SurveyQuestionModal from './SurveyQuestionModal';
import axios from 'axios';

const SurveyIntro = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState(null);

  const gatewayURL = import.meta.env.VITE_GATEWAY_URL;
  const instance = axios.create({
    baseURL: gatewayURL
  });

  const handleStartSurvey = async () => {
    try {
      const response = await instance.get('/api/user/recomm/first-question')
      console.log("첫번째 질문 받아오기 성공 : ", response.data);
      setData(response.data);
      setIsModalOpen(true);
    } catch(error){
      console.error("Error get first-question: ", error);
      setIsModalOpen(false);
    }
    
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
        <SurveyQuestionModal onClose={handleCloseModal} data={data.qstAnsSet} surveyId={data.surveyId}/>
      )}
    </div>
  );
};

export default SurveyIntro;