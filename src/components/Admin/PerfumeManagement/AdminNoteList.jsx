import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PerfumeManagementSidebar from '../../Sidebars/AdminSidebars/PerfumeManagementSidebar';
import axiosInstance from '../../../lib/axiosInstance';
import AlertModal from '../../Modals/AlertModal'; // AlertModal 임포트
import './AdminNoteList.css';

const AdminNoteList = () => {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]); // API에서 가져온 노트 목록
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 오류 메시지
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [currentGroup, setCurrentGroup] = useState(1); // 현재 페이지 그룹
  const [parentNoteId, setParentNoteId] = useState(1); // 검색할 부모 노드 ID

  const BUTTONS_PER_GROUP = 10; // 페이지 그룹당 버튼 개수

  // API 호출
  const fetchNotes = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      console.log(`Fetching notes for page: ${page} with parent: ${parentNoteId}`);
      const response = await axiosInstance.get(`/api/user/perfume/note/lists/${page}`, {
        params: {
          parent: parentNoteId, // 부모 노트 ID 파라미터 추가
        },
      });
      console.log('API Response:', response.data);

      setNotes(response.data.noteList || []); // 노트 목록 업데이트
      setTotalPages(response.data.totalPages || 1); // 전체 페이지 수 설정
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError('노트 데이터를 가져오는 중 오류가 발생했습니다.'); // 오류 메시지 설정
    } finally {
      setLoading(false);
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchNotes(page); // 해당 페이지의 데이터 가져오기
  };

  // 그룹 변경 핸들러
  const handleGroupChange = (direction) => {
    if (direction === 'prev' && currentGroup > 1) {
      setCurrentGroup((prev) => prev - 1);
    } else if (direction === 'next' && currentGroup < Math.ceil(totalPages / BUTTONS_PER_GROUP)) {
      setCurrentGroup((prev) => prev + 1);
    }
  };

  // 검색 입력 핸들러
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // 검색 시 첫 페이지로 리셋
    fetchNotes(1); // 첫 페이지 데이터 가져오기
  };

  // 노트 삭제 API 호출
  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/admin/perfume/note/delete`, {
        params: { id: id },
      });
      console.log('Deleted note:', response.data);
      // 삭제 후 재호출하여 리스트 갱신
      fetchNotes(currentPage);
    } catch (error) {
      console.error('Error deleting note:', error);
      setError('노트를 삭제하는 중 오류가 발생했습니다.'); // 삭제 오류 발생 시 메시지 설정
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    console.log('Fetching notes on page change:', currentPage);
    fetchNotes(currentPage);
  }, [currentPage, parentNoteId]);

  // 현재 그룹의 페이지 번호 계산
  const startPage = (currentGroup - 1) * BUTTONS_PER_GROUP + 1;
  const endPage = Math.min(startPage + BUTTONS_PER_GROUP - 1, totalPages);
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  // 노트 추가 버튼 클릭 시 NoteRegistration 페이지로 이동
  const handleNoteAdd = () => {
    navigate('/admin/perfumemanagement/noteregistration');
  };

  return (
    <div className="admin-note-list-container">
      <PerfumeManagementSidebar />
      <div className="admin-note-list-content">
        <div className="admin-note-list-header">
          <h1>노트 목록 조회</h1>
          <form className="admin-note-list-search-bar" onSubmit={handleSearch}>
            <input
              type="number"
              placeholder="부모 노트 ID 검색 (1~13)"
              value={parentNoteId}
              onChange={(e) => setParentNoteId(e.target.value)}
            />
            <button type="submit">검색</button>
          </form>
        </div>

        {loading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <AlertModal message={error} onClose={() => setError(null)} /> // 오류 발생 시 AlertModal 표시
        ) : (
          <>
            <table className="admin-note-list-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>노트 이름</th>
                  <th>노트 설명</th>
                  <th>부모 노트 ID</th>
                  <th>액션</th>
                </tr>
              </thead>
              <tbody>
                {notes.length === 0 ? (
                  <tr>
                    <td colSpan="5">No notes available.</td>
                  </tr>
                ) : (
                  notes.map((note) => (
                    <tr key={note.id}>
                      <td>{note.id}</td>
                      <td>{note.noteNm}</td>
                      <td>{note.noteContent}</td>
                      <td>{note.parentNoteId}</td>
                      <td>
                        <button
                          className="admin-note-list-edit-button"
                          onClick={() => navigate(`/admin/perfumemanagement/notedetail?id=${note.id}`)}
                        >
                          수정
                        </button>
                        <button
                          className="admin-note-list-delete-button"
                          onClick={() => handleDelete(note.id)} // 삭제 버튼 클릭 시 handleDelete 호출
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="admin-note-list-pagination-container">
              <div className="admin-note-list-pagination">
                {currentGroup > 1 && (
                  <button onClick={() => handleGroupChange('prev')} className="pagination-button">
                    이전
                  </button>
                )}
                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                  >
                    {page}
                  </button>
                ))}
                {currentGroup < Math.ceil(totalPages / BUTTONS_PER_GROUP) && (
                  <button onClick={() => handleGroupChange('next')} className="pagination-button">
                    다음
                  </button>
                )}
              </div>
              <div className="admin-perfume-list-action-buttons">
                <button className="admin-note-list-write-btn" onClick={handleNoteAdd}>
                  노트 추가
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminNoteList;