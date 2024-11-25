import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SurveyQuestionModal.css';
import AlertModal from '../Modals/AlertModal';
import axios from 'axios';
import { getCookie } from '../../lib/CookieUtil';

const SurveyQuestionModal = ({ onClose, data, surveyId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMainNotes, setSelectedMainNotes] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [selectedNotesNxtQstId, setSelectedNotesNxtQstId] = useState([]);
  const [otherQuestions, setOtherQuestions] = useState([]); // 첫번째 질문을 제외한 나머지 질문들
  const [surveyLength, setSurveyLength] = useState(10);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [userAnsId, setUserAnsId] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if(currentPage >2 && currentPage < surveyLength){
      const syncSelectedAnswers = () => {
        // 현재 페이지에 해당하는 질문 아이디
        const currentQstId = otherQuestions
          .filter(qstAnsSet => qstAnsSet.order === "MIDDLE")[currentPage - 2]?.qstId;
    
        if (currentQstId) {
          setSelectedAnswers(prevState => ({
            ...prevState,
            [currentQstId]: selectedAnswers[currentQstId] || ""
          }));
        }
      };
      syncSelectedAnswers();
    }
    
  }, [currentPage, otherQuestions]);
  

  const gatewayURL = import.meta.env.VITE_GATEWAY_URL;
  const instance = axios.create({
    baseURL: gatewayURL
  });

  const handleNextPage = () => {
    if (currentPage === 1 && selectedMainNotes.length < 3) {
      console.log("현재 페이지 번호(1) : ", currentPage);
      return;
    } else if (currentPage < surveyLength) {
      console.log("현재 페이지 번호 : ", currentPage);
      console.log("전체 질문 길이 : ", surveyLength);
      console.log("답변 저장 상태 : ", selectedAnswers);
      setCurrentPage((prev) => prev + 1);
    } else if (currentPage === surveyLength) {
      console.log("마지막 질문 값 저장 상태 : ", selectedPrice);
      console.log("현재 페이지 번호 : ", currentPage);
      console.log("전체 질문 길이 : ", surveyLength);
      handleSubmit();
    }
  };

  const handleNextQuestionPages = async () => {
    if (currentPage === 1 && selectedMainNotes.length < 3) {
      return;
    } 
    else if(currentPage === 1 && selectedNotesNxtQstId.length === 3) {
      try {
        const response = await instance.get(
          `/api/user/recomm/questions/${surveyId}`,
          {
            params: {
              nxt1: selectedNotesNxtQstId[0],
              nxt2: selectedNotesNxtQstId[1],
              nxt3: selectedNotesNxtQstId[2]
            }
          },
        );
        console.log("연계 질문 불러오기 성공 : ", response.data);
        setOtherQuestions(response.data.qstAnsSets);
        setSurveyLength(response.data.qstAnsSets.length+1);
        console.log("질문 개수 : ",response.data.qstAnsSets.length+1);
        handleNextPage();
      }catch(error) {
        console.error("연계 질문 불러오기 실패: ", error);
        // 에러에 대한 추가적인 처리가 필요하지 않을까?
      }
    }else if( currentPage >=2 ) {
      handleNextPage();
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleMainNoteSelection = (note, nxtQstId) => {
    if (selectedMainNotes.includes(note)) {
      setSelectedMainNotes(selectedMainNotes.filter((n) => n !== note)); // 메인에 대해서만
      setSelectedNotesNxtQstId(selectedNotesNxtQstId.filter((n) => n !== nxtQstId)); // 선택한 노트의 다음 질문 아이디
    } else if (selectedMainNotes.length < 3) {
      setSelectedMainNotes([...selectedMainNotes, note]);
      setSelectedNotesNxtQstId([...selectedNotesNxtQstId, nxtQstId]);
      if (selectedMainNotes.length === 2) {
        console.log("선택한 답변 메핑값 : ", [...selectedMainNotes, note]);
        console.log("선택한 답변의 다음 질문 아이디 : ", [...selectedNotesNxtQstId, nxtQstId]);
      }
    }
  };

  // 연계질문 답변 선택 처리 함수
  const handleSubNoteSelection = (qstId, value) => {
    setSelectedAnswers(prevState => {
      // 새로운 객체를 생성하여 기존 상태를 복사
      const newAnswers = { ...prevState };
      
      // 해당 qstId의 기존 답변이 존재하면 삭제
      if (newAnswers[qstId]) {
        delete newAnswers[qstId];
      }
      
      // 새로운 값을 추가
      newAnswers[qstId] = value;
      return newAnswers;
    });
  };
  

  const handlePriceSelection = (price) => {
    setSelectedPrice(price);
  };

  const handleSubmit = async () => {
    // selectedAnswers 객체를 서버로 보낼 형식으로 변환
    const formattedNoteData = Object.values(selectedAnswers).map(value => ({
      noteName: value
    }));
    console.log("note 조립 후 : ", formattedNoteData);
  
    try {
      const token = getCookie('accessToken');
      if (!token) {
        throw new Error('로그인 토큰이 없습니다.');
      }
      const response = await instance.post('/api/user/recomm/result', 
        {
          notes: formattedNoteData,
          price: parseInt(selectedPrice, 10),
          surveyId: surveyId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("저장 요청 성공 : ", response.data);
      setUserAnsId(response.data.id);
      setShowAlert(true); // 설문 완료 알림 모달 표시
    } catch (error) {
      console.error("저장 요청 실패 : ", error);
    }
  };
  

  const closeAlertAndNavigate = () => {
    setShowAlert(false);  // 알림 모달 닫기
    navigate('/PerfumeRecommendation/SurveyResult', { deliverId: userAnsId});  // 결과 페이지로 이동
  };

  const renderPageContent = () => {
    if (currentPage === 1) {
      return (
        <>
          <h2>{data.qstText}</h2>
          <div className="selected-notes"> 
            {selectedMainNotes.map((note, index) => (
              <span key={index} className="selected-note">{`${index + 1}. ${note}`}</span>
            ))}
          </div>
          <div className="survey-options">
            {data.ansSets.map((ans, index) => (
              <button
                key={index}
                className={`survey-option-button ${selectedMainNotes.includes(ans.value) ? "selected" : ""}`}
                onClick={() => handleMainNoteSelection(ans.value, ans.nextQstId)}
              >
                {ans.ansText}
              </button>
            ))}
          </div>
        </>
      );
    } else if (currentPage >= 2 && currentPage <= surveyLength - 1) {
      // currentPage에서 현재 페이지를 이용하여 해당 페이지의 질문을 가져옵니다.
      const currentQuestionIndex = currentPage - 2;
      const currentQuestion = otherQuestions
        .filter(qstAnsSet => qstAnsSet.order === "MIDDLE")[currentQuestionIndex];
    
      return (
        <>
          {currentQuestion && (
            <div key={currentQuestion.qstId}>
              <h2>{currentQuestion.qstText}</h2>
              <div className="survey-options">
                {currentQuestion.ansSets.map((ans, index) => (
                  <button
                    key={index}
                    className={`survey-option-button ${selectedAnswers[currentQuestion.qstId] === ans.value ? "selected" : ""}`}
                    onClick={() => handleSubNoteSelection(currentQuestion.qstId, ans.value)}
                  >
                    {ans.ansText}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      );
    } else if (currentPage === surveyLength) {
      // END 질문을 들고옵니다.
      const endQuestionIndex = 0; // END 질문은 하나이므로 항상 0번째 인덱스를 사용
      const endQuestion = otherQuestions
        .filter(qstAnsSet => qstAnsSet.order === "END")[endQuestionIndex];
    
      return (
        <>
          {endQuestion && (
            <div key={endQuestion.qstId}>
              <h2>{endQuestion.qstText}</h2>
              <div className="survey-options">
                {endQuestion.ansSets.map((price, index) => (
                  <button
                    key={index}
                    className={`survey-option-button ${selectedPrice === price.value ? "selected" : ""}`}
                    onClick={() => handlePriceSelection(price.value)}
                  >
                    {price.ansText}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      );
    }    
  };

  // todo : 여기부터 다시 수정하면 될 것 같다.
  return (
    <div className="survey-question-modal-overlay" onClick={onClose}>
      <div className="survey-question-modal" onClick={(e) => e.stopPropagation()}>
        <div className="survey-question-modal-header">
          <h1>설문 조사</h1>
          <div className="survey-question-modal-nav-buttons">
            {currentPage > 1 && (
              <button className="survey-prev-button" onClick={handlePrevPage}>이전</button>
            )}
            <button
              className="survey-next-button"
              onClick={handleNextQuestionPages}
              disabled={currentPage === 1 && selectedMainNotes.length < 3}
            >
              {currentPage === surveyLength ? "제출" : "다음"}
            </button>
          </div>
        </div>
        <p>나의 취향 찾기!</p>
        <div className="survey-question-modal-content">{renderPageContent()}</div>
        <div className="survey-question-modal-actions">
          <button className="survey-close-button" onClick={onClose}>닫기</button>
        </div>
      </div>

      {/* 알림 모달 표시 */}
      {showAlert && (
        <AlertModal
          message="설문조사가 제출되었습니다!"
          onClose={closeAlertAndNavigate}
        />
      )}
    </div>
  );
};

export default SurveyQuestionModal;