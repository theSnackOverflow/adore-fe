import React, { useState } from 'react';
import axios from 'axios';
import UserManagementSidebar from '../../Sidebars/AdminSidebars/UserManagementSidebar';
import AlertModal from '../../Modals/AlertModal'; // AlertModal 임포트
import './UserRegistration.css';

const UserRegistration = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '', // Swagger 명세에 따라 추가
    birthdate: '',
    gender: '',
    inflow: '', // 유입경로 추가
    nickname: '', // 닉네임 추가
    state: 'ACTIVE', // 상태 추가 (기본값 설정)
    role: 'USER', // 역할 추가 (기본값 설정)
  });

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(''); // Alert 메시지 상태 추가

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleRegister = async () => {
    // 필수 항목 검사
    if (!userData.name || !userData.email || !userData.password || !userData.birthdate || !userData.nickname) {
      setAlertMessage("필수 항목을 모두 입력해주세요");
      setIsAlertModalOpen(true);
      return;
    }

    try {
      const response = await axios.post('/api/admin/user/create', userData);
      setAlertMessage('회원이 성공적으로 등록되었습니다!');
      setIsAlertModalOpen(true);
    } catch (error) {
      console.error('회원 등록 오류:', error);
      const errorMessage = error.response?.data?.message || '회원 등록 중 오류가 발생했습니다.';
      setAlertMessage(errorMessage);
      setIsAlertModalOpen(true);
    }
  };

  const handleCancel = () => {
    setAlertMessage("회원 등록을 취소했습니다");
    setIsAlertModalOpen(true);
  };

  const closeAlertModal = () => {
    setIsAlertModalOpen(false);
  };

  return (
    <div className="user-registration-container">
      <UserManagementSidebar />
      <div className="user-registration-content">
        <h1>회원 등록</h1>
        <div className="user-registration-form">
          <table className="user-registration-table">
            <tbody>
              <tr>
                <th>이름</th>
                <td>
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <th>이메일</th>
                <td>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <th>비밀번호</th>
                <td>
                  <input
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <th>생년월일</th>
                <td>
                  <input
                    type="date"
                    name="birthdate"
                    value={userData.birthdate}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <th>성별</th>
                <td>
                  <select
                    name="gender"
                    value={userData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="남성">남성</option>
                    <option value="여성">여성</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>닉네임</th>
                <td>
                  <input
                    type="text"
                    name="nickname"
                    value={userData.nickname}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <th>유입 경로</th>
                <td>
                  <input
                    type="text"
                    name="inflow"
                    value={userData.inflow}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="user-registration-buttons">
            <button onClick={handleRegister} className="user-registration-register-btn">등록</button>
            <button onClick={handleCancel} className="user-registration-cancel-btn">취소</button>
          </div>
        </div>
      </div>

      {isAlertModalOpen && (
        <AlertModal
          message={alertMessage}
          onClose={closeAlertModal}
        />
      )}
    </div>
  );
};

export default UserRegistration;