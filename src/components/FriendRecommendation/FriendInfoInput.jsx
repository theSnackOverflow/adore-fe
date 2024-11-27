// src/components/FriendRecommendation/FriendInfoInput.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCookie } from '../../lib/CookieUtil';
import FriendRecommendationSidebar from '../Sidebars/FriendRecommendationSidebar';
import AlertModal from '../Modals/AlertModal';
import './FriendInfoInput.css';

const FriendInfoInput = () => {

  const gatewayURL = import.meta.env.VITE_GATEWAY_URL;
  const instance = axios.create({
    baseURL: gatewayURL
  });
  
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    age: '',
    notes: [],
    character: '',
    price: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleNoteSelection = (note) => {
    setFormData(prevState => {
      const { notes } = prevState;

      if (notes.length >= 6 && !notes.includes(note)) {
        setAlertMessage("최대 6개까지 선택할 수 있습니다.");
        setIsAlertModalOpen(true);
        return prevState;
      }

      return {
        ...prevState,
        notes: notes.includes(note) ? notes.filter(n => n !== note) : [...notes, note]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 필수 항목들이 채워져 있는지 확인
    const { name, gender, age, notes, character, price } = formData;
    if (!name || !gender || !age || notes.length !== 6 || !character || !price) {
      setAlertMessage("필수 항목들을 모두 입력해주세요!");
      setIsAlertModalOpen(true);
      return;
    }
    const body = {
      name: name,
      gender: gender,
      age: parseInt(age, 10),
      notes: notes.map(note => ({ noteName: note })),
      character: character,
      price: parseInt(price, 10)
    };
    console.log("친구 정보 : ", body);

    const token = getCookie('accessToken');
      if (!token) {
        throw new Error('로그인 토큰이 없습니다.');
      }
    const header = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    // 서버에 데이터 전송
    try {
      const response = await instance.post('/api/user/recomm/friend', body, header);
      console.log("저장 및 추천 요청 성공: ", response.data);
      navigate('/friendrecommendation/friendresult', { deliverId: response.data.id});  // 결과 페이지로 이동
    } catch (error) {
      console.error("저장 및 추천 요청 실패: ", error);
      throw new Error('저장 및 추천 요청에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    setAlertMessage("입력이 취소되었습니다 🥲");
    setIsAlertModalOpen(true);
  };

  const closeAlertModal = () => {
    setIsAlertModalOpen(false);
    setAlertMessage("");
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
                  placeholder='이름을 입력해주세요.'
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
                  <option value="">선택해주세요</option>
                  <option value="MEN">남성</option>
                  <option value="WOMEN">여성</option>
                  <option value="UNISEX">중성</option>
                </select>
              </td>
            </tr>
            <tr>
              <th>나이</th>
              <td>
                <input
                  type="text"
                  name="age"
                  placeholder='숫자만 입력해주세요.'
                  value={formData.age}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <th>추천노트(6개)</th>
              <td>
                <div className="friend-info-checkbox-group">
                  {['apple', 'lemon', 'floral notes', 'rose', 'jasmine', 'green notes', 'coffee', 'spicy notes', 'butter', 'woody notes', 'mint', 'musk'].map((note) => (
                    <label key={note}>
                      <input
                        type="checkbox"
                        value={note}
                        checked={formData.notes.includes(note)}
                        onChange={() => handleNoteSelection(note)}
                      />
                      {note}
                    </label>
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <th>성격</th>
              <td>
                <select
                  name="character"
                  value={formData.character}
                  onChange={handleInputChange}
                >
                  <option value="">선택해주세요</option>
                  <option value="ENERGETIC">활동적</option>
                  <option value="CALM">차분함</option>
                  <option value="EMOTIONAL">감성적</option>
                  <option value="INTELLECTUAL">지적인</option>
                  <option value="INDEPENDENT">독립적</option>
                  <option value="CHEERFUL">유쾌한</option>
                </select>
              </td>
            </tr>
            <tr>
              <th>가격대</th>
              <td>
                <select
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                >
                  <option value="">선택해주세요</option>
                  <option value={50000}>10만원 미만(5만원 대)</option>
                  <option value={100000}>10만원 대</option>
                  <option value={200000}>20만원 대</option>
                  <option value={300000}>30만원 대</option>
                  <option value={400000}>40만원 대</option>
                  <option value={500000}>50만원 대</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="friend-info-form-buttons">
          <button type="button" onClick={handleSubmit}>
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