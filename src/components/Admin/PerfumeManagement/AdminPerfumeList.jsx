import React, { useState, useEffect } from 'react';
import UserManagementSidebar from '../../Sidebars/AdminSidebars/PerfumeManagementSidebar';
import axiosInstance from '../../../lib/axiosInstance';
import './AdminPerfumeList.css';

const PerfumeList = () => {
  const [perfumes, setPerfumes] = useState([]); // API에서 가져온 향수 목록
  const [searchQuery, setSearchQuery] = useState(''); // 검색어
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [currentGroup, setCurrentGroup] = useState(1); // 현재 페이지 그룹
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 오류 메시지

  const BUTTONS_PER_GROUP = 10; // 페이지 그룹당 버튼 개수

  // API 호출
  const fetchPerfumes = async (page = 1, query = '') => {
    setLoading(true);
    setError(null); // 오류 초기화
    try {
      const response = await axiosInstance.get(`/api/admin/perfume/lists/${page}`, {
        params: {
          type: 'TITLE', // 검색 기준 (TITLE 고정)
          keyword: query, // 검색어
        },
      });

      const perfumeList = response.data.perfumeList || [];
      
      // 각 향수의 상세 정보 가져오기
      const detailedPerfumes = await Promise.all(
        perfumeList.map(async (perfume) => {
          try {
            const detailsResponse = await axiosInstance.get(`/api/admin/perfume/`, {
              params: { id: perfume.id },
            });
            const { top, middle, base } = detailsResponse.data;
            return { ...perfume, top, middle, base };
          } catch (detailError) {
            console.error(`Error fetching details for perfume ID ${perfume.id}:`, detailError);
            return { ...perfume, top: 'N/A', middle: 'N/A', base: 'N/A' };
          }
        })
      );

      // API 응답 데이터 설정
      setPerfumes(detailedPerfumes);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching perfumes:', error);
      setError('향수 데이터를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // 검색 실행 핸들러
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // 페이지를 1로 초기화
    setCurrentGroup(1); // 페이지 그룹을 1로 초기화
    fetchPerfumes(1, searchQuery); // 검색어에 맞는 첫 번째 페이지 데이터 가져오기
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchPerfumes(page, searchQuery); // 현재 검색어와 함께 해당 페이지 데이터를 가져오기
  };

  // 그룹 변경 핸들러
  const handleGroupChange = (direction) => {
    if (direction === 'prev' && currentGroup > 1) {
      setCurrentGroup((prev) => prev - 1);
    } else if (direction === 'next' && currentGroup < Math.ceil(totalPages / BUTTONS_PER_GROUP)) {
      setCurrentGroup((prev) => prev + 1);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchPerfumes();
  }, []);

  // 현재 그룹의 페이지 번호 계산
  const startPage = (currentGroup - 1) * BUTTONS_PER_GROUP + 1;
  const endPage = Math.min(startPage + BUTTONS_PER_GROUP - 1, totalPages);
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <div className="admin-perfume-list-container">
      <UserManagementSidebar />
      <div className="admin-perfume-list-content">
        <div className="admin-perfume-list-header">
          <h1>향수 목록 조회</h1>
          <form className="admin-perfume-list-search-bar" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="향수 이름 검색"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button type="submit">검색</button>
          </form>
        </div>
        {loading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            <table className="admin-perfume-list-table">
              <thead>
                <tr>
                  <th>브랜드</th>
                  <th>향수 이름</th>
                  <th>노트</th>
                  <th>생성일</th>
                  <th>수정일</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {perfumes.map((perfume) => (
                  <tr key={perfume.id}>
                    <td>{perfume.brand}</td>
                    <td>{perfume.name}</td>
                    <td>
                      <span className="note-section">
                        <strong>Top:</strong> {perfume.top || 'N/A'}
                      </span>
                      <br/>
                      <span className="note-section">
                        <strong>Middle:</strong> {perfume.middle || 'N/A'}
                      </span>
                      <br/>
                      <span className="note-section">
                        <strong>Base:</strong> {perfume.base || 'N/A'}
                      </span>
                    </td>
                    <td>{new Date(perfume.createdAt).toLocaleDateString()}</td>
                    <td>{new Date(perfume.updatedAt).toLocaleDateString()}</td>
                    <td>
                      <button className="admin-perfume-list-edit-button">수정</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="admin-perfume-list-pagination-container">
              <div className="admin-perfume-list-pagination">
                {currentGroup > 1 && (
                  <button onClick={() => handleGroupChange('prev')} className="pagination-button">
                    이전
                  </button>
                )}
                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                  >
                    {page}
                  </button>
                ))}
                {currentGroup < Math.ceil(totalPages / BUTTONS_PER_GROUP) && (
                  <button onClick={() => handleGroupChange('next')} className="pagination-button">
                    다음
                  </button>
                )}
              </div>
              <div className="admin-perfume-list-action-buttons">
                <button className="admin-perfume-list-write-btn">
                  향수 추가
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PerfumeList;