import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PerfumeSidebar from '../Sidebars/PerfumeSidebar';
import PerfumeItem from './PerfumeItem';
import PerfumeDetailModal from './PerfumeDetailModal';
import './PerfumeList.css';

const PerfumeList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('BRAND'); // 기본 검색 타입
  const [perfumes, setPerfumes] = useState([]);
  const [selectedPerfumeDetail, setSelectedPerfumeDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNext, setHasNext] = useState(true); // 다음 페이지 여부

  const fetchPerfumeList = async (page = 1, append = false) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://gachon-adore.duckdns.org/api/user/perfume/lists/${page}`,
        {
          params: { type: searchType, keyword: searchQuery },
        }
      );

      if (response.data && response.data.perfumeList) {
        const perfumeList = response.data.perfumeList;

        // 상세 데이터 미리 로드
        const detailedPerfumes = await Promise.all(
          perfumeList.map(async (perfume) => {
            try {
              const detailResponse = await axios.get(
                `https://gachon-adore.duckdns.org/api/user/perfume/`,
                { params: { id: perfume.id } }
              );
              return { ...perfume, detail: detailResponse.data };
            } catch (error) {
              console.error(`향수 상세 데이터 로드 실패 (ID: ${perfume.id}):`, error);
              return { ...perfume, detail: null }; // 실패 시 기본값 처리
            }
          })
        );

        // 데이터 추가 또는 새로 설정
        setPerfumes((prevPerfumes) =>
          append ? [...prevPerfumes, ...detailedPerfumes] : detailedPerfumes
        );
        setHasNext(response.data.hasNext); // 다음 페이지 여부 업데이트
      } else {
        setHasNext(false); // 더 이상 데이터가 없으면 hasNext를 false로 설정
      }
    } catch (error) {
      console.error('향수 리스트를 불러오는 중 오류 발생:', error);
      setHasNext(false);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로딩 및 검색 요청
  useEffect(() => {
    setPerfumes([]); // 새로운 검색 시 기존 데이터 초기화
    setCurrentPage(1);
    setHasNext(true);
    fetchPerfumeList(1); // 첫 페이지 데이터 로드
  }, [searchQuery, searchType]);

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      if (!loading && hasNext) {
        fetchPerfumeList(currentPage + 1, true); // 다음 페이지 추가 로드
        setCurrentPage((prevPage) => prevPage + 1);
      }
    }
  };

  // 스크롤 이벤트 등록
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll); // 컴포넌트 언마운트 시 이벤트 제거
    };
  }, [loading, hasNext, currentPage]);

  const openModal = (perfume) => {
    setSelectedPerfumeDetail(perfume.detail);
  };

  const closeModal = () => setSelectedPerfumeDetail(null);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setCurrentPage(1);
      setPerfumes([]);
      fetchPerfumeList(1);
    }
  };

  return (
    <div className="perfume-recommendation-container">
      <PerfumeSidebar />
      <div className="perfume-list">
        <div className="perfume-list-header">
          <h1>향수 검색</h1>
        </div>
      <div className="perfume-list-search-bar">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="NAME">이름</option>
            <option value="BRAND">브랜드</option>
          </select>
          <input
            type="text"
            placeholder="검색어 입력"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>검색</button>
        </div>
        <div className="perfume-grid">
          {perfumes.map((perfume) => (
            <PerfumeItem
              key={perfume.id}
              perfume={perfume}
              onClick={() => openModal(perfume)}
            />
          ))}
        </div>
        {loading && <p>로딩 중...</p>}
        {!hasNext && <p>더 이상 결과가 없습니다.</p>}
        {selectedPerfumeDetail && (
          <PerfumeDetailModal
            perfume={selectedPerfumeDetail}
            onClose={closeModal}
          />
        )}
      </div>
    </div>
  );
};

export default PerfumeList;
