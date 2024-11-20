import { Link } from 'react-router-dom';
import '../Sidebar.css';

const AdminNoticeManagementSidebar = () => {
  return (
    <div className="sidebar">
      <h3><Link to="/Admin/NoticeManagement/AdminNoticeList">공지사항 목록 조회</Link></h3>
      <ul>
        <li><Link to="/Admin/NoticeManagement/AdminNoticeCreate">공지사항 수정</Link></li>
        <li><Link to="/Admin/NoticeManagement/AdminNoticeCreate">공지사항 등록</Link></li>
      </ul>
    </div>
  );
};

export default AdminNoticeManagementSidebar;