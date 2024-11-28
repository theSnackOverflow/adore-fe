import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerSupportSidebar from '../Sidebars/CustomerSupportSidebar';
import './InquiryList.css';

const InquiryList = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [type, setType] = useState('NAME');
  const [filter, setFilter] = useState('WAIT');
  const [category, setCategory] = useState('USER');
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  // API 호출로 데이터 가져오기
  const fetchInquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://gachon-adore.duckdns.org:8111/api/admin/question/lists/${currentPage}?type=${type}&filter=${filter}&category=${category}&keyword=${keyword}`,
        {
          headers: {
            accept: '*/*',
          },
        }
      );
      if (!response.ok) {
        throw new Error('데이터를 가져오는 데 실패했습니다.');
      }
      const data = await response.json();
      setInquiries(data.questionList || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [type, filter, category, currentPage]);

  const handleSearch = () => {
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
    fetchInquiries();
  };

  // 로딩 및 에러 처리
  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>에러가 발생했습니다: {error}</div>;
  }

  return (
    <div className="customer-support-container">
      <CustomerSupportSidebar />
      <div className="inquiry-list">
        <div className="inquiry-list-header">
          <h1>문의 목록</h1>
          <div className="inquiry-list-filters">
            <div className="inquiry-search-bar">
            <select className="inquiry-search-select" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="NICKNAME">닉네임</option>
              <option value="EMAIL">이메일</option>
            </select>
            <input
              type="text"
              placeholder="제목, 작성자 등 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button className="inquiry-search-btn" onClick={handleSearch}>검색</button>
            </div>
          </div>
        </div>
        <label className="inquiry-filter-label">상태:</label>
          <select className="inquiry-filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="WAIT">대기</option>
              <option value="COMPLETE">완료</option>
            </select>
            <label className="inquiry-filter-label">카테고리:</label>
            <select className="inquiry-filter-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="USER">사용자</option>
              <option value="SERVICE">서비스</option>
              <option value="REVIEW">리뷰</option>
              <option value="COMMENT">댓글</option>
              <option value="ETC">기타</option>
            </select>
        <table className="inquiry-list-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>상태</th>
              <th>작성 날짜</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry, index) => (
              <tr key={index}>
                <td>{index + 1 + (currentPage - 1) * 10}</td>
                <td>{inquiry.title}</td>
                <td>{inquiry.nickname}</td>
                <td>{inquiry.state}</td>
                <td>{new Date(inquiry.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={index + 1 === currentPage ? 'active' : ''}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          className="inquiry-list-write-btn"
          onClick={() => navigate('/customersupport/inquiryform')}
        >
          글쓰기
        </button>
      </div>
    </div>
  );
};

export default InquiryList;
