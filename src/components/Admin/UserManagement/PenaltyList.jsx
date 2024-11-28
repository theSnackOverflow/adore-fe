import React, { useState, useEffect } from 'react';
import UserManagementSidebar from '../../Sidebars/AdminSidebars/UserManagementSidebar';
import axiosInstance from '../../../lib/axiosInstance';
import './PenaltyList.css';

const PenaltyList = () => {
  const [penaltys, setPenaltys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수 상태
  const [penaltyLevel, setPenaltyLevel] = useState('LOW');

  // API 호출
  const fetchPenaltys = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(`/api/admin/penalty/lists/${page}`, {
        params: {
          penaltyLevel: penaltyLevel || 'LOW', // 필터링
        },
      });
      setPenaltys(response.data.penaltList || []);
      setTotalPages(response.data.totalPages); // 총 페이지 수 설정

    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('페널티 회원 데이터를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      fetchPenaltys(page); // 해당 페이지의 데이터 가져오기
    }
  };

  // 카테고리 필터 변경 핸들러
  const handlePenaltyChange = (e) => {
    setPenaltyLevel(e.target.value);
    setCurrentPage(1); // 카테고리 변경 시 첫 페이지로 리셋
    fetchPenaltys(1); // 첫 페이지 데이터 가져오기
  };


  useEffect(() => {
    fetchPenaltys(currentPage); // 컴포넌트가 마운트될 때 첫 페이지 데이터 로드
  }, [penaltyLevel, currentPage]);

  return (
    <div className="report-list-container">
      <UserManagementSidebar />
      <div className="report-list-content">
        <div className="report-list-header">
          <h1>제제회원 목록 조회</h1>
          <div className="report-list-search-bar">
            <select value={penaltyLevel} onChange={handlePenaltyChange}>
              <option value="LOW">1일</option>
              <option value="MIDDLE">7일</option>
              <option value="HIGH">블랙 리스트</option>
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
                  <th>회원 ID</th>
                  <th>회원 닉네임</th>
                  <th>회원 이메일</th>
                  <th>제제 수준</th>
                  <th>제제일</th>
                  <th>만료일</th>
                </tr>
              </thead>
              <tbody>
                {penaltys.length === 0 ? (
                  <tr>
                    <td colSpan="5">No penalty found.</td>
                  </tr>
                ) : (
                  penaltys.map((penalty) => (
                    <tr key={penalty.id}>
                      <td>{penalty.memberId}</td>
                      {/* 제목 클릭 시 ReportDetail로 이동 */}
                      <td>
                          {penalty.nickname}
                      </td>
                      <td>{penalty.email}</td>
                      <td>{penalty.penaltyLevel}</td>
                      <td>{new Date(penalty.createdAt).toLocaleString("ko-KR", {dateStyle: "full"})}</td>
                      <td>{new Date(penalty.expiredAt).toLocaleString("ko-KR", {dateStyle: "full"})}</td>
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

export default PenaltyList;
