// src/components/LoginForm/LoginForm.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';
import PasswordResetModal from '../Modals/PasswordResetModal';
import AlertModal from '../Modals/AlertModal';

const LoginForm = ({ onLogin }) => {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();  // `useNavigate`로 수정

  const openResetModal = () => setIsResetModalOpen(true);
  const closeResetModal = () => setIsResetModalOpen(false);

  const openErrorModal = (message) => {
    setErrorMessage(message);
    setIsErrorModalOpen(true);
  };
  const closeErrorModal = () => setIsErrorModalOpen(false);

  const openSuccessModal = () => setIsSuccessModalOpen(true);
  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    navigate('/');  // 모달을 닫을 때 홈으로 이동
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // 이메일 또는 비밀번호가 없으면 오류 모달을 열도록 함
    if (!email || !password) {
      openErrorModal("이메일과 비밀번호를 모두 입력해 주세요.");
      return;
    }

    try {
      const loginResult = await onLogin(email, password);
      console.log("로그인 결과:", loginResult);

      if (loginResult === "ADMIN") {
        setIsSuccessModalOpen(true);
        navigate('/admin/statisticsmanagement/adminstatistics');  // 관리자 페이지로 이동
      } else if (loginResult === "USER") {
        console.log("로그인 성공!");
        navigate('/');  // 홈 페이지로 이동
      } else {
        openErrorModal("아이디와 비밀번호가 일치하지 않습니다!");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      openErrorModal("로그인 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  const handleSignupClick = () => {
    navigate('/SignUpForm');
  };

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Adore</h2>
        <div className="login-form-group">
          <label htmlFor="email">아이디</label>
          <input
            type="email"
            id="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="login-form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="login-form-buttons">
          <button type="submit" className="login-form-login-btn">
            로그인
          </button>
          <button type="button" className="login-form-reset-password-btn" onClick={openResetModal}>
            비밀번호 재설정
          </button>
          <button type="button" className="login-form-signup-btn" onClick={handleSignupClick}>
            회원 가입
          </button>
        </div>
        <p>아직 회원이 아니신가요?</p>
      </form>

      {/* 비밀번호 재설정 모달 */}
      <PasswordResetModal show={isResetModalOpen} handleClose={closeResetModal} />

      {/* 로그인 에러 모달 - 오류 메시지를 동적으로 전달 */}
      {isErrorModalOpen && (
        <AlertModal
          message={errorMessage}
          onClose={closeErrorModal}
        />
      )}

      {/* 관리자 모드 로그인 성공 모달 */}
      {isSuccessModalOpen && (
        <AlertModal
          message="관리자 모드로 로그인 성공!"
          onClose={closeSuccessModal}
        />
      )}
    </div>
  );
};

export default LoginForm;