import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../../lib/axiosInstance';
import AdminNoticeManagementSidebar from '../../Sidebars/AdminSidebars/AdminNoticeManagementSidebar';
import './AdminNoticeEdit.css';

const AdminNoticeEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: initialId } = location.state || {}; // 전달된 공지사항 ID

  const [noticeId, setNoticeId] = useState(initialId || ''); // 공지사항 번호 필드
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [writerName, setWriterName] = useState('');
  const [state, setState] = useState('');
  const [createdDate, setCreatedDate] = useState('');
  const [updatedDate, setUpdatedDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 공지사항 데이터 조회
  const fetchNotice = async (id) => {
    if (!id) {
      setErrorMessage('공지사항 ID가 필요합니다.');
      return;
    }

    try {
      console.log('Fetching notice with ID:', id);
      const response = await axiosInstance.get(`/api/admin/notification/?id=${id}`);
      if (response.status === 200) {
        const data = response.data;
        console.log('Fetched Notice Data:', data); // 디버깅용
        setNoticeId(data.id || id);
        setTitle(data.title || '');
        setContent(data.content || '');
        setWriterName(data.writerName || '');
        setState(data.state || '');
        setCreatedDate(data.createdDate || '');
        setUpdatedDate(data.updatedDate || '');
        setErrorMessage('');
      } else {
        setErrorMessage('공지사항 정보를 불러오는 데 실패했습니다.');
      }
    } catch (error) {
      console.error('공지사항 조회 실패:', error);
      setErrorMessage('공지사항 정보를 불러오는 데 실패했습니다.');
    }
  };

  // 초기 ID가 있을 경우 공지사항 데이터를 로드
  useEffect(() => {
    if (initialId) {
      fetchNotice(initialId);
    } else {
      console.warn('initialId is not provided');
    }
  }, [initialId]);

  const handleNoticeIdChange = (e) => setNoticeId(e.target.value);

  const handleSearch = () => {
    if (!noticeId) {
      setErrorMessage('공지사항 번호를 입력해주세요.');
      return;
    }
    fetchNotice(noticeId);
  };

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleContentChange = (e) => setContent(e.target.value);
  const handleStateChange = (e) => setState(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setErrorMessage('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      console.log('Submitting updated data:', { title, content, state });
      const response = await axiosInstance.patch(
        `/api/admin/notification/update?id=${noticeId}&state=${state}`,
        { title, content }
      );

      if (response.status === 200) {
        alert('공지사항이 성공적으로 수정되었습니다.');
        navigate('/Admin/NoticeManagement/AdminNoticeList');
      }
    } catch (error) {
      console.error('공지사항 수정 실패:', error);
      const serverErrorMessage =
        error.response?.data?.message || '공지사항 수정 중 오류가 발생했습니다.';
      setErrorMessage(serverErrorMessage);
    }
  };

  const handleCancel = () => {
    navigate('/Admin/NoticeManagement/AdminNoticeList');
  };

  return (
    <div className="admin-notice-edit-container">
      <AdminNoticeManagementSidebar />
      <div className="admin-notice-edit-content">
        <h1>공지사항 수정</h1>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form onSubmit={handleSubmit} className="admin-notice-edit-form">
          {/* 공지사항 번호 입력 및 조회 */}
          <div className="admin-notice-edit-form-group">
            <label>공지사항 번호</label>
            <div className="notice-id-search-bar">
              <input
                type="text"
                placeholder="공지사항 번호 입력"
                value={noticeId}
                onChange={handleNoticeIdChange}
                disabled={!!initialId} // 전달된 ID가 있을 경우 입력 비활성화
              />
              {!initialId && ( // 전달된 ID가 없는 경우에만 조회 버튼 활성화
                <button
                  type="button"
                  onClick={handleSearch}
                  className="notice-id-search-btn"
                >
                  조회
                </button>
              )}
            </div>
          </div>
          <div className="admin-notice-edit-form-group">
            <label>작성자</label>
            <input
              type="text"
              value={writerName}
              disabled
              className="readonly-field"
            />
          </div>
          <div className="admin-notice-edit-form-group">
            <label>작성일</label>
            <input
              type="text"
              value={createdDate}
              disabled
              className="readonly-field"
            />
          </div>
          <div className="admin-notice-edit-form-group">
            <label>수정일</label>
            <input
              type="text"
              value={updatedDate}
              disabled
              className="readonly-field"
            />
          </div>
          <div className="admin-notice-edit-form-group">
            <label>상태</label>
            <select value={state} onChange={handleStateChange}>
              <option value="ACTIVE">활성</option>
              <option value="INACTIVE">비활성</option>
            </select>
          </div>
          <div className="admin-notice-edit-form-group">
            <label>제목</label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              required
            />
          </div>
          <div className="admin-notice-edit-form-group">
            <label>내용</label>
            <textarea
              value={content}
              onChange={handleContentChange}
              required
            />
          </div>
          <div className="admin-notice-edit-form-buttons">
            <button
              type="submit"
              className="admin-notice-edit-save-button"
            >
              수정
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="admin-notice-edit-cancel-button"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminNoticeEdit;