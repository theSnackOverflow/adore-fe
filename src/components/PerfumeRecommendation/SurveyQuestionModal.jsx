import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SurveyQuestionModal.css';
import AlertModal from '../Modals/AlertModal';

const SurveyQuestionModal = ({ onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMainNotes, setSelectedMainNotes] = useState([]);
  const [selectedSubNotes, setSelectedSubNotes] = useState({});
  const [selectedPrice, setSelectedPrice] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const mainNotes = ["시트러스", "머스크", "플로랄", "우디", "스파이시", "푸제르", "오리엔탈", "시프레", "가죽", "암브레", "바닐라", "아로마틱"];
  const subNotes = {
    "시트러스": ["레몬", "오렌지", "유자", "베르가못", "라임", "자몽", "만다린", "키 라임", "블러드 오렌지", "카피르 라임"],
    "머스크": ["화이트 머스크", "따뜻한 머스크", "애니멀 머스크", "파우더리 머스크", "크리스탈 머스크", "머스크 엠브레트", "실크 머스크", "리치 머스크", "소프트 머스크", "아쿠아틱 머스크"],
    "플로랄": ["장미", "라벤더", "재스민", "프리지아", "피오니", "릴리", "튤립", "히아신스", "가르데니아", "일랑일랑"],
    "우디": ["삼나무", "백단향", "참나무 이끼", "파출리", "가이악 우드", "시더우드", "흑단", "로즈우드", "오크", "티크 우드"],
    "스파이시": ["계피", "생강", "카다멈", "후추", "정향", "넛맥", "사프란", "아니스", "페퍼민트", "바질"],
    "푸제르": ["라벤더", "클라리 세이지", "오크 모스", "우디 베이스", "베티버", "머스크", "블랙 커런트", "타임", "로즈마리", "베르가못"],
    "오리엔탈": ["앰버", "바닐라", "파촐리", "토카빈", "머스크", "샌달우드", "오포포낙스", "인센스", "미르", "로즈우드"],
    "시프레": ["오크 모스", "라벤더", "시더우드", "파인", "패출리", "로즈마리", "베티버", "레몬", "라임", "머스크"],
    "가죽": ["가죽", "스웨이드", "연기", "샤프레", "앰버", "머스크", "우디", "토바코", "캐스터럼", "유황"],
    "암브레": ["앰버", "엠버그리스", "파촐리", "바닐라", "미르", "인센스", "스모크", "머스크", "샌달우드", "라벤더"],
    "바닐라": ["타히티 바닐라", "마다가스카르 바닐라", "프렌치 바닐라", "앰버 바닐라", "머스크 바닐라", "스파이시 바닐라", "카라멜 바닐라", "코코아 바닐라", "허니 바닐라", "코코넛 바닐라"],
    "아로마틱": ["라벤더", "로즈마리", "타임", "바질", "베르가못", "클라리 세이지", "유칼립투스", "파인", "민트", "페퍼민트"]
  };

  const priceOptions = ["~10만원", "10만원~20만원", "20만원~30만원", "30만원~40만원", "40만원~50만원", "50만원 이상"];

  const handleNextPage = () => {
    if (currentPage === 1 && selectedMainNotes.length < 3) {
      return;
    } else if (currentPage < 11) {
      setCurrentPage((prev) => prev + 1);
    } else if (currentPage === 11) {
      handleSubmit();
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleMainNoteSelection = (note) => {
    if (selectedMainNotes.includes(note)) {
      setSelectedMainNotes(selectedMainNotes.filter((n) => n !== note));
    } else if (selectedMainNotes.length < 3) {
      setSelectedMainNotes([...selectedMainNotes, note]);
      if (selectedMainNotes.length === 2) {
        setTimeout(handleNextPage, 100);
      }
    }
  };

  const handleSubNoteSelection = (page, note) => {
    setSelectedSubNotes((prev) => ({ ...prev, [page]: note }));
    setTimeout(handleNextPage, 100);
  };

  const handlePriceSelection = (price) => {
    setSelectedPrice(price);
    setShowAlert(true);  // 알림 모달 표시
  };

  const closeAlertAndNavigate = () => {
    setShowAlert(false);  // 알림 모달 닫기
    navigate('/PerfumeRecommendation/SurveyResult');  // 결과 페이지로 이동
  };

  const renderPageContent = () => {
    if (currentPage === 1) {
      return (
        <>
          <h2>좋아하는 노트를 선택해주세요 (최대 3개)</h2>
          <div className="selected-notes">
            {selectedMainNotes.map((note, index) => (
              <span key={index} className="selected-note">{`${index + 1}. ${note}`}</span>
            ))}
          </div>
          <div className="survey-options">
            {mainNotes.map((note, index) => (
              <button
                key={index}
                className={`survey-option-button ${selectedMainNotes.includes(note) ? "selected" : ""}`}
                onClick={() => handleMainNoteSelection(note)}
              >
                {note}
              </button>
            ))}
          </div>
        </>
      );
    } else if (currentPage >= 2 && currentPage <= 10) {
      const mainNoteIndex = Math.floor((currentPage - 2) / 3);
      const selectedMainNote = selectedMainNotes[mainNoteIndex];
      const previouslySelected = Object.values(selectedSubNotes).slice((mainNoteIndex * 3), currentPage - 2);
      const pageSubNotes = subNotes[selectedMainNote].filter((note) => !previouslySelected.includes(note));
      const selectedSubNote = selectedSubNotes[currentPage];
      const subNoteIndex = (currentPage - 2) % 3 + 1;

      return (
        <>
          <h2>{`${selectedMainNote} 향의 하위 노트를 선택해주세요 (${subNoteIndex}번째 선택)`}</h2>
          <div className="survey-options">
            {pageSubNotes.map((note, index) => (
              <button
                key={index}
                className={`survey-option-button ${selectedSubNote === note ? "selected" : ""}`}
                onClick={() => handleSubNoteSelection(currentPage, note)}
              >
                {note}
              </button>
            ))}
          </div>
        </>
      );
    } else if (currentPage === 11) {
      return (
        <>
          <h2>원하는 가격대를 선택해주세요</h2>
          <div className="survey-options">
            {priceOptions.map((price, index) => (
              <button
                key={index}
                className={`survey-option-button ${selectedPrice === price ? "selected" : ""}`}
                onClick={() => handlePriceSelection(price)}
              >
                {price}
              </button>
            ))}
          </div>
        </>
      );
    }
  };

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
              onClick={handleNextPage}
              disabled={currentPage === 1 && selectedMainNotes.length < 3}
            >
              {currentPage === 11 ? "제출" : "다음"}
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