import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerSupportSidebar from '../Sidebars/CustomerSupportSidebar';
import './InquiryForm.css';
import { getCookie } from '../../lib/CookieUtil';

const InquiryForm = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null); // 이미지 처리는 나중 추가 가능
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title.trim() || !category.trim() || !content.trim()) {
      alert('제목, 카테고리, 내용은 필수 입력 사항입니다.');
      return;
    }

    const token = getCookie('accessToken'); // 인증 토큰을 로컬 스토리지에서 가져옴
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    const requestData = {
      title,
      category,
      content,
    };

    try {
      const response = await fetch(`http://gachon-adore.duckdns.org:8111/api/user/my/question/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // 토큰 추가
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        alert('문의가 성공적으로 제출되었습니다.');
        navigate('/customersupport/inquirylist');
      } else {
        const errorData = await response.json();
        alert(`문의 제출에 실패했습니다: ${errorData.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('문의 제출 중 오류 발생:', error);
      alert('서버와 통신 중 문제가 발생했습니다.');
    }
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
                  <option value="USER">회원</option>
                  <option value="SERVICE">서비스</option>
                  <option value="REVIEW">리뷰</option>
                  <option value="COMMENT">댓글</option>
                  <option value="ETC">기타</option>
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
          </tbody>
        </table>
        <div className="inquiry-form-action-buttons">
          <button className="inquiry-form-submit-btn" onClick={handleSubmit}>작성</button>
          <button
            className="inquiry-form-cancel-btn"
            onClick={() => navigate('/customersupport/inquirylist')}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default InquiryForm;
