// src/components/CustomerSupport/InquiryList.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerSupportSidebar from '../Sidebars/CustomerSupportSidebar';
import './InquiryList.css';

const InquiryList = ({ inquiries }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const filteredInquiries = inquiries.filter((inquiry) =>
    inquiry.title.includes(searchQuery) || inquiry.category.includes(searchQuery)
  );

  return (
    <div className="customer-support-container">
      <CustomerSupportSidebar />
      <div className="inquiry-list">
        <div className="inquiry-list-header">
            <h1>내 문의 목록</h1>
            <div className="inquiry-list-search-bar">
                <input
                    type="text"
                    placeholder="제목, 카테고리 등"
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>
        </div>
        <table className="inquiry-list-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>카테고리</th>
              <th>작성 날짜</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {filteredInquiries.map((inquiry, index) => (
              <tr key={inquiry.id}>
                <td>{index + 1}</td>
                <td>{inquiry.title}</td>
                <td>{inquiry.category}</td>
                <td>{inquiry.date}</td>
                <td>
                  <button className="inquiry-list-delete-btn">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="inquiry-list-write-btn" onClick={() => navigate('/customersupport/inquiryform')}>글쓰기</button>
      </div>
    </div>
  );
};

export default InquiryList;