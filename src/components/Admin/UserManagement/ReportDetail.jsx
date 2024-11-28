import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // useParams로 URL의 reportId 가져오기
import UserManagementSidebar from '../../Sidebars/AdminSidebars/UserManagementSidebar';
import axiosInstance from '../../../lib/axiosInstance';
import AlertModal from '../../Modals/AlertModal'; // AlertModal 임포트
import './ReportDetail.css';

const ReportDetail = () => {
  const { reportId } = useParams(); // URL에서 reportId 가져오기
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
  const [loading, setLoading] = useState(false);
  const [penaltyLevel, setPenaltyLevel] = useState('LOW');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(''); // Alert 메시지 상태 추가
  const [error, setError] = useState('');

  // 신고 조회 API 호출
  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/admin/report/', {
        params: { id: reportId },
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

  const handlePenaltyChange = (e) => {
    setPenaltyLevel(e.target.value);
  };

  const handleSave = () => {
    setAlertMessage('신고가 성공적으로 저장되었습니다!');
    setIsAlertModalOpen(true); // AlertModal 열기
  };

  const handleDelete = async () => {
    console.log(penaltyLevel);
    if (penaltyLevel === 'NONE') {
      return;
    }
    try {
      setLoading(true);
      await axiosInstance.post('/api/admin/report/process', null, {
        params: { id: reportData.id, penaltyLevel },
      });
      setAlertMessage('신고가 삭제되었습니다.');
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
    fetchReportData(); // 컴포넌트가 마운트될 때 신고 데이터 로드
  }, [reportId]);

  return (
    <div className="report-detail-container">
      <UserManagementSidebar />
      <div className="report-detail-content">
        <h1>신고 상세 조회 및 처리</h1>
        {error && <p className="error-message">{error}</p>} {/* 오류 메시지 출력 */}
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
                  <td>
                    {reportData.reporterName} ({reportData.reporterEmail})
                  </td>
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
                  <th>페널티 부여</th>
                  <td>
                    <select
                      name="level"
                      value={penaltyLevel}
                      onChange={handlePenaltyChange}
                    >
                      <option value="HIGH">블랙리스트</option>
                      <option value="MIDDLE">7일</option>
                      <option value="LOW">1일</option>
                      <option value="NONE">부여 안 함</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="report-detail-buttons">
              <button onClick={handleSave} className="report-detail-save-btn">
                저장
              </button>
              <button onClick={handleDelete} className="report-detail-delete-btn">
                삭제
              </button>
            </div>
          </div>
        )}
      </div>

      {isAlertModalOpen && (
        <AlertModal message={alertMessage} onClose={closeAlertModal} />
      )}
    </div>
  );
};

export default ReportDetail;
