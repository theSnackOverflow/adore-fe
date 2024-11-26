import React, { useState, useEffect } from 'react';
import axiosInstance from '../../lib/axiosInstance';
import { useParams } from 'react-router-dom';
import PerfumeSidebar from '../Sidebars/PerfumeSidebar';
import AlertModal from '../Modals/AlertModal';
import { getCookie } from '../../lib/CookieUtil'; // 쿠키에서 토큰 가져오기 유틸
import './ReviewDetail.css';

const ReviewDetail = () => {
  const { reviewId } = useParams(); // 리뷰 ID를 URL 파라미터에서 가져옴
  const [reviewData, setReviewData] = useState(null); // 리뷰 데이터를 저장할 상태
  const [nickname, setNickname] = useState('익명 사용자'); // 사용자 닉네임
  const [logedinUserNickname, setLogedinUserNickname] = useState('익명 사용자'); // 사용자 닉네임
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false); // 추천 여부
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(''); // AlertModal에 표시할 메시지

  // 리뷰 데이터를 가져오는 함수
  const fetchReviewData = async () => {
    try {
      const response = await axiosInstance.get(`api/user/review/`, {
        params: { id: reviewId },
      });

      console.log('Fetched Review Data:', response.data);

      setReviewData({
        perfumeName: response.data.perfumeName || '알 수 없음',
        memberId: response.data.memberId,
        title: response.data.title || '제목 없음',
        content: response.data.content || '내용 없음',
        rating: response.data.rating || 0,
        createdAt: response.data.createdAt || new Date(),
        likeCnt: response.data.likeCnt || 0,
      });

      setLikes(response.data.likeCnt || 0);
      setComments(response.data.commentList || []);
      setHasLiked(response.data.hasLiked || false); // 서버에서 좋아요 여부 확인

      if (response.data.memberId) {
        fetchUserNickname(response.data.memberId);
      }
    } catch (error) {
      console.error('Error fetching review data:', error);
      setAlertMessage('리뷰 데이터를 가져오는데 실패했습니다.');
      setIsAlertModalOpen(true);
    }
  };

  // 사용자 닉네임을 가져오는 함수
  const fetchUserNickname = async (memberId) => {
    try {
      const response = await axiosInstance.get(`api/admin/user/`, {
        params: { id: memberId },
      });
      setNickname(response.data.nickname || '익명 사용자');
    } catch (error) {
      setAlertMessage('사용자 정보를 가져오는데 실패했습니다.');
      setIsAlertModalOpen(true);
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    fetchReviewData();
  }, []); // 의존성 배열 빈 배열로 설정해 초기 실행만 수행

  // 좋아요 처리 함수
  const handleLike = async () => {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      setAlertMessage('로그인이 필요합니다.');
      setIsAlertModalOpen(true);
      return;
    }

    if (hasLiked) {
      setAlertMessage('추천은 한 번만 할 수 있습니다!');
      setIsAlertModalOpen(true);
      return;
    }

    try {
      const response = await axiosInstance.patch(
        `api/user/review/like`,
        null,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // 헤더에 토큰 추가
          },
          params: {
            id: reviewId,
          },
        }
      );

      console.log('Like API Response:', response.data);
      if (response.data === 'REVIEW_LIKE_SUCCESS') {
        setHasLiked(true); // 좋아요 상태 업데이트
        setLikes((prev) => prev + 1); // 좋아요 수 증가
      } else {
        setAlertMessage('알 수 없는 오류가 발생했습니다.');
        setIsAlertModalOpen(true);
      }
    } catch (error) {
      console.error('Error liking the review:', error);
      setAlertMessage('추천을 등록하는데 실패했습니다.');
      setIsAlertModalOpen(true);
    }
  };

  // 로그인한 사용자 닉네임을 가져오는 함수
const fetchLoggedInUserNickname = async () => {
  try {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      setAlertMessage('로그인이 필요합니다.');
      setIsAlertModalOpen(true);
      return;
    }

    // 1. JWT 토큰으로 memberId 가져오기
    const tokenResponse = await axiosInstance.get(`/api/auth/token`, {
      params: { token: accessToken },
    });
    const memberId = tokenResponse.data.memberId;

    // 2. memberId로 사용자 정보 조회하여 닉네임 가져오기
    const userResponse = await axiosInstance.get(`/api/admin/user/`, {
      params: { id: memberId },
    });
    setLogedinUserNickname(userResponse.data.nickname || '익명 사용자');
  } catch (error) {
    console.error('Error fetching logged-in user nickname:', error);
    setAlertMessage('로그인 사용자 정보를 가져오는데 실패했습니다.');
    setIsAlertModalOpen(true);
  }
};

