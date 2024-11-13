// src/components/Admin/SurveyManagement/AdminSurveyCreate.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSurveyManagementSidebar from '../../Sidebars/AdminSidebars/AdminSurveyManagementSidebar';
import './AdminSurveyCreate.css';

const AdminSurveyCreate = () => {
  const navigate = useNavigate();
  const [surveyInfo, setSurveyInfo] = useState({
    title: '',
    status: '활성화',
  });
  const [questions, setQuestions] = useState([
    { id: Date.now(), questionText: '', answers: [{ id: Date.now(), text: '' }] },
  ]);

  const handleSurveyInfoChange = (key, value) => {
    setSurveyInfo((prev) => ({ ...prev, [key]: value }));
  };

  const handleQuestionTextChange = (id, text) => {
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, questionText: text } : q
      )
    );
  };

  const handleAddQuestion = () => {
    if (questions.length < 10) {
      setQuestions([
        ...questions,
        { id: Date.now(), questionText: '', answers: [{ id: Date.now(), text: '' }] },
      ]);
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('설문조사가 생성되었습니다.');
    setSurveyInfo({ title: '', status: '활성화' });
    setQuestions([{ id: Date.now(), questionText: '', answers: [{ id: Date.now(), text: '' }] }]);
    navigate('/Admin/SurveyManagement/AdminSurveyList');
  };

  const handleCancel = () => {
    navigate('/Admin/SurveyManagement/AdminSurveyList');
  };

  return (
    <div className="admin-survey-create-container">
      <AdminSurveyManagementSidebar />
      <div className="admin-survey-create-content">
        <h1>설문조사 생성</h1>

        <form onSubmit={handleSubmit} className="admin-survey-create-form">
          <div className="admin-survey-create-form-group">
            <label>제목</label>
            <input
              type="text"
              placeholder="설문조사 제목을 입력하세요"
              value={surveyInfo.title}
              onChange={(e) => handleSurveyInfoChange('title', e.target.value)}
              required
            />
          </div>
          <div className="admin-survey-create-form-group">
            <label>상태</label>
            <select
              value={surveyInfo.status}
              onChange={(e) => handleSurveyInfoChange('status', e.target.value)}
            >
              <option value="활성화">활성화</option>
              <option value="비활성화">비활성화</option>
            </select>
          </div>

          <div className="admin-survey-create-questions-section">
            {questions.map((question, index) => (
              <div key={question.id} className="admin-survey-create-question-item">
                <div className="admin-survey-create-question-header">
                  <span className="question-number">질문 {index + 1}</span>
                  <button
                    type="button"
                    className="admin-survey-create-delete-button"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    질문 삭제
                  </button>
                </div>
                <div className="admin-survey-create-form-group question-input">
                  <label>질문</label>
                  <input
                    type="text"
                    placeholder="질문을 입력하세요"
                    value={question.questionText}
                    onChange={(e) => handleQuestionTextChange(question.id, e.target.value)}
                  />
                </div>

                <div className="admin-survey-create-answers-section">
                  {question.answers.map((answer) => (
                    <div key={answer.id} className="admin-survey-create-form-group admin-survey-create-answer-item">
                      <label>답변</label>
                      <input
                        type="text"
                        placeholder="답변을 입력하세요"
                        value={answer.text}
                        onChange={(e) => handleAnswerTextChange(question.id, answer.id, e.target.value)}
                      />
                      <button
                        type="button"
                        className="admin-survey-create-delete-button"
                        onClick={() => handleDeleteAnswer(question.id, answer.id)}
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                  {question.answers.length < 5 && (
                    <div className="admin-survey-create-add-answer-button-container">
                      <button type="button" className="admin-survey-create-add-answer-button" onClick={() => handleAddAnswer(question.id)}>답변 추가</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {questions.length < 10 && (
              <div className="admin-survey-create-add-question-button-container">
                <button type="button" className="admin-survey-create-add-question-button" onClick={handleAddQuestion}>질문 추가</button>
              </div>
            )}
          </div>

          <div className="admin-survey-create-form-buttons">
            <button type="submit" className="admin-survey-create-register-button">생성</button>
            <button type="button" onClick={handleCancel} className="admin-survey-create-cancel-button">취소</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSurveyCreate;