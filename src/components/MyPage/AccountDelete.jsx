import React, { useState } from 'react';
import MyPageSidebar from '../Sidebars/MyPageSidebar';
import './AccountDelete.css';

const AccountDelete = () => {
  const [reason, setReason] = useState('');
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = () => {
    if (confirmText === '탈퇴') {
      alert('계정이 탈퇴되었습니다.');
    } else {
      alert('탈퇴 확인 문구를 정확히 입력해주세요.');
    }
  };

  const handleCancel = () => {
    setReason('');
    setConfirmText('');
  };

  return (
    <div className="mypage-container">
      <MyPageSidebar />
      <div className="account-delete">
        <h1>회원 탈퇴</h1>
        <div className="notice">
          <p>• 탈퇴 후 계정과 관련된 모든 데이터는 복구할 수 없습니다.</p>
          <p>• 탈퇴 후에는 다시 로그인할 수 없으며, 데이터 복구 요청이 불가능합니다.</p>
        </div>
        <div className="delete-reason">
          <h2>탈퇴 사유 선택 (필수)</h2>
          <ul>
            <li>
              <label><input type="checkbox" /> 서비스가 기대에 미치지 못함</label>
            </li>
            <li>
              <label><input type="checkbox" /> 더 이상 서비스를 이용하지 않음</label>
            </li>
            <li>
              <label><input type="checkbox" /> 개인정보 보호가 우려됨</label>
            </li>
            <li>
              <label><input type="checkbox" /> 서비스가 복잡하고 사용하기 어려움</label>
            </li>
            <li>
              <label>
                <input type="checkbox" /> 기타 (직접 입력)
                <input type="text" className="input-other" />
              </label>
            </li>
          </ul>
        </div>
        <div className="confirm-delete">
          <label>
            탈퇴 확인
            <input 
              type="text" 
              className="input-confirm" 
              value={confirmText} 
              onChange={(e) => setConfirmText(e.target.value)} 
              placeholder="탈퇴 확인 문구를 입력하세요"
            />
          </label>
          <p>* 탈퇴 버튼을 클릭하면 계정이 즉시 삭제되며, 복구가 불가능합니다.</p>
        </div>
        <div className="accountdelete-action-buttons">
          <button className="delete-button" onClick={handleDelete}>회원 탈퇴</button>
          <button className="cancel-button" onClick={handleCancel}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default AccountDelete;