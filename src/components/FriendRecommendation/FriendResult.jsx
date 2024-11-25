// src/components/FriendRecommendation/FriendRecommendationResult.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import FriendRecommendationSidebar from '../Sidebars/FriendRecommendationSidebar';
import SurveyResultPerfumeCard from '../PerfumeRecommendation/SurveyResultPerfumeCard';
import './FriendResult.css';

const FriendResult = ({ friendId }) => {

  const navigate = useNavigate(); // useNavigate 훅을 가져옵니다.
  const location = useLocation();

  // const id = friendId ? friendId : location.deliverId;
  const id = 1;

  const gatewayURL = import.meta.env.VITE_GATEWAY_URL;
  const instance = axios.create({
    baseURL: gatewayURL
  });

  const [perfumes, setPerfumes] = useState([]);

  useEffect(() => {
    const fetchRecommendationDetails = async () => {
      try{
        const response = await instance.get(`/api/user/recomm/result/${id}`);
        console.log("결과 요청 성공 : ", response.data);
        setPerfumes(response.data.perfumes);
      } catch(error) {
        console.error("결과 요청 실패", error);
        throw new Error("추천 결과가 존재하지 않습니다.");
      }
    };

    fetchRecommendationDetails();
  },[id]);

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
      </div>
    </div>
  );
};

export default FriendResult;