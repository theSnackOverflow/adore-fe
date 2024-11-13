import { useState } from 'react';
import './PasswordResetModal.css';

const PasswordResetModal = ({ show, handleClose }) => {
  const [isCodeSent, setIsCodeSent] = useState(false); // 인증코드 발송 상태

  if (!show) return null;

  const handleConfirmClick = () => {
    setIsCodeSent(true); // 인증코드 발송 팝업 표시
  };

  const closeCodeSentPopup = () => {
    setIsCodeSent(false); // 인증코드 발송 팝업 닫기
    handleClose(); // 전체 모달 닫기
  };

  return (
    <>
      <div className="password-reset-overlay">
        <div className="password-reset-content">
          <h2>비밀번호 재설정</h2>
          <p>
            계정과 연결된 이메일을 입력하세요.<br />
            이메일 주소로 비밀번호 재설정 링크를 보내드립니다.
          </p>
          <div className="form-group">
            <label htmlFor="email">이메일 입력</label>
            <input type="email" id="email" placeholder="이메일 입력" />
          </div>
          <div className="password-reset-buttons">
            <button className="password-reset-confirm-btn" onClick={handleConfirmClick}>확인</button>
            <button className="password-reset-cancel-btn" onClick={handleClose}>취소</button>
          </div>
        </div>
      </div>

      {/* 인증코드 발송 팝업 */}
      {isCodeSent && (
        <div className="code-sent-popup">
          <div className="code-sent-content">
            <p>인증코드를 발송했습니다!</p>
            <button onClick={closeCodeSentPopup} className="code-sent-close-btn">확인</button>
          </div>
        </div>
      )}
    </>
  );
};

export default PasswordResetModal;