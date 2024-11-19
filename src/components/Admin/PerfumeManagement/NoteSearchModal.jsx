// src/components/Admin/PerfumeManagement/NoteSearchModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NoteSearchModal.css';

const NoteSearchModal = ({ onClose, onSelect }) => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://gachon-adore.duckdns.org:8081/user/perfume/note/list');
      setNotes(response.data);
    } catch (error) {
      console.error('노트 검색 오류:', error);
      setError('노트 데이터를 불러오는 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredNotes = notes.filter((note) =>
    note.noteNm.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="note-search-modal-overlay">
      <div className="note-search-modal">
        <h2>노트 검색</h2>
        <input
          type="text"
          placeholder="노트 이름 검색"
          value={searchTerm}
          onChange={handleSearchChange}
          className="note-search-input"
        />
        {error && <p className="error">{error}</p>}
        <div className="note-search-results">
          {filteredNotes.map((note) => (
            <div
              key={note.noteId}
              className="note-item"
              onClick={() => onSelect(note.noteNm)} // 노트 선택 시 onSelect 콜백 호출
            >
              {note.noteNm}
            </div>
          ))}
        </div>
        <button onClick={onClose} className="close-modal-button">닫기</button>
      </div>
    </div>
  );
};

export default NoteSearchModal;