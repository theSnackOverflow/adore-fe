import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../lib/axiosInstance';
import PerfumeSidebar from '../Sidebars/PerfumeSidebar';
import FragranceSearchModal from '../Modals/FragranceSearchModal';
import './OtherReviewList.css';

const OtherReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [perfumeList, setPerfumeList] = useState([]);
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  // 전체 리뷰 불러오기
  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const response = await axiosInstance.get(`/api/user/review/lists/${currentPage}`, {
          params: { type: 'TITLE', keyword: '' },
        });
        setReviews(response.data?.reviewList || []);
        setTotalPages(response.data?.totalPages || 1);
      } catch (error) {
        console.error('전체 리뷰를 가져오는 중 오류 발생:', error);
        setReviews([]);
      }
    };

    if (!selectedPerfume) {
      fetchAllReviews(); // 특정 향수가 선택되지 않은 경우 전체 리뷰 로드
    }
  }, [currentPage, selectedPerfume]);

  // 특정 향수 리뷰 불러오기
  const fetchReviewsByPerfume = async (perfume, page = 1) => {
    try {
      const response = await axiosInstance.get(`/api/user/review/lists/${page}`, {
        params: { type: 'TITLE', keyword: perfume.perfume_nm },
      });
      setReviews(response.data?.reviewList || []);
      setTotalPages(response.data?.totalPages || 1);
    } catch (error) {
      console.error('리뷰를 가져오는 중 오류 발생:', error);
      setReviews([]);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSelectFragrance = (perfume) => {
    setSelectedPerfume(perfume);
    setIsModalOpen(false);
    setCurrentPage(1); // 페이지를 초기화하고 향수 리뷰 로드
    fetchReviewsByPerfume(perfume, 1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      if (selectedPerfume) {
        fetchReviewsByPerfume(selectedPerfume, page); // 선택된 향수의 리뷰 가져오기
      }
    }
  };

  const handleWriteReview = () => {
    navigate('/mypage/reviewform');
  };

  return (
    <div className="other-review-list-container">
      <PerfumeSidebar />
      <div className="other-review-list-content">
        <div className="other-review-list-header">
          <h1>향수 리뷰 보기</h1>
          <button className="other-review-list-select-btn" onClick={openModal}>
            향수 선택
          </button>
        </div>
        {selectedPerfume && (
          <div className="other-review-list-review-details">
            <div className="other-review-list-review-details-header">
              <h2>{selectedPerfume.perfume_nm}</h2>
              <span className="other-review-list-brand">{selectedPerfume.brand}</span>
            </div>
            <p>평점: {'★'.repeat(selectedPerfume.rating_value)}{'☆'.repeat(5 - selectedPerfume.rating_value)}</p>
            <p>노트: {selectedPerfume.top} / {selectedPerfume.middle} / {selectedPerfume.base}</p>
            <p>{selectedPerfume.perfume_desc}</p>
          </div>
        )}
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
            {reviews.map((review) => (
              <tr key={review.id}>
                <td>{review.name}</td>
                <td>
                  <Link to={'/perfumerecommendation/reviewdetail'} className="review-link">
                    {review.title}
                  </Link>
                </td>
                <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                <td>{review.likeCnt}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="other-review-list-pagination-container">
          <div className="other-review-list-pagination">
            {currentPage > 1 && <button onClick={() => handlePageChange(currentPage - 1)}>이전</button>}
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? 'active' : ''}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            {currentPage < totalPages && <button onClick={() => handlePageChange(currentPage + 1)}>다음</button>}
          </div>
        <div className="other-review-list-action-buttons">
          <button className="other-review-list-write-btn" onClick={handleWriteReview}>
            리뷰 작성
          </button>
        </div>
        </div>
        {isModalOpen && (
          <FragranceSearchModal
            onClose={closeModal}
            onSelectFragrance={handleSelectFragrance}
            perfumeList={perfumeList}
          />
        )}
      </div>
    </div>
  );
};

export default OtherReviewList;