useEffect(() => {
  fetchReviewData();
  fetchLoggedInUserNickname(); // 추가
}, []);

  // 댓글 작성 함수
// 댓글 작성 함수
const handleCommentSubmit = async () => {
  if (newComment.trim()) {
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        setAlertMessage('로그인이 필요합니다.');
        setIsAlertModalOpen(true);
        return;
      }

      const response = await axiosInstance.post(
        `/api/user/review/comment/create`,
        {
          content: newComment, // 댓글 내용
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // 헤더에 토큰 추가
          },
          params: {
            reviewId, // 리뷰 ID 전달
          },
        }
      );

      console.log('Comment API Response:', response.data); // 디버깅용 로그

      if (response.data === 'COMMENT_CREATE_SUCCESS') {
        setComments((prev) => [
          ...prev,
          {
            id: new Date().getTime(), // 임시 ID
            user: logedinUserNickname, // 현재 로그인한 사용자 닉네임 사용
            content: newComment,
          },
        ]);
        setNewComment('');
        setAlertMessage('댓글이 성공적으로 작성되었습니다.');
      } else {
        setAlertMessage('댓글 작성에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Error creating comment:', error);
      setAlertMessage('댓글 작성 중 문제가 발생했습니다.');
    }
    setIsAlertModalOpen(true);
  } else {
    setAlertMessage('댓글 내용을 입력해주세요.');
    setIsAlertModalOpen(true);
  }
};

  // 댓글 삭제 함수
  const handleDeleteComment = async (commentId) => {
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        setAlertMessage('로그인이 필요합니다.');
        setIsAlertModalOpen(true);
        return;
      }

      await axiosInstance.delete(`api/user/review/comment`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: { id: commentId },
      });

      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      setAlertMessage('댓글을 삭제했습니다.');
      setIsAlertModalOpen(true);
    } catch (error) {
      setAlertMessage('댓글 삭제에 실패했습니다.');
      setIsAlertModalOpen(true);
    }
  };

  const closeAlertModal = () => setIsAlertModalOpen(false);

  if (!reviewData) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="review-detail-container">
      <PerfumeSidebar />
      <div className="review-detail-content">
        <div className="review-detail-perfume-name">
          <h1>{reviewData.perfumeName}</h1>
        </div>
        <div className="review-detail-card">
          <div className="review-detail-header">
            <div className="review-detail-user-info">
              <h1>{nickname}</h1>
            </div>
            <div className="review-detail-actions">
              <button onClick={handleLike} className="review-detail-like-btn">
                추천 👍 {likes}
              </button>
            </div>
          </div>
          <div className="review-detail-body">
            <h2>{reviewData.title}</h2>
            <div className="review-detail-body-2">
              <p>작성일: {new Date(reviewData.createdAt).toLocaleDateString()}</p>
              <p>별점: {reviewData.rating}</p>
            </div>
            <hr />
            <p>{reviewData.content}</p>
          </div>
        </div>
        <div className="review-detail-comments">
          <h2>댓글</h2>
          {comments.map((comment) => (
            <div key={comment.id} className="review-detail-comment">
              <strong>{comment.user || '익명'}</strong>
              <p>{comment.content || '내용 없음'}</p>
              {comment.user == {logedinUserNickname} ? (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="review-detail-delete-comment-btn"
                >
                  삭제하기
                </button>
              ) : (
                <button
                  onClick={() => setAlertMessage('신고가 완료되었습니다.')}
                  className="review-detail-report-comment-btn"
                >
                  신고하기
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="review-detail-new-comment">
          <p className="review-detail-new-comment-writer">{logedinUserNickname}</p>
          <input
            type="text"
            placeholder="댓글 내용"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleCommentSubmit}>댓글 작성</button>
        </div>
      </div>
      {isAlertModalOpen && (
        <AlertModal message={alertMessage} onClose={closeAlertModal} />
      )}
    </div>
  );
};

export default ReviewDetail;