// src/components/PerfumeRecommendation/NoteList.jsx
import React, { useState } from 'react';
import NoteSidebar from '../Sidebars/PerfumeSidebar';
import NoteItem from './NoteItem';
import NoteDetailModal from './NoteDetailModal';
import './NoteList.css';

const NoteList = () => {
  const [selectedCategory, setSelectedCategory] = useState('시트러스');
  const [selectedNote, setSelectedNote] = useState(null); // 선택된 노트를 저장하는 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

  const notes = [
    { id: 1, name: '노트 1', description: 'Body text', imageUrl: '/path/to/image1.jpg' },
    { id: 2, name: '노트 2', description: 'Body text', imageUrl: '/path/to/image2.jpg' },
    { id: 3, name: '노트 3', description: 'Body text', imageUrl: '/path/to/image3.jpg' },
    { id: 4, name: '노트 4', description: 'Body text', imageUrl: '/path/to/image4.jpg' },
    { id: 5, name: '노트 5', description: 'Body text', imageUrl: '/path/to/image5.jpg' },
    { id: 6, name: '노트 6', description: 'Body text', imageUrl: '/path/to/image6.jpg' },
  ];

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const openModal = (note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedNote(null);
    setIsModalOpen(false);
  };

  return (
    <div className="note-recommendation-container">
      <NoteSidebar />
      <div className="note-list">
        <div className="note-list-header">
          <h1>전체 노트 보기</h1>
          <select
            className="note-list-category-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="시트러스">시트러스</option>
            <option value="플로랄">플로랄</option>
            <option value="우디">우디</option>
            <option value="프루츠">프루츠</option>
            <option value="머스크">머스크</option>
          </select>
        </div>
        <div className="note-list-category-info">
          <h2>
            {selectedCategory} <span className="note-list-category-description">citrus</span>
          </h2>
          <p>
            시트러스 노트는 레몬, 오렌지, 베르가못과 같은 감귤류에서 나오는 상쾌하고 산뜻한 향을 말해요...
          </p>
        </div>
        <div className="note-list-grid">
          {notes.map((note) => (
            <NoteItem key={note.id} note={note} onClick={() => openModal(note)} /> // 노트 클릭 시 모달 오픈
          ))}
        </div>
        {isModalOpen && selectedNote && (
          <NoteDetailModal note={selectedNote} onClose={closeModal} />
        )}
      </div>
    </div>
  );
};

export default NoteList;