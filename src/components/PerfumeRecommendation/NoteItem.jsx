// src/components/PerfumeRecommendation/NoteItem.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './NoteItem.css'; // Add appropriate styling for NoteItem

const NoteItem = ({ note, onClick }) => {
  return (
    <div className="note-item" onClick={() => onClick(note)}>
      <img 
        src={note.imageUrl || 'default_image_path'} 
        alt={note.name} 
        className="note-item-image" 
      />
      <div className="note-item-content">
        <h3 className="note-item-name">{note.name}</h3>
        <p className="note-item-description">{note.description}</p>
      </div>
    </div>
  );
};

// Prop validation
NoteItem.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default NoteItem;
