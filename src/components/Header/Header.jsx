import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ userRole, onLogout }) => {
  const navigate = useNavigate();

  const renderNavLinks = () => {
    if (userRole === "USER") {
      return (
        <>
          <li><Link to="/perfumerecommendation/perfumelist">향수 추천</Link></li>
          <li><Link to="/FriendRecommendation/FriendInfoInput">선물 추천</Link></li>
          <li><Link to="/mypage/personalinfoedit">마이페이지</Link></li>
          <li><Link to="/customersupport/noticelist">고객지원</Link></li>
        </>
      );
    } else if (userRole === "ADMIN") {
      return (
        <>
          <li><Link to="/admin/statistics">통계 관리</Link></li>
          <li><Link to="/Admin/PerfumeManagement/AdminPerfumeList">향수 관리</Link></li>
          <li><Link to="/Admin/UserManagement/UserList">회원 관리</Link></li>
          <li><Link to="/Admin/InquiryManagement/AdminInquiryList">문의사항 관리</Link></li>
          <li><Link to="/Admin/NoticeManagement/AdminNoticeList">공지사항 관리</Link></li>
          <li><Link to="/Admin/SurveyManagement/AdminSurveyList">설문조사 관리</Link></li>
        </>
      );
    } else {
      return (
        <>
          <li><Link to="/login">로그인</Link></li>
          <li><Link to="/SignUpForm">회원가입</Link></li>
        </>
      );
    }
  };

  return (
    <header className="header">
      <nav className="nav">
        <h1 className={userRole === "ADMIN" ? "logo-admin" : "logo"}>
          <Link to="/">Adore</Link>
        </h1>
        <ul className="nav-menu">
          {renderNavLinks()}
        </ul>
        <div className="nav-auth-buttons">
          {userRole !== "GUEST" && (
            <button onClick={onLogout} className="header-logout-btn">로그아웃</button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
