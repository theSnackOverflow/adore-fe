// src/components/Admin/UserManagement/UserRegistration.jsx
import React, { useState } from 'react';
import UserManagementSidebar from '../../Sidebars/AdminSidebars/UserManagementSidebar';
import AlertModal from '../../Modals/AlertModal'; // AlertModal 임포트
import './UserRegistration.css';

const UserRegistration = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    birthdate: '',
    gender: '남성',
    address: '',
  });

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(''); // Alert 메시지 상태 추가

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleRegister = () => {
    // 필수 항목 검사
    if (!userData.name || !userData.email || !userData.phone || !userData.birthdate || !userData.address) {
      setAlertMessage("필수 항목을 모두 입력해주세요");
      setIsAlertModalOpen(true);
    } else {
      setAlertMessage("회원이 성공적으로 등록되었습니다!");
      setIsAlertModalOpen(true);
      // 등록 로직 추가 가능
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
                <th>전화번호</th>
                <td>
                  <input
                    type="text"
                    name="phone"
                    value={userData.phone}
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
                <th>주소</th>
                <td>
                  <input
                    type="text"
                    name="address"
                    value={userData.address}
                    onChange={handleInputChange}
                  />
                  <button className="user-registration-address-search-btn">검색</button>
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