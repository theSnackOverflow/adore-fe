import React, { useState, useEffect } from 'react';
import axiosInstance from '../../lib/axiosInstance';
import MyPageSidebar from '../Sidebars/MyPageSidebar';
import './PersonalInfoEdit.css';

// 쿠키에서 특정 이름의 값을 가져오는 함수
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const PersonalInfoEdit = () => {
  const [userId, setUserId] = useState(null); // 사용자 ID
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');

  const [editMode, setEditMode] = useState({
    email: false,
    name: false,
    nickname: false,
    birthdate: false,
  });

  // 사용자 ID와 초기 정보 로드
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = getCookie('accessToken');
        if (!token) throw new Error('로그인 토큰이 없습니다.');
  
        // JWT 토큰 요청
        const tokenResponse = await axiosInstance.get('/api/auth/token', { params: { token } });
        console.log('Token Response:', tokenResponse.data);
  
        const fetchedUserId = tokenResponse.data.memberId;
        setUserId(fetchedUserId);
  
        // 사용자 정보 API 호출
        const userResponse = await axiosInstance.get(`/api/user/my/${fetchedUserId}`);
        console.log('User Response:', userResponse.data);
  
        setEmail(userResponse.data.email || '');
        setName(userResponse.data.memberName || '');
        setNickname(userResponse.data.nickname || '');
        setBirthdate(userResponse.data.birthdate || '');
        setGender(userResponse.data.gender || '남성');
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error.response || error);
        alert('사용자 정보를 불러오는데 실패했습니다.');
      }
    };
  
    fetchUserInfo();
  }, []);

  const toggleEditMode = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSaveChanges = async () => {
    try {
      if (!userId) throw new Error('사용자 ID가 없습니다.');

      const updatedUserData = {
        name,
        nickname,
        email,
        birthdate,
        gender,
      };

      const response = await axiosInstance.patch(`/api/user/my/${userId}`, updatedUserData);

      if (response.status === 200) {
        alert('변경 사항이 저장되었습니다.');
        setEditMode({
          email: false,
          name: false,
          nickname: false,
          birthdate: false,
        });
      } else {
        throw new Error('저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('변경 사항 저장 실패:', error);
      alert(error.response?.data?.message || '변경 사항을 저장하지 못했습니다.');
    }
  };

  const handleCancel = () => {
    setEditMode({
      email: false,
      name: false,
      nickname: false,
      birthdate: false,
    });
  };

  return (
    <div className="mypage-container">
      <MyPageSidebar />
      <div className="personal-info-edit">
        <h1>개인정보 변경</h1>
        <ul>
          <li>
            <span className="label">이름</span>
            {editMode.name ? (
              <input
                type="text"
                className="input-value"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            ) : (
              <span className="value">{name}</span>
            )}
            <button onClick={() => toggleEditMode('name')}>
              {editMode.name ? '확인' : '이름 변경'}
            </button>
          </li>

          <li>
            <span className="label">닉네임</span>
            {editMode.nickname ? (
              <input
                type="text"
                className="input-value"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            ) : (
              <span className="value">{nickname}</span>
            )}
            <button onClick={() => toggleEditMode('nickname')}>
              {editMode.nickname ? '확인' : '닉네임 변경'}
            </button>
          </li>

          <li>
            <span className="label">아이디 (이메일)</span>
            {editMode.email ? (
              <input
                type="text"
                className="input-value"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            ) : (
              <span className="value">{email}</span>
            )}
            <button onClick={() => toggleEditMode('email')}>
              {editMode.email ? '확인' : '이메일 변경'}
            </button>
          </li>

          <li>
            <span className="label">생년월일</span>
            {editMode.birthdate ? (
              <input
                type="date"
                className="input-value"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
              />
            ) : (
              <span className="value">{birthdate}</span>
            )}
            <button onClick={() => toggleEditMode('birthdate')}>
              {editMode.birthdate ? '확인' : '생년월일 변경'}
            </button>
          </li>

          <li>
            <span className="label">성별</span>
            <select
              className="input-value"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="남성">남성</option>
              <option value="여성">여성</option>
              <option value="중성">중성</option>
            </select>
          </li>
        </ul>

        <div className="personalinfoeidt-action-buttons">
          <button onClick={handleSaveChanges}>저장</button>
          <button onClick={handleCancel}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoEdit;