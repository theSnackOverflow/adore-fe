import React, { useState, useEffect } from 'react';
import PerfumeSidebar from '../Sidebars/PerfumeSidebar';
import axiosInstance from '../../lib/axiosInstance';
import './SurveyResultList.css';

const SurveyResultList = () => {
  const [surveyResults, setSurveyResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchSurveyResults = async () => {
      try {
        const response = await axiosInstance.get('/api/survey/results');
        setSurveyResults(response.data);
      } catch (error) {
        console.error('Error fetching survey results:', error);
      }
    };
    fetchSurveyResults();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/survey/results/${id}`);
      if (response.status === 200) {
        setSurveyResults((prevResults) => prevResults.filter((result) => result.id !== id));
        alert('설문조사 결과가 삭제되었습니다.');
      } else {
        alert('설문조사 결과 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting survey result:', error);
      alert('설문조사 결과 삭제 중 오류가 발생했습니다.');
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResults = surveyResults.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(surveyResults.length / itemsPerPage);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="survey-result-list-container">
      <PerfumeSidebar />
      <div className="survey-result-list-content">
        <div className="survey-result-list-header">
          <h1>설문조사 결과</h1>
        </div>
        <div className="survey-result-list-table-container">
          <table className="survey-result-list-table">
            <thead>
              <tr>
                <th>제목</th>
                <th>생성 일자</th>
                <th>추천 향수</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {currentResults.map((result) => (
                <tr key={result.id}>
                  <td>{result.title}</td>
                  <td>{result.createdAt}</td>
                  <td>
                    {result.recommendedPerfumes.slice(0, 3).join(', ')}
                  </td>
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

export default SurveyResultList;