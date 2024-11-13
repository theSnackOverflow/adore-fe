// src/components/sidebars/FriendRecommendationSidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const FriendRecommendationSidebar = () => {
  return (
    <div className="sidebar">
      <h3>친구 선물 추천</h3>
      <ul>
        <li><Link to="/FriendRecommendation/FriendInfoInput">친구 정보 입력</Link></li>
        <li><Link to="/FriendRecommendation/FriendResult">결과 확인</Link></li>
      </ul>
    </div>
  );
};

export default FriendRecommendationSidebar;