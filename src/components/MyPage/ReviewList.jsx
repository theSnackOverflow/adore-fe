// src/components/MyPage/ReviewList.js
import React, { useState } from 'react';
import MyPageSidebar from '../Sidebars/MyPageSidebar';
import './ReviewList.css';
import { useNavigate } from 'react-router-dom';

const ReviewList = ({ reviews, setReviews }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = (id) => {
    setReviews(reviews.filter((review) => review.id !== id));
  };

  const handleEdit = (id) => {
    // Edit functionality placeholder
    alert(`Editing review with ID: ${id}`);
    // In a real app, you could navigate to a review edit page here
  };

  return (
    <div className="mypage-container">
      <MyPageSidebar />
      <div className="review-list">
        <h1>내 리뷰 목록</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="향수 이름, 제목 등"
            value={searchQuery}
            onChange={handleSearch}
          />
          <button className="search-btn">🔍</button>
        </div>
        <table className="review-table">
          <thead>
            <tr>
              <th>향수</th>
              <th>제목</th>
              <th>평점</th>
              <th>작성 날짜</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {reviews
              .filter((review) =>
                review.fragrance.toLowerCase().includes(searchQuery.toLowerCase()) ||
                review.title.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((review) => (
                <tr key={review.id}>
                  <td>{review.fragrance}</td>
                  <td>{review.title}</td>
                  <td>
                    {'★'.repeat(Math.floor(review.rating))}
                    {'☆'.repeat(5 - Math.floor(review.rating))}
                  </td>
                  <td>{review.date}</td>
                  <td>
                    {/* <button className="rl-edit-btn" onClick={() => handleEdit(review.id)}>
                      수정
                    </button> */}
                    <button className="rl-delete-btn" onClick={() => handleDelete(review.id)}>
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <button className="rl-write-btn" onClick={() => navigate('/mypage/reviewform')}>
          글쓰기
        </button>
      </div>
    </div>
  );
};

export default ReviewList;