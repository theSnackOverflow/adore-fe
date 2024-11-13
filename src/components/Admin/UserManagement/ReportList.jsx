// src/components/Admin/ReportManagement/ReportList.jsx
import React, { useState } from 'react';
import UserManagementSidebar from '../../Sidebars/AdminSidebars/UserManagementSidebar';
import './ReportList.css';

const ReportList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const reports = [
    { reporter: '신고자3', title: '프로필 신고', category: 'B', date: '2024-10-10', status: '미처리' },
    { reporter: '신고자2', title: '댓글 내용 신고', category: 'A', date: '2024-10-05', status: '처리 중' },
    { reporter: '신고자1', title: '리뷰 내용 신고', category: 'C', date: '2024-10-01', status: '처리 완료' },
  ];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const filteredReports = reports.filter(
    (report) =>
      (report.reporter.includes(searchQuery) || report.title.includes(searchQuery)) &&
      (!categoryFilter || report.category === categoryFilter)
  );

  return (
    <div className="report-list-container">
      <UserManagementSidebar />
      <div className="report-list-content">
        <div className="report-list-header">
        <h1>신고 목록 조회</h1>
            <div className="report-list-search-bar">
            <input
                type="text"
                placeholder="작성자, 제목 등"
                value={searchQuery}
                onChange={handleSearchChange}
            />
            <select value={categoryFilter} onChange={handleCategoryChange}>
                <option value="">카테고리 선택</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
            </select>
            </div>
        </div>
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
            {filteredReports.map((report, index) => (
              <tr key={index}>
                <td>{report.reporter}</td>
                <td>{report.title}</td>
                <td>{report.category}</td>
                <td>{report.date}</td>
                <td>{report.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="report-list-more-button">+ 더보기</button>
      </div>
    </div>
  );
};

export default ReportList;