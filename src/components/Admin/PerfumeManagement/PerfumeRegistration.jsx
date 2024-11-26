import React, { useState } from 'react';
import axiosInstance from '../../../lib/axiosInstance';
import PerfumeManagementSidebar from '../../Sidebars/AdminSidebars/PerfumeManagementSidebar';
import './PerfumeRegistration.css';

const PerfumeRegistration = () => {
  const [perfumeData, setPerfumeData] = useState({
    name: '',
    notes: '',
    brand: '',
    gender: '',
    season: '',
    price: '',
    perfumePhoto: null,
    base: '',
    top: '',
    middle: '',
    country: '',
    description: '',
  });

  // Handle input changes for text inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPerfumeData({ ...perfumeData, [name]: value });
  };

  // Handle file changes (image upload)
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setPerfumeData({ ...perfumeData, [name]: files[0] });
  };

  // Handle the perfume registration process
  const handleRegister = async () => {
    // 필수 항목 체크
    if (!perfumeData.name || !perfumeData.price || !perfumeData.perfumePhoto || !perfumeData.brand) {
      alert('향수 이름, 가격, 브랜드, 그리고 사진은 필수입니다!');
      return;
    }
  
    // 가격을 정수로 변환
    const price = parseInt(perfumeData.price, 10);
    if (isNaN(price)) {
      alert('가격은 숫자여야 합니다!');
      return;
    }
  
    // FormData 객체에 필드 추가
    const formData = new FormData();
    formData.append('name', perfumeData.name);
    formData.append('notes', perfumeData.notes);
    formData.append('brand', perfumeData.brand);
    formData.append('gender', perfumeData.gender);
    formData.append('season', perfumeData.season);
    formData.append('price', price); // 가격을 숫자로 변환하여 추가
    formData.append('perfumePhoto', perfumeData.perfumePhoto);
    formData.append('base', perfumeData.base);
    formData.append('top', perfumeData.top);
    formData.append('middle', perfumeData.middle);
    formData.append('country', perfumeData.country);
    formData.append('description', perfumeData.description);
  
    console.log('Sending request with the following data:', perfumeData); // 디버깅용 로그
  
    try {
      const response = await axiosInstance.post('/api/admin/perfume/create', formData);
      console.log('Response received:', response.data); // 디버깅용 로그
      alert('향수가 등록되었습니다!');
    } catch (error) {
      console.error('Error registering perfume:', error.response ? error.response.data : error.message); // 디버깅용 로그
      alert('향수 등록에 실패했습니다.');
    }
  };

  // Handle cancellation of the registration
  const handleCancel = () => {
    // 입력된 데이터 초기화
    setPerfumeData({
      name: '',
      notes: '',
      brand: '',
      gender: '',
      season: '',
      price: '',
      perfumePhoto: null,
      base: '',
      top: '',
      middle: '',
      country: '',
      description: '',
    });

    alert('향수 등록이 취소되었습니다!');
    
    // 화면 새로고침
    window.location.reload();
  };

  return (
    <div className="perfume-registration-container">
      <PerfumeManagementSidebar />
      <div className="perfume-registration-content">
        <h1>향수 정보 등록</h1>
        <div className="perfume-registration-form">
          <table className="perfume-registration-table">
            <tbody>
              {/* Inputs for the form */}
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
                <th>주 사용 성별</th>
                <td className="gender-options">
                  <label><input type="radio" name="gender" value="남성" onChange={handleInputChange} /> 남성</label>
                  <label><input type="radio" name="gender" value="여성" onChange={handleInputChange} /> 여성</label>
                  <label><input type="radio" name="gender" value="중성" onChange={handleInputChange} /> 중성</label>
                </td>
              </tr>
              <tr>
                <th>계절</th>
                <td>
                  <input
                    type="text"
                    name="season"
                    placeholder="계절"
                    value={perfumeData.season}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <th>가격</th>
                <td>
                  <input
                    type="text"
                    name="price"
                    placeholder="가격"
                    value={perfumeData.price}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <th>향수 사진</th>
                <td>
                  <input
                    type="file"
                    name="perfumePhoto"
                    onChange={handleFileChange}
                  />
                </td>
              </tr>
              <tr>
                <th>브랜드</th>
                <td>
                  <input
                    type="text"
                    name="brand"
                    placeholder="브랜드"
                    value={perfumeData.brand}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <th>베이스 노트</th>
                <td>
                  <input
                    type="text"
                    name="base"
                    placeholder="베이스 노트"
                    value={perfumeData.base}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <th>탑 노트</th>
                <td>
                  <input
                    type="text"
                    name="top"
                    placeholder="탑 노트"
                    value={perfumeData.top}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <th>미들 노트</th>
                <td>
                  <input
                    type="text"
                    name="middle"
                    placeholder="미들 노트"
                    value={perfumeData.middle}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <th>국가</th>
                <td>
                  <input
                    type="text"
                    name="country"
                    placeholder="국가"
                    value={perfumeData.country}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <th>설명</th>
                <td>
                  <textarea
                    name="description"
                    placeholder="설명"
                    value={perfumeData.description}
                    onChange={handleInputChange}
                  />
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