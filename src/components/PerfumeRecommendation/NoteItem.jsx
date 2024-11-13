// src/components/PerfumeRecommendation/NoteList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoteSidebar from '../Sidebars/PerfumeSidebar';
import NoteItem from './NoteItem';
import NoteDetailModal from './NoteDetailModal';
import './NoteList.css';

const NoteList = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedNote, setSelectedNote] = useState(null); // 선택된 노트를 저장하는 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [notes, setNotes] = useState([]); // 노트 데이터를 저장할 상태
  const [mainCategories, setMainCategories] = useState([]); // 대분류 노트를 저장할 상태
  const [categoryDescription, setCategoryDescription] = useState(''); // 대분류 설명을 저장할 상태

  // 서버에서 노트 리스트 불러오기
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('http://gachon-adore.duckdns.org:8081/user/perfume/note/list');
        console.log("API Response:", response.data); // 응답 데이터 확인
        if (response.data && response.data.length > 0) {
          setNotes(response.data);

          // parentNoteId가 0인 노트만 필터링하여 대분류로 저장
          const mainNotes = response.data.filter(note => note.parentNoteId === 0);
          setMainCategories(mainNotes);

          // 첫 번째 대분류 노트를 기본 선택값으로 설정
          if (mainNotes.length > 0) {
            setSelectedCategory(mainNotes[0].noteNm);
            setCategoryDescription(mainNotes[0].noteContent); // 설명 설정
          }
        }
      } catch (error) {
        console.error('노트 데이터를 불러오는 중 오류 발생:', error);
      }
    };

    fetchNotes();
  }, []);

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setSelectedCategory(selected);

    // 선택한 대분류 노트의 설명을 업데이트
    const category = mainCategories.find(category => category.noteNm === selected);
    setCategoryDescription(category ? category.noteContent : '설명이 없습니다.');
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
            {mainCategories.map((category) => (
              <option key={category.id} value={category.noteNm}>
                {category.noteNm}
              </option>
            ))}
          </select>
        </div>
        <div className="note-list-category-info">
          <h2>
            {selectedCategory} <span className="note-list-category-description"></span>
          </h2>
          <p>
            {categoryDescription} {/* 선택된 대분류 노트의 설명 */}
          </p>
        </div>
        <div className="note-list-grid">
          {notes
            .filter((note) => note.parentNoteId === mainCategories.find(category => category.noteNm === selectedCategory)?.id)
            .map((note) => (
            <NoteItem 
              key={note.id} 
              note={{
                id: note.id,
                name: note.noteNm,
                description: note.noteContent,
                imageUrl: note.noteImg
              }} 
              onClick={() => openModal(note)} 
            />
          ))}
        </div>
        {isModalOpen && selectedNote && (
          <NoteDetailModal 
            note={{
              id: selectedNote.id,
              name: selectedNote.noteNm,
              description: selectedNote.noteContent,
              imageUrl: selectedNote.noteImg
            }} 
            onClose={closeModal} 
          />
        )}
      </div>
    </div>
  );
};

export default NoteList;