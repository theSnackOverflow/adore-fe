// src/components/Sidebars/AdminSidebars/AdminSurveyManagementSidebar.jsx

import { Link } from 'react-router-dom';
import '../Sidebar.css';

const AdminSurveyManagementSidebar = () => {
  return (
    <div className="sidebar">
      <h3><Link to="/Admin/SurveyManagement/AdminSurveyList">설문조사 관리</Link></h3>
      <h3><Link to="/Admin/SurveyManagement/AdminSurveyCreate">설문조사 생성</Link></h3>
      {/* <ul>
        <li><Link to="/Admin/SurveyManagement/AdminSurveyList?status=활성화">활성화</Link></li>
        <li><Link to="/Admin/SurveyManagement/AdminSurveyList?status=비활성화">비활성화</Link></li>
      </ul> */}
    </div>
  );
};

export default AdminSurveyManagementSidebar;