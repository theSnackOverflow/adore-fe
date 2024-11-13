// src/components/Sidebars/AdminInquiryManagementSidebar.jsx

import { Link } from 'react-router-dom';
import '../Sidebar.css';

const AdminInquiryManagementSidebar = () => {
  return (
    <div className="sidebar">
        <h3><Link to="/Admin/InquiryManagement/AdminInquiryList">문의사항 목록 조회</Link></h3>
        <ul>
          <li><Link to="/Admin/InquiryManagement/AdminInquiryList?status=답변 대기">답변 대기</Link></li>
          <li><Link to="/Admin/InquiryManagement/AdminInquiryList?status=답변 중">답변 중</Link></li>
          <li><Link to="/Admin/InquiryManagement/AdminInquiryList?status=답변 완료">답변 완료</Link></li>
        </ul>
    </div>
  );
};

export default AdminInquiryManagementSidebar;