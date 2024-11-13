import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MyPageSidebar from '../Sidebars/MyPageSidebar';
import FragranceSearchModal from '../Modals/FragranceSearchModal';
import CancelConfirmationModal from '../Modals/CancelConfirmationModal';
import AlertModal from '../Modals/AlertModal';
import './ReviewForm.css';

const ReviewForm = () => {
  const [selectedFragrance, setSelectedFragrance] = useState('');
  const [title, setTitle] = useState('');
  const [rating, setRating] = useState(5); // 별점 기본값을 5로 설정
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [showHoverPreview, setShowHoverPreview] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [perfumeList, setPerfumeList] = useState([]); // 향수 리스트 추가
  const navigate = useNavigate();

  useEffect(() => {
    // 향수 리스트를 불러오는 함수
    const fetchPerfumeList = async () => {
      try {
        const response = await axios.get('http://gachon-adore.duckdns.org:8081/user/perfume/perfume/list');
        if (response.data && response.data.length > 0) {
          setPerfumeList(response.data);
        } else {
          console.warn('서버에서 빈 향수 리스트를 반환했습니다.');
        }
      } catch (error) {
        console.error('향수 리스트를 가져오는 중 오류 발생:', error);
      }
    };

    fetchPerfumeList();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file);
      setImage(file);
      setImagePreviewUrl(previewUrl);
    } else {
      alert("이미지 파일만 업로드할 수 있습니다.");
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openCancelModal = () => setIsCancelModalOpen(true);
  const closeCancelModal = () => setIsCancelModalOpen(false);
  const closeAlertModal = () => setShowAlertModal(false);

  const handleSelectFragrance = (fragrance) => {
    setSelectedFragrance(fragrance);
    setIsModalOpen(false);
  };

  const handleRating = (value) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    if (!selectedFragrance || !title || rating <= 0 || !content) {
      setShowAlertModal(true); // 필수 항목이 채워지지 않은 경우 AlertModal 표시
      return;
    }

    const reviewData = {
      title,
      content,
      photo: image ? image.name : '', // 이미지 파일 이름
      perfumeId: selectedFragrance.id, // 선택한 향수의 ID
      memberId: 0, // 실제 사용자의 ID로 교체 필요
    };

    try {
      const response = await axios.post('http://gachon-adore.duckdns.org:8081/user/review/create', reviewData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('리뷰 생성 성공:', response.data);
      navigate('/mypage/reviewlist'); // 리뷰 목록 페이지로 이동
    } catch (error) {
      console.error('리뷰 생성 중 오류 발생:', error);
    }
  };

  return (
    <div className="mypage-container">
      <MyPageSidebar />
      <div className="review-form">
        <h1>리뷰 등록</h1>
        <div className="review-form-table">
          <div className="review-form-row">
            <span className="review-form-label">향수 선택</span>
            <div className="review-form-input-group">
              <input
                type="text"
                placeholder="Select fragrance"
                className="review-form-fragrance-input"
                value={selectedFragrance.perfume_nm || ''}
                readOnly
              />
              <button className="review-form-search-btn" onClick={openModal}>🔍</button>
            </div>
          </div>
          <div className="review-form-row">
            <span className="review-form-label">제목</span>
            <input
              type="text"
              className="review-form-input-text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="review-form-row">
            <span className="review-form-label">별점</span>
            <div className="review-form-rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`review-form-star ${rating >= star ? 'review-form-filled' : ''}`}
                  onClick={() => handleRating(star)} // 1점 단위로 클릭
                >
                  ★
                </span>
              ))}
              <span className="review-form-rating-display">{rating}</span>
            </div>
          </div>
          <div className="review-form-row">
            <span className="review-form-label">내용</span>
            <textarea
              className="review-form-input-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="review-form-row">
            <span className="review-form-label">사진</span>
            <div className="review-form-file-upload">
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              {imagePreviewUrl && (
                <div
                  className="review-form-image-preview-container"
                  onMouseEnter={() => setShowHoverPreview(true)}
                  onMouseLeave={() => setShowHoverPreview(false)}
                >
                  <img src={imagePreviewUrl} alt="이미지 미리보기" className="review-form-image-preview" />
                  {showHoverPreview && (
                    <div className="review-form-hover-preview">
                      <img src={imagePreviewUrl} alt="확대 이미지 미리보기" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="review-form-action-buttons">
          <button
            onClick={handleSubmit}
            className="review-form-submit-btn"
          >
            리뷰 작성
          </button>
          <button onClick={openCancelModal} className="review-form-cancel-btn">취소</button>
        </div>

        {isModalOpen && (
          <FragranceSearchModal
            onClose={closeModal}
            onSelectFragrance={handleSelectFragrance}
            perfumeList={perfumeList} // 향수 리스트 전달
          />
        )}
        {isCancelModalOpen && (
          <CancelConfirmationModal onClose={closeCancelModal} onConfirm={() => navigate('/mypage/reviewlist')} />
        )}
        {showAlertModal && (
          <AlertModal
            message="모든 필수 항목을 입력해 주세요!"
            onClose={closeAlertModal}
          />
        )}
      </div>
    </div>
  );
};

export default ReviewForm;