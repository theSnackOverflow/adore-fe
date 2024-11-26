import React, { useState, useEffect } from 'react';
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

  // 향수 리스트 불러오기
  useEffect(() => {
    const fetchPerfumeList = async () => {
      try {
        const response = await axiosInstance.get('/api/user/perfume/lists/1', {
          params: { type: 'NAME', keyword: '' },
        });
        setPerfumeList(response.data?.perfumeList || []);
      } catch (error) {
        console.error('향수 리스트를 가져오는 중 오류 발생:', error);
        setPerfumeList([]);
      }
    };

    fetchPerfumeList();
  }, []);

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

  // 특정 향수 정보 불러오기
  const fetchPerfumeDetails = async (perfumeId) => {
    try {
      const response = await axiosInstance.get(`/api/user/perfume/?id=${perfumeId}`);
      setSelectedPerfume(response.data || null); // 서버에서 받은 향수 정보를 설정
      console.log(response.data);
    } catch (error) {
      console.error('향수 세부 정보를 가져오는 중 오류 발생:', error);
    }
  };

  // 특정 향수 리뷰 불러오기
  const fetchReviewsByPerfume = async (perfume, page = 1) => {
    try {
      const response = await axiosInstance.get(`/api/user/review/lists/${page}`, {
        params: { type: 'TITLE', keyword: perfume.name },
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
    fetchPerfumeDetails(perfume.id); // ID 기반으로 세부 데이터 요청
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
    <div className="other-review-perfume-info-main-box">
      <div className="other-review-perfume-info-box1">
        <div className="other-review-list-review-details-header">
        {/* 향수 이름과 브랜드 */}
        <h2>{selectedPerfume.name}</h2>
        <span className="other-review-list-brand">{selectedPerfume.brand}</span>
      </div>
      <div className="other-review-perfume-info">
        <div>
          {/* 노트 정보 */}
          <p>
            <span>Tope : </span>{selectedPerfume.top || '알 수 없음'}
          </p>
          <p>
            <span>Middle : </span>{selectedPerfume.middle || '알 수 없음'}
          </p>
          <p>
            <span>Base : </span>{selectedPerfume.base || '알 수 없음'}
          </p>
        </div>
        <div>
          <p><span>출시 연도 : </span>{selectedPerfume.year || '정보 없음'}</p>
          <p><span>성별 : </span>{selectedPerfume.gender || '정보 없음'}</p>
          <p>
            <span>가격 : </span>
            {selectedPerfume.price ? `${selectedPerfume.price.toLocaleString()}원` : '정보 없음'}
          </p>
        </div>
      </div>
        {/* 설명 */}
        <p className="other-review-list-perfume-desc">
          <span>설명 : </span>
          <div> {selectedPerfume.perfumeDesc || '설명이 없습니다.'}
          </div>          
        </p>
        {/* 평점 */}
        <p>
          <span>평점 : </span>
          {'★'.repeat(selectedPerfume.rating || 0)}
          {'☆'.repeat(5 - (selectedPerfume.rating || 0))}
        </p>
      </div>
      <div className="other-review-perfume-info-box2">
        {/* 이미지 표시 */}
        {selectedPerfume.perfumePhoto && (
          <img
            src={selectedPerfume.perfumePhoto}
            alt={`${selectedPerfume.name} 사진`}
            className="perfume-image"
          />
        )}
      </div>
    </div>
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
                  <Link to={`/perfumerecommendation/reviewdetail/${review.id}`} className="review-link">
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