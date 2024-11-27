import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSurveyManagementSidebar from '../../Sidebars/AdminSidebars/AdminSurveyManagementSidebar';
import './AdminSurveyCreate.css';

const AdminSurveyCreate = () => {
  const navigate = useNavigate();
  const [surveyInfo, setSurveyInfo] = useState({
    status: '활성화',
  });

  const [questions, setQuestions] = useState([
    {
      id: Date.now(),
      type: 'START',
      questionText: '',
      domain: 'NOTE',
      order: 1,
      nextQuestionId: -1,
      answers: Array(3)
        .fill(0)
        .map(() => ({ id: Date.now() + Math.random(), text: '', value: '' })),
    },
  ]);

  const [hasEndQuestion, setHasEndQuestion] = useState(false);

  const handleSurveyInfoChange = (key, value) => {
    setSurveyInfo((prev) => ({ ...prev, [key]: value }));
  };

  const handleQuestionChange = (id, key, value) => {
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, [key]: value } : q
      )
    );
  };

  const handleAnswerChange = (questionId, answerId, key, value) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a) =>
                a.id === answerId ? { ...a, [key]: value } : a
              ),
            }
          : q
      )
    );
  };

  const handleAddQuestion = (type) => {
    if (hasEndQuestion) {
      alert('이미 마지막 질문이 추가되었습니다. 더 이상 질문을 추가할 수 없습니다.');
      return;
    }

    if (questions.length < 10) {
      const newQuestion = {
        id: Date.now(),
        type: type || 'MIDDLE',
        questionText: '',
        domain: type === 'END' ? 'PRICE' : 'NOTE',
        selectionType: 'SINGLE',
        order: type === 'END' ? questions.length + 1 : '',
        nextQuestionId: -1,
        answers: [{ id: Date.now(), text: '', value: '' }],
      };

      if (type === 'END') {
        setHasEndQuestion(true);
        newQuestion.domain = 'PRICE';
      }

      setQuestions([...questions, newQuestion]);
    } else {
      alert('최대 10개의 질문만 추가할 수 있습니다.');
    }
  };

  const handleAddAnswer = (questionId) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: [
                ...q.answers,
                { id: Date.now(), text: '', value: '' },
              ],
            }
          : q
      )
    );
  };

  const handleDeleteQuestion = (id) => {
    const questionToDelete = questions.find((q) => q.id === id);
    if (questionToDelete.type === 'END') {
      setHasEndQuestion(false);
    }
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
    console.log('Survey Info:', surveyInfo);
    console.log('Questions:', questions);
    alert('설문조사가 생성되었습니다.');
    setSurveyInfo({ status: '활성화' });
    setQuestions([
      {
        id: Date.now(),
        type: 'START',
        questionText: '',
        domain: 'NOTE',
        order: 1,
        nextQuestionId: -1,
        answers: Array(3)
          .fill(0)
          .map(() => ({ id: Date.now() + Math.random(), text: '', value: '' })),
      },
    ]);
    setHasEndQuestion(false);
    navigate('/Admin/SurveyManagement/AdminSurveyList');
  };

  return (
    <div className="admin-survey-create-container">
      <AdminSurveyManagementSidebar />
      <div className="admin-survey-create-content">
        <h1>설문조사 생성</h1>

        <form onSubmit={handleSubmit} className="admin-survey-create-form">
          {/* <div className="admin-survey-create-form-group">
            <label>상태</label>
            <select
              value={surveyInfo.status}
              onChange={(e) => handleSurveyInfoChange('status', e.target.value)}
            >
              <option value="활성화">활성화</option>
              <option value="비활성화">비활성화</option>
            </select>
          </div> */}

          <div className="admin-survey-create-questions-section">
            {questions.map((question, index) => (
              <div key={question.id} className="admin-survey-create-question-item">
                <div className="admin-survey-create-question-header">
                  <span className="question-number">
                    질문 {index + 1} ({question.type})
                  </span>
                  {question.type !== 'START' && (
                    <button
                      type="button"
                      className="admin-survey-create-delete-button"
                      onClick={() => handleDeleteQuestion(question.id)}
                    >
                      질문 삭제
                    </button>
                  )}
                </div>
                <div className="admin-survey-create-form-group">
                  <label>질문</label>
                  <input
                    type="text"
                    placeholder="질문 내용을 입력하세요"
                    value={question.questionText}
                    onChange={(e) =>
                      handleQuestionChange(question.id, 'questionText', e.target.value)
                    }
                  />
                </div>

                {question.type === 'MIDDLE' && (
                  <>
                    <div className="admin-survey-create-form-group">
                      <label>순서</label>
                      <input
                        type="number"
                        value={question.order}
                        onChange={(e) =>
                          handleQuestionChange(question.id, 'order', e.target.value)
                        }
                      />
                    </div>
                    <div className="admin-survey-create-form-group">
                      <label>선택 유형</label>
                      <div>
                        <label>
                          <input
                            type="radio"
                            name={`selectionType-${question.id}`}
                            value="SINGLE"
                            checked={question.selectionType === 'SINGLE'}
                            onChange={(e) =>
                              handleQuestionChange(question.id, 'selectionType', e.target.value)
                            }
                          />
                          단일 선택
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`selectionType-${question.id}`}
                            value="MULTIPLE"
                            checked={question.selectionType === 'MULTIPLE'}
                            onChange={(e) =>
                              handleQuestionChange(question.id, 'selectionType', e.target.value)
                            }
                          />
                          다중 선택
                        </label>
                      </div>
                    </div>
                    <div className="admin-survey-create-form-group">
                      <label>도메인</label>
                      <select
                        value={question.domain}
                        onChange={(e) =>
                          handleQuestionChange(question.id, 'domain', e.target.value)
                        }
                      >
                        <option value="NOTE">노트</option>
                        <option value="PRICE">가격</option>
                        <option value="GENDER">성별</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="admin-survey-create-form-group">
                  <label>다음 질문 ID</label>
                  <input
                    type="number"
                    placeholder="다음 질문 ID를 입력하세요"
                    value={question.nextQuestionId}
                    onChange={(e) =>
                      handleQuestionChange(question.id, 'nextQuestionId', e.target.value)
                    }
                  />
                </div>

                <div className="admin-survey-create-answers-section">
                  {question.answers.map((answer) => (
                    <div key={answer.id} className="admin-survey-create-form-group">
                      <label>답변</label>
                      <input
                        type="text"
                        placeholder="답변 내용을 입력하세요"
                        value={answer.text}
                        onChange={(e) =>
                          handleAnswerChange(question.id, answer.id, 'text', e.target.value)
                        }
                      />
                      <label>값</label>
                      <input
                        type="text"
                        placeholder="매핑 값"
                        value={answer.value}
                        onChange={(e) =>
                          handleAnswerChange(question.id, answer.id, 'value', e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteAnswer(question.id, answer.id)}
                        disabled={
                          question.type === 'START' && question.answers.length <= 3
                        }
                      >
                        답변 삭제
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddAnswer(question.id)}
                    disabled={question.answers.length >= 10}
                  >
                    답변 추가
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="admin-survey-create-buttons">
            <button
              type="button"
              onClick={() => handleAddQuestion('MIDDLE')}
            >
              중간 질문 추가
            </button>
            <button
              type="button"
              onClick={() => handleAddQuestion('END')}
              disabled={hasEndQuestion}
            >
              마지막 질문 추가
            </button>
            <button type="submit">설문조사 생성</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSurveyCreate;