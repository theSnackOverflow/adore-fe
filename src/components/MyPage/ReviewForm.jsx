import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../lib/axiosInstance'; // Axios 인스턴스
import { getCookie } from '../../lib/CookieUtil'; // Access Token 가져오기 유틸
import MyPageSidebar from '../Sidebars/MyPageSidebar';
import FragranceSearchModal from '../Modals/FragranceSearchModal';
import CancelConfirmationModal from '../Modals/CancelConfirmationModal';
import AlertModal from '../Modals/AlertModal';
import './ReviewForm.css';

const ReviewForm = () => {
  const [selectedFragrance, setSelectedFragrance] = useState(null); // 향수 선택 객체
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [photo, setPhoto] = useState('');
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const navigate = useNavigate();

  // 이미지 업로드 핸들러
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setAlertMessage('이미지 파일만 업로드할 수 있습니다.');
        setShowAlertModal(true);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setAlertMessage('이미지 파일 크기는 5MB 이하만 가능합니다.');
        setShowAlertModal(true);
        return;
      }
      setImage(file);
      setImageError('');
    }
  };

  // 모달 핸들러
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openCancelModal = () => setIsCancelModalOpen(true);
  const closeCancelModal = () => setIsCancelModalOpen(false);
  const closeAlertModal = () => {
    setAlertMessage('');
    setShowAlertModal(false);
  };

  const handleSelectFragrance = (fragrance) => {
    setSelectedFragrance(fragrance);
    setIsModalOpen(false);
  };

  // 리뷰 제출 핸들러
  const handleSubmit = async () => {
    if (!selectedFragrance || !title || !content) {
      setAlertMessage('모든 필수 항목을 입력해 주세요!');
      setShowAlertModal(true);
      return;
    }
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        setAlertMessage('로그인이 필요합니다. 다시 로그인해주세요.');
        setShowAlertModal(true);
        navigate('/login'); // 로그인 페이지로 리다이렉트
        return;
      }
  
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('perfumeId', selectedFragrance.id); // 향수 ID
      formData.append('photo', photo); // 이미지 URI
      if (image) {
        formData.append('file', image); // 이미지 파일
      }
  
      const response = await axiosInstance.post('/api/user/review/create', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Access Token 추가
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 200) {
        setAlertMessage('리뷰 작성이 완료되었습니다.');
        setShowAlertModal(true);
  
        // 2초 후에 페이지 이동
        setTimeout(() => {
          navigate('/mypage/myreviewlist');
        }, 2000);
      } else {
        console.error('리뷰 작성 실패:', response.data);
        setAlertMessage('리뷰 작성에 실패했습니다. 다시 시도해주세요.');
        setShowAlertModal(true);
      }
    } catch (error) {
      console.error('리뷰 작성 오류:', error.response || error);
      if (error.response?.status === 401) {
        setAlertMessage('인증이 만료되었습니다. 다시 로그인해주세요.');
        setShowAlertModal(true);
        navigate('/login');
      } else {
        setAlertMessage('리뷰 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
        setShowAlertModal(true);
      }
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
                placeholder="향수를 선택하세요"
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
            <span className="review-form-label">내용</span>
            <textarea
              className="review-form-input-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="review-form-row">
            <span className="review-form-label">이미지 URI</span>
            <input
              type="text"
              className="review-form-input-text"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              placeholder="이미지 URI를 입력하세요"
            />
          </div>
          <div className="review-form-row">
            <span className="review-form-label">사진</span>
            <div className="review-form-file-upload">
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              {imageError && <p className="error-message">{imageError}</p>}
            </div>
          </div>
        </div>
        <div className="review-form-action-buttons">
          <button
            onClick={handleSubmit}
            className="review-form-submit-btn"
            disabled={!selectedFragrance || !title || !content}
          >
            리뷰 작성
          </button>
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
            onConfirm={() => navigate('/mypage/myreviewlist')}
          />
        )}
        {showAlertModal && (
          <AlertModal
            message={alertMessage}
            onClose={closeAlertModal}
          />
        )}
      </div>
    </div>
  );
};

export default ReviewForm;