// src/components/PerfumeRecommendation/PerfumeItem.jsx
import React from 'react';
import './PerfumeItem.css';

const PerfumeItem = ({ perfume, onClick }) => {
  return (
    <div className="perfume-card" onClick={onClick}>
      <div className="perfume-card-content">
        <h2>{perfume.perfume_nm}</h2> {/* ERDCloud 향수 이름 */}
        <p>{perfume.perfume_desc}</p> {/* ERDCloud 향수 설명 */}
      </div>
      <div className="perfume-image-placeholder">+</div>
    </div>
  );
};

export default PerfumeItem;