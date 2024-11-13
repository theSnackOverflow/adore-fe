// src/components/Admin/UserList.jsx
import React, { useState } from 'react';
import UserManagementSidebar from '../../Sidebars/AdminSidebars/UserManagementSidebar';
import './UserList.css';

const UserList = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const users = [
    { id: 1003, name: '홍길동', email: 'hong@domain.com', joinDate: '2024-09-02', status: '활동' },
    { id: 1002, name: '김영희', email: 'kim@domain.com', joinDate: '2024-09-06', status: '활동' },
    { id: 1001, name: '이철수', email: 'lee@domain.com', joinDate: '2024-09-10', status: '활동' },
    { id: 4, name: '회원', email: 'email@domain.com', joinDate: '2024-00-00', status: '활동' },
    { id: 3, name: '회원', email: 'email@domain.com', joinDate: '2024-00-00', status: '활동' },
    { id: 2, name: '회원', email: 'email@domain.com', joinDate: '2024-00-00', status: '활동' },
    { id: 1, name: '회원', email: 'email@domain.com', joinDate: '2024-00-00', status: '활동' },
  ];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.includes(searchQuery) || user.email.includes(searchQuery)
  );

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
        <table className="user-list-user-table">
          <thead>
            <tr>
              <th>회원번호</th>
              <th>이름</th>
              <th>이메일</th>
              <th>가입 날짜</th>
              <th>상태</th>
              <th>수정</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.joinDate}</td>
                <td>{user.status}</td>
                <td>
                  <button className="user-list-edit-button">수정</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="user-list-more-button">+ 더보기</button>
      </div>
    </div>
  );
};

export default UserList;