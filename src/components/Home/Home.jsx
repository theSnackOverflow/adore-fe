import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 네비게이트 함수 임포트
import axios from 'axios';
import './Home.css';

const Home = () => {
  const gatewayURL = import.meta.env.VITE_GATEWAY_URL;
  const instance = axios.create({
    baseURL: gatewayURL
  });
  const navigate = useNavigate();

  const [perfumes, setPerfumes] = useState([]);

  const fetchMainPerfumes = async () => {
    try{
      const response = await instance.get('/api/user/perfume/main');
      console.log("메인페이지 향수 조회 성공 : ", response.data);
      setPerfumes(response.data);
    } catch(error) {
      setPerfumes([]);
      console.log("메인페이지 향수 조회 실패");
      throw new Error("메인페이지 향수 조회 실패");
    }
  }

  useEffect(() => {
    fetchMainPerfumes();
  }, []);

  const handleFindPerfumeClick = () => {
    navigate('/perfumeRecommendation/surveyIntro'); // 버튼 클릭 시 페이지 이동
  };

  // if(!perfumes){
  //   return <p>Loading</p>;
  // }

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
          {perfumes !== undefined ? perfumes.map((perfume) => (
            <div key={perfume.id} className="home-perfume-card">
              <p>NAME: {perfume.name}</p>
              <p>BRAND: {perfume.brand}</p>
              <div className='home-perfume-image-placeholder'>
                <img
                  src={perfume.perfumeImg}
                  alt={perfume.name}
                />
              </div>
            </div>
          )) : Array.from({ length: 4 }).map(() => (
              <div className='home-perfume-card'>로딩 중</div>
            )
          )
          }
        </div>
      </div>
    </div>
  );
};

export default Home;