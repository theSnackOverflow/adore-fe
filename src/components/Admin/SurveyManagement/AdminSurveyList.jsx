// src/components/Admin/SurveyManagement/AdminSurveyList.jsx

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AdminSurveyManagementSidebar from '../../Sidebars/AdminSidebars/AdminSurveyManagementSidebar';
import './AdminSurveyList.css';

// 더미 데이터 생성
const authors = ['관리자1', '관리자2', '관리자3'];
const getRandomDate = () => {
  const start = new Date(2024, 0, 1);
  const end = new Date();
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const getRandomResponses = () => Math.floor(Math.random() * 100) + 1;

// 더미 설문조사 데이터 생성 (200개)
const surveys = Array.from({ length: 200 }, (_, index) => ({
  id: 200 - index,
  author: authors[Math.floor(Math.random() * authors.length)],
  title: `설문조사 ${200 - index}`,
  date: getRandomDate(),
  responses: getRandomResponses(),
}));

const AdminSurveyList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const pagesPerGroup = 10;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredSurveys = surveys
    .filter(
      (survey) =>
        survey.title.includes(searchQuery) || survey.author.includes(searchQuery)
    )
    .sort((a, b) => b.id - a.id);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSurveys = filteredSurveys.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredSurveys.length / itemsPerPage);
  const currentGroup = Math.floor((currentPage - 1) / pagesPerGroup);
  const startPage = currentGroup * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const goToPreviousGroup = () => {
    if (startPage > 1) setCurrentPage(startPage - 1);
  };
  const goToNextGroup = () => {
    if (endPage < totalPages) setCurrentPage(endPage + 1);
  };

  const handleEditClick = (surveyId) => {
    navigate(`/Admin/SurveyManagement/AdminSurveyDetail/${surveyId}`);
  };

  return (
    <div className="admin-survey-list-container">
      <AdminSurveyManagementSidebar />
      <div className="admin-survey-list-content">
        <div className="admin-survey-list-header">
          <h1>설문조사 목록 조회</h1>
          <div className="admin-survey-list-search-bar">
            <input
              type="text"
              placeholder="제목, 작성자 등"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <table className="admin-survey-list-table">
          <thead>
            <tr>
              <th>작성자</th>
              <th>제목</th>
              <th>작성 날짜</th>
              <th>응답 수</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {currentSurveys.map((survey) => (
              <tr key={survey.id}>
                <td>{survey.author}</td>
                <td>
                  <Link to={`/Admin/SurveyManagement/AdminSurveyDetail/${survey.id}`}>
                    {survey.title}
                  </Link>
                </td>
                <td>{survey.date}</td>
                <td>{survey.responses}</td>
                <td>
                  <button
                    className="admin-survey-list-edit-button"
                    onClick={() => handleEditClick(survey.id)}
                  >
                    수정
                  </button>
                  <button className="admin-survey-list-delete-button">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="admin-survey-list-pagination">
          {startPage > 1 && (
            <button onClick={goToPreviousGroup} className="admin-survey-list-pagination-nav">이전</button>
          )}
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={currentPage === page ? 'active' : ''}
            >
              {page}
            </button>
          ))}
          {endPage < totalPages && (
            <button onClick={goToNextGroup} className="admin-survey-list-pagination-nav">다음</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSurveyList;