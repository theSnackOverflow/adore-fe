import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerSupportSidebar from '../Sidebars/CustomerSupportSidebar';
import './NoticeList.css';

const NoticeList = () => {
  const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태
  const [notices, setNotices] = useState([]); // 공지사항 리스트 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [loading, setLoading] = useState(false); // 로딩 상태

  const fetchNotices = async (page = 1, query = '') => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://gachon-adore.duckdns.org:8111/api/admin/notification/lists/${page}`,
        {
          params: { searchType: 'NICKNAME', keyword: query },
        }
      );

      if (response.data) {
        setNotices(response.data.notificationList);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('공지사항 데이터를 가져오는 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 및 검색어/페이지 변경 시 데이터 로드
  useEffect(() => {
    fetchNotices(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  // 페이지가 변경되면 스크롤을 아래로 내리는 useEffect
  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [currentPage, notices]); // currentPage나 notices가 변경될 때마다 실행

  const handleSearch = () => {
    setCurrentPage(1); // 검색 시 첫 페이지로 초기화
    fetchNotices(1, searchQuery);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="customer-support-container">
      <CustomerSupportSidebar />
      <div className="notice-list">
        <div className="notice-header">
          <h1>공지사항</h1>
          <div className="notice-search-bar">
            <input
              type="text"
              placeholder="닉네임 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch}>검색</button>
          </div>
        </div>
        {loading ? (
          <p>로딩 중...</p>
        ) : notices.length > 0 ? (
          <>
            <table className="notice-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>제목</th>
                  <th>닉네임</th>
                  <th>이메일</th>
                  <th>작성 시간</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((notice, index) => (
                  <tr key={index}>
                    <td>{index + 1 + (currentPage - 1) * 10}</td>
                    <td>{notice.title}</td>
                    <td>{notice.nickname}</td>
                    <td>{notice.email}</td>
                    <td>{new Date(notice.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 페이지네이션 */}
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    className={`pagination-btn ${
                      currentPage === pageNumber ? 'active' : ''
                    }`}
                    onClick={() => handlePageClick(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                )
              )}
            </div>
          </>
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default NoticeList;
