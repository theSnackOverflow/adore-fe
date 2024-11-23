import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위해 사용
import axios from 'axios';
import UserManagementSidebar from '../../Sidebars/AdminSidebars/UserManagementSidebar';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]); // 여기가 `users`로 선언됨
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate

  const formatDate = (dateString) => dateString.split('T')[0];

  const fetchUsers = async (page = 1) => {
    try {
      const response = await axios.get(`https://gachon-adore.duckdns.org/api/admin/user/lists/${page}`, {
        params: {
          type: 'NAME',
          keyword: searchQuery,
        },
      });

      const { memberList = [], totalPages } = response.data;
      const formattedUsers = memberList.map((user) => ({
        ...user,
        createdAt: formatDate(user.createdAt),
      }));

      setUsers(formattedUsers); // 여기도 `users` 상태를 설정
      setTotalPages(totalPages);
      setError(null);
    } catch (error) {
      console.error('API 호출 중 오류:', error);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleEditClick = (userId) => {
    navigate('/Admin/UserManagement/UserInfoEdit', { state: { userId } });
  };

  // 페이지네이션 그룹 계산
  const pagesPerGroup = 10; // 한 번에 표시할 페이지 버튼 수
  const currentGroup = Math.ceil(currentPage / pagesPerGroup); // 현재 그룹 계산
  const startPage = (currentGroup - 1) * pagesPerGroup + 1; // 그룹의 첫 페이지
  const endPage = Math.min(currentGroup * pagesPerGroup, totalPages); // 그룹의 마지막 페이지

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
            {users.map((user) => ( // `users`로 변경
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.createdAt}</td>
                <td>
                  <button
                    className="user-list-edit-button"
                    onClick={() => handleEditClick(user.id)}
                  >
                    수정
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          {startPage > 1 && (
            <button
              onClick={() => handlePageChange(startPage - 1)}
              className="pagination-button"
            >
              이전
            </button>
          )}
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
            <button
              key={startPage + i}
              onClick={() => handlePageChange(startPage + i)}
              className={`pagination-button ${
                currentPage === startPage + i ? 'active' : ''
              }`}
            >
              {startPage + i}
            </button>
          ))}
          {endPage < totalPages && (
            <button
              onClick={() => handlePageChange(endPage + 1)}
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