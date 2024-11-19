import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // 전달된 state를 받기 위해 사용
import axios from 'axios';
import UserManagementSidebar from '../../Sidebars/AdminSidebars/UserManagementSidebar';
import AlertModal from '../../Modals/AlertModal';
import './UserInfoEdit.css';

const UserInfoEdit = () => {
  const location = useLocation(); // useLocation을 사용해 전달된 state를 가져옴
  const userIdFromState = location.state?.userId || ''; // 전달된 userId
  const [userId, setUserId] = useState(userIdFromState); // 검색할 회원 번호
  const [userData, setUserData] = useState({
    id: '',
    name: '',
    email: '',
    nickname: '',
    gender: '',
    inflow: '',
    birthDate: '',
    state: '',
    role: '',
    createdAt: '',
    updatedAt: '',
  });

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // 회원 데이터를 불러오는 함수
  const fetchUserData = async (id) => {
    try {
      const response = await axios.get(
        `http://gachon-adore.duckdns.org:8111/api/admin/user/?id=${id}`
      );
      if (response.status === 200) {
        const data = response.data;
        setUserData({
          id: data.id || '',
          name: data.name || '',
          email: data.email || '',
          nickname: data.nickname || '',
          gender: data.gender || '',
          inflow: data.inflow || '',
          birthDate: data.birthDate || '',
          state: data.state || '',
          role: data.role || '',
          createdAt: data.createdAt || '',
          updatedAt: data.updatedAt || '',
        });
        setAlertMessage(`회원 번호 ${id}의 정보를 불러왔습니다.`);
        setIsAlertModalOpen(true);
      }
    } catch (error) {
      console.error(error);
      setAlertMessage('회원 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.');
      setIsAlertModalOpen(true);
    }
  };

  useEffect(() => {
    if (userIdFromState) {
      fetchUserData(userIdFromState); // 전달된 userId가 있을 경우 바로 데이터 호출
    }
  }, [userIdFromState]);

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  const handleSearch = () => {
    if (userId) {
      fetchUserData(userId);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.patch(
        `http://gachon-adore.duckdns.org:8111/api/admin/user/update?id=${userData.id}`,
        {
          name: userData.name,
          email: userData.email,
          nickname: userData.nickname,
          gender: userData.gender,
          inflow: userData.inflow,
          birthDate: userData.birthDate,
          state: userData.state,
          role: userData.role,
        }
      );
      if (response.status === 200) {
        setAlertMessage('회원 정보가 성공적으로 수정되었습니다.');
        setIsAlertModalOpen(true);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data.message) {
        setAlertMessage(`수정 실패: ${error.response.data.message}`);
      } else {
        setAlertMessage('회원 정보를 수정하는 데 실패했습니다. 다시 시도해주세요.');
      }
      setIsAlertModalOpen(true);
    }
  };

  const handleDelete = async () => {
    if (!userData.id) {
      setAlertMessage('삭제할 사용자를 먼저 조회해주세요.');
      setIsAlertModalOpen(true);
      return;
    }

    const confirmDelete = window.confirm(`회원 번호 ${userData.id}를 삭제하시겠습니까?`);
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://gachon-adore.duckdns.org:8111/api/admin/user/delete?id=${userData.id}`
      );
      if (response.status === 200) {
        setAlertMessage('회원 정보가 성공적으로 삭제되었습니다.');
        setUserData({
          id: '',
          name: '',
          email: '',
          nickname: '',
          gender: '',
          inflow: '',
          birthDate: '',
          state: '',
          role: '',
          createdAt: '',
          updatedAt: '',
        });
        setIsAlertModalOpen(true);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data.message) {
        setAlertMessage(`삭제 실패: ${error.response.data.message}`);
      } else {
        setAlertMessage('회원 정보를 삭제하는 데 실패했습니다. 다시 시도해주세요.');
      }
      setIsAlertModalOpen(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
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
                  <div className="user-info-search-bar">
                    <input
                      type="text"
                      placeholder="회원 번호 입력"
                      value={userId}
                      onChange={handleUserIdChange}
                    />
                    <button onClick={handleSearch} className="user-info-search-btn">
                      조회
                    </button>
                  </div>
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
              수정
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