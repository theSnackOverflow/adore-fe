import React, { useState } from 'react';
import UserManagementSidebar from '../../Sidebars/AdminSidebars/UserManagementSidebar';
import AlertModal from '../../Modals/AlertModal';
import './UserInfoEdit.css';

const UserInfoEdit = () => {
  const [userData, setUserData] = useState({
    id: '', // 회원 번호
    name: '', // 이름
    email: '', // 이메일
    nickname: '', // 닉네임
    gender: '', // 성별
    inflow: '', // 유입경로
    birthDate: '', // 생년월일
    state: '', // 회원 상태
    role: '', // 역할 (USER, ADMIN 등)
    createdAt: '', // 가입일
    updatedAt: '', // 수정일
  });

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSave = () => {
    setAlertMessage('회원 정보가 성공적으로 저장되었습니다!');
    setIsAlertModalOpen(true);
  };

  const handleDelete = () => {
    setAlertMessage('회원 정보가 삭제되었습니다.');
    setIsAlertModalOpen(true);
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
                    name="id"
                    value={userData.id}
                    disabled
                    className="user-info-edit-disabled-input"
                  />
                </td>
              </tr>
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
                <th>이메일</th>
                <td>
                  <input
                    type="text"
                    name="email"
                    value={userData.email}
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
              <tr>
                <th>생년월일</th>
                <td>
                  <input
                    type="date"
                    name="birthDate"
                    value={userData.birthDate}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <th>회원 상태</th>
                <td>
                  <select
                    name="state"
                    value={userData.state}
                    onChange={handleInputChange}
                  >
                    <option value="ACTIVE">활성</option>
                    <option value="INACTIVE">비활성</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>회원 역할</th>
                <td>
                  <select
                    name="role"
                    value={userData.role}
                    onChange={handleInputChange}
                  >
                    <option value="USER">사용자</option>
                    <option value="ADMIN">관리자</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>가입일</th>
                <td>
                  <input
                    type="text"
                    name="createdAt"
                    value={userData.createdAt}
                    disabled
                    className="user-info-edit-disabled-input"
                  />
                </td>
              </tr>
              <tr>
                <th>수정일</th>
                <td>
                  <input
                    type="text"
                    name="updatedAt"
                    value={userData.updatedAt}
                    disabled
                    className="user-info-edit-disabled-input"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="user-info-edit-buttons">
            <button onClick={handleSave} className="user-info-edit-save-btn">
              저장
            </button>
            <button onClick={handleDelete} className="user-info-edit-delete-btn">
              삭제
            </button>
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

export default UserInfoEdit;