import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../lib/axiosInstance'; // Axios 인스턴스
import { getCookie } from '../../lib/CookieUtil'; // Access Token 가져오기 유틸
import MyPageSidebar from '../Sidebars/MyPageSidebar';
import FragranceSearchModal from '../Modals/FragranceSearchModal';
import CancelConfirmationModal from '../Modals/CancelConfirmationModal';
import AlertModal from '../Modals/AlertModal';
import './ReviewForm.css';

const ReviewForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reviewId } = location.state || {}; // 수정 모드일 경우 전달받은 리뷰 ID

  const [selectedFragrance, setSelectedFragrance] = useState(null); // 향수 선택 객체
  const [title, setTitle] = useState(''); // 제목 초기값 설정
  const [content, setContent] = useState(''); // 내용 초기값 설정
  const [photo, setPhoto] = useState(''); // 이미지 URI 초기값 설정
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlertModal, setShowAlertModal] = useState(false);

  // 디버깅 로그: reviewId 확인
  console.log('Received reviewId:', reviewId);

  // 수정 모드일 경우 기존 데이터 불러오기
  useEffect(() => {
    if (!reviewId) {
      console.log('No reviewId provided. Form is in create mode.');
      return; // 리뷰 ID가 없으면 생성 모드로 동작
    }
  
    const fetchReviewDetails = async () => {
      try {
        const accessToken = getCookie('accessToken');
        if (!accessToken) {
          alert('로그인이 필요합니다.');
          navigate('/login'); // 로그인 페이지로 이동
          return;
        }
  
        console.log(`Fetching review details for edit with ID: ${reviewId}`);
        const response = await axiosInstance.get(`/api/user/review/`, {
          params: { id: reviewId },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.data.code === "MEM-ERR-004") {
          alert('제제된 회원입니다.');
        }
  
        if (response.data) {
          console.log('Review details fetched successfully:', response.data); // 디버깅 로그
          const data = response.data;
  
          // 기존 데이터로 폼 필드 채우기
          setSelectedFragrance({ name: data.perfumeName });
          setTitle(data.title);
          setContent(data.content);
          setPhoto(data.img || ''); // img를 이미지 URL에 매핑
  
          // 향수 ID를 조회
          console.log(`Fetching perfume ID for perfume name: ${data.perfumeName}`);
          const perfumeIdResponse = await axiosInstance.get(
            `/api/user/perfume/lists/1`, // 1은 기본 페이지 번호
            {
              params: {
                type: 'NAME',
                keyword: data.perfumeName,
              },
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
  
          if (perfumeIdResponse.data && perfumeIdResponse.data.perfumeList.length > 0) {
            const fetchedPerfume = perfumeIdResponse.data.perfumeList[0];
            console.log('Fetched perfume ID:', fetchedPerfume.id);
            setSelectedFragrance((prev) => ({ ...prev, id: fetchedPerfume.id }));
          } else {
            console.error('Perfume not found in the list response:', perfumeIdResponse.data);
            alert('향수 정보를 불러오는 데 실패했습니다.');
          }
        }
      } catch (error) {
        console.error('리뷰 조회 중 오류가 발생했습니다:', error.response || error);
        alert('리뷰 정보를 불러오는 데 실패했습니다.');
      }
    };
  
    fetchReviewDetails();
  }, [reviewId, navigate]);

  // 이미지 업로드 핸들러
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setAlertMessage('이미지 파일만 업로드할 수 있습니다.');
        setShowAlertModal(true);
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        setAlertMessage('이미지 파일 크기는 100MB 이하만 가능합니다.');
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

  // 리뷰 제출/수정 핸들러
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
        navigate('/login');
        return;
      }
  
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('perfumeId', selectedFragrance.id || '');
  
      // 이미지 처리
      if (photo) {
        formData.append('photo', photo); // URI를 추가
      } else {
        console.log('No photo URI provided.');
      }
  
      if (image) {
        formData.append('file', image); // 실제 파일 추가
      } else {
        console.log('No image file provided.');
      }
  
      // 디버깅: FormData 확인
      console.log('FormData entries:');
      for (let pair of formData.entries()) {
        console.log(pair[0], ':', pair[1]);
      }
  
      // 작성 모드와 수정 모드에 따른 API URL 및 요청 분기
      const apiUrl = reviewId
        ? `/api/user/review/update?id=${reviewId}` // 수정 모드
        : `/api/user/review/create`; // 작성 모드
      const method = reviewId ? 'patch' : 'post'; // PATCH 또는 POST 선택
  
      console.log(`Submitting ${method.toUpperCase()} request to ${apiUrl}`);
  
      const response = await axiosInstance[method](apiUrl, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // Content-Type은 FormData 사용 시 자동 설정
        },
      });
  
      if (response.status === 200) {
        console.log('Review processed successfully:', response.data);
        setAlertMessage(reviewId ? '리뷰가 성공적으로 수정되었습니다.' : '리뷰가 성공적으로 작성되었습니다.');
        setShowAlertModal(true);
        setTimeout(() => {
          navigate('/mypage/myreviewlist');
        }, 2000);
      } else {
        console.error('Review processing failed:', response.data);
        setAlertMessage('리뷰 처리에 실패했습니다. 다시 시도해주세요.');
        setShowAlertModal(true);
      }
    } catch (error) {
      console.error('리뷰 처리 오류:', error.response || error);
      if (error.response?.status === 401) {
        setAlertMessage('인증이 만료되었습니다. 다시 로그인해주세요.');
        setShowAlertModal(true);
        navigate('/login');
      } else {
        setAlertMessage('리뷰 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        setShowAlertModal(true);
      }
    }
  };

  return (
    <div className="mypage-container">
      <MyPageSidebar />
      <div className="review-form">
        <h1>{reviewId ? '리뷰 수정' : '리뷰 등록'}</h1>
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
              {photo && (
                <div className="image-preview">
                  <img src={photo} alt="리뷰 이미지 미리보기" />
                </div>
              )}
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
            {reviewId ? '리뷰 수정' : '리뷰 작성'}
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