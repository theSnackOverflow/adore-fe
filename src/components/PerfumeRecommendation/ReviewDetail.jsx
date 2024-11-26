import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PerfumeSidebar from '../Sidebars/PerfumeSidebar';
import AlertModal from '../Modals/AlertModal';
import './ReviewDetail.css';

const ReviewDetail = () => {
  const { reviewId } = useParams(); // 리뷰 ID를 URL 파라미터에서 가져옴
  const [reviewData, setReviewData] = useState(null); // 리뷰 데이터를 저장할 상태
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false); // 추천 여부
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(''); // AlertModal에 표시할 메시지

  // 리뷰 데이터를 서버에서 가져오는 함수
  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const response = await axios.get(`http://gachon-adore.duckdns.org:8111/api/user/review/detail`, {
          params: { id: reviewId }, // API 요청 파라미터
        });

        if (response.data) {
          console.log("Fetched review data:", response.data); // 디버깅 로그
          setReviewData(response.data);
          setLikes(response.data.likeCnt || 0);
          setComments(response.data.comments || []); // 응답의 comments 필드 매핑
        } else {
          console.error("리뷰 데이터가 비어 있습니다.");
        }
      } catch (error) {
        console.error("리뷰 데이터를 가져오는 중 오류 발생:", error);
        setAlertMessage("리뷰 데이터를 불러오는 데 실패했습니다.");
        setIsAlertModalOpen(true);
      }
    };

    fetchReviewData();
  }, [reviewId]);

  const handleLike = async () => {
    if (hasLiked) {
      setAlertMessage("추천은 한 번만 할 수 있습니다!");
      setIsAlertModalOpen(true);
      return;
    }

    try {
      const response = await axios.post(
        `http://gachon-adore.duckdns.org:8111/api/user/review/like`,
        { id: reviewId }
      );

      if (response.data === "SUCCESS") {
        setLikes(likes + 1);
        setHasLiked(true);
      } else {
        setAlertMessage("추천 처리 중 문제가 발생했습니다.");
        setIsAlertModalOpen(true);
      }
    } catch (error) {
      console.error("추천 처리 중 오류 발생:", error);
      setAlertMessage("추천 처리에 실패했습니다.");
      setIsAlertModalOpen(true);
    }
  };

  const handleReportComment = () => {
    setAlertMessage("신고가 완료되었습니다");
    setIsAlertModalOpen(true);
  };

  const handleDeleteComment = (commentId) => {
    setComments(comments.filter((comment) => comment.id !== commentId));
    setAlertMessage("댓글을 삭제했습니다");
    setIsAlertModalOpen(true);
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      setAlertMessage("댓글 내용을 입력해주세요.");
      setIsAlertModalOpen(true);
      return;
    }

    try {
      const response = await axios.post(
        `http://gachon-adore.duckdns.org:8111/api/user/review/comment`,
        {
          reviewId,
          content: newComment,
        }
      );

      if (response.data === "SUCCESS") {
        const newCommentObj = {
          id: comments.length + 1,
          user: "내 닉네임", // 서버에서 받아오거나 하드코딩
          content: newComment,
        };
        setComments([...comments, newCommentObj]);
        setNewComment('');
      } else {
        setAlertMessage("댓글 작성 중 문제가 발생했습니다.");
        setIsAlertModalOpen(true);
      }
    } catch (error) {
      console.error("댓글 작성 중 오류 발생:", error);
      setAlertMessage("댓글 작성에 실패했습니다.");
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
        <h1>{reviewData.perfumeName}</h1>
        <div className="review-detail-card">
          <div className="review-detail-header">
            <div className="review-detail-user-info">
              <div className="review-detail-profile-pic"></div>
              <h1>{reviewData.writer?.nickname || "익명"}</h1>
            </div>
            <div className="review-detail-image">사진</div>
          </div>
          <div className="review-detail-body">
            <h2>{reviewData.title}</h2>
            <div className="review-detail-body-info">
              <p>별점 : {reviewData.rating}</p>
              <p>작성시간 : {new Date(reviewData.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="review-detail-body-content">
              <p>{reviewData.content}</p>
            </div>
          </div>
          <div className="review-detail-actions">
            <button onClick={handleLike} className="review-detail-like-btn">
              추천 👍 {likes}
            </button>
            <button onClick={handleReportComment} className="review-detail-report-btn">
              신고하기
            </button>
          </div>
        </div>

        <h2>댓글</h2>
        <div className="review-detail-comments">
          {comments.map((comment) => (
            <div key={comment.id} className="review-detail-comment">
              <strong>{comment.user}</strong>
              <p>{comment.content}</p>
              {comment.user === "내 닉네임" ? (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="review-detail-delete-comment-btn"
                >
                  삭제하기
                </button>
              ) : (
                <button
                  onClick={handleReportComment}
                  className="review-detail-report-comment-btn"
                >
                  신고하기
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="review-detail-new-comment">
          <input
            type="text"
            placeholder="댓글 내용"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleCommentSubmit}>작성하기</button>
        </div>
      </div>

      {isAlertModalOpen && (
        <AlertModal
          message={alertMessage}
          onClose={closeAlertModal}
        />
      )}
    </div>
  );
};

export default ReviewDetail;