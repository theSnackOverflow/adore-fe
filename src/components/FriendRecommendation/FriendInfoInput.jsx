// src/components/FriendRecommendation/FriendInfoInput.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FriendRecommendationSidebar from '../Sidebars/FriendRecommendationSidebar';
import AlertModal from '../Modals/AlertModal';
import './FriendInfoInput.css';

const FriendInfoInput = () => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '남성',
    ageRange: '20대',
    favoriteNotes: '',
    personality: [],
    usagePurpose: [],
    priceRange: '10만원 대',
  });

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e, category) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [category]: prevData[category].includes(value)
        ? prevData[category].filter((item) => item !== value)
        : [...prevData[category], value],
    }));
  };

  const handleRecommendation = () => {
    if (
      !formData.name ||
      !formData.favoriteNotes ||
      formData.personality.length === 0 ||
      formData.usagePurpose.length === 0
    ) {
      setAlertMessage("필수 항목들을 모두 입력해주세요!");
      setIsAlertModalOpen(true);
    } else {
      navigate('/friendrecommendation/friendresult'); // FriendResult 페이지로 이동
    }
  };

  const handleCancel = () => {
    setAlertMessage("입력이 취소되었습니다 🥲");
    setIsAlertModalOpen(true);
  };

  const closeAlertModal = () => {
    setIsAlertModalOpen(false);
  };

  return (
    <div className="friend-info-input-container">
      <FriendRecommendationSidebar />
      <div className="friend-info-input-content">
        <h1>친구 정보 입력</h1>
        <table className="friend-info-input-table">
          <tbody>
            <tr>
              <th>이름</th>
              <td>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <th>성별</th>
              <td>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="남성">남성</option>
                  <option value="여성">여성</option>
                </select>
              </td>
            </tr>
            <tr>
              <th>연령대</th>
              <td>
                <select
                  name="ageRange"
                  value={formData.ageRange}
                  onChange={handleInputChange}
                >
                  <option value="10대">10대</option>
                  <option value="20대">20대</option>
                  <option value="30대">30대</option>
                  <option value="40대">40대</option>
                  <option value="50대 이상">50대 이상</option>
                </select>
              </td>
            </tr>
            <tr>
              <th>선호 노트</th>
              <td>
                <div className="friend-info-search-bar">
                  <input
                    type="text"
                    placeholder="노트 검색"
                    name="favoriteNotes"
                    value={formData.favoriteNotes}
                    onChange={handleInputChange}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th>성격</th>
              <td>
                <div className="friend-info-checkbox-group">
                  {['활동적', '차분함', '감성적', '지적인', '독립적', '유쾌한', '계획적'].map((trait) => (
                    <label key={trait}>
                      <input
                        type="checkbox"
                        value={trait}
                        checked={formData.personality.includes(trait)}
                        onChange={(e) => handleCheckboxChange(e, 'personality')}
                      />
                      {trait}
                    </label>
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <th>사용 목적</th>
              <td>
                <div className="friend-info-checkbox-group">
                  {['일상용', '데이트용', '파티용'].map((purpose) => (
                    <label key={purpose}>
                      <input
                        type="checkbox"
                        value={purpose}
                        checked={formData.usagePurpose.includes(purpose)}
                        onChange={(e) => handleCheckboxChange(e, 'usagePurpose')}
                      />
                      {purpose}
                    </label>
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <th>가격대</th>
              <td>
                <select
                  name="priceRange"
                  value={formData.priceRange}
                  onChange={handleInputChange}
                >
                  <option value="5만원 대">5만원 대</option>
                  <option value="10만원 대">10만원 대</option>
                  <option value="20만원 대">20만원 대</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="friend-info-form-buttons">
          <button type="button" onClick={handleRecommendation}>
            추천 받기
          </button>
          <button type="button" onClick={handleCancel}>
            취소
          </button>
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

export default FriendInfoInput;