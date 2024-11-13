// src/components/NoticeManagement/AdminNoticeList.jsx

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminNoticeManagementSidebar from '../../Sidebars/AdminSidebars/AdminNoticeManagementSidebar';
import './AdminNoticeList.css';

// 더미 데이터 생성
const authors = ['관리자1', '관리자2', '관리자3'];
const titles = ['시스템 점검 안내', '신규 기능 업데이트', '휴일 안내'];
const statuses = ['활성화', '비활성화'];
const getRandomDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 공지사항 더미 데이터 생성 (200개)
const notices = Array.from({ length: 200 }, (_, index) => ({
  id: 200 - index,
  author: authors[Math.floor(Math.random() * authors.length)],
  title: titles[Math.floor(Math.random() * titles.length)],
  date: getRandomDateTime(),
  status: statuses[Math.floor(Math.random() * statuses.length)],
}));

const AdminNoticeList = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const pagesPerGroup = 10;

  // 쿼리 파라미터에서 status 값을 추출
  const queryParams = new URLSearchParams(location.search);
  const statusFilter = queryParams.get('status') || '활성화';

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredNotices = notices
    .filter(
      (notice) =>
        (!statusFilter || notice.status === statusFilter) &&
        (notice.author.includes(searchQuery) || notice.title.includes(searchQuery))
    )
    .sort((a, b) => b.id - a.id);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotices = filteredNotices.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const currentGroup = Math.floor((currentPage - 1) / pagesPerGroup);
  const startPage = currentGroup * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
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
            <input
              type="text"
              placeholder="작성자, 제목 등"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <table className="admin-notice-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>작성자</th>
              <th>제목</th>
              <th>작성 시간</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {currentNotices.map((notice) => (
              <tr key={notice.id}>
                <td>{notice.id}</td>
                <td>{notice.author}</td>
                <td>{notice.title}</td>
                <td>{notice.date}</td>
                <td>{notice.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="admin-notice-pagination">
          {startPage > 1 && (
            <button onClick={goToPreviousGroup} className="admin-notice-pagination-nav">이전</button>
          )}
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={currentPage === page ? 'active' : ''}
            >
              {page}
            </button>
          ))}
          {endPage < totalPages && (
            <button onClick={goToNextGroup} className="admin-notice-pagination-nav">다음</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNoticeList;