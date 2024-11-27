// src/components/Sidebars/UserManagementSidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../Sidebar.css';

const PerfumeManagementSidebar = () => {
  return (
    <div className="sidebar">
        <h3><Link to="/Admin/PerfumeManagement/AdminPerfumeList">향수 목록 조회</Link></h3>
        <ul>
          {/* <li><Link to="/Admin/PerfumeManagement/PerfumeInfoEdit">향수 정보 수정</Link></li> */}
          <li><Link to="/Admin/PerfumeManagement/PerfumeRegistration">향수 등록</Link></li>
        </ul>
        <h3><Link to="/Admin/PerfumeManagement/AdminNoteList">노트 목록 조회</Link></h3>
        <ul>
          {/* <li><Link to="/Admin/PerfumeManagement/NoteInfoEdit">노트 정보 수정</Link></li> */}
          <li><Link to="/admin/perfumemanagement/noteregistration">노트 등록</Link></li>
        </ul>
    </div>
  );
};

export default PerfumeManagementSidebar;