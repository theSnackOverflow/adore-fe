import React, { useState } from 'react';
import MyPageSidebar from '../Sidebars/MyPageSidebar';
import axiosInstance from '../../lib/axiosInstance'; // Axios 인스턴스
import axios from 'axios';
import './PasswordChange.css';

const PasswordChange = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [emailCheckMessage, setEmailCheckMessage] = useState({ text: '', styleClass: '' });
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });

  // 이메일 전송 API 호출
  const handleSendVerificationCode = async () => {
    if (!email) {
      setErrorMessage((prev) => ({ ...prev, email: '이메일을 입력하세요.' }));
      return;
    }

    try {
      const response = await axios.post('https://gachon-adore.duckdns.org/api/auth/email-send', null, {
        params: { email },
      });

      if (response.status === 200) {
        setEmailVerificationSent(true);
        setEmailCheckMessage({
          text: '인증 코드가 전송되었습니다.',
          styleClass: 'success-message',
        });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || '인증 코드 전송 실패. 다시 시도해주세요.';
      setEmailCheckMessage({
        text: errorMsg,
        styleClass: 'error-message',
      });
    }
  };

  // 인증 확인 API 호출
  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setVerificationMessage('인증 코드를 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post('https://gachon-adore.duckdns.org/api/auth/email-verify', {
        email,
        code: verificationCode,
      });

      if (response.data === 'EMAIL_AUTHORIZATION_SUCCESS') {
        setIsVerified(true);
        setVerificationMessage('인증이 성공적으로 완료되었습니다!');
      } else {
        setVerificationMessage('인증 코드가 유효하지 않습니다.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || '인증 확인 중 오류가 발생했습니다.';
      setVerificationMessage(errorMsg);
    }
  };

  // 비밀번호 재설정 API 호출
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !newPassword || !confirmPassword) {
      setErrorMessage({
        email: !email ? '이메일을 입력하세요.' : '',
        newPassword: !newPassword ? '새 비밀번호를 입력하세요.' : '',
        confirmPassword: !confirmPassword ? '새 비밀번호 확인을 입력하세요.' : '',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage((prev) => ({
        ...prev,
        confirmPassword: '비밀번호가 일치하지 않습니다.',
      }));
      return;
    }

    if (!isVerified) {
      setVerificationMessage('이메일 인증을 완료해주세요.');
      return;
    }

    try {
      const response = await axios.post('https://gachon-adore.duckdns.org/api/auth/reset-password', {
        email,
        newPassword,
        newPasswordConfirm: confirmPassword,
        emailVerify: true,
      });

      if (response.status === 200) {
        alert('비밀번호가 성공적으로 변경되었습니다.');
        setEmail('');
        setNewPassword('');
        setConfirmPassword('');
        setVerificationCode('');
        setEmailCheckMessage({ text: '', styleClass: '' });
        setVerificationMessage('');
        setIsVerified(false);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || '비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요.';
      setEmailCheckMessage({
        text: errorMsg,
        styleClass: 'error-message',
      });
    }
  };

  return (
    <div className="mypage-container">
      <MyPageSidebar />
      <div className="password-change">
        <h1>비밀번호 변경</h1>
        <form onSubmit={handleSubmit}>
          {/* 이메일 입력 */}
          <div className="password-change-input-group">
            <label>이메일</label>
            <div className="password-change-input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage((prev) => ({ ...prev, email: '' }));
                  setEmailCheckMessage({ text: '', styleClass: '' });
                  setVerificationMessage('');
                }}
                placeholder="이메일을 입력하세요"
                required
              />
              <button
                type="button"
                className="password-change-btn"
                onClick={handleSendVerificationCode}
              >
                인증 요청
              </button>
            </div>
            {emailCheckMessage.text && (
              <p className={emailCheckMessage.styleClass}>{emailCheckMessage.text}</p>
            )}
            {errorMessage.email && <p className="error-message">{errorMessage.email}</p>}
          </div>

          {/* 인증 코드 입력 */}
          {emailVerificationSent && (
            <div className="password-change-input-group">
              <label>인증 코드</label>
              <div className="password-change-input-group">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="인증 코드를 입력하세요"
                  required
                />
                <button
                  type="button"
                  className="password-change-btn"
                  onClick={handleVerifyCode}
                  disabled={isVerified}
                >
                  인증 확인
                </button>
              </div>
              {verificationMessage && (
                <p className={isVerified ? 'success-message' : 'error-message'}>
                  {verificationMessage}
                </p>
              )}
            </div>
          )}

          {/* 비밀번호 입력 */}
          <div className="password-change-input-group">
            <label>새 비밀번호</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setErrorMessage((prev) => ({ ...prev, newPassword: '' }));
              }}
              placeholder="새 비밀번호를 입력하세요"
              required
            />
            {errorMessage.newPassword && <p className="error-message">{errorMessage.newPassword}</p>}
          </div>

          <div className="password-change-input-group">
            <label>새 비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrorMessage((prev) => ({ ...prev, confirmPassword: '' }));
              }}
              placeholder="새 비밀번호를 다시 입력하세요"
              required
            />
            {errorMessage.confirmPassword && (
              <p className="error-message">{errorMessage.confirmPassword}</p>
            )}
          </div>

          {/* 버튼 */}
          <div className="password-change-actions">
            <button type="submit">변경</button>
            <button type="button" onClick={() => window.location.reload()}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChange;