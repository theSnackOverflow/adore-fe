import React from 'react';
import { useNavigate } from 'react-router-dom'; // 네비게이트 함수 임포트
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleFindPerfumeClick = () => {
    navigate('/perfumeRecommendation/surveyIntro'); // 버튼 클릭 시 페이지 이동
  };

  return (
    <div className="home-container">
      <div className="home-banner">
        <div className="home-banner-container">
          <h1>Adore</h1>
          <p>당신의 취향을 찾아드립니다</p>
          <button className="home-find-perfume-btn" onClick={handleFindPerfumeClick}>
            나의 취향 찾기
          </button>
        </div>
      </div>
      <div className="home-new-perfumes">
        <h2>이 달의 신규 향수</h2>
        <div className="home-perfume-card-container">
          <div className="home-perfume-card">신규 향수 1</div>
          <div className="home-perfume-card">신규 향수 2</div>
          <div className="home-perfume-card">신규 향수 3</div>
          <div className="home-perfume-card">신규 향수 4</div>
        </div>
      </div>
    </div>
  );
};

export default Home;