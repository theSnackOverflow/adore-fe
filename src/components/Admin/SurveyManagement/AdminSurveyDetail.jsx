import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import AdminSurveyManagementSidebar from '../../Sidebars/AdminSidebars/AdminSurveyManagementSidebar';
import './AdminSurveyDetail.css';

const AdminSurveyDetail = () => {

  const gatewayURL = import.meta.env.VITE_GATEWAY_URL;
  const instance = axios.create({
    baseURL: gatewayURL
  });
  const { surveyId } = useParams(); // 라우트 파라미터에서 surveyId를 가져옴
  const location = useLocation();
  const navigate = useNavigate();

  // 쿼리 파라미터 추출
  const queryParams = new URLSearchParams(location.search);
  const doUpdate = queryParams.get('doUpdate') === 'true' ? true : false;

  const [surveyInfo, setSurveyInfo] = useState({
    title: '',
    date: '',
    responses: 0,
  });
  const [questions, setQuestions] = useState([]);
  const [isEditing, setIsEditing] = useState(doUpdate);

  useEffect(() => {
    const fetchSurveyDetail = async () => {
      try {
        const response = await instance.get(`/api/admin/survey/?surveyId=${surveyId}`);
        if (response.data) {
          console.log('설문 상세 응답 성공: ', response.data);
          setSurveyInfo({
            title: response.data.title || '',
            date: response.data.createdAt || '',
            responses: response.data.surveyCnt || 0,
          });
          setQuestions(response.data.questionList || []);
        }
      } catch (error) {
        console.error('설문조사 상세 데이터를 가져오는 중 오류가 발생했습니다:', error);
        throw new Error('설문 상세 조회 실패');
      }
    };
  
    fetchSurveyDetail();
  }, [surveyId]);  

  const handleSurveyInfoChange = (key, value) => {
    setSurveyInfo((prev) => ({ ...prev, [key]: value }));
  };

  const handleQuestionTextChange = (id, text) => {
    setQuestions(
      questions.map((q) =>
        q.surveyQstId === id ? { ...q, questionTxt: text || '' } : q
      )
    );
  };

  const handleAddAnswer = (questionId) => {
    setQuestions(
      questions.map((q) =>
        q.surveyQstId === questionId
          ? { ...q, answerList: [...q.answerList, { surveyAnsId: Date.now(), answerTxt: '', value: '', nxtQstId: 0 }] }
          : q
      )
    );
  };

  const handleAnswerTextChange = (questionId, answerId, text, key) => {
    setQuestions(
      questions.map((q) =>
        q.surveyQstId === questionId
          ? {
              ...q,
              answerList: q.answerList.map((a) =>
                a.surveyAnsId === answerId ? { ...a, [key]: text || '' } : a
              ),
            }
          : q
      )
    );
  };

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.surveyQstId !== id));
  };

  const handleDeleteAnswer = (questionId, answerId) => {
    setQuestions(
      questions.map((q) =>
        q.surveyQstId === questionId
          ? { ...q, answerList: q.answerList.filter((a) => a.surveyAnsId !== answerId) }
          : q
      )
    );
  };

  const handleSaveChanges = async () => {
    // 제약 조건 검사
    const hasStartQuestion = questions.some(q => q.questionOrder === 'START' && q.questionType === 'MULTIPLE' && q.answerList.length >= 3 && q.answerList.every(a => a.nxtQstId !== -1));
    const hasEndQuestion = questions.some(q => q.questionOrder === 'END');

    if (!hasStartQuestion) {
      alert('START 질문은 MULTIPLE 타입이어야 하고, 3개 이상의 답변이 필요하며, 각 답변의 nxtQstId가 -1이 아니어야 합니다.');
      return;
    }

    if (!hasEndQuestion) {
      alert('END 질문이 필요합니다.');
      return;
    }

    console.log("응답 형태 : ", questions);
    try {
      const response = await instance.patch(`/api/admin/survey/update?surveyId=${surveyId}`, {
        questionList: questions
      });
      if (response.status === 200) {
        alert('수정사항이 저장되었습니다.');
        navigate('/Admin/SurveyManagement/AdminSurveyList');
      }
    } catch (error) {
      console.error('수정사항 저장 중 오류가 발생했습니다:', error);
      throw new Error('수정사항 저장 실패');
    }
  };

  return (
    <div className="admin-survey-detail-container">
      <AdminSurveyManagementSidebar />
      <div className="admin-survey-detail-content">
        <h1>설문조사 상세 조회 및 수정</h1>

        <div className="admin-survey-detail-survey-info">
          <div className="admin-survey-detail-form-group">
            <label>제목</label>
            <input
              type="text"
              value={surveyInfo.title}
              onChange={(e) => handleSurveyInfoChange('title', e.target.value)}
              readOnly={!isEditing}
            />
          </div>
          <div className="admin-survey-detail-form-group">
            <label>작성 날짜</label>
            <span>{surveyInfo.date}</span>
          </div>
          <div className="admin-survey-detail-form-group">
            <label>응답 수</label>
            <span>{surveyInfo.responses}명</span>
          </div>
        </div>

        {/* <div className="admin-survey-detail-survey-summary">
          <h2>응답 통계 요약</h2>
          <p>설문에 대한 통계 요약을 여기에 표시할 예정입니다. 현재는 응답 분포, 평균 점수 등의 통계를 여기에 보여줄 수 있습니다.</p>
        </div> */}

        <div className="admin-survey-detail-questions-section">
          {questions.map((question) => (
            <div key={question.surveyQstId} className="admin-survey-detail-question-item">
              <div className="admin-survey-detail-form-group question-input">
                <label>질문</label>
                <input
                  type="text"
                  placeholder="질문을 입력하세요"
                  value={question.questionTxt}
                  onChange={(e) => handleQuestionTextChange(question.surveyQstId, e.target.value)}
                  readOnly={!isEditing}
                />
                {isEditing && (
                  <button className="admin-survey-detail-delete-button" onClick={() => handleDeleteQuestion(question.surveyQstId)}>질문 삭제</button>
                )}
              </div>

              <div className="admin-survey-detail-answers-section">
                {question.answerList.map((answer) => (
                  <div key={answer.surveyAnsId} className="admin-survey-detail-form-group admin-survey-detail-answer-item">
                    <label>답변</label>
                    <input
                      type="text"
                      placeholder="답변을 입력하세요"
                      value={answer.answerTxt}
                      onChange={(e) => handleAnswerTextChange(question.surveyQstId, answer.surveyAnsId, e.target.value, 'answerTxt')}
                      readOnly={!isEditing}
                    />
                    <label>값</label>
                    <input
                      type="text"
                      placeholder="매핑 값"
                      value={answer.value}
                      onChange={(e) => handleAnswerTextChange(question.surveyQstId, answer.surveyAnsId, e.target.value, 'value')}
                      readOnly={!isEditing}
                    />
                    {isEditing && (
                      <button className="admin-survey-detail-delete-button" onClick={() => handleDeleteAnswer(question.surveyQstId, answer.surveyAnsId)}>삭제</button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <div className="admin-survey-detail-add-answer-button-container">
                    <button className="admin-survey-detail-add-answer-button" onClick={() => handleAddAnswer(question.surveyQstId)}>답변 추가</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {isEditing && (
          <button className="admin-survey-detail-save-button" onClick={handleSaveChanges}>수정사항 저장</button>
        )}
      </div>
    </div>
  );
};

export default AdminSurveyDetail;
