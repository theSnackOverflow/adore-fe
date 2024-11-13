// src/components/PerfumeRecommendation/Review/OtherReviewList.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PerfumeSidebar from '../Sidebars/PerfumeSidebar';
import './OtherReviewList.css';

const OtherReviewList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reviews] = useState([
    { id: 1, user: '회원 1', title: '리뷰 1', date: '2024-10-01', rating: 32 },
    { id: 2, user: '회원 2', title: '리뷰 2', date: '2024-10-05', rating: 20 },
    { id: 3, user: '회원 3', title: '리뷰 3', date: '2024-10-10', rating: 32 },
  ]);

  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleWriteReview = () => {
    navigate('/mypage/reviewform'); // 글쓰기 버튼 클릭 시 리뷰 작성 페이지로 이동
  };

  const filteredReviews = reviews.filter((review) =>
    review.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="other-review-list-container">
      <PerfumeSidebar />
      <div className="other-review-list-content">
        <div className="other-review-list-header">
          <h1>향수 리뷰 보기</h1>
          <div className="other-review-list-search-bar">
            <input
              type="text"
              placeholder="향수 이름 검색"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="other-review-list-review-details">
          <div className="other-review-list-review-details-header">
            <h2>향수 1</h2>
            <span className="other-review-list-brand">brand1</span>
          </div>
          <p>주요 노트 : Top / Middle / Base</p>
          <p>향수에 대한 상세 정보</p>
        </div>
        <table className="other-review-list-review-table">
          <thead>
            <tr>
              <th>작성자</th>
              <th>제목</th>
              <th>작성 날짜</th>
              <th>추천 수</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map((review) => (
              <tr key={review.id}>
                <td>{review.user}</td>
                <td>
                  <Link to={`/perfumerecommendation/review/${review.id}`} className="review-link">
                    {review.title}
                  </Link>
                </td>
                <td>{review.date}</td>
                <td>{review.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="other-review-list-action-buttons">
          <button className="other-review-list-more-button">+ 더보기</button>
          <button className="other-review-list-write-button" onClick={handleWriteReview}>
            리뷰 작성
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtherReviewList;