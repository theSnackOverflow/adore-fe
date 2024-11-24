import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../lib/axiosInstance'; // Axios 인스턴스 가져오기
import { getCookie } from '../../lib/CookieUtil'; // Access Token 가져오기 유틸
import MyPageSidebar from '../Sidebars/MyPageSidebar';
import FragranceSearchModal from '../Modals/FragranceSearchModal';
import CancelConfirmationModal from '../Modals/CancelConfirmationModal';
import AlertModal from '../Modals/AlertModal';
import './ReviewForm.css';

const ReviewForm = () => {
  const [selectedFragrance, setSelectedFragrance] = useState(null); // 향수 객체로 변경
  const [title, setTitle] = useState('');
  const [rating, setRating] = useState(5); // 별점 기본값
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [showHoverPreview, setShowHoverPreview] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [perfumeList, setPerfumeList] = useState([]);
  const navigate = useNavigate();

  // 향수 리스트 불러오기
  useEffect(() => {
    const fetchPerfumeList = async () => {
      try {
        const response = await axiosInstance.get('/api/user/perfume/perfume/list');
        if (response.data && response.data.length > 0) {
          setPerfumeList(response.data);
        }
      } catch (error) {
        console.error('향수 리스트 불러오기 오류:', error);
      }
    };
    fetchPerfumeList();
  }, []);

  // 이미지 업로드 핸들러
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      alert('이미지 파일만 업로드할 수 있습니다.');
    }
  };

  // 모달 핸들러
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

  // 리뷰 제출 핸들러
  const handleSubmit = async () => {
    if (!selectedFragrance || !title || rating <= 0 || !content) {
      setShowAlertModal(true);
      return;
    }

    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('perfumeId', selectedFragrance.id); // 향수 ID
    formData.append('photo', image || ''); // 이미지 파일

    try {
      const response = await axiosInstance.post('/api/user/review/create', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Access Token 추가
          'Content-Type': 'multipart/form-data', // FormData 전송
        },
      });

      if (response.status === 201) {
        alert('리뷰 작성이 완료되었습니다.');
        navigate('/mypage/myreviewlist'); // 리뷰 목록 페이지로 이동
      }
    } catch (error) {
      console.error('리뷰 작성 오류:', error);
      alert('리뷰 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
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
                value={selectedFragrance ? `${selectedFragrance.id} - ${selectedFragrance.name}` : ''}
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
                  onClick={() => handleRating(star)}
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
          <button onClick={handleSubmit} className="review-form-submit-btn">리뷰 작성</button>
          <button onClick={openCancelModal} className="review-form-cancel-btn">취소</button>
        </div>

        {isModalOpen && (
          <FragranceSearchModal
            onClose={closeModal}
            onSelectFragrance={handleSelectFragrance}
          />
        )}
        {isCancelModalOpen && (
          <CancelConfirmationModal
            onClose={closeCancelModal}
            onConfirm={() => navigate('/mypage/reviewlist')}
          />
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