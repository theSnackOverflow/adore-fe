// src/components/modals/FragranceSearchModal.js

import React, { useState, useEffect } from 'react';
import './FragranceSearchModal.css';

const FragranceSearchModal = ({ onClose, onSelectFragrance, perfumeList }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(perfumeList);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    setSearchResults(perfumeList);
  }, [perfumeList]);

  const handleSearch = () => {
    const results = perfumeList.filter((perfume) =>
      perfume.perfume_nm.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <div className="fragrance-modal-overlay" onClick={onClose}>
      <div className="fragrance-modal-content" onClick={(e) => e.stopPropagation()}>
        <h1>향수 검색</h1>
        <div className="fragrance-modal-search-group">
          <input
            type="text"
            placeholder="Search fragrance"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="fragrance-modal-search-input"
          />
          <button onClick={handleSearch} className="fragrance-modal-search-btn">검색</button>
        </div>
        <div className="fragrance-modal-results">
          {searchResults.map((perfume) => (
            <div
              key={perfume.id}
              className="fragrance-modal-result-item"
              onClick={() => onSelectFragrance(perfume)}
            >
              {perfume.perfume_nm}
            </div>
          ))}
        </div>
        <div className="fragrance-modal-action-btn">
          <button onClick={onClose} className="fragrance-modal-close-btn">닫기</button>
        </div>
      </div>
    </div>
  );
};

export default FragranceSearchModal;
