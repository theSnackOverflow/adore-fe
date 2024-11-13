// src/components/Admin/SurveyManagement/AdminSurveyDetail.jsx

import { useState } from 'react';
import AdminSurveyManagementSidebar from '../../Sidebars/AdminSidebars/AdminSurveyManagementSidebar';
import './AdminSurveyDetail.css';

const AdminSurveyDetail = () => {
  const [surveyInfo, setSurveyInfo] = useState({
    title: '설문조사 제목',
    date: '2024-00-00',
    responses: 120, 
  });

  const [questions, setQuestions] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      questionText: `질문 ${i + 1}`,
      answers: Array.from({ length: 3 }, (_, j) => ({
        id: `${i + 1}-${j + 1}`,
        text: `답변 ${j + 1}`,
      })),
    }))
  );

  const handleAddQuestion = () => {
    if (questions.length < 10) {
      setQuestions([
        ...questions,
        { id: Date.now(), questionText: '', answers: [{ id: Date.now(), text: '' }] },
      ]);
    }
  };

  const handleQuestionTextChange = (id, text) => {
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, questionText: text } : q
      )
    );
  };

  const handleAddAnswer = (questionId) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId && q.answers.length < 5
          ? { ...q, answers: [...q.answers, { id: Date.now(), text: '' }] }
          : q
      )
    );
  };

  const handleAnswerTextChange = (questionId, answerId, text) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a) =>
                a.id === answerId ? { ...a, text } : a
              ),
            }
          : q
      )
    );
  };

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleDeleteAnswer = (questionId, answerId) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? { ...q, answers: q.answers.filter((a) => a.id !== answerId) }
          : q
      )
    );
  };

  const handleSurveyInfoChange = (key, value) => {
    setSurveyInfo((prev) => ({ ...prev, [key]: value }));
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

        {/* 응답 결과 통계 섹션 */}
        <div className="admin-survey-detail-survey-summary">
          <h2>응답 통계 요약</h2>
          <p>설문에 대한 통계 요약을 여기에 표시할 예정입니다. 현재는 응답 분포, 평균 점수 등의 통계를 여기에 보여줄 수 있습니다.</p>
        </div>

        {/* 질문 섹션 */}
        <div className="admin-survey-detail-questions-section">
          {questions.map((question) => (
            <div key={question.id} className="admin-survey-detail-question-item">
              <div className="admin-survey-detail-form-group question-input">
                <label>질문</label>
                <input
                  type="text"
                  placeholder="질문을 입력하세요"
                  value={question.questionText}
                  onChange={(e) => handleQuestionTextChange(question.id, e.target.value)}
                />
                <button className="admin-survey-detail-delete-button" onClick={() => handleDeleteQuestion(question.id)}>질문 삭제</button>
              </div>

              <div className="admin-survey-detail-answers-section">
                {question.answers.map((answer) => (
                  <div key={answer.id} className="admin-survey-detail-form-group admin-survey-detail-answer-item">
                    <label>답변</label>
                    <input
                      type="text"
                      placeholder="답변을 입력하세요"
                      value={answer.text}
                      onChange={(e) => handleAnswerTextChange(question.id, answer.id, e.target.value)}
                    />
                    <button className="admin-survey-detail-delete-button" onClick={() => handleDeleteAnswer(question.id, answer.id)}>삭제</button>
                  </div>
                ))}
                {question.answers.length < 5 && (
                  <div className="admin-survey-detail-add-answer-button-container">
                    <button className="admin-survey-detail-add-answer-button" onClick={() => handleAddAnswer(question.id)}>답변 추가</button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {questions.length < 10 && (
            <div className="admin-survey-detail-add-question-button-container">
              <button className="admin-survey-detail-add-question-button" onClick={handleAddQuestion}>질문 추가</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSurveyDetail;