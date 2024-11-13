// src/components/MyPage/ReviewForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MyPageSidebar from '../Sidebars/MyPageSidebar';
import FragranceSearchModal from '../Modals/FragranceSearchModal';
import CancelConfirmationModal from '../Modals/CancelConfirmationModal';
import AlertModal from '../Modals/AlertModal';
import './ReviewForm.css';

const ReviewForm = ({ addReview }) => {
  const [selectedFragrance, setSelectedFragrance] = useState('');
  const [title, setTitle] = useState('');
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [showHoverPreview, setShowHoverPreview] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const navigate = useNavigate();

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

  const handleRating = (value) => setRating(value);

  useEffect(() => {
    // 입력 상태를 확인하는 함수로 사용 여부 결정 가능
  }, [selectedFragrance, title, rating, content]);

  const handleSubmit = () => {
    if (!selectedFragrance || !title || rating <= 0 || !content) {
      setShowAlertModal(true); // 필수 항목이 채워지지 않은 경우 AlertModal 표시
      return;
    }

    const newReview = {
      id: Date.now(),
      fragrance: selectedFragrance,
      title,
      rating,
      date: new Date().toISOString().split('T')[0],
    };
    addReview(newReview);
    navigate('/mypage/reviewlist');
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
                value={selectedFragrance}
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
                  className={`review-form-star ${rating >= star ? 'review-form-filled' : rating >= star - 0.5 ? 'review-form-half' : ''}`}
                  onClick={() => handleRating(star - 0.5)}
                  onDoubleClick={() => handleRating(star)}
                >
                  ★
                </span>
              ))}
              <span className="review-form-rating-display">{rating.toFixed(1)}</span>
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
                  <img src={imagePreviewUrl} alt="이미지 미리보기" class                  Name="review-form-image-preview"
                />
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
          <FragranceSearchModal onClose={closeModal} onSelectFragrance={handleSelectFragrance} />
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