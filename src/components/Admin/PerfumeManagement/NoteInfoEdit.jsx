import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PerfumeManagementSidebar from '../../Sidebars/AdminSidebars/PerfumeManagementSidebar';
import axiosInstance from '../../../lib/axiosInstance';
import './NoteRegistration.css';

const NoteInfoEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // noteId가 URL 파라미터로 전달됨
  const noteId = new URLSearchParams(location.search).get('id');

  const [noteData, setNoteData] = useState({
    name: '',
    content: '',
    parentNoteId: 1, // 기본 부모 노트 ID는 1
    file: null,
    noteImg: '',
  });

  // noteId로 노트 조회 API 호출
  useEffect(() => {
    if (noteId) {
      const fetchNoteData = async () => {
        try {
          const response = await axiosInstance.get(`/api/admin/perfume/note/`, {
            params: { id: noteId },
          });
          const data = response.data;
          setNoteData({
            name: data.noteNm,
            content: data.noteContent,
            parentNoteId: data.parentNoteId,
            noteImg: data.noteImg,
          });
        } catch (error) {
          console.error('노트 정보를 가져오는 데 실패했습니다.', error);
        }
      };
      fetchNoteData();
    }
  }, [noteId]);

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNoteData({ ...noteData, [name]: value });
  };

  // 파일 변경 핸들러
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNoteData({ ...noteData, [name]: files[0] });
  };

  // 노트 수정 핸들러
  const handleUpdateNote = async (e) => {
    e.preventDefault();

    if (!noteData.name || !noteData.content) {
      alert('노트 이름과 내용은 필수 항목입니다.');
      return;
    }

    const formData = new FormData();
    formData.append('name', noteData.name);
    formData.append('content', noteData.content);
    formData.append('parentNoteId', noteData.parentNoteId);
    if (noteData.file) formData.append('file', noteData.file); // 파일이 있을 경우 추가
    formData.append('noteImg', noteData.noteImg); // 이미지 URL 추가

    try {
      const response = await axiosInstance.put(`/api/admin/perfume/note/update`, formData);

      if (response.status === 200) {
        alert('노트가 성공적으로 수정되었습니다.');
        navigate('/admin/perfumemanagement/adminnotelist'); // 수정 후 노트 목록 페이지로 이동
      }
    } catch (error) {
      console.error('노트 수정 오류:', error);
      alert('노트 수정에 실패했습니다.');
    }
  };

  // 등록 취소 핸들러
  const handleCancel = () => {
    alert('노트 수정이 취소되었습니다!');
    navigate('/admin/perfumemanagement/adminnotelist');
  };

  return (
    <div className="note-registration-container">
      <PerfumeManagementSidebar />
      <div className="note-registration-content">
        <h1>노트 수정</h1>
        <div className="note-registration-form">
          <table className="note-registration-table">
            <tbody>
              <tr>
                <th>노트 이름</th>
                <td>
                  <input
                    type="text"
                    name="name"
                    placeholder="노트 이름"
                    value={noteData.name}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <th>노트 내용</th>
                <td>
                  <textarea
                    name="content"
                    placeholder="노트 내용"
                    value={noteData.content}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <th>부모 노트 ID</th>
                <td>
                  <input
                    type="number"
                    name="parentNoteId"
                    value={noteData.parentNoteId}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <th>파일</th>
                <td>
                  <input
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                  />
                </td>
              </tr>
              <tr>
                <th>노트 이미지</th>
                <td>
                  <input
                    type="text"
                    name="noteImg"
                    placeholder="이미지 GCS 경로"
                    value={noteData.noteImg}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="note-registration-buttons">
            <button onClick={handleUpdateNote} className="note-registration-register-btn">
              수정
            </button>
            <button onClick={handleCancel} className="note-registration-cancel-btn">
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteInfoEdit;