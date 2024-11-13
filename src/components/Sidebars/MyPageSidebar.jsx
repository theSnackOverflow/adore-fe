// src/components/Sidebars/MyPageSidebar.js
// import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const MyPageSidebar = () => {
  return (
    <div className="sidebar">
      <h3>내 프로필 관리</h3>
      <ul>
        <li><Link to="/MyPage/PersonalInfoEdit">개인정보 변경</Link></li>
        <li><Link to="/MyPage/PasswordChange">비밀번호 변경</Link></li>
        <li><Link to="/MyPage/AccountDelete">회원 탈퇴</Link></li>
      </ul>
      
      <h3>내 리뷰 관리</h3>
      <ul>
        <li><Link to="/mypage/myreviewlist">내 리뷰 목록</Link></li>
        <li><Link to="/MyPage/ReviewForm">리뷰 등록</Link></li>
      </ul>
    </div>
  );
};

export default MyPageSidebar;