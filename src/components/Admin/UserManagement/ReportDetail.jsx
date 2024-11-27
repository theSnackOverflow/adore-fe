import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserManagementSidebar from '../../Sidebars/AdminSidebars/UserManagementSidebar';
import axiosInstance from '../../../lib/axiosInstance';
import AlertModal from '../../Modals/AlertModal'; // AlertModal 임포트
import './ReportDetail.css';

const ReportDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [reportIdInput, setReportIdInput] = useState('');
  const [reportData, setReportData] = useState({
    title: '',
    content: '',
    reporterName: '',
    reporterEmail: '',
    targetName: '',
    targetEmail: '',
    category: '',
    state: '',
    createdDate: '',
    updatedDate: '',
    response: '',
    memo: '',
    canProcess: false,
  });
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(''); // Alert 메시지 상태 추가
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 신고 조회 API 호출
  const fetchReportData = async (id) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/admin/report/', {
        params: { id },
      });
      setReportData(response.data); // API 응답 데이터로 상태 업데이트
      setError('');
    } catch (error) {
      setError('신고 내용을 가져오는 데 실패했습니다.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (reportIdInput) {
      fetchReportData(reportIdInput); // 신고 ID로 조회
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData({ ...reportData, [name]: value });
  };

  const handleSave = () => {
    setAlertMessage("신고가 성공적으로 저장되었습니다!");
    setIsAlertModalOpen(true); // AlertModal 열기
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/api/admin/report/process', null, {
        params: { id: reportData.id },
      });
      setAlertMessage("신고가 삭제되었습니다.");
      setIsAlertModalOpen(true);
      setError('');
    } catch (error) {
      setError('신고 삭제에 실패했습니다.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const closeAlertModal = () => {
    setIsAlertModalOpen(false);
  };

  useEffect(() => {
    if (reportIdInput) {
      fetchReportData(reportIdInput); // 컴포넌트가 마운트될 때 신고 데이터 로드
    }
  }, [reportIdInput]);

  return (
    <div className="report-detail-container">
      <UserManagementSidebar />
      <div className="report-detail-content">
        <div className="report-detail-header">
          <h1>신고 상세 조회 및 처리</h1>
          {/* 신고 ID 입력하여 검색하는 부분 */}
          <div className="report-detail-search-bar">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="신고 ID 입력"
                value={reportIdInput}
                onChange={(e) => setReportIdInput(e.target.value)}
              />
              <button type="submit">검색</button>
            </form>
          </div>
          {error && <p className="error-message">{error}</p>} {/* 오류 메시지 출력 */}
        </div>
        {loading ? (
          <div className="loading-spinner">
            <p>로딩 중...</p>
          </div>
        ) : (
          <div className="report-detail-form">
            <table className="report-detail-table">
              <tbody>
                <tr>
                  <th>신고자</th>
                  <td>{reportData.reporterName} ({reportData.reporterEmail})</td>
                </tr>
                <tr>
                  <th>제목</th>
                  <td>{reportData.title}</td>
                </tr>
                <tr>
                  <th>작성 날짜</th>
                  <td>{new Date(reportData.createdDate).toLocaleString()}</td>
                </tr>
                <tr>
                  <th>카테고리</th>
                  <td>{reportData.category}</td>
                </tr>
                <tr>
                  <th>신고 내용</th>
                  <td>{reportData.content}</td>
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
                      name="state"
                      value={reportData.state}
                      onChange={handleInputChange}
                    >
                      <option value="WAIT">대기</option>
                      <option value="PROCESSING">처리 중</option>
                      <option value="COMPLETED">처리 완료</option>
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
        )}
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