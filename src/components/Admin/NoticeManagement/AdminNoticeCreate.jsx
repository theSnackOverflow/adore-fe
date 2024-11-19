import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNoticeManagementSidebar from '../../Sidebars/AdminSidebars/AdminNoticeManagementSidebar';
import './AdminNoticeCreate.css';

const AdminNoticeCreate = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      const formattedTime = now.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentDateTime(`${formattedDate} ${formattedTime}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleContentChange = (e) => setContent(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setErrorMessage('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post(
        '/api/admin/notification/create',
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      if (response.status === 200) {
        alert('공지사항이 등록되었습니다.');
        navigate('/Admin/NoticeManagement/AdminNoticeList');
      } else {
        throw new Error('등록 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('공지사항 등록 오류:', error);
      setErrorMessage('공지사항 등록 중 오류가 발생했습니다.');
    }
  };

  const handleCancel = () => {
    navigate('/Admin/NoticeManagement/AdminNoticeList');
  };

  return (
    <div className="admin-notice-create-container">
      <AdminNoticeManagementSidebar />
      <div className="admin-notice-create-content">
        <h1>공지사항 등록</h1>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form onSubmit={handleSubmit} className="admin-notice-create-form">
          <div className="admin-notice-create-form-group">
            <label>작성자</label>
            <span>관리자2</span>
          </div>
          <div className="admin-notice-create-form-group">
            <label>작성 시간</label>
            <span>{currentDateTime}</span>
          </div>
          <div className="admin-notice-create-form-group">
            <label>제목</label>
            <input type="text" value={title} onChange={handleTitleChange} required />
          </div>
          <div className="admin-notice-create-form-group">
            <label>내용</label>
            <textarea value={content} onChange={handleContentChange} required />
          </div>
          <div className="admin-notice-create-form-buttons">
            <button type="submit" className="admin-notice-create-register-button">
              등록
            </button>
            <button type="button" onClick={handleCancel} className="admin-notice-create-cancel-button">
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminNoticeCreate;