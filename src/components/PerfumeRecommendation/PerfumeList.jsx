// src/components/PerfumeRecommendation/PerfumeList.jsx
import React, { useState } from 'react';
import PerfumeSidebar from '../Sidebars/PerfumeSidebar';
import PerfumeItem from './PerfumeItem';
import PerfumeDetailModal from './PerfumeDetailModal';
import './PerfumeList.css';

const PerfumeList = () => {
  const [sortOption, setSortOption] = useState('인기순');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerfume, setSelectedPerfume] = useState(null);

  // ERDCloud 테이블 구조에 맞춘 더미 데이터 20개
  const perfumes = [
    { id: 1, perfume_nm: '향수 1', perfume_desc: '섬세하고 우아한 향', brand: '브랜드 A', release_year: 2021, price: '123,000', rating_value: 4, rating_cnt: 23, top: '레몬, 베르가못', middle: '장미, 라벤더', base: '파출리, 시더우드', perfume_img: 'path/to/image1.jpg' },
    { id: 2, perfume_nm: '향수 2', perfume_desc: '따뜻하고 부드러운 향', brand: '브랜드 B', release_year: 2022, price: '99,000', rating_value: 3, rating_cnt: 15, top: '시트러스, 허브', middle: '자스민, 일랑일랑', base: '바닐라, 머스크', perfume_img: 'path/to/image2.jpg' },
    { id: 3, perfume_nm: '향수 3', perfume_desc: '상쾌한 시트러스 향', brand: '브랜드 C', release_year: 2020, price: '110,000', rating_value: 5, rating_cnt: 45, top: '오렌지, 유자', middle: '페퍼민트, 라임', base: '앰버, 바닐라', perfume_img: 'path/to/image3.jpg' },
    { id: 4, perfume_nm: '향수 4', perfume_desc: '깊고 따뜻한 우디 향', brand: '브랜드 D', release_year: 2019, price: '140,000', rating_value: 4, rating_cnt: 30, top: '블랙 페퍼, 레몬', middle: '시더우드, 베티버', base: '머스크, 가이악 우드', perfume_img: 'path/to/image4.jpg' },
    { id: 5, perfume_nm: '향수 5', perfume_desc: '플로럴과 우디의 조화', brand: '브랜드 E', release_year: 2018, price: '105,000', rating_value: 4, rating_cnt: 12, top: '장미, 시트러스', middle: '자스민, 페퍼', base: '파출리, 샌달우드', perfume_img: 'path/to/image5.jpg' },
    { id: 6, perfume_nm: '향수 6', perfume_desc: '청량한 허브와 시트러스', brand: '브랜드 F', release_year: 2017, price: '130,000', rating_value: 2, rating_cnt: 8, top: '유자, 바질', middle: '로즈마리, 민트', base: '시더우드, 앰버', perfume_img: 'path/to/image6.jpg' },
    { id: 7, perfume_nm: '향수 7', perfume_desc: '은은하고 부드러운 머스크 향', brand: '브랜드 G', release_year: 2016, price: '115,000', rating_value: 5, rating_cnt: 52, top: '화이트 머스크, 장미', middle: '일랑일랑, 재스민', base: '머스크, 바닐라', perfume_img: 'path/to/image7.jpg' },
    { id: 8, perfume_nm: '향수 8', perfume_desc: '강렬한 스파이시와 우디', brand: '브랜드 H', release_year: 2015, price: '125,000', rating_value: 4, rating_cnt: 22, top: '블랙 페퍼, 시트러스', middle: '카다멈, 계피', base: '우드, 머스크', perfume_img: 'path/to/image8.jpg' },
    { id: 9, perfume_nm: '향수 9', perfume_desc: '상쾌한 아쿠아틱 향', brand: '브랜드 I', release_year: 2014, price: '98,000', rating_value: 3, rating_cnt: 16, top: '라임, 민트', middle: '바질, 레몬그라스', base: '머스크, 우디', perfume_img: 'path/to/image9.jpg' },
    { id: 10, perfume_nm: '향수 10', perfume_desc: '고혹적인 플로랄 향', brand: '브랜드 J', release_year: 2013, price: '110,000', rating_value: 4, rating_cnt: 29, top: '라일락, 장미', middle: '프리지아, 피오니', base: '머스크, 앰버', perfume_img: 'path/to/image10.jpg' },
    { id: 11, perfume_nm: '향수 11', perfume_desc: '달콤한 과일과 플로랄', brand: '브랜드 K', release_year: 2023, price: '125,000', rating_value: 5, rating_cnt: 11, top: '복숭아, 망고', middle: '백합, 라벤더', base: '바닐라, 사프란', perfume_img: 'path/to/image11.jpg' },
    { id: 12, perfume_nm: '향수 12', perfume_desc: '감각적인 우디 향', brand: '브랜드 L', release_year: 2012, price: '135,000', rating_value: 3, rating_cnt: 24, top: '오크 모스, 라벤더', middle: '시더우드, 파출리', base: '머스크, 앰버', perfume_img: 'path/to/image12.jpg' },
    { id: 13, perfume_nm: '향수 13', perfume_desc: '스모키한 가죽향', brand: '브랜드 M', release_year: 2011, price: '118,000', rating_value: 2, rating_cnt: 20, top: '베르가못, 블랙 페퍼', middle: '시프레, 바질', base: '가죽, 머스크', perfume_img: 'path/to/image13.jpg' },
    { id: 14, perfume_nm: '향수 14', perfume_desc: '향긋한 프루티와 플로랄', brand: '브랜드 N', release_year: 2010, price: '140,000', rating_value: 4, rating_cnt: 25, top: '사과, 페어', middle: '라벤더, 카모마일', base: '샌달우드, 바닐라', perfume_img: 'path/to/image14.jpg' },
    { id: 15, perfume_nm: '향수 15', perfume_desc: '대담한 오리엔탈 향', brand: '브랜드 O', release_year: 2009, price: '119,000', rating_value: 5, rating_cnt: 14, top: '자스민, 머스크', middle: '로즈우드, 미르', base: '앰버, 바닐라', perfume_img: 'path/to/image15.jpg' },
    { id: 16, perfume_nm: '향수 16', perfume_desc: '화사한 플로랄 계열', brand: '브랜드 P', release_year: 2008, price: '99,000', rating_value: 3, rating_cnt: 17, top: '가르데니아, 튤립', middle: '라일락, 페퍼', base: '머스크, 바닐라', perfume_img: 'path/to/image16.jpg' },
    { id: 17, perfume_nm: '향수 17', perfume_desc: '깊고 부드러운 가죽 향', brand: '브랜드 Q', release_year: 2007, price: '150,000', rating_value: 4, rating_cnt: 9, top: '블랙 페퍼, 레몬', middle: '가죽, 사프란', base: '가이악 우드, 앰버', perfume_img: 'path/to/image17.jpg' },
    { id: 18, perfume_nm: '향수 18', perfume_desc: '산뜻한 그린과 허브 향', brand: '브랜드 R', release_year: 2006, price: '128,000', rating_value: 4, rating_cnt: 27, top: '레몬그라스, 민트', middle: '로즈마리, 세이지', base: '시더우드, 머스크', perfume_img: 'path/to/image18.jpg' },
    { id: 19, perfume_nm: '향수 19', perfume_desc: '고요하고 평화로운 향', brand: '브랜드 S', release_year: 2005, price: '133,000', rating_value: 5, rating_cnt: 10, top: '화이트 플로럴, 유자', middle: '라일락, 클로브', base: '앰버, 바닐라', perfume_img: 'path/to/image19.jpg' },
    { id: 20, perfume_nm: '향수 20', perfume_desc: '감미롭고 로맨틱한 향', brand: '브랜드 T', release_year: 2004, price: '145,000', rating_value: 5, rating_cnt: 33, top: '피치, 애플', middle: '자스민, 장미', base: '바닐라, 시더우드', perfume_img: 'path/to/image20.jpg' },
  ];

  const openModal = (perfume) => setSelectedPerfume(perfume);
  const closeModal = () => setSelectedPerfume(null);

  const filteredPerfumes = perfumes.filter((perfume) =>
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
            <button onClick={() => setSortOption('인기순')}>인기순</button>
            <button onClick={() => setSortOption('최신순')}>최신순</button>
            <button onClick={() => setSortOption('가격순')}>가격순</button>
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