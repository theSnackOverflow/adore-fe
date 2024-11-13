// src/components/PerfumeRecommendation/NoteItem.jsx
import React from 'react';
import './NoteItem.css';

const NoteItem = ({ note, onClick }) => {
  return (
    <div className="note-card" onClick={onClick}>
      <div className="note-content">
        <h2 className="note-title">{note.name}</h2>
        <p className="note-description">{note.description}</p>
      </div>
      <div className="note-image-placeholder">
        {note.imageUrl ? (
          <img src={note.imageUrl} alt={note.name} style={{ borderRadius: '4px', width: '100%', height: '100%' }} />
        ) : (
          'No Image'
        )}
      </div>
    </div>
  );
};

export default NoteItem;