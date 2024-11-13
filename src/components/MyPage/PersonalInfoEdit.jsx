// src/components/MyPage/PersonalInfoEdit.js
import React, { useState } from 'react';
import MyPageSidebar from '../Sidebars/MyPageSidebar';
import './PersonalInfoEdit.css';

const PersonalInfoEdit = () => {
  const [email, setEmail] = useState('1234@gmail.com');
  const [name, setName] = useState('홍길동');
  const [nickname, setNickname] = useState('길동이'); // 닉네임 추가
  const [phone, setPhone] = useState('010-1234-5678');
  const [birthdate, setBirthdate] = useState('1990-01-01');
  const [gender, setGender] = useState('남성');
  const [emailAlert, setEmailAlert] = useState(true);
  const [smsAlert, setSmsAlert] = useState(true);

  const [editMode, setEditMode] = useState({
    email: false,
    name: false,
    nickname: false, // 닉네임 편집 모드 추가
    phone: false,
    birthdate: false,
    emailVerification: false,
    phoneVerification: false,
  });

  const [verificationCode, setVerificationCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const toggleEditMode = (field) => {
    if (field === 'email') {
      setEditMode((prev) => ({ ...prev, email: !prev.email, phoneVerification: false }));
    } else if (field === 'phone') {
      setEditMode((prev) => ({ ...prev, phone: !prev.phone, emailVerification: false }));
    } else {
      setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
    }
  };

  const handleSendVerificationCode = (type) => {
    const generatedCode = '123456';
    setVerificationCode(generatedCode);
    alert(`인증 코드가 발송되었습니다: ${generatedCode}`);
    if (type === 'email') {
      setEditMode((prev) => ({ ...prev, emailVerification: true, phoneVerification: false }));
      setInputCode('');
    } else if (type === 'phone') {
      setEditMode((prev) => ({ ...prev, phoneVerification: true, emailVerification: false }));
      setInputCode('');
    }
  };

  const handleVerifyCode = () => {
    if (inputCode === verificationCode) {
      alert('인증이 완료되었습니다.');
      setEditMode({
        ...editMode,
        email: false,
        emailVerification: false,
        phone: false,
        phoneVerification: false,
      });
      setInputCode('');
    } else {
      alert('인증 코드가 올바르지 않습니다.');
    }
  };

  const handleSaveChanges = () => {
    alert('변경 사항이 저장되었습니다.');
    setEditMode({
      email: false,
      name: false,
      nickname: false, // 닉네임 편집 모드 초기화
      phone: false,
      birthdate: false,
      emailVerification: false,
      phoneVerification: false,
    });
  };

  const handleCancel = () => {
    setEditMode({
      email: false,
      name: false,
      nickname: false,
      phone: false,
      birthdate: false,
      emailVerification: false,
      phoneVerification: false,
    });
    setNewPhone('');
    setInputCode('');
  };

  return (
    <div className="mypage-container">
      <MyPageSidebar />
      <div className="personal-info-edit">
        <h1>개인정보 변경</h1>
        <ul>
          {/* 이름 */}
          <li>
            <span className="label">이름</span>
            <span className="value">{name}</span>
          </li>

          {/* 닉네임 */}
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

          {/* 이메일 변경 */}
          <li>
            <span className="label">아이디 (이메일)</span>
            {editMode.email ? (
              <>
                <input 
                  type="text" 
                  className="input-value"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
                <button onClick={() => handleSendVerificationCode('email')}>
                  인증 코드 발송
                </button>
              </>
            ) : (
              <span className="value">{email}</span>
            )}
            {!editMode.email && (
              <button onClick={() => toggleEditMode('email')}>
                이메일 변경
              </button>
            )}
          </li>
          {editMode.emailVerification && (
            <li>
              <span className="label">이메일 인증코드</span>
              <input 
                type="text" 
                className="input-value"
                value={inputCode} 
                onChange={(e) => setInputCode(e.target.value)} 
              />
              <button onClick={handleVerifyCode}>확인</button>
            </li>
          )}

          {/* 전화번호 변경 */}
          <li>
            <span className="label">전화번호</span>
            {editMode.phone ? (
              <>
                <input 
                  type="text" 
                  className="input-value"
                  value={newPhone} 
                  placeholder="새 전화번호 입력"
                  onChange={(e) => setNewPhone(e.target.value)} 
                />
                <button onClick={() => handleSendVerificationCode('phone')}>
                  인증번호 발송
                </button>
              </>
            ) : (
              <span className="value">{phone}</span>
            )}
            {!editMode.phone && (
              <button onClick={() => toggleEditMode('phone')}>
                전화번호 변경
              </button>
            )}
          </li>
          {editMode.phoneVerification && (
            <li>
              <span className="label">인증번호</span>
              <input 
                type="text" 
                className="input-value"
                value={inputCode} 
                onChange={(e) => setInputCode(e.target.value)} 
              />
              <button onClick={handleVerifyCode}>확인</button>
            </li>
          )}
          
          {/* 생년월일 */}
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
            <button onClick={() => toggleEditMode('birthdate')}>{editMode.birthdate ? '확인' : '생년월일 변경'}</button>
          </li>

          {/* 성별 */}
          <li>
            <span className="label">성별</span>
            <select 
              className="input-value gender-select"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="남성">남성</option>
              <option value="여성">여성</option>
              <option value="중성">중성</option>
            </select>
          </li>
        </ul>

        {/* 알림 설정 */}
        <h1>알림 설정</h1>
        <ul>
          <li>
            <span className="label">이메일 알림</span>
            <label>
              <input
                type="radio"
                checked={emailAlert}
                onChange={() => setEmailAlert(true)}
              /> on
            </label>
            <label>
              <input
                type="radio"
                checked={!emailAlert}
                onChange={() => setEmailAlert(false)}
              /> off
            </label>
          </li>
          <li>
            <span className="label">SMS 알림</span>
            <label>
              <input
                type="radio"
                checked={smsAlert}
                onChange={() => setSmsAlert(true)}
              /> on
            </label>
            <label>
              <input
                type="radio"
                checked={!smsAlert}
                onChange={() => setSmsAlert(false)}
              /> off
            </label>
          </li>
        </ul>
        
        {/* 저장 및 닫기 버튼 */}
        <div className="personalinfoeidt-action-buttons">
          <button onClick={handleSaveChanges}>변경</button>
          <button onClick={handleCancel}>닫기</button>
        </div>
       </div>
       </div>
     );
   };
   
   export default PersonalInfoEdit;