// src/components/MyPage/PasswordChange.js
import React, { useState } from 'react';
import MyPageSidebar from '../Sidebars/MyPageSidebar';
import './PasswordChange.css';

const PasswordChange = () => {
  const [dummyPassword, setDummyPassword] = useState('1234'); // 실제 비밀번호처럼 관리되는 더미 비밀번호
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValidCurrentPassword, setIsValidCurrentPassword] = useState(true); // 현재 비밀번호 검증 상태
  const [errorMessage, setErrorMessage] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const validateCurrentPassword = () => {
    if (currentPassword !== dummyPassword) {
      setIsValidCurrentPassword(false);
      setErrorMessage((prev) => ({
        ...prev,
        currentPassword: '현재 비밀번호가 일치하지 않습니다.'
      }));
    } else {
      setIsValidCurrentPassword(true);
      setErrorMessage((prev) => ({ ...prev, currentPassword: '' }));
    }
  };

  const validateNewPassword = () => {
    if (newPassword === currentPassword) {
      setErrorMessage((prev) => ({
        ...prev,
        newPassword: "비밀번호를 다르게 설정해주세요!"
      }));
    } else {
      setErrorMessage((prev) => ({ ...prev, newPassword: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 각 필드의 유효성 검사
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage((prev) => ({
        currentPassword: !currentPassword ? '현재 비밀번호를 입력하세요.' : '',
        newPassword: !newPassword ? '새 비밀번호를 입력하세요.' : '',
        confirmPassword: !confirmPassword ? '새 비밀번호 확인을 입력하세요.' : ''
      }));
      return;
    }

    validateCurrentPassword();
    validateNewPassword();

    if (isValidCurrentPassword && newPassword !== currentPassword && newPassword === confirmPassword) {
      setDummyPassword(newPassword); // 새로운 비밀번호로 업데이트
      alert("비밀번호가 성공적으로 변경되었습니다.");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else if (newPassword !== confirmPassword) {
      setErrorMessage((prev) => ({
        ...prev,
        confirmPassword: "새 비밀번호가 일치하지 않습니다."
      }));
    }
  };

  const handleCancel = () => {
    window.location.reload(); // 페이지 새로고침
  };

  return (
    <div className="mypage-container">
      <MyPageSidebar />
      <div className="password-change">
        <h1>비밀번호 변경</h1>
        <form onSubmit={handleSubmit}>
          <label>
            현재 비밀번호
            <input 
              type="password" 
              value={currentPassword} 
              onChange={(e) => setCurrentPassword(e.target.value)} 
              onBlur={validateCurrentPassword} 
              required 
            />
            {errorMessage.currentPassword && <p className="error-message">{errorMessage.currentPassword}</p>}
          </label>
          <label>
            새 비밀번호
            <input 
              type="password" 
              value={newPassword} 
              onChange={(e) => {
                setNewPassword(e.target.value);
                validateNewPassword();
              }}
              required 
            />
            {errorMessage.newPassword && <p className="error-message">{errorMessage.newPassword}</p>}
          </label>
          <label>
            새 비밀번호 확인
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
            {errorMessage.confirmPassword && <p className="error-message">{errorMessage.confirmPassword}</p>}
          </label>
          <div className="password-change-actions">
            <button type="submit" disabled={!isValidCurrentPassword || !newPassword || !confirmPassword}>변경</button>
            <button type="button" onClick={handleCancel}>취소</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChange;