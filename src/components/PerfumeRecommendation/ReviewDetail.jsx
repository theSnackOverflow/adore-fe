import React, { useState, useEffect } from 'react';
import axiosInstance from '../../lib/axiosInstance';
import { useParams } from 'react-router-dom';
import PerfumeSidebar from '../Sidebars/PerfumeSidebar';
import AlertModal from '../Modals/AlertModal';
import './ReviewDetail.css';

const ReviewDetail = () => {
  const { reviewId } = useParams(); // 리뷰 ID를 URL 파라미터에서 가져옴
  const [reviewData, setReviewData] = useState(null); // 리뷰 데이터를 저장할 상태
  const [nickname, setNickname] = useState('익명 사용자'); // 사용자 닉네임
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
      const data = response.data;

      setReviewData({
        perfumeName: data.perfumeName || '알 수 없음',
        memberId: data.memberId,
        title: data.title || '제목 없음',
        content: data.content || '내용 없음',
        rating: data.rating || 0,
        createdAt: data.createdAt || new Date(),
        likeCnt: data.likeCnt || 0,
      });

      setLikes(data.likeCnt || 0);
      setComments(data.CommentList || []);

      if (data.memberId) {
        fetchUserNickname(data.memberId);
      }
    } catch (error) {
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

  // 초기 로딩 시 데이터 가져오기
  useEffect(() => {
    if (reviewId) {
      fetchReviewData();
    } else {
      setAlertMessage('리뷰 ID가 없습니다.');
      setIsAlertModalOpen(true);
    }
  }, [reviewId]);

  // 좋아요 처리 함수
  const handleLike = async () => {
    if (hasLiked) {
      setAlertMessage("추천은 한 번만 할 수 있습니다!");
      setIsAlertModalOpen(true);
    } else {
      try {
        await axiosInstance.patch(`api/user/review/like`, null, {
          params: { id: reviewId },
        });
        setHasLiked(true);
        fetchReviewData(); // 좋아요 후 데이터를 다시 가져옴
      } catch (error) {
        setAlertMessage('추천을 등록하는데 실패했습니다.');
        setIsAlertModalOpen(true);
      }
    }
  };

  // 댓글 작성 함수
  const handleCommentSubmit = async () => {
    if (newComment.trim()) {
      try {
        const response = await axiosInstance.post(`api/user/review/comment`, {
          reviewId,
          content: newComment,
        });
        setComments([...comments, response.data]);
        setNewComment('');
      } catch (error) {
        setAlertMessage('댓글 작성에 실패했습니다.');
        setIsAlertModalOpen(true);
      }
    } else {
      setAlertMessage('댓글 내용을 입력해주세요.');
      setIsAlertModalOpen(true);
    }
  };

  // 댓글 삭제 함수
  const handleDeleteComment = async (commentId) => {
    try {
      await axiosInstance.delete(`api/user/review/comment`, {
        params: { id: commentId },
      });
      setComments(comments.filter((comment) => comment.id !== commentId));
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
              {comment.user === '내 닉네임' ? (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="review-detail-delete-comment-btn"
                >
                  삭제하기
                </button>
              ) : (
                <button
                  onClick={() => setAlertMessage("신고가 완료되었습니다.")}
                  className="review-detail-report-comment-btn"
                >
                  신고하기
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="review-detail-new-comment">
          <p className="review-detail-new-comment-writer">{nickname}</p>
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