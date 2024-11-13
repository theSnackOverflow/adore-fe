// src/components/PerfumeRecommendation/PerfumeList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PerfumeSidebar from '../Sidebars/PerfumeSidebar';
import PerfumeItem from './PerfumeItem';
import PerfumeDetailModal from './PerfumeDetailModal';
import './PerfumeList.css';

const PerfumeList = () => {
  const [sortOption, setSortOption] = useState('인기순');
  const [sortDirection, setSortDirection] = useState('desc'); // 오름차순 또는 내림차순
  const [searchQuery, setSearchQuery] = useState('');
  const [perfumes, setPerfumes] = useState([]);
  const [selectedPerfume, setSelectedPerfume] = useState(null);

// src/components/PerfumeRecommendation/PerfumeList.jsx
const dummyData = [
  { id: 1, perfume_nm: '아침의 상쾌함', perfume_desc: '신선한 시트러스와 라벤더가 조화된 향', brand: '브랜드 A', release_year: 2022, price: '50,000', rating_value: 4, rating_cnt: 12, top: '레몬, 오렌지', middle: '라벤더, 로즈마리', base: '시더우드, 앰버' },
  { id: 2, perfume_nm: '따뜻한 포옹', perfume_desc: '부드러운 머스크와 플로럴이 어우러진 향', brand: '브랜드 B', release_year: 2021, price: '75,000', rating_value: 5, rating_cnt: 22, top: '베르가못, 복숭아', middle: '자스민, 장미', base: '머스크, 바닐라' },
  { id: 3, perfume_nm: '가을의 산책', perfume_desc: '우디와 스파이시가 절묘하게 조화된 향', brand: '브랜드 C', release_year: 2020, price: '65,000', rating_value: 3, rating_cnt: 18, top: '후추, 시나몬', middle: '시더우드, 오크', base: '파출리, 바닐라' },
  { id: 4, perfume_nm: '여름의 바다', perfume_desc: '상쾌한 아쿠아틱과 민트의 조화', brand: '브랜드 D', release_year: 2019, price: '55,000', rating_value: 4, rating_cnt: 25, top: '민트, 레몬', middle: '바질, 라벤더', base: '머스크, 앰버' },
  { id: 5, perfume_nm: '황혼의 정원', perfume_desc: '신비로운 플로럴과 우디의 조화', brand: '브랜드 E', release_year: 2018, price: '90,000', rating_value: 5, rating_cnt: 30, top: '자몽, 오렌지 블로썸', middle: '로즈, 페퍼', base: '베티버, 시더' },
  { id: 6, perfume_nm: '초여름의 빛', perfume_desc: '신선한 허브와 시트러스의 조화', brand: '브랜드 F', release_year: 2023, price: '60,000', rating_value: 3, rating_cnt: 15, top: '라임, 유자', middle: '바질, 민트', base: '앰버, 시더' },
  { id: 7, perfume_nm: '달콤한 유혹', perfume_desc: '바닐라와 프루티가 어우러진 감미로운 향', brand: '브랜드 G', release_year: 2017, price: '95,000', rating_value: 5, rating_cnt: 40, top: '복숭아, 망고', middle: '자스민, 일랑일랑', base: '바닐라, 머스크' },
  { id: 8, perfume_nm: '겨울의 따스함', perfume_desc: '따뜻한 스파이스와 우디가 매력적인 향', brand: '브랜드 H', release_year: 2016, price: '85,000', rating_value: 4, rating_cnt: 27, top: '계피, 정향', middle: '가이악우드, 샌달우드', base: '바닐라, 앰버' },
  { id: 9, perfume_nm: '아름다운 기억', perfume_desc: '섬세한 플로럴과 그린 노트의 조화', brand: '브랜드 I', release_year: 2022, price: '105,000', rating_value: 4, rating_cnt: 32, top: '라일락, 페어', middle: '장미, 튤립', base: '머스크, 바닐라' },
  { id: 10, perfume_nm: '자연의 향기', perfume_desc: '싱그러운 허브와 시더우드가 어우러진 향', brand: '브랜드 J', release_year: 2015, price: '70,000', rating_value: 3, rating_cnt: 21, top: '로즈마리, 세이지', middle: '라벤더, 시프레', base: '시더우드, 앰버' },
  { id: 11, perfume_nm: '비밀의 정원', perfume_desc: '화사한 플로럴과 우디가 어우러진 향', brand: '브랜드 K', release_year: 2023, price: '100,000', rating_value: 5, rating_cnt: 20, top: '장미, 자스민', middle: '페퍼, 시프레', base: '앰버, 시더우드' },
  { id: 12, perfume_nm: '맑은 아침', perfume_desc: '시원한 민트와 시트러스의 상쾌한 향', brand: '브랜드 L', release_year: 2012, price: '50,000', rating_value: 4, rating_cnt: 15, top: '레몬, 민트', middle: '라임, 오렌지 블로썸', base: '시더우드, 앰버' },
  { id: 13, perfume_nm: '은은한 달빛', perfume_desc: '부드러운 플로럴과 우디의 조화', brand: '브랜드 M', release_year: 2021, price: '85,000', rating_value: 5, rating_cnt: 12, top: '베르가못, 일랑일랑', middle: '자스민, 튤립', base: '샌달우드, 머스크' },
  { id: 14, perfume_nm: '따스한 오후', perfume_desc: '과일과 플로럴의 달콤한 조화', brand: '브랜드 N', release_year: 2020, price: '75,000', rating_value: 4, rating_cnt: 17, top: '자몽, 사과', middle: '프리지아, 피오니', base: '머스크, 바닐라' },
  { id: 15, perfume_nm: '여행의 기억', perfume_desc: '상쾌한 시트러스와 우디의 만남', brand: '브랜드 O', release_year: 2019, price: '120,000', rating_value: 5, rating_cnt: 28, top: '레몬, 자몽', middle: '로즈마리, 민트', base: '파출리, 앰버' },
  { id: 16, perfume_nm: '뜨거운 여름', perfume_desc: '열정적인 스파이스와 우디 향', brand: '브랜드 P', release_year: 2018, price: '65,000', rating_value: 4, rating_cnt: 24, top: '후추, 시나몬', middle: '샌달우드, 가이악우드', base: '머스크, 바닐라' },
  { id: 17, perfume_nm: '눈 내리는 밤', perfume_desc: '차분한 우디와 머스크의 향', brand: '브랜드 Q', release_year: 2017, price: '95,000', rating_value: 5, rating_cnt: 19, top: '블랙 페퍼, 샌달우드', middle: '장미, 바질', base: '가이악우드, 앰버' },
  { id: 18, perfume_nm: '해변의 추억', perfume_desc: '상쾌한 아쿠아틱과 민트의 조화', brand: '브랜드 R', release_year: 2016, price: '60,000', rating_value: 3, rating_cnt: 15, top: '레몬, 민트', middle: '바질, 로즈마리', base: '머스크, 바닐라' },
  { id: 19, perfume_nm: '황혼의 조화', perfume_desc: '깊고 따뜻한 우디와 플로럴', brand: '브랜드 S', release_year: 2015, price: '80,000', rating_value: 4, rating_cnt: 33, top: '라일락, 오렌지 블로썸', middle: '로즈, 베티버', base: '샌달우드, 시더우드' },
  { id: 20, perfume_nm: '따뜻한 겨울', perfume_desc: '스파이시와 머스크의 따뜻한 조화', brand: '브랜드 T', release_year: 2014, price: '70,000', rating_value: 4, rating_cnt: 22, top: '후추, 계피', middle: '장미, 시더우드', base: '머스크, 앰버' },
  { id: 21, perfume_nm: '밤의 여왕', perfume_desc: '관능적인 플로럴과 오리엔탈 노트', brand: '브랜드 U', release_year: 2021, price: '150,000', rating_value: 5, rating_cnt: 41, top: '자스민, 오렌지 블로썸', middle: '페퍼, 시프레', base: '앰버, 바닐라' },
  { id: 22, perfume_nm: '푸른 하늘', perfume_desc: '상쾌한 시트러스와 그린 노트의 조화', brand: '브랜드 V', release_year: 2019, price: '65,000', rating_value: 3, rating_cnt: 20, top: '유자, 라임', middle: '바질, 라벤더', base: '머스크, 파출리' },
  { id: 23, perfume_nm: '새벽의 정적', perfume_desc: '우디와 시트러스가 조화된 시원한 향', brand: '브랜드 W', release_year: 2017, price: '85,000', rating_value: 4, rating_cnt: 28, top: '레몬그라스, 유칼립투스', middle: '시더우드, 미르', base: '머스크, 앰버' },
  { id: 24, perfume_nm: '사랑의 향기', perfume_desc: '달콤한 프루티와 로맨틱한 플로럴', brand: '브랜드 X', release_year: 2020, price: '95,000', rating_value: 5, rating_cnt: 33, top: '복숭아, 체리', middle: '장미, 피오니', base: '바닐라, 앰버' },
  { id: 25, perfume_nm: '가을의 온기', perfume_desc: '따뜻한 스파이시와 플로럴 노트', brand: '브랜드 Y', release_year: 2018, price: '75,000', rating_value: 4, rating_cnt: 29, top: '시나몬, 정향', middle: '자스민, 베티버', base: '파출리, 앰버' },
  { id: 26, perfume_nm: '여름 바다', perfume_desc: '시원한 아쿠아틱과 시트러스', brand: '브랜드 Z', release_year: 2016, price: '60,000', rating_value: 3, rating_cnt: 17, top: '레몬, 오렌지', middle: '바질, 시프레', base: '머스크, 시더우드' },
  { id: 27, perfume_nm: '이브닝 글로우', perfume_desc: '따뜻한 오리엔탈과 스파이스 노트', brand: '브랜드 AA', release_year: 2021, price: '130,000', rating_value: 5, rating_cnt: 37, top: '샤프란, 카다멈', middle: '자스민, 로즈우드', base: '머스크, 앰버' },
  { id: 28, perfume_nm: '봄의 선물', perfume_desc: '화사한 플로럴과 과일 노트', brand: '브랜드 AB', release_year: 2018, price: '68,000', rating_value: 4, rating_cnt: 21, top: '복숭아, 배', middle: '장미, 프리지아', base: '머스크, 앰버' },
  { id: 29, perfume_nm: '황금빛 햇살', perfume_desc: '상큼한 시트러스와 달콤한 과일', brand: '브랜드 AC', release_year: 2019, price: '52,000', rating_value: 3, rating_cnt: 16, top: '레몬, 자몽', middle: '일랑일랑, 페어', base: '바닐라, 샌달우드' },
  { id: 30, perfume_nm: '순수한 자아', perfume_desc: '우디와 머스크가 어우러진 깊은 향', brand: '브랜드 AD', release_year: 2020, price: '92,000', rating_value: 5, rating_cnt: 26, top: '화이트 머스크, 페퍼', middle: '시더우드, 파출리', base: '머스크, 앰버' },
  { id: 31, perfume_nm: '한여름의 열기', perfume_desc: '이국적인 오리엔탈 스파이스', brand: '브랜드 AE', release_year: 2015, price: '110,000', rating_value: 5, rating_cnt: 40, top: '정향, 자스민', middle: '베티버, 시더우드', base: '바닐라, 앰버' },
  { id: 32, perfume_nm: '하얀 아침', perfume_desc: '순수한 플로럴과 머스크의 조화', brand: '브랜드 AF', release_year: 2021, price: '78,000', rating_value: 4, rating_cnt: 24, top: '라일락, 라벤더', middle: '로즈, 백합', base: '머스크, 바닐라' },
  { id: 33, perfume_nm: '안개의 정원', perfume_desc: '부드러운 우디와 플로럴의 조화', brand: '브랜드 AG', release_year: 2017, price: '105,000', rating_value: 4, rating_cnt: 33, top: '장미, 로즈마리', middle: '시더우드, 샌달우드', base: '파출리, 앰버' },
  { id: 34, perfume_nm: '추억의 밤', perfume_desc: '깊고 매혹적인 오리엔탈 노트', brand: '브랜드 AH', release_year: 2018, price: '115,000', rating_value: 5, rating_cnt: 28, top: '일랑일랑, 샤프란', middle: '자스민, 시더우드', base: '바닐라, 머스크' },
  { id: 35, perfume_nm: '신비로운 어둠', perfume_desc: '강렬한 우디와 가죽 향', brand: '브랜드 AI', release_year: 2016, price: '140,000', rating_value: 5, rating_cnt: 39, top: '블랙 페퍼, 후추', middle: '가죽, 우디', base: '앰버, 파출리' },
  { id: 36, perfume_nm: '봄의 노래', perfume_desc: '상큼한 과일과 꽃의 조화', brand: '브랜드 AJ', release_year: 2019, price: '72,000', rating_value: 4, rating_cnt: 19, top: '체리, 복숭아', middle: '장미, 프리지아', base: '바닐라, 앰버' },
  { id: 37, perfume_nm: '여명의 빛', perfume_desc: '시트러스와 그린 노트가 어우러진 상쾌한 향', brand: '브랜드 AK', release_year: 2015, price: '58,000', rating_value: 3, rating_cnt: 18, top: '레몬그라스, 라임', middle: '바질, 라벤더', base: '시더우드, 머스크' },
  { id: 38, perfume_nm: '여름밤의 꿈', perfume_desc: '상큼한 시트러스와 스파이스의 조화', brand: '브랜드 AL', release_year: 2022, price: '98,000', rating_value: 4, rating_cnt: 27, top: '자몽, 오렌지', middle: '카다멈, 민트', base: '파출리, 앰버' },
  { id: 39, perfume_nm: '밤하늘의 별', perfume_desc: '달콤한 프루티와 따뜻한 오리엔탈 노트', brand: '브랜드 AM', release_year: 2020, price: '125,000', rating_value: 5, rating_cnt: 36, top: '복숭아, 베르가못', middle: '장미, 시프레', base: '앰버, 머스크' },
  { id: 40, perfume_nm: '아침 이슬', perfume_desc: '청량한 시트러스와 플로럴의 조화', brand: '브랜드 AN', release_year: 2014, price: '55,000', rating_value: 4, rating_cnt: 22, top: '라임, 민트', middle: '프리지아, 튤립', base: '바닐라, 시더우드' }
];


  useEffect(() => {
    const fetchPerfumes = async () => {
      try {
        const response = await axios.get('http://gachon-adore.duckdns.org:8081/user/perfume/perfume/list');
        if (response.data && response.data.length > 0) {
          setPerfumes(response.data);
        } else {
          setPerfumes(dummyData);
        }
      } catch (error) {
        console.error('향수 데이터를 불러오는 중 오류 발생:', error);
        setPerfumes(dummyData);
      }
    };

    fetchPerfumes();
  }, []);

  const openModal = (perfume) => setSelectedPerfume(perfume);
  const closeModal = () => setSelectedPerfume(null);

  const toggleSortOption = (option) => {
    if (sortOption === option) {
      setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortOption(option);
      setSortDirection('desc'); // 기본 정렬 방향은 내림차순
    }
  };

  const sortedPerfumes = [...perfumes].sort((a, b) => {
    let compareValue = 0;
    switch (sortOption) {
      case '인기순':
        compareValue = b.rating_cnt - a.rating_cnt; // 리뷰 개수로 인기순 정렬
        break;
      case '최신순':
        compareValue = b.release_year - a.release_year;
        break;
      case '가격순':
        compareValue = parseInt(b.price.replace(/,/g, ''), 10) - parseInt(a.price.replace(/,/g, ''), 10);
        break;
      default:
        return 0;
    }
    return sortDirection === 'asc' ? -compareValue : compareValue;
  });

  const filteredPerfumes = sortedPerfumes.filter((perfume) =>
    perfume.perfume_nm.includes(searchQuery) || perfume.perfume_desc.includes(searchQuery)
  );

  return (
    <div className="perfume-recommendation-container">
      <PerfumeSidebar />
      <div className="perfume-list">
        <div className="perfume-list-header">
          <h1>전체 향수 보기</h1>
          <div className="perfume-list-search-bar">
            <input
              type="text"
              placeholder="향수 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="sort-options">
            <button onClick={() => toggleSortOption('인기순')}>
              인기순 {sortOption === '인기순' && (sortDirection === 'asc' ? '▲' : '▼')}
            </button>
            <button onClick={() => toggleSortOption('최신순')}>
              최신순 {sortOption === '최신순' && (sortDirection === 'asc' ? '▲' : '▼')}
            </button>
            <button onClick={() => toggleSortOption('가격순')}>
              가격순 {sortOption === '가격순' && (sortDirection === 'asc' ? '▲' : '▼')}
            </button>
          </div>
        </div>
        <div className="perfume-grid">
          {filteredPerfumes.map((perfume) => (
            <PerfumeItem key={perfume.id} perfume={perfume} onClick={() => openModal(perfume)} />
          ))}
        </div>
        {selectedPerfume && <PerfumeDetailModal perfume={selectedPerfume} onClose={closeModal} />}
      </div>
    </div>
  );
};

export default PerfumeList;