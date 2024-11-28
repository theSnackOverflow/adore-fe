import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트
import UserManagementSidebar from '../../Sidebars/AdminSidebars/UserManagementSidebar';
import axiosInstance from '../../../lib/axiosInstance';
import './ReportList.css';

const ReportList = () => {
  const [categoryFilter, setCategoryFilter] = useState('');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수 상태
  const [filter, setFilter] = useState('WAIT');
  const navigate = useNavigate(); // React Router의 useNavigate 사용

  // API 호출
  const fetchReports = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(`/api/admin/report/lists/${page}`, {
        params: {
          filter: filter || 'WAIT', // 필터링
          category: categoryFilter || 'REVIEW', // 카테고리 필터
        },
      });
      setReports(response.data.reportList || []);
      setTotalPages(response.data.totalPages); // 총 페이지 수 설정

    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('보고서 데이터를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      fetchReports(page); // 해당 페이지의 데이터 가져오기
    }
  };

  // 카테고리 필터 변경 핸들러
  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1); // 카테고리 변경 시 첫 페이지로 리셋
    fetchReports(1); // 첫 페이지 데이터 가져오기
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1); // 카테고리 변경 시 첫 페이지로 리셋
    fetchReports(1); // 첫 페이지 데이터 가져오기
  };

  useEffect(() => {
    fetchReports(currentPage); // 컴포넌트가 마운트될 때 첫 페이지 데이터 로드
  }, [categoryFilter, filter, currentPage]);

  return (
    <div className="report-list-container">
      <UserManagementSidebar />
      <div className="report-list-content">
        <div className="report-list-header">
          <h1>신고 목록 조회</h1>
          <div className="report-list-search-bar">
            <select value={categoryFilter} onChange={handleCategoryChange}>
              <option value="REVIEW">리뷰</option>
              <option value="COMMENT">댓글</option>
            </select>
            <select value={filter} onChange={handleFilterChange}>
              <option value="WAIT">대기</option>
              <option value="COMPLETE">완료</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            <table className="report-list-table">
              <thead>
                <tr>
                  <th>신고자</th>
                  <th>제목</th>
                  <th>카테고리</th>
                  <th>작성 날짜</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan="5">No reports found.</td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr key={report.id}>
                      <td>{report.nickname}</td>
                      {/* 제목 클릭 시 ReportDetail로 이동 */}
                      <td>
                        <button
                          className="report-title-button"
                          onClick={() => navigate(`/ReportDetail/${report.id}`)}
                        >
                          {report.title}
                        </button>
                      </td>
                      <td>{report.category}</td>
                      <td>{new Date(report.createdAt).toLocaleString()}</td>
                      <td>{report.state}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                이전
              </button>
              <span>{currentPage} / {totalPages}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                다음
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportList;
