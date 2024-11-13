// src/components/modals/CancelConfirmationModal.js
import React, { useEffect } from 'react';
import './CancelConfirmationModal.css';

const CancelConfirmationModal = ({ onClose, onConfirm }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Escape 키 이벤트 리스너 추가
    document.addEventListener('keydown', handleKeyDown);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="cancel-modal-overlay" onClick={onClose}>
      <div className="cancel-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>리뷰 작성을 정말 취소하시겠어요?</h2>
        <p>작성된 내용은 모두 삭제됩니다. 🥲</p>
        <div className="cancel-modal-action-buttons">
          <button className="cancel-modal-confirm-btn" onClick={onConfirm}>네</button>
          <button className="cancel-modal-close-btn" onClick={onClose}>아니요</button>
        </div>
      </div>
    </div>
  );
};

export default CancelConfirmationModal;