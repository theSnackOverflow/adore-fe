import React, { useState, useEffect } from 'react';
import axiosInstance from '../../lib/axiosInstance'; // Axios 인스턴스
import MyPageSidebar from '../Sidebars/MyPageSidebar';
import './MyReviewList.css';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../lib/CookieUtil'; // 쿠키에서 Access Token 가져오기

const MyReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [memberName, setMemberName] = useState(''); // 로그인 사용자 이름
  const navigate = useNavigate();

  // 사용자 이름 가져오기
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const accessToken = getCookie('accessToken');
        if (!accessToken) {
          alert('로그인이 필요합니다.');
          navigate('/login'); // 로그인 페이지로 이동
          return;
        }

        console.log('Fetching user name with token:', accessToken); // 디버깅 로그

        const response = await axiosInstance.get('/api/auth/token', {
          params: { token: accessToken },
        });

        console.log('User name fetch response:', response.data); // 디버깅 로그

        setMemberName(response.data.memberName); // 사용자 이름 저장
      } catch (error) {
        console.error('사용자 정보를 가져오는 중 오류가 발생했습니다:', error);
        alert('사용자 정보를 확인할 수 없습니다.');
      }
    };
    fetchUserName();
  }, [navigate]);

  // 리뷰 데이터 로드
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        console.log(`Fetching reviews for page ${currentPage} and query "${searchQuery}"`); // 디버깅 로그
        const response = await axiosInstance.get(`/api/user/review/lists/${currentPage}`, {
          params: { type: 'NAME', keyword: searchQuery },
        });

        console.log('Review fetch response:', response.data); // 디버깅 로그

        // 사용자의 이름과 일치하는 리뷰만 필터링
        const filteredReviews = response.data.reviewList.filter(
          (review) => review.name === memberName
        );

        setReviews(filteredReviews || []);
        setTotalPages(response.data.totalPages || 1); // 전체 페이지 수 설정
      } catch (error) {
        console.error('리뷰 데이터를 가져오는 중 오류가 발생했습니다:', error);
      }
    };
    if (memberName) {
      fetchReviews();
    }
  }, [searchQuery, currentPage, memberName]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  const handleDelete = async (id) => {
    try {
      const accessToken = getCookie('accessToken'); // Access Token 가져오기
      if (!accessToken) {
        alert('로그인이 필요합니다.');
        navigate('/login'); // 로그인 페이지로 이동
        return;
      }

      console.log('Attempting to delete review with ID:', id); // 디버깅 로그

      // 리뷰 삭제 API 호출
      const response = await axiosInstance.delete(`/api/user/review/delete`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Access Token 포함
        },
        params: { id }, // 리뷰 ID 전달
      });

      console.log('Delete review response:', response.data); // 디버깅 로그

      if (response.data === 'REVIEW_DELETE_SUCCESS') {
        // 삭제 성공 시 리뷰 목록 갱신
        setReviews(reviews.filter((review) => review.id !== id));
        alert('리뷰가 성공적으로 삭제되었습니다.');
      } else {
        alert('리뷰 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('리뷰 삭제 중 오류가 발생했습니다:', error);
      alert('리뷰 삭제 도중 문제가 발생했습니다.');
    }
  };

  const handleEdit = async (id) => {
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }
  
      // 리뷰 조회 API 호출
      const response = await axiosInstance.get(`/api/user/review/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: { id },
      });
  
      if (response.data) {
        console.log('Edit review fetch response:', response.data); // 디버깅 로그
  
        // 리뷰 데이터와 함께 수정 페이지로 이동
        navigate('/MyPage/ReviewForm', { 
          state: { 
            reviewId: id, // 수정할 리뷰의 ID 추가
            reviewData: response.data, 
          },
        });
      } else {
        alert('리뷰 정보를 가져오는 데 실패했습니다.');
      }
    } catch (error) {
      console.error('리뷰 조회 중 오류가 발생했습니다:', error);
      alert('리뷰 정보를 가져오는 도중 문제가 발생했습니다.');
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      console.log(`Navigating to page ${page}`); // 디버깅 로그
      setCurrentPage(page);
    }
  };

  return (
    <div className="mypage-container">
      <MyPageSidebar />
      <div className="my-review-list">
        <h1>내 리뷰 목록</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="제목"
            value={searchQuery}
            onChange={handleSearch}
          />
          <button className="search-btn">🔍</button>
        </div>
        <table className="review-table">
          <thead>
            <tr>
              <th>작성자</th>
              <th>제목</th>
              <th>작성일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <td>{review.name}</td>
                <td>{review.title}</td>
                <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(review.id)}
                  >
                    수정
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(review.id)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination-container">
          <div className="pagination">
            {currentPage > 1 && (
              <button onClick={() => goToPage(currentPage - 1)}>이전</button>
            )}
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? 'active' : ''}
                onClick={() => goToPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            {currentPage < totalPages && (
              <button onClick={() => goToPage(currentPage + 1)}>다음</button>
            )}
          </div>
          <button
            className="write-btn"
            onClick={() => navigate('/MyPage/ReviewForm')}
          >
            리뷰 작성
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyReviewList;