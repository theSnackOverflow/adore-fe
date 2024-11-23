import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoteSidebar from '../Sidebars/PerfumeSidebar';
import NoteItem from './NoteItem';
import NoteDetailModal from './NoteDetailModal';
import './NoteList.css';

const NoteList = () => {
  const [selectedCategory, setSelectedCategory] = useState(''); // 선택된 대분류 이름
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // 선택된 대분류 ID
  const [selectedNote, setSelectedNote] = useState(null); // 선택된 노트 데이터
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [notes, setNotes] = useState([]); // 하위 노트 데이터
  const [mainCategories, setMainCategories] = useState([]); // 대분류 데이터
  const [categoryDescription, setCategoryDescription] = useState(''); // 대분류 설명
  const [categoryImg, setCategoryImg] = useState(''); // 대분류
  const [page, setPage] = useState(1); // 페이지 번호
  const [loading, setLoading] = useState(false); // 로딩 상태

  const gatewayURL = import.meta.env.VITE_GATEWAY_URL;
  // 대분류 목록 가져오기
  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await axios.get(`${gatewayURL}/api/user/perfume/note/parent`);
        if (response.data && response.data.length > 0) {
          setMainCategories(response.data);

          // 첫 번째 대분류를 기본 선택값으로 설정
          const firstCategory = response.data[0];
          setSelectedCategory(firstCategory.noteNm);
          setSelectedCategoryId(firstCategory.id);
          setCategoryDescription(firstCategory.noteNm);
          setCategoryImg(firstCategory.noteImg);

          // 첫 번째 대분류의 하위 노트 로드
          fetchNotes(firstCategory.id);
        }
      } catch (error) {
        console.error('대분류 데이터를 불러오는 중 오류 발생:', error);
      }
    };

    fetchMainCategories();
  }, []);

  // 선택된 대분류의 하위 노트 가져오기
  const fetchNotes = async (categoryId) => {
    if (loading) return; // 로딩 중일 경우 중복 요청 방지
    setLoading(true);
    try {
      const response = await axios.get(
        `${gatewayURL}/api/user/perfume/note/lists/${page}`,
        { params: { parent: categoryId } }
      );
      if (response.data && response.data.noteList) {
        setNotes((prevNotes) => [...prevNotes, ...response.data.noteList]); // 이전 노트에 새로 받은 노트 추가
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.error('하위 노트를 불러오는 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  };

  // 대분류 변경 핸들러
  const handleCategoryChange = (e) => {
    const selected = mainCategories.find(category => category.noteNm === e.target.value);
    if (selected) {
      setSelectedCategory(selected.noteNm);
      setSelectedCategoryId(selected.id);
      setCategoryDescription(selected.noteNm);
      setNotes([]); // 기존 노트 초기화
      setPage(1); // 페이지 초기화
      fetchNotes(selected.id); // 선택된 대분류의 하위 노트 로드
    }
  };

  // 모달 열기
  const openModal = (note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setSelectedNote(null);
    setIsModalOpen(false);
  };

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    const bottom = window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight;
    if (bottom) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchNotes(selectedCategoryId, nextPage);
        return nextPage;
      });
    }
  };

  // 스크롤 이벤트 리스너 추가 및 정리
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [selectedCategoryId, page]);

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
            {categoryDescription} {/* 선택된 대분류 설명 */}
            <img src={categoryImg} alt="category.noteNm" />
          </p>
        </div>
        <div className="note-list-grid">
          {notes.map((note, index) => (
            <NoteItem
              key={`${note.id}-${index}`} // Combine id and index to ensure a unique key
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
