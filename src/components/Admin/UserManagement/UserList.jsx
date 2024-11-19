import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserManagementSidebar from '../../Sidebars/AdminSidebars/UserManagementSidebar';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    return dateString.split('T')[0]; // "2024-11-19T12:34:56" -> "2024-11-19"
  };

  // API 호출 함수
  const fetchUsers = async (page = 1) => {
    try {
      const response = await axios.get(`/api/admin/user/lists/${page}`, {
        params: {
          type: 'NAME', // 검색 기준 (이름)
          keyword: searchQuery, // 검색어
        },
      });

      const { memberList = [], totalPages } = response.data; // 응답 데이터에서 회원 목록과 전체 페이지 수 가져오기
      console.log('API 응답 데이터:', memberList); // 디버깅용 데이터 출력

      // 가입 날짜 포맷팅
      const formattedUsers = memberList.map((user) => ({
        ...user,
        createdAt: formatDate(user.createdAt),
      }));

      setUsers(formattedUsers); // 상태 업데이트
      setTotalPages(totalPages); // 전체 페이지 수 업데이트
      setError(null); // 오류 초기화
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    }
  };

  // 검색어 변경 시와 현재 페이지 변경 시 데이터 호출
  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // 검색어 상태 업데이트
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage); // 페이지 이동
    }
  };

  return (
    <div className="user-list-container">
      <UserManagementSidebar />
      <div className="user-list-content">
        <div className="user-list-header">
          <h1>회원 목록 조회</h1>
          <div className="user-list-search-bar">
            <input
              type="text"
              placeholder="이름 or 이메일"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        <table className="user-list-user-table">
          <thead>
            <tr>
              <th>회원번호</th>
              <th>이름</th>
              <th>이메일</th>
              <th>가입 날짜</th>
              <th>수정</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.createdAt}</td>
                <td>
                  <button className="user-list-edit-button">수정</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* 페이지네이션 */}
        <div className="pagination">
          {currentPage > 1 && (
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="pagination-button"
            >
              이전
            </button>
          )}
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`pagination-button ${
                currentPage === i + 1 ? 'active' : ''
              }`}
            >
              {i + 1}
            </button>
          ))}
          {currentPage < totalPages && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="pagination-button"
            >
              다음
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;