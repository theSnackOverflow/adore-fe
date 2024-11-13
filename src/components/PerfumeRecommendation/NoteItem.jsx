// src/components/PerfumeRecommendation/NoteItem.jsx
import React from 'react';
import './NoteItem.css';

const NoteItem = ({ note, onClick }) => {
  return (
    <div className="note-card" onClick={onClick}>
      <h2>{note.name}</h2>
      <p>{note.description}</p>
      <div className="note-image-placeholder">+</div>
    </div>
  );
};

export default NoteItem;