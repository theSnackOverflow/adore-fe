// src/components/Sidebars/UserManagementSidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../Sidebar.css';

const PerfumeManagementSidebar = () => {
  return (
    <div className="sidebar">
        <h3><Link to="/Admin/PerfumeManagement/AdminPerfumeList">향수 목록 조회</Link></h3>
        <h3><Link to="/Admin/PerfumeManagement/PerfumeInfoEdit">향수 정보 수정</Link></h3>
        <h3><Link to="/Admin/PerfumeManagement/PerfumeRegistration">향수 등록</Link></h3>
    </div>
  );
};

export default PerfumeManagementSidebar;