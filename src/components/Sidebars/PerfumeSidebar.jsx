// src/components/Sidebars/FragranceSidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const FragranceSidebar = () => {
  return (
    <div className="sidebar">
      <h3><a href="../perfumerecommendation/perfumelist">전체 향수 보기</a></h3>
      <h3><a href="../perfumerecommendation/notelist">전체 노트 보기</a></h3>
      <h3><Link to="../perfumerecommendation/surveyintro">향수 추천 받기</Link></h3>
        <ul>
          {/* <li><Link to="/">설문 조사</Link></li> */}
          <li><Link to="../perfumerecommendation/surveyresultlist">추천 결과 확인</Link></li>
        </ul>
      <h3>향수 리뷰 보기</h3>
      <ul>
        <li><Link to="../PerfumeRecommendation/OtherReviewList">리뷰 목록 보기</Link></li>
      </ul>
    </div>
  );
};

export default FragranceSidebar;