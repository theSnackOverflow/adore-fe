// src/components/CustomerSupport/InquiryForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerSupportSidebar from '../Sidebars/CustomerSupportSidebar';
import './InquiryForm.css';

const InquiryForm = ({ addInquiry }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [showHoverPreview, setShowHoverPreview] = useState(false); // 이미지 확대 상태
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file);
      setImage(file);
      setImagePreviewUrl(previewUrl);
    } else {
      alert("이미지 파일만 업로드할 수 있습니다.");
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !category.trim() || !content.trim()) {
      alert('제목, 카테고리, 내용은 필수 입력 사항입니다.');
      return;
    }
    const newInquiry = {
      id: Date.now(),
      category,
      title,
      content,
      date: new Date().toISOString().split('T')[0],
    };
    addInquiry(newInquiry);
    alert('문의가 제출되었습니다.');
    navigate('/customersupport/inquirylist');
  };

  return (
    <div className="customer-support-container">
      <CustomerSupportSidebar />
      <div className="inquiry-form">
        <h1>문의하기</h1>
        <table className="inquiry-form-table">
          <tbody>
            <tr>
              <th>제목</th>
              <td>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="문의 제목을 입력하세요"
                />
              </td>
            </tr>
            <tr>
              <th>카테고리</th>
              <td>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">선택</option>
                  <option value="배송">배송</option>
                  <option value="제품">제품</option>
                  <option value="결제">결제</option>
                  <option value="기타">기타</option>
                </select>
              </td>
            </tr>
            <tr>
              <th>내용</th>
              <td>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="문의 내용을 입력하세요"
                />
              </td>
            </tr>
            <tr>
              <th>사진</th>
              <td>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreviewUrl && (
                  <div
                    className="inquiry-form-image-preview-container"
                    onMouseEnter={() => setShowHoverPreview(true)}
                    onMouseLeave={() => setShowHoverPreview(false)}
                  >
                    <img
                      src={imagePreviewUrl}
                      alt="이미지 미리보기"
                      className="inquiry-form-image-preview"
                    />
                    {showHoverPreview && (
                      <div className="inquiry-form-hover-preview">
                        <img src={imagePreviewUrl} alt="확대 이미지 미리보기" />
                      </div>
                    )}
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="inquiry-form-action-buttons">
          <button className="inquiry-form-submit-btn" onClick={handleSubmit}>작성</button>
          <button className="inquiry-form-cancel-btn" onClick={() => navigate('/customersupport/inquirylist')}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default InquiryForm;