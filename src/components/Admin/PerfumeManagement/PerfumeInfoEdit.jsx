// src/components/Admin/PerfumeManagement/PerfumeInfoEdit.jsx
import React, { useState } from 'react';
import PerfumeManagementSidebar from '../../Sidebars/AdminSidebars/PerfumeManagementSidebar';
import './PerfumeInfoEdit.css';

const PerfumeInfoEdit = () => {
  const [perfumeData, setPerfumeData] = useState({
    name: '향수 이름',
    notes: ['노트1', '노트2', '노트3', '노트4'],
    brand: '',
    gender: '남성',
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

  const handleSave = () => {
    alert("저장되었습니다!");
    // 저장 로직 구현
  };

  const handleDelete = () => {
    alert("삭제되었습니다!");
    // 삭제 로직 구현
  };

  return (
    <div className="perfume-info-edit-container">
      <PerfumeManagementSidebar />
      <div className="perfume-info-edit-content">
        <h1>향수 정보 수정</h1>
        <div className="perfume-info-edit-form">
          <table className="perfume-info-edit-table">
            <tbody>
              <tr>
                <th>향수 이름</th>
                <td>
                  <input
                    type="text"
                    name="name"
                    value={perfumeData.name}
                    onChange={handleInputChange}
                    className="full-width-input"
                  />
                </td>
              </tr>
              <tr>
                <th>주요 노트</th>
                <td>
                  {perfumeData.notes.map((note, index) => (
                    <span key={index} className="perfume-note">{note}</span>
                  ))}
                </td>
              </tr>
              <tr>
                <th>브랜드</th>
                <td>
                  <input
                    type="text"
                    name="brand"
                    value={perfumeData.brand}
                    onChange={handleInputChange}
                    className="full-width-input"
                  />
                  <button className="perfume-info-edit-search-btn">검색</button>
                </td>
              </tr>
              <tr>
                <th>주 사용 성별</th>
                <td className="gender-options">
                  <label><input type="radio" name="gender" value="남성" onChange={handleInputChange} checked={perfumeData.gender === '남성'} /> 남성</label>
                  <label><input type="radio" name="gender" value="여성" onChange={handleInputChange} checked={perfumeData.gender === '여성'} /> 여성</label>
                  <label><input type="radio" name="gender" value="중성" onChange={handleInputChange} checked={perfumeData.gender === '중성'} /> 중성</label>
                </td>
              </tr>
              <tr>
                <th>무드</th>
                <td className="mood-options">
                  {['무드1', '무드2', '무드3', '무드4', '무드5'].map((mood, index) => (
                    <label key={index} className="mood-checkbox">
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
                  <select name="usage" value={perfumeData.usage} onChange={handleInputChange} className="full-width-input">
                    <option value="">선택</option>
                    <option value="일상">일상</option>
                    <option value="특별한 날">특별한 날</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="perfume-info-edit-buttons">
            <button onClick={handleSave} className="perfume-info-edit-save-btn">저장</button>
            <button onClick={handleDelete} className="perfume-info-edit-delete-btn">삭제</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfumeInfoEdit;