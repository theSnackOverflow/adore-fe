// src/components/Sidebars/UserManagementSidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../Sidebar.css';

const UserManagementSidebar = () => {
  return (
    <div className="sidebar">
        <h3><Link to="/Admin/UserManagement/UserList">회원 목록 조회</Link></h3>
            <ul>
            <li><Link to="/Admin/UserManagement/UserInfoEdit">회원 정보 수정</Link></li>
            <li><Link to="/Admin/UserManagement/UserRegistration">회원 등록</Link></li>
            <li><Link to="/Admin/UserManagement/PenaltyList">제제 회원 목록 조회</Link></li>
            </ul>
        <h3><Link to="/Admin/UserManagement/ReportList">신고 목록 조회</Link></h3>
            <ul>
                <li><Link to="/Admin/UserManagement/ReportDetail">신고 상세 조회</Link></li>
            </ul>
    </div>
  );
};

export default UserManagementSidebar;