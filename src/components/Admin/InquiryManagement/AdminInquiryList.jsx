// src/components/Admin/InquiryManagement/AdminInquiryList.jsx

import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AdminInquiryManagementSidebar from '../../Sidebars/AdminSidebars/AdminInquiryManagementSidebar';
import './AdminInquiryList.css';

// 랜덤 이름, 제목, 상태, 날짜 생성
const names = ['홍길동', '김영희', '이철수', '박민수', '최수정', '윤지영', '박상우', '김다은', '정준호', '이지은'];
const titles = [
  '로그인 문제', '회원가입 오류', '결제 관련 문의', '배송 지연', '환불 요청',
  '상품 정보 수정 요청', '리뷰 작성 관련', '배송 상태 문의', '비밀번호 변경 요청', '계정 삭제 문의'
];
const statuses = ['답변 대기', '답변 중', '답변 완료'];
const getRandomDate = () => {
  const start = new Date(2024, 0, 1);
  const end = new Date();
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

// 더미 데이터 생성
const inquiries = Array.from({ length: 200 }, (_, index) => ({
  id: 200 - index,
  writer: names[Math.floor(Math.random() * names.length)],
  title: titles[Math.floor(Math.random() * titles.length)],
  date: getRandomDate(),
  status: statuses[Math.floor(Math.random() * statuses.length)],
}));

const AdminInquiryList = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const pagesPerGroup = 10;

  // 쿼리 파라미터에서 status 값을 추출
  const queryParams = new URLSearchParams(location.search);
  const statusFilter = queryParams.get('status');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // 검색 및 상태 필터링
  const filteredInquiries = inquiries
    .filter((inquiry) =>
      (!statusFilter || inquiry.status === statusFilter) &&
      (inquiry.writer.includes(searchQuery) || inquiry.title.includes(searchQuery))
    )
    .sort((a, b) => b.id - a.id);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInquiries = filteredInquiries.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
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
    <div className="admin-inquiry-list-container">
      <AdminInquiryManagementSidebar />
      <div className="admin-inquiry-list-content">
        <div className="admin-inquiry-list-header">
          <h1>문의사항 목록 조회</h1>
          <div className="admin-inquiry-search-bar">
            <input
              type="text"
              placeholder="사용자 이름, 제목 등"
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
            {currentInquiries.map((inquiry) => (
              <tr key={inquiry.id}>
                <td>{inquiry.id}</td>
                <td>{inquiry.writer}</td>
                <td>{inquiry.title}</td>
                <td>{inquiry.date}</td>
                <td>{inquiry.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="admin-inquiry-listpagination">
          {startPage > 1 && (
            <button onClick={goToPreviousGroup} className="admin-inquiry-listpagination-nav">이전</button>
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
            <button onClick={goToNextGroup} className="admin-inquiry-listpagination-nav">다음</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminInquiryList;