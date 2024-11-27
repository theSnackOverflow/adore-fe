import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../lib/CookieUtil';
import FriendRecommendationSidebar from '../Sidebars/FriendRecommendationSidebar';
import axiosInstance from '../../lib/axiosInstance';
import './FriendResultList.css';

const FriendResultList = () => {
  const [surveyResults, setSurveyResults] = useState([]);
  const [searchType, setSearchType] = useState("NAME"); // 친구 이름
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    fetchSurveyResults();
  }, [searchQuery, searchType, currentPage]);

  const fetchSurveyResults = async () => {
    try {
      const token = getCookie('accessToken');
      if (!token) {
        throw new Error('로그인 토큰이 없습니다.');
      }
      const response = await axiosInstance.get(`/api/user/recomm/friend/list/${currentPage}?type=${searchType}&keyword=${searchQuery}`,
        {
          headers: { Authorization: `Bearer ${token}`}
        },
      );
      setSurveyResults(response.data.friendList);
      setHasNext(response.data.hasNext);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('친구 설문 결과 리스트를 조회하는데 실패했습니다 : ', error);
      throw new Error('친구 설문 결과 리스트 조회 실패');
    }
  };

  const handleDelete = async (friendId) => {
    try {
      const token = getCookie('accessToken');
      if (!token) {
        throw new Error('로그인 토큰이 없습니다.');
      }
      const header = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axiosInstance.delete(`/api/user/recomm/friend/${friendId}`, header);
      if (response.status === 200) {
        setSurveyResults((prevResults) => prevResults.filter((result) => result.friendId !== friendId));
        alert('설문조사 결과가 삭제되었습니다.');
      } else {
        alert('설문조사 결과 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting survey result:', error);
      alert('설문조사 결과 삭제 중 오류가 발생했습니다.');
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  const handleSearch = () => {
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
    fetchSurveyResults();
  };

  const handleDetailPageRequestClick = (id) => {
    navigate(`/friendrecommendation/friendresult/${id}`);
  }

  return (
    <div className="survey-result-list-container">
      <FriendRecommendationSidebar />
      <div className="survey-result-list-content">
        <div className="survey-result-list-header">
          <h1>친구 설문조사 결과</h1>
          <div className="survey-result-list-search-bar">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="NAME">이름</option>
              <option value="GENDER">성별</option>
            </select>
            <input
              type='text'
              placeholder='친구이름 또는 성별(MEN, WOMEN, UNISEX)'
              onChange={(e) => setSearchQuery(e.target.value)}
            />
             <button className="survey-result-list-search-btn" onClick={handleSearch}>검색</button>
          </div>
        </div>
        <div className="survey-result-list-table-container">
          <table className="survey-result-list-table">
            <thead>
              <tr>
                <th>이름</th>
                <th>성별</th>
                <th>나이</th>
                <th>생성일</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {surveyResults.map((result) => (
                <tr key={result.friendId}>
                  <td onClick={() => handleDetailPageRequestClick(result.friendId)}>{result.name}</td>
                  <td onClick={() => handleDetailPageRequestClick(result.friendId)}>{result.gender}</td>
                  <td onClick={() => handleDetailPageRequestClick(result.friendId)}>{result.age}</td>
                  <td>{new Date(result.createdAt).toLocaleString()}</td>
                  <td>
                    <button className="delete-button" onClick={() => handleDelete(result.id)}>
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="survey-result-pagination">
          {[...Array(totalPages)].map((_, pageIndex) => (
            <button
              key={pageIndex + 1}
              onClick={() => handlePageChange(pageIndex + 1)}
              className={currentPage === pageIndex + 1 ? 'active' : ''}
            >
              {pageIndex + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendResultList;