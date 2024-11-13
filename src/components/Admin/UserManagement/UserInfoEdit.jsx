// src/components/Admin/UserManagement/UserInfoEdit.jsx
import React, { useState } from 'react';
import UserManagementSidebar from '../../Sidebars/AdminSidebars/UserManagementSidebar';
import AlertModal from '../../Modals/AlertModal'; // AlertModal 임포트
import './UserInfoEdit.css';

const UserInfoEdit = () => {
  const [userData, setUserData] = useState({
    id: '1003',
    name: '홍길동',
    email: 'hong@domain.com',
    phone: '010-0000-0000',
    birthdate: '2000-10-09',
    gender: '남성',
    address: '',
  });
  
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(''); // 모달 메시지 상태 추가

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSave = () => {
    setAlertMessage("해당 회원 정보가 저장되었습니다!");
    setIsAlertModalOpen(true); // 저장 모달 열기
  };

  const handleDelete = () => {
    setAlertMessage("해당 회원 정보가 삭제되었습니다.");
    setIsAlertModalOpen(true); // 삭제 모달 열기
  };

  const closeAlertModal = () => {
    setIsAlertModalOpen(false);
  };

  return (
    <div className="user-info-edit-container">
      <UserManagementSidebar />
      <div className="user-info-edit-content">
        <h1>회원 정보 수정</h1>
        <div className="user-info-edit-form">
          <table className="user-info-edit-table">
            <tbody>
              <tr>
                <th>회원 번호</th>
                <td>
                  <input
                    type="text"
                    value={userData.id}
                    name="id"
                    disabled
                    className="user-info-edit-disabled-input"
                  />
                </td>
              </tr>
              <tr>
                <th>이름</th>
                <td>{userData.name}</td>
              </tr>
              <tr>
                <th>이메일</th>
                <td>{userData.email}</td>
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
                  <button className="user-info-edit-address-search-btn">검색</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="user-info-edit-buttons">
            <button onClick={handleSave} className="user-info-edit-save-btn">저장</button>
            <button onClick={handleDelete} className="user-info-edit-delete-btn">삭제</button>
          </div>
        </div>
      </div>

      {/* 저장 및 삭제 알림 모달 */}
      {isAlertModalOpen && (
        <AlertModal
          message={alertMessage} // 동적으로 설정된 메시지 표시
          onClose={closeAlertModal}
        />
      )}
    </div>
  );
};

export default UserInfoEdit;