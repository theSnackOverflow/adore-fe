// src/components/PerfumeRecommendation/Review/OtherReviewList.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import PerfumeSidebar from '../Sidebars/PerfumeSidebar';
import FragranceSearchModal from '../Modals/FragranceSearchModal';
import './OtherReviewList.css';


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

const dummyReviews = {
  1: [
    { id: 1, user: '사용자 A', title: '상쾌한 향!', date: '2023-10-01', likeCnt: 10, views: 50, rate: 4, state: 'ACTIVE' },
    { id: 2, user: '사용자 B', title: '좋은 선택이었어요', date: '2023-10-02', likeCnt: 5, views: 30, rate: 4, state: 'ACTIVE' },
  ],
  2: [
    { id: 3, user: '사용자 C', title: '따뜻한 향!', date: '2023-10-03', likeCnt: 15, views: 70, rate: 5, state: 'ACTIVE' },
    { id: 4, user: '사용자 D', title: '아주 만족합니다', date: '2023-10-04', likeCnt: 12, views: 60, rate: 5, state: 'ACTIVE' },
  ],
  3: [
    { id: 5, user: '사용자 E', title: '가을에 잘 어울려요', date: '2023-10-05', likeCnt: 8, views: 40, rate: 3, state: 'ACTIVE' },
    { id: 6, user: '사용자 F', title: '조화로운 향', date: '2023-10-06', likeCnt: 6, views: 35, rate: 3, state: 'ACTIVE' },
  ],
  4: [
    { id: 7, user: '사용자 G', title: '여름에 딱이에요', date: '2023-10-07', likeCnt: 20, views: 80, rate: 4, state: 'ACTIVE' },
    { id: 8, user: '사용자 H', title: '상쾌한 느낌입니다', date: '2023-10-08', likeCnt: 18, views: 75, rate: 4, state: 'ACTIVE' },
  ],
  5: [
    { id: 9, user: '사용자 I', title: '정말 아름다운 향', date: '2023-10-09', likeCnt: 25, views: 100, rate: 5, state: 'ACTIVE' },
    { id: 10, user: '사용자 J', title: '매력적인 향수', date: '2023-10-10', likeCnt: 22, views: 90, rate: 5, state: 'ACTIVE' },
  ],
  6: [
    { id: 11, user: '사용자 K', title: '상큼한 향이에요', date: '2023-10-11', likeCnt: 10, views: 50, rate: 3, state: 'ACTIVE' },
    { id: 12, user: '사용자 L', title: '무난한 향수', date: '2023-10-12', likeCnt: 7, views: 40, rate: 3, state: 'ACTIVE' },
  ],
  7: [
    { id: 13, user: '사용자 M', title: '달콤한 향이 좋아요', date: '2023-10-13', likeCnt: 30, views: 120, rate: 5, state: 'ACTIVE' },
    { id: 14, user: '사용자 N', title: '너무 향기롭습니다', date: '2023-10-14', likeCnt: 28, views: 110, rate: 5, state: 'ACTIVE' },
  ],
  8: [
    { id: 15, user: '사용자 O', title: '겨울에 잘 어울려요', date: '2023-10-15', likeCnt: 20, views: 90, rate: 4, state: 'ACTIVE' },
    { id: 16, user: '사용자 P', title: '따뜻한 느낌입니다', date: '2023-10-16', likeCnt: 18, views: 80, rate: 4, state: 'ACTIVE' },
  ],
  9: [
    { id: 17, user: '사용자 Q', title: '섬세한 향!', date: '2023-10-17', likeCnt: 15, views: 75, rate: 4, state: 'ACTIVE' },
    { id: 18, user: '사용자 R', title: '좋은 향수입니다', date: '2023-10-18', likeCnt: 12, views: 65, rate: 4, state: 'ACTIVE' },
  ],
  10: [
    { id: 19, user: '사용자 S', title: '자연적인 느낌!', date: '2023-10-19', likeCnt: 10, views: 55, rate: 3, state: 'ACTIVE' },
    { id: 20, user: '사용자 T', title: '무난한 향수', date: '2023-10-20', likeCnt: 8, views: 45, rate: 3, state: 'ACTIVE' },
  ],
  11: [
    { id: 21, user: '사용자 U', title: '신선한 향!', date: '2023-10-21', likeCnt: 11, views: 60, rate: 5, state: 'ACTIVE' },
    { id: 22, user: '사용자 V', title: '매일 사용하고 싶어요', date: '2023-10-22', likeCnt: 9, views: 50, rate: 5, state: 'ACTIVE' },
  ],
  12: [
    { id: 23, user: '사용자 W', title: '상쾌한 아침', date: '2023-10-23', likeCnt: 12, views: 75, rate: 4, state: 'ACTIVE' },
    { id: 24, user: '사용자 X', title: '기분이 좋아져요', date: '2023-10-24', likeCnt: 10, views: 65, rate: 4, state: 'ACTIVE' },
  ],
  13: [
    { id: 25, user: '사용자 Y', title: '부드러운 향', date: '2023-10-25', likeCnt: 14, views: 80, rate: 5, state: 'ACTIVE' },
    { id: 26, user: '사용자 Z', title: '행복한 기억', date: '2023-10-26', likeCnt: 16, views: 85, rate: 5, state: 'ACTIVE' },
  ],
  14: [
    { id: 27, user: '사용자 AA', title: '따뜻한 향기', date: '2023-10-27', likeCnt: 12, views: 60, rate: 4, state: 'ACTIVE' },
    { id: 28, user: '사용자 AB', title: '기분이 좋아요', date: '2023-10-28', likeCnt: 15, views: 70, rate: 4, state: 'ACTIVE' },
  ],
  15: [
    { id: 29, user: '사용자 AC', title: '매혹적인 향', date: '2023-10-29', likeCnt: 20, views: 90, rate: 5, state: 'ACTIVE' },
    { id: 30, user: '사용자 AD', title: '정말 아름다워요', date: '2023-10-30', likeCnt: 18, views: 80, rate: 5, state: 'ACTIVE' },
  ],
  16: [
    { id: 31, user: '사용자 AE', title: '상큼한 여름', date: '2023-10-31', likeCnt: 11, views: 67, rate: 4, state: 'ACTIVE' },
    { id: 32, user: '사용자 AF', title: '상쾌한 향', date: '2023-11-01', likeCnt: 13, views: 72, rate: 4, state: 'ACTIVE' },
  ],

  17: [
    { id: 33, user: '사용자 AG', title: '차분한 느낌', date: '2023-11-02', likeCnt: 9, views: 50, rate: 5, state: 'ACTIVE' },
    { id: 34, user: '사용자 AH', title: '조화로운 향', date: '2023-11-03', likeCnt: 8, views: 45, rate: 5, state: 'ACTIVE' },
  ],
  18: [
    { id: 35, user: '사용자 AI', title: '상쾌한 아쿠아틱', date: '2023-11-04', likeCnt: 12, views: 60, rate: 3, state: 'ACTIVE' },
    { id: 36, user: '사용자 AJ', title: '여름에 잘 어울려요', date: '2023-11-05', likeCnt: 10, views: 55, rate: 3, state: 'ACTIVE' },
  ],
  19: [
    { id: 37, user: '사용자 AK', title: '깊고 매력적인 향', date: '2023-11-06', likeCnt: 15, views: 70, rate: 4, state: 'ACTIVE' },
    { id: 38, user: '사용자 AL', title: '우디와 플로럴의 조화', date: '2023-11-07', likeCnt: 12, views: 65, rate: 4, state: 'ACTIVE' },
  ],
  20: [
    { id: 39, user: '사용자 AM', title: '따뜻한 겨울에 딱!', date: '2023-11-08', likeCnt: 10, views: 50, rate: 4, state: 'ACTIVE' },
    { id: 40, user: '사용자 AN', title: '기분이 좋아지는 향', date: '2023-11-09', likeCnt: 9, views: 45, rate: 4, state: 'ACTIVE' },
  ],
  21: [
    { id: 41, user: '사용자 AO', title: '관능적인 향!', date: '2023-11-10', likeCnt: 20, views: 90, rate: 5, state: 'ACTIVE' },
    { id: 42, user: '사용자 AP', title: '매력적인 향수', date: '2023-11-11', likeCnt: 18, views: 85, rate: 5, state: 'ACTIVE' },
  ],
  22: [
    { id: 43, user: '사용자 AQ', title: '상쾌한 기분', date: '2023-11-12', likeCnt: 12, views: 60, rate: 3, state: 'ACTIVE' },
    { id: 44, user: '사용자 AR', title: '무난한 향', date: '2023-11-13', likeCnt: 10, views: 55, rate: 3, state: 'ACTIVE' },
  ],
  23: [
    { id: 45, user: '사용자 AS', title: '시원한 향이 좋습니다', date: '2023-11-14', likeCnt: 15, views: 65, rate: 4, state: 'ACTIVE' },
    { id: 46, user: '사용자 AT', title: '편안한 느낌', date: '2023-11-15', likeCnt: 13, views: 50, rate: 4, state: 'ACTIVE' },
  ],
  24: [
    { id: 47, user: '사용자 AU', title: '달콤한 향기', date: '2023-11-16', likeCnt: 20, views: 75, rate: 5, state: 'ACTIVE' },
    { id: 48, user: '사용자 AV', title: '행복한 향수', date: '2023-11-17', likeCnt: 18, views: 70, rate: 5, state: 'ACTIVE' },
  ],
  25: [
    { id: 49, user: '사용자 AW', title: '따뜻한 향이 좋아요', date: '2023-11-18', likeCnt: 11, views: 60, rate: 4, state: 'ACTIVE' },
    { id: 50, user: '사용자 AX', title: '정말 매력적입니다', date: '2023-11-19', likeCnt: 10, views: 55, rate: 4, state: 'ACTIVE' },
  ],
  26: [
    { id: 51, user: '사용자 AY', title: '상큼한 여름 향', date: '2023-11-20', likeCnt: 12, views: 65, rate: 3, state: 'ACTIVE' },
    { id: 52, user: '사용자 AZ', title: '무난한 향수입니다', date: '2023-11-21', likeCnt: 9, views: 50, rate: 3, state: 'ACTIVE' },
  ],
  27: [
    { id: 53, user: '사용자 BA', title: '달콤한 향', date: '2023-11-22', likeCnt: 14, views: 70, rate: 5, state: 'ACTIVE' },
    { id: 54, user: '사용자 BB', title: '편안한 향', date: '2023-11-23', likeCnt: 16, views: 75, rate: 5, state: 'ACTIVE' },
  ],
  28: [
    { id: 55, user: '사용자 BC', title: '좋은 향!', date: '2023-11-24', likeCnt: 10, views: 60, rate: 4, state: 'ACTIVE' },
    { id: 56, user: '사용자 BD', title: '상큼한 향수', date: '2023-11-25', likeCnt: 12, views: 65, rate: 4, state: 'ACTIVE' },
  ],
  29: [
    { id: 57, user: '사용자 BE', title: '매력적인 향', date: '2023-11-26', likeCnt: 20, views: 80, rate: 5, state: 'ACTIVE' },
    { id: 58, user: '사용자 BF', title: '정말 좋습니다', date: '2023-11-27', likeCnt: 18, views: 70, rate: 5, state: 'ACTIVE' },
  ],
  30: [
    { id: 59, user: '사용자 BG', title: '상큼한 느낌', date: '2023-11-28', likeCnt: 15, views: 65, rate: 4, state: 'ACTIVE' },
    { id: 60, user: '사용자 BH', title: '편안한 향수', date: '2023-11-29', likeCnt: 13, views: 60, rate: 4, state: 'ACTIVE' },
  ],
  31: [
    { id: 61, user: '사용자 BI', title: '향이 오래가요', date: '2023-11-30', likeCnt: 20, views: 90, rate: 5, state: 'ACTIVE' },
    { id: 62, user: '사용자 BJ', title: '여름에 잘 어울려요', date: '2023-12-01', likeCnt: 18, views: 85, rate: 5, state: 'ACTIVE' },
  ],
  32: [
    { id: 63, user: '사용자 BK', title: '아주 좋습니다', date: '2023-12-02', likeCnt: 12, views: 60, rate: 4, state: 'ACTIVE' },
    { id: 64, user: '사용자 BL', title: '상큼한 향이 좋아요', date: '2023-12-03', likeCnt: 10, views: 55, rate: 4, state: 'ACTIVE' },
  ],
  33: [
    { id: 65, user: '사용자 BM', title: '부드러운 향', date: '2023-12-04', likeCnt: 14, views: 70, rate: 5, state: 'ACTIVE' },
    { id: 66, user: '사용자 BN', title: '기분이 좋아지는 향', date: '2023-12-05', likeCnt: 12, views: 65, rate: 5, state: 'ACTIVE' },
  ],
  34: [
    { id: 67, user: '사용자 BO', title: '매혹적인 오리엔탈', date: '2023-12-06', likeCnt: 18, views: 80, rate: 5, state: 'ACTIVE' },
    { id: 68, user: '사용자 BP', title: '정말 좋습니다', date: '2023-12-07', likeCnt: 15, views: 75, rate: 5, state: 'ACTIVE' },
  ],
  35: [
    { id: 69, user: '사용자 BQ', title: '강렬한 향', date: '2023-12-08', likeCnt: 20, views: 90, rate: 5, state: 'ACTIVE' },
    { id: 70, user: '사용자 BR', title: '매력적인 향수', date: '2023-12-09', likeCnt: 22, views: 85, rate: 5, state: 'ACTIVE' },
  ],
  36: [
    { id: 71, user: '사용자 BS', title: '상큼한 과일향', date: '2023-12-10', likeCnt: 14, views: 65, rate: 4, state: 'ACTIVE' },
    { id: 72, user: '사용자 BT', title: '편안한 느낌', date: '2023-12-11', likeCnt: 11, views: 60, rate: 4, state: 'ACTIVE' },
  ],
  37: [
    { id: 73, user: '사용자 BU', title: '상쾌한 향!', date: '2023-12-12', likeCnt: 12, views: 55, rate: 3, state: 'ACTIVE' },
    { id: 74, user: '사용자 BV', title: '무난한 향수', date: '2023-12-13', likeCnt: 10, views: 50, rate: 3, state: 'ACTIVE' },
  ],
  38: [
    { id: 75, user: '사용자 BW', title: '기분이 좋아지는 향', date: '2023-12-14', likeCnt: 15, views: 70, rate: 4, state: 'ACTIVE' },
    { id: 76, user: '사용자 BX', title: '상큼한 여름', date: '2023-12-15', likeCnt: 18, views: 75, rate: 4, state: 'ACTIVE' },
  ],
  39: [
    { id: 77, user: '사용자 BY', title: '매력적인 향!', date: '2023-12-16', likeCnt: 20, views: 80, rate: 5, state: 'ACTIVE' },
    { id: 78, user: '사용자 BZ', title: '행복한 향수', date: '2023-12-17', likeCnt: 22, views: 85, rate: 5, state: 'ACTIVE' },
  ],
  40: [
    { id: 79, user: '사용자 CA', title: '상쾌한 아침', date: '2023-12-18', likeCnt: 14, views: 60, rate: 4, state: 'ACTIVE' },
    { id: 80, user: '사용자 CB', title: '편안한 느낌', date: '2023-12-19', likeCnt: 11, views: 55, rate: 4, state: 'ACTIVE' },
  ],
};


const OtherReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [perfumeList, setPerfumeList] = useState([]);
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerfumeList = async () => {
      try {
        const response = await axios.get('http://gachon-adore.duckdns.org:8081/user/perfume/perfume/list');
        if (response.data && response.data.length > 0) {
          setPerfumeList(response.data);
        } else {
          setPerfumeList(dummyData); // 서버에서 비어있는 리스트를 반환할 경우 더미 데이터 사용
        }
      } catch (error) {
        console.error('향수 리스트를 가져오는 중 오류 발생:', error);
        setPerfumeList(dummyData); // 오류가 발생해도 더미 데이터 사용
      }
    };

    fetchPerfumeList();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSelectFragrance = async (perfume) => {
    setSelectedPerfume(perfume);
    setIsModalOpen(false);

    try {
      const reviewsResponse = await axios.get(`http://gachon-adore.duckdns.org:8081/user/review/list`, {
        params: { perfume_id: perfume.id },
      });
      if (reviewsResponse.data && reviewsResponse.data.length > 0) {
        setReviews(reviewsResponse.data);
      } else {
        setReviews(dummyReviews[perfume.id] || []); // 서버에서 리뷰가 없으면 해당 향수의 더미 리뷰 사용
      }
    } catch (error) {
      console.error('리뷰를 가져오는 중 오류 발생:', error);
      setReviews(dummyReviews[perfume.id] || []); // 오류 발생 시에도 더미 리뷰 사용
    }
  };

  const handleWriteReview = () => {
    navigate('/mypage/reviewform');
  };

  const filteredReviews = reviews.filter((review) => review.state === 'ACTIVE');

  return (
    <div className="other-review-list-container">
      <PerfumeSidebar />
      <div className="other-review-list-content">
        <div className="other-review-list-header">
          <h1>향수 리뷰 보기</h1>
          <button className="other-review-list-select-btn" onClick={openModal}>향수 선택</button>
        </div>
        {selectedPerfume && (
          <div className="other-review-list-review-details">
            <div className="other-review-list-review-details-header">
              <h2>{selectedPerfume.perfume_nm}</h2>
              <span className="other-review-list-brand">{selectedPerfume.brand}</span>
            </div>
            <p>평점: {'★'.repeat(selectedPerfume.rating_value)}{'☆'.repeat(5 - selectedPerfume.rating_value)} ({selectedPerfume.rating_value})</p>
            <p>노트: {selectedPerfume.top} / {selectedPerfume.middle} / {selectedPerfume.base}</p>
            <p>{selectedPerfume.perfume_desc}</p>
          </div>
        )}
        <table className="other-review-list-review-table">
          <thead>
            <tr>
              <th>작성자</th>
              <th>제목</th>
              <th>별점</th>
              <th>추천 수</th>
              <th>조회수</th>
              <th>작성 날짜</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map((review) => (
              <tr key={review.id}>
                <td>{review.user}</td>
                <td>
                  <Link to={`/perfumerecommendation/review/${review.id}`} className="review-link">
                    {review.title}
                  </Link>
                </td>
                <td>{'★'.repeat(review.rate)}{'☆'.repeat(5 - review.rate)}</td>
                <td>{review.likeCnt}</td>
                <td>{review.views}</td>
                <td>{new Date(review.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="other-review-list-action-buttons">
          <button className="other-review-list-more-button">+ 더보기</button>
          <button className="other-review-list-write-button" onClick={handleWriteReview}>
            리뷰 작성
          </button>
        </div>

        {isModalOpen && (
          <FragranceSearchModal
            onClose={closeModal}
            onSelectFragrance={handleSelectFragrance}
            perfumeList={perfumeList}
          />
        )}
      </div>
    </div>
  );
};

export default OtherReviewList;