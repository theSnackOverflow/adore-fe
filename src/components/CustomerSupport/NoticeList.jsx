// src/components/CustomerSupport/NoticeList.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerSupportSidebar from '../Sidebars/CustomerSupportSidebar';
import './NoticeList.css';

const NoticeList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const notices = [
    { id: 6, category: '카테고리 6', title: '공지사항 6', date: '2024.09.07' },
    { id: 5, category: '카테고리 5', title: '공지사항 5', date: '2024.09.06' },
    { id: 4, category: '카테고리 4', title: '공지사항 4', date: '2024.09.05' },
    { id: 3, category: '카테고리 3', title: '공지사항 3', date: '2024.09.04' },
    { id: 2, category: '카테고리 2', title: '공지사항 2', date: '2024.09.03' },
    { id: 1, category: '카테고리 1', title: '공지사항 1', date: '2024.09.02' },
  ];

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const filteredNotices = notices.filter(
    (notice) =>
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="customer-support-container">
      <CustomerSupportSidebar />
      <div className="notice-list">
        <div className="notice-header">
        <h1>공지사항</h1>
            <div className="notice-search-bar">
            <input
              type="text"
              placeholder="제목, 카테고리 등"
              value={searchQuery}
              onChange={handleSearch}
            />
            {/* <button className="notice-search-btn">🔍</button> */}
          </div>
        </div>
        <table className="notice-table">
          <thead>
            <tr>
              <th>No</th>
              <th>제목</th>
              <th>카테고리</th>
              <th>작성시간</th>
            </tr>
          </thead>
          <tbody>
            {filteredNotices.map((notice) => (
              <tr key={notice.id}>
                <td>{notice.id}</td>
                <td>
                  <span
                    className="notice-title"
                    onClick={() => navigate(`/customer-support/notice/${notice.id}`)}
                  >
                    {notice.title}
                  </span>
                </td>
                <td>{notice.category}</td>
                <td>{notice.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NoticeList;