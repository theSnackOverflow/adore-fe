import React, { useState, useEffect } from 'react';
import axiosInstance from '../../lib/axiosInstance'; // Axios 인스턴스 가져오기
import './FragranceSearchModal.css';

const FragranceSearchModal = ({ onClose, onSelectFragrance }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1); // 현재 페이지
  const [hasMore, setHasMore] = useState(true); // 더 많은 데이터 여부

  useEffect(() => {
    // ESC 키로 모달 닫기
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
    if (searchQuery.trim()) {
      fetchResults();
    } else {
      setSearchResults([]);
      setPage(1);
      setHasMore(true);
    }
  }, [searchQuery]);

  const fetchResults = async (isLoadMore = false) => {
    if (isLoading) return; // 로딩 중일 경우 중복 요청 방지
    setIsLoading(true);

    try {
      const response = await axiosInstance.get(
        `/api/user/perfume/lists/${page}`, // 현재 페이지 요청
        { params: { type: 'NAME', keyword: searchQuery } }
      );
      const newResults = response.data.perfumeList || [];

      setSearchResults((prevResults) =>
        isLoadMore ? [...prevResults, ...newResults] : newResults
      );
      setHasMore(newResults.length > 0); // 더 많은 데이터가 있는지 확인
    } catch (error) {
      console.error('향수 검색 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchResults([]);
    setPage(1);
    setHasMore(true);
    fetchResults();
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // 무한 스크롤 이벤트 핸들러
  useEffect(() => {
    const handleScroll = () => {
      const isBottom =
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight;
      if (isBottom) {
        handleLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore, isLoading]);

  useEffect(() => {
    if (page > 1) {
      fetchResults(true); // 추가 데이터 로드
    }
  }, [page]);

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
          <button onClick={handleSearch} className="fragrance-modal-search-btn">
            검색
          </button>
        </div>
        <div className="fragrance-modal-results">
          {searchResults.map((perfume) => (
            <div
              key={perfume.id}
              className="fragrance-modal-result-item"
              onClick={() => onSelectFragrance(perfume)}
            >
              {perfume.name} ({perfume.brand})
            </div>
          ))}
          {isLoading && <p className="fragrance-modal-loading">로딩 중...</p>}
          {!hasMore && !isLoading && searchResults.length > 0 && (
            <p className="fragrance-modal-no-more">더 이상 결과가 없습니다.</p>
          )}
        </div>
        <div className="fragrance-modal-action-btn">
          <button onClick={onClose} className="fragrance-modal-close-btn">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FragranceSearchModal;