import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 추가
import './SignupCompleteModal.css';

const SignupCompleteModal = ({ show, handleClose }) => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleLoginClick = () => {
    navigate('/login'); // 로그인 페이지로 이동
  };

  if (!show) return null;

  return (
    <div className="signup-complete-overlay">
      <div className="signup-complete-content">
        <h2>회원가입 완료!</h2>
        <p>회원가입이 완료되었습니다.<br></br>
           지금 로그인하여 서비스를 이용해보세요!</p>
        <div className="signup-complete-buttons">
          <button className="signup-complete-login-btn" onClick={handleLoginClick}>로그인</button>
          <button className="signup-complete-close-btn" onClick={handleClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default SignupCompleteModal;