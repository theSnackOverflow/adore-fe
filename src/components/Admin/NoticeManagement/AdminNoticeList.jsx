import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminNoticeManagementSidebar from '../../Sidebars/AdminSidebars/AdminNoticeManagementSidebar';
import './AdminNoticeList.css';

const AdminNoticeList = () => {
  const [notices, setNotices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('1'); // 디폴트 값 설정
  const [searchType, setSearchType] = useState('NAME'); // 디폴트 값 설정
  const [error, setError] = useState(null);
  const itemsPerPage = 10;
  const pagesPerGroup = 10;

  const navigate = useNavigate();

  // 공지사항 API 호출 함수
  const fetchNotices = async (page = 1) => {
    try {
      const params = {
        searchType,
        keyword: searchQuery,
      };

      const response = await axios.get(
        `http://gachon-adore.duckdns.org:8111/api/admin/notification/lists/${page}`,
        { params }
      );

      const { notificationList, totalPages } = response.data;

      setNotices(notificationList || []);
      setTotalPages(totalPages || 1);
      setError(null);
    } catch (err) {
      console.error('공지사항 목록 불러오기 오류:', err);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    }
  };

  // 컴포넌트 로드 시 기본값으로 API 호출
  useEffect(() => {
    fetchNotices(currentPage);
  }, [currentPage, searchQuery, searchType]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (id) => {
    // 수정 페이지로 이동
    navigate(`/admin/notification/edit/${id}`);
  };

  const currentGroup = Math.floor((currentPage - 1) / pagesPerGroup);
  const startPage = currentGroup * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  const goToPreviousGroup = () => {
    if (startPage > 1) setCurrentPage(startPage - 1);
  };

  const goToNextGroup = () => {
    if (endPage < totalPages) setCurrentPage(endPage + 1);
  };

  return (
    <div className="admin-notice-list-container">
      <AdminNoticeManagementSidebar />
      <div className="admin-notice-list-content">
        <div className="admin-notice-list-header">
          <h1>공지사항 목록 조회</h1>
          <div className="admin-notice-search-bar">
            <select value={searchType} onChange={handleSearchTypeChange}>
              <option value="TITLE">제목</option>
              <option value="NICKNAME">작성자 닉네임</option>
              <option value="EMAIL">작성자 이메일</option>
              <option value="STATE">상태</option>
              <option value="BRAND">브랜드</option>
              <option value="NAME">이름</option>
            </select>
            <input
              type="text"
              placeholder="검색어 입력"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        {error && <p className="error-message">{error}</p>}
        <table className="admin-notice-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자 닉네임</th>
              <th>작성자 이메일</th>
              <th>상태</th>
              <th>작성 시간</th>
              <th>수정</th> {/* 수정 열 추가 */}
            </tr>
          </thead>
          <tbody>
            {notices.length > 0 ? (
              notices.map((notice, index) => (
                <tr key={notice.id}>
                  <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td>{notice.title}</td>
                  <td>{notice.nickname}</td>
                  <td>{notice.email}</td>
                  <td>{notice.state}</td>
                  <td>{new Date(notice.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(notice.id)}
                      className="admin-notice-list-edit-button"
                    >
                      수정
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">데이터가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="admin-notice-pagination">
          {startPage > 1 && (
            <button onClick={goToPreviousGroup} className="admin-notice-pagination-nav">
              이전
            </button>
          )}
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={currentPage === page ? 'active' : ''}
              >
                {page}
              </button>
            )
          )}
          {endPage < totalPages && (
            <button onClick={goToNextGroup} className="admin-notice-pagination-nav">
              다음
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNoticeList;