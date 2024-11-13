// src/components/PerfumeRecommendation/NoteDetailModal.jsx
import React from 'react';
import './NoteDetailModal.css';

const NoteDetailModal = ({ note, onClose }) => {
  return (
    <div className="note-detail-modal-overlay" onClick={onClose}>
      <div className="note-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="note-detail-modal-header">
          <div className="note-detail-modal-info">
            <h1>{note.name}</h1>
            <span className="note-detail-modal-category">{note.category}</span>
          </div>
        </div>
        <div className="note-detail-modal-content">
          <div className="note-detail-modal-description">
            <p>{note.description}</p>
          </div>
          <div className="note-detail-modal-image-container">
            <img 
              src={note.imageUrl} 
              alt={`${note.name} 이미지`} 
              className="note-detail-modal-image"
            />
          </div>
        </div>
        <div className="note-detail-modal-actions">
          <button className="note-detail-modal-close-btn" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailModal;