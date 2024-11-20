import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import AdminInquiryManagementSidebar from '../../Sidebars/AdminSidebars/AdminInquiryManagementSidebar';
import './AdminInquiryList.css';

const AdminInquiryList = () => {
  const location = useLocation();
  const [inquiries, setInquiries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const pagesPerGroup = 10;

  // 쿼리 파라미터에서 상태 필터 값 추출
  const queryParams = new URLSearchParams(location.search);
  const statusFilter = queryParams.get('status') || 'WAIT';

  // 데이터 가져오기
  const fetchInquiries = async (page = 1) => {
    try {
      const response = await axios.get(
        `http://gachon-adore.duckdns.org:8111/api/admin/question/lists/${page}`,
        {
          params: {
            type: 'TITLE', // 제목 검색
            filter: statusFilter, // 상태 필터
            category: 'COMMENT', // 카테고리
            keyword: searchQuery, // 검색어
          },
        }
      );

      const { questionList, totalPages } = response.data;

      setInquiries(questionList || []);
      setTotalPages(totalPages || 1);
    } catch (error) {
      console.error('데이터를 가져오는 중 오류가 발생했습니다.', error);
      setInquiries([]); // 오류 발생 시 목록 비우기
    }
  };

  // 페이지가 로드되거나 검색어/페이지 변경 시 데이터 로드
  useEffect(() => {
    fetchInquiries(currentPage);
  }, [currentPage, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
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
    <div className="admin-inquiry-list-container">
      <AdminInquiryManagementSidebar />
      <div className="admin-inquiry-list-content">
        <div className="admin-inquiry-list-header">
          <h1>문의사항 목록 조회</h1>
          <div className="admin-inquiry-search-bar">
            <input
              type="text"
              placeholder="제목 검색"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <table className="admin-inquiry-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>작성자</th>
              <th>제목</th>
              <th>문의 날짜</th>
              <th>처리 상태</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length > 0 ? (
              inquiries.map((inquiry) => (
                <tr key={inquiry.id}>
                  <td>{inquiry.id}</td>
                  <td>{inquiry.nickname}</td>
                  <td>{inquiry.title}</td>
                  <td>{inquiry.createdAt.split('T')[0]}</td>
                  <td>{inquiry.state}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">조회된 문의사항이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="admin-inquiry-listpagination">
          {startPage > 1 && (
            <button onClick={goToPreviousGroup} className="admin-inquiry-listpagination-nav">
              이전
            </button>
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
            <button onClick={goToNextGroup} className="admin-inquiry-listpagination-nav">
              다음
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminInquiryList;