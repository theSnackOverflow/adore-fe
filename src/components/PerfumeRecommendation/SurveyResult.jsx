// src/components/PerfumeRecommendation/SurveyResult.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PerfumeSidebar from '../Sidebars/PerfumeSidebar';
import SurveyResultPerfumeCard from './SurveyResultPerfumeCard';
import axios from 'axios';
import './SurveyResult.css';

const SurveyResult = ({ userAnsId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // const id = userAnsId ? userAnsId : location.deliverId;
  const id = 1; // 주석 처리 예정

  const gatewayURL = import.meta.env.VITE_GATEWAY_URL;
  const instance = axios.create({
    baseURL: gatewayURL
  });
  
  const [perfumes, setPerfumes] = useState([]);
  const [hasSatisSurvey, setHasSatisSurvey] = useState(false);

  useEffect(() => {
    const fetchRecommendationDetails = async () => {
      try{
        const response = await instance.get(`/api/user/recomm/result/${id}`);
        console.log("결과 요청 성공 : ", response.data);
        setPerfumes(response.data.perfumes);
        setHasSatisSurvey(response.data.hasSatisSurvey);
      } catch(error) {
        console.error("결과 요청 실패", error);
        throw new Error("추천 결과가 존재하지 않습니다.");
      }
    };

    fetchRecommendationDetails();
  },[id]);

  const gotoSurveyIntro = () => {
    navigate('/perfumerecommendation/surveyintro');
  }

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
          <button className="survey-result-refresh-button" onClick={gotoSurveyIntro}>
            ⟳
          </button>
        </div>
        <div className="survey-result-recommended-perfumes">
          <h1>추천 결과 확인</h1>
          {perfumes.length > 0 ? (
            perfumes.map((perfume, index) => (
              <SurveyResultPerfumeCard
                key={perfume.id}
                perfume={perfume}
                isEven={index % 2 === 1} // 짝수 인덱스에만 `isEven`을 true로 전달
              />
            ))
          ) : (
            <p>추천 결과를 불러오는 중입니다...</p>
          )}
        </div>
        {!hasSatisSurvey && <div>설문조사 모달 추가하기</div>}
      </div>
    </div>
  );
};

export default SurveyResult;