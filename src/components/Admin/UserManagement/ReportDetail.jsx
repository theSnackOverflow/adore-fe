// src/components/Admin/ReportManagement/ReportDetail.jsx
import React, { useState } from 'react';
import UserManagementSidebar from '../../Sidebars/AdminSidebars/UserManagementSidebar';
import AlertModal from '../../Modals/AlertModal'; // AlertModal 임포트
import './ReportDetail.css';

const ReportDetail = () => {
  const [reportData, setReportData] = useState({
    reporter: '관리자2',
    title: '댓글 내용 신고',
    date: '2024-10-05',
    category: 'A',
    content: '신고 내용 예시입니다.',
    response: '',
    memo: '',
    status: '처리 중',
  });

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(''); // Alert 메시지 상태 추가

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData({ ...reportData, [name]: value });
  };

  const handleSave = () => {
    setAlertMessage("신고가 성공적으로 저장되었습니다!");
    setIsAlertModalOpen(true); // AlertModal 열기
  };

  const handleDelete = () => {
    setAlertMessage("신고가 삭제되었습니다.");
    setIsAlertModalOpen(true); // AlertModal 열기
  };

  const closeAlertModal = () => {
    setIsAlertModalOpen(false);
  };

  return (
    <div className="report-detail-container">
      <UserManagementSidebar />
      <div className="report-detail-content">
        <h1>신고 상세 조회 및 처리</h1>
        <div className="report-detail-form">
          <table className="report-detail-table">
            <tbody>
              <tr>
                <th>신고자</th>
                <td>{reportData.reporter}</td>
              </tr>
              <tr>
                <th>제목</th>
                <td>{reportData.title}</td>
              </tr>
              <tr>
                <th>작성 날짜</th>
                <td>{reportData.date}</td>
              </tr>
              <tr>
                <th>카테고리</th>
                <td>
                  <input
                    type="text"
                    name="category"
                    value={reportData.category}
                    disabled
                    className="report-detail-disabled-input"
                  />
                </td>
              </tr>
              <tr>
                <th>신고 내용</th>
                <td>
                  <textarea
                    name="content"
                    value={reportData.content}
                    readOnly
                    className="report-detail-readonly-textarea"
                  />
                </td>
              </tr>
              <tr>
                <th>답변</th>
                <td>
                  <textarea
                    name="response"
                    value={reportData.response}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <th>처리 메모</th>
                <td>
                  <textarea
                    name="memo"
                    value={reportData.memo}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <th>처리 상태</th>
                <td>
                  <select
                    name="status"
                    value={reportData.status}
                    onChange={handleInputChange}
                  >
                    <option value="처리 중">처리 중</option>
                    <option value="처리 완료">처리 완료</option>
                    <option value="미처리">미처리</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="report-detail-buttons">
            <button onClick={handleSave} className="report-detail-save-btn">저장</button>
            <button onClick={handleDelete} className="report-detail-delete-btn">삭제</button>
          </div>
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

export default ReportDetail;