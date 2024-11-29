import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSurveyManagementSidebar from '../../Sidebars/AdminSidebars/AdminSurveyManagementSidebar';
import './AdminSurveyList.css';

const AdminSurveyList = () => {
  const navigate = useNavigate();

  const [filterType, setFilterType] = useState('ACTIVE'); // 기본은 ACTIVE
  const [surveys, setSurveys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  // const itemsPerPage = 10;
  const pagesPerGroup = 10;

  const gatewayURL = import.meta.env.VITE_GATEWAY_URL;
  const instance = axios.create({
    baseURL: gatewayURL
  });

  const fetchSurveys = async () => {
    try {
      const response = await instance.get(`/api/admin/survey/list/${currentPage}?filter=${filterType}`, {
      });
      if(response.data && response.data.surveyList){
        console.log('설문 리스트 응답 성공 : ', response.data);
        setSurveys(response.data.surveyList);
        setHasNext(response.data.hasNext);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('설문조사 데이터를 가져오는 중 오류가 발생했습니다:', error);
      throw new Error('설문 리스트 조회 실패');
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, [filterType, currentPage])

  const handleFilterType = (e) => {
    setFilterType(e.target.value);
    setCurrentPage(1);
  }

  const currentGroup = Math.floor((currentPage - 1) / pagesPerGroup);
  const startPage = currentGroup * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const goToPreviousGroup = () => {
    if (startPage > 1) setCurrentPage(startPage - 1);
  };
  const goToNextGroup = () => {
    if (endPage < totalPages) setCurrentPage(endPage + 1);
  };

  const handleEditClick = (surveyId) => {
    navigate(`/Admin/SurveyManagement/AdminSurveyDetail/${surveyId}?doUpdate=true`);
  };

  const handleDetailPageRequestClick = (id) => {
    navigate(`/Admin/SurveyManagement/AdminSurveyDetail/${id}?doUpdate=false`);
  }

  const handleDeleteClick = async (surveyId) => {
    try{
      instance.delete(`/api/admin/survey/delete?surveyId=${surveyId}`, {
      });
      console.log("설문 삭제 성공");
      setSurveys((prev) => prev.filter((result) => result.id !== surveyId));
      alert("설문이 삭제되었습니다.");
    }catch(error) {
      console.error("설문 삭제 중 오류가 발생했습니다.", error);
      throw new Error('설문 삭제 실패');
    }
  };

  return (
    <div className="admin-survey-list-container">
      <AdminSurveyManagementSidebar />
      <div className="admin-survey-list-content">
        <div className="admin-survey-list-header">
          <h1>설문조사 목록 조회</h1>
          <div className="admin-survey-list-search-bar">
            <label>
              상태
              <br />
              <select
                name='filterType'
                value={filterType}
                onChange={handleFilterType}
              >
                <option value="ACTIVE">활성화 설문</option>
                <option value="INACTIVE">비활성화 설문</option>
              </select>
            </label>
          </div>
        </div>
        <table className="admin-survey-list-table">
          <thead>
            <tr>
              <th>작성자</th>
              <th>설문조사 ID</th>
              <th>작성 날짜</th>
              <th>응답 수</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {surveys.map((survey) => (
              <tr key={survey.id}>
                <td onClick={() => handleDetailPageRequestClick(survey.id)}>{survey.name}</td>
                <td onClick={() => handleDetailPageRequestClick(survey.id)}>{`설문조사 ${survey.id}`}</td>
                <td onClick={() => handleDetailPageRequestClick(survey.id)}>{new Date(survey.createdAt).toLocaleString()}</td>
                <td onClick={() => handleDetailPageRequestClick(survey.id)}>{survey.surveyCnt}</td>
                <td>
                  <button
                    className="admin-survey-list-edit-button"
                    onClick={() => handleEditClick(survey.id)}
                  >
                    수정
                  </button>
                  <button 
                    className="admin-survey-list-delete-button"
                    onClick={() => handleDeleteClick(survey.id)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="admin-survey-list-pagination">
          {startPage > 1 && (
            <button onClick={goToPreviousGroup} className="admin-survey-list-pagination-nav">
              이전
            </button>
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
            <button onClick={goToNextGroup} className="admin-survey-list-pagination-nav">
              다음
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSurveyList;