
// src/components/Admin/PerfumeManagement/PerfumeRegistration.jsx
import React, { useState } from 'react';
import PerfumeManagementSidebar from '../../Sidebars/AdminSidebars/PerfumeManagementSidebar';
import './PerfumeRegistration.css';

const PerfumeRegistration = () => {
  const [perfumeData, setPerfumeData] = useState({
    name: '',
    notes: '',
    brand: '',
    gender: '',
    mood: [],
    usage: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPerfumeData({ ...perfumeData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPerfumeData((prevState) => ({
      ...prevState,
      mood: checked
        ? [...prevState.mood, name]
        : prevState.mood.filter((mood) => mood !== name),
    }));
  };

  const handleRegister = () => {
    alert("향수가 등록되었습니다!");
    // 등록 로직 구현
  };

  const handleCancel = () => {
    alert("향수 등록이 취소되었습니다!");
    // 취소 로직 구현
  };

  return (
    <div className="perfume-registration-container">
      <PerfumeManagementSidebar />
      <div className="perfume-registration-content">
        <h1>향수 정보 등록</h1>
        <div className="perfume-registration-form">
          <table className="perfume-registration-table">
            <tbody>
              <tr>
                <th>향수 이름</th>
                <td>
                  <input
                    type="text"
                    name="name"
                    placeholder="향수 이름"
                    value={perfumeData.name}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <th>주요 노트</th>
                <td>
                  <input
                    type="text"
                    name="notes"
                    placeholder="노트 검색"
                    value={perfumeData.notes}
                    onChange={handleInputChange}
                  />
                  <button className="perfume-registration-search-btn">검색</button>
                </td>
              </tr>
              <tr>
                <th>브랜드</th>
                <td>
                  <input
                    type="text"
                    name="brand"
                    placeholder="브랜드 검색"
                    value={perfumeData.brand}
                    onChange={handleInputChange}
                  />
                  <button className="perfume-registration-search-btn">검색</button>
                </td>
              </tr>
              <tr>
                <th>주 사용 성별</th>
                <td className="gender-options">
                  <label><input type="radio" name="gender" value="남성" onChange={handleInputChange} /> 남성</label>
                  <label><input type="radio" name="gender" value="여성" onChange={handleInputChange} /> 여성</label>
                  <label><input type="radio" name="gender" value="중성" onChange={handleInputChange} /> 중성</label>
                </td>
              </tr>
              <tr>
                <th>무드</th>
                <td className="mood-options">
                  {['무드1', '무드2', '무드3', '무드4', '무드5'].map((mood, index) => (
                    <label key={index}>
                      <input
                        type="checkbox"
                        name={mood}
                        checked={perfumeData.mood.includes(mood)}
                        onChange={handleCheckboxChange}
                      />
                      {mood}
                    </label>
                  ))}
                </td>
              </tr>
              <tr>
                <th>주 사용 상황</th>
                <td>
                  <select name="usage" value={perfumeData.usage} onChange={handleInputChange}>
                    <option value="">선택</option>
                    <option value="일상">일상</option>
                    <option value="특별한 날">특별한 날</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="perfume-registration-buttons">
            <button onClick={handleRegister} className="perfume-registration-register-btn">등록</button>
            <button onClick={handleCancel} className="perfume-registration-cancel-btn">취소</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfumeRegistration;