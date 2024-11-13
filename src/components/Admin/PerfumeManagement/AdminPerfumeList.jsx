// src/components/Admin/PerfumeManagement/AdminPerfumeList.jsx
import React, { useState } from 'react';
import UserManagementSidebar from '../../Sidebars/AdminSidebars/PerfumeManagementSidebar';
import './AdminPerfumeList.css';

const PerfumeList = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const perfumes = [
    { name: '홍길동', notes: ['노트1', '노트2', '노트3', '노트4'], brand: '브랜드 1', status: '수정' },
    { name: '김영희', notes: ['노트1', '노트2'], brand: '브랜드 2', status: '수정' },
    { name: '이철수', notes: ['노트1', '노트2', '노트3'], brand: '브랜드 3', status: '수정' },
  ];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPerfumes = perfumes.filter(
    (perfume) =>
      perfume.name.includes(searchQuery) || perfume.notes.some((note) => note.includes(searchQuery))
  );

  return (
    <div className="admin-perfume-list-container">
      <UserManagementSidebar />
      <div className="admin-perfume-list-content">
        <div className="admin-perfume-list-header">
          <h1>향수 목록 조회</h1>
          <div className="admin-perfume-list-search-bar">
            <input
              type="text"
              placeholder="향수 이름"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <table className="admin-perfume-list-table">
          <thead>
            <tr>
              <th>향수 이름</th>
              <th>노트</th>
              <th>브랜드</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {filteredPerfumes.map((perfume, index) => (
              <tr key={index}>
                <td>{perfume.name}</td>
                <td>
                  {perfume.notes.map((note, i) => (
                    <span key={i} className="admin-perfume-note">{note}</span>
                  ))}
                  {perfume.notes.length > 3 && <span className="perfume-note-more">+ 더보기</span>}
                </td>
                <td>{perfume.brand}</td>
                <td>
                  <button className="admin-perfume-list-edit-button">{perfume.status}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="admin-perfume-list-actions">
          <button className="admin-perfume-list-more-button">+ 더보기</button>
          <button className="admin-perfume-list-add-button">추가하기</button>
        </div>
      </div>
    </div>
  );
};

export default PerfumeList;