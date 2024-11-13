// src/components/PerfumeRecommendation/NoteList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoteSidebar from '../Sidebars/PerfumeSidebar';
import NoteItem from './NoteItem';
import NoteDetailModal from './NoteDetailModal';
import './NoteList.css';

const NoteList = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedNote, setSelectedNote] = useState(null); // 선택된 노트를 저장하는 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [notes, setNotes] = useState([]); // 노트 데이터를 저장할 상태
  const [mainCategories, setMainCategories] = useState([]); // 대분류 노트를 저장할 상태
  const [categoryDescription, setCategoryDescription] = useState(''); // 대분류 설명을 저장할 상태

  // 더미 데이터 부분 (내가 직접 추가할 부분)
  const dummyNotes = [
    { note_id: 1, note_nm: '시트러스', note_desc: '시트러스 계열은 상큼하고 활기찬 느낌을 주며, 주로 레몬, 오렌지, 베르가못과 같은 감귤류 과일에서 추출됩니다. 신선하고 밝은 향으로, 여름에 잘 어울립니다.', note_img: '/images/citrus.jpg', parent_note_id: -1 },
    { note_id: 2, note_nm: '플로랄', note_desc: '플로랄 향은 장미, 라벤더, 재스민 등 다양한 꽃에서 유래하며, 부드럽고 여성스러운 분위기를 자아냅니다. 이 향조는 주로 로맨틱하고 우아한 느낌을 선호하는 이들에게 인기가 많습니다.', note_img: '/images/floral.jpg', parent_note_id: -1 },
    { note_id: 3, note_nm: '우디', note_desc: '우디 계열은 나무와 뿌리에서 얻은 깊고 따뜻한 향으로, 삼나무, 샌달우드, 파출리 등이 포함됩니다. 차분하고 성숙한 분위기를 연출하며, 가을과 겨울에 잘 어울립니다.', note_img: '/images/woody.jpg', parent_note_id: -1 },
    { note_id: 4, note_nm: '프루티', note_desc: '프루티 계열은 사과, 복숭아, 체리 등 과일 향을 연상시키며, 달콤하고 상쾌한 느낌을 줍니다. 가볍고 경쾌한 향조로 일상적인 분위기에 적합합니다.', note_img: '/images/fruity.jpg', parent_note_id: -1 },
    { note_id: 5, note_nm: '머스크', note_desc: '머스크 계열은 따뜻하고 부드러운 잔향을 남기며, 편안하고 포근한 느낌을 줍니다. 이 향조는 주로 피부에 오래 남아 은은한 여운을 남기는 특징이 있습니다.', note_img: '/images/musk.jpg', parent_note_id: -1 },
    { note_id: 6, note_nm: '스파이시', note_desc: '스파이시 계열은 후추, 정향, 육두구 등 매콤하고 강렬한 향을 지닌 향조입니다. 따뜻하면서도 신비로운 매력을 지니며, 독특한 분위기를 연출합니다.', note_img: '/images/spicy.jpg', parent_note_id: -1 },
    { note_id: 7, note_nm: '오리엔탈', note_desc: '오리엔탈 향조는 이국적이고 관능적인 느낌으로, 바닐라, 앰버, 미르와 같은 향이 포함됩니다. 따뜻하고 무게감 있는 향으로, 깊이 있는 향취를 선호하는 이들에게 적합합니다.', note_img: '/images/oriental.jpg', parent_note_id: -1 },
    { note_id: 8, note_nm: '아쿠아틱', note_desc: '아쿠아틱 향조는 바다와 물에서 영감을 받아 시원하고 상쾌한 향을 지닙니다. 청량하고 깨끗한 느낌을 주어 여름철이나 일상적인 분위기에 잘 어울립니다.', note_img: '/images/aquatic.jpg', parent_note_id: -1 },
    { note_id: 9, note_nm: '그린', note_desc: '그린 계열은 풀잎, 잔디, 녹색 잎에서 느낄 수 있는 신선하고 초록빛 나는 향을 담고 있습니다. 자연적이고 생기 넘치는 분위기를 선사하며, 상쾌한 느낌을 줍니다.', note_img: '/images/green.jpg', parent_note_id: -1 },
    { note_id: 10, note_nm: '허벌', note_desc: '허벌 계열은 라벤더, 바질, 세이지와 같은 허브의 향을 연상시킵니다. 청량하고 약초 같은 향취로, 편안한 느낌을 주며 자연을 닮은 향을 좋아하는 이들에게 인기가 많습니다.', note_img: '/images/herbal.jpg', parent_note_id: -1 },
    { note_id: 11, note_nm: '푸제르', note_desc: '푸제르 계열은 라벤더, 이끼, 쿠마린 등에서 유래하며 클래식하고 전통적인 향수에 많이 사용됩니다. 우디하고 신선한 향으로, 차분한 분위기를 연출하는 데 적합합니다.', note_img: '/images/fougere.jpg', parent_note_id: -1 },
    { note_id: 12, note_nm: '고메', note_desc: '고메 향조는 초콜릿, 커피, 바닐라와 같은 달콤한 향을 포함하여, 달콤하고 맛있는 느낌을 줍니다. 주로 따뜻하고 아늑한 분위기를 선호하는 사람들에게 인기가 있습니다.', note_img: '/images/gourmand.jpg', parent_note_id: -1 },
  
  // 시트러스 하위그룹 노트들 (parent_note_id: 1)
    { note_id: 101, note_nm: '레몬', note_desc: '신선한 레몬 향.', note_img: '/images/lemon.jpg', parent_note_id: 1 },
    { note_id: 102, note_nm: '라임', note_desc: '상큼한 라임 향.', note_img: '/images/lime.jpg', parent_note_id: 1 },
    { note_id: 103, note_nm: '베르가못', note_desc: '살짝 쌉싸름한 베르가못 향.', note_img: '/images/bergamot.jpg', parent_note_id: 1 },
    { note_id: 104, note_nm: '자몽', note_desc: '상큼한 자몽 향.', note_img: '/images/grapefruit.jpg', parent_note_id: 1 },
    { note_id: 105, note_nm: '오렌지 블로썸', note_desc: '부드러운 오렌지 꽃 향.', note_img: '/images/orange_blossom.jpg', parent_note_id: 1 },
    { note_id: 106, note_nm: '만다린', note_desc: '달콤한 만다린 오렌지 향.', note_img: '/images/mandarin.jpg', parent_note_id: 1 },
    { note_id: 107, note_nm: '유자', note_desc: '독특한 유자 향.', note_img: '/images/yuzu.jpg', parent_note_id: 1 },
    { note_id: 108, note_nm: '핑크 자몽', note_desc: '상쾌한 핑크 자몽 향.', note_img: '/images/pink_grapefruit.jpg', parent_note_id: 1 },
    { note_id: 109, note_nm: '카피르 라임', note_desc: '신선하고 톡 쏘는 라임 향.', note_img: '/images/kafir_lime.jpg', parent_note_id: 1 },
    { note_id: 110, note_nm: '시트론', note_desc: '고전적인 시트론 향.', note_img: '/images/citron.jpg', parent_note_id: 1 },
    { note_id: 111, note_nm: '비터 오렌지', note_desc: '쌉싸름한 비터 오렌지 향.', note_img: '/images/bitter_orange.jpg', parent_note_id: 1 },
    { note_id: 112, note_nm: '칼라몬딘', note_desc: '감귤과 유사한 칼라몬딘 향.', note_img: '/images/calamondin.jpg', parent_note_id: 1 },
    { note_id: 113, note_nm: '레몬 버베나', note_desc: '레몬과 비슷한 허브 향.', note_img: '/images/lemon_verbena.jpg', parent_note_id: 1 },
    { note_id: 114, note_nm: '카모마일', note_desc: '부드러운 카모마일 향.', note_img: '/images/chamomile.jpg', parent_note_id: 1 },
    { note_id: 115, note_nm: '베르가못 오일', note_desc: '베르가못의 에센셜 오일 향.', note_img: '/images/bergamot_oil.jpg', parent_note_id: 1 },
    { note_id: 116, note_nm: '시트러스 잎', note_desc: '신선한 시트러스 잎 향.', note_img: '/images/citrus_leaf.jpg', parent_note_id: 1 },
    { note_id: 117, note_nm: '카프리 레몬', note_desc: '이탈리아 카프리에서 나는 레몬 향.', note_img: '/images/capri_lemon.jpg', parent_note_id: 1 },
    { note_id: 118, note_nm: '이탈리안 시트러스', note_desc: '이탈리아 시트러스의 시원한 향.', note_img: '/images/italian_citrus.jpg', parent_note_id: 1 },
    { note_id: 119, note_nm: '브라질리안 오렌지', note_desc: '열대 오렌지의 강렬한 향.', note_img: '/images/brazil_orange.jpg', parent_note_id: 1 },
    { note_id: 120, note_nm: '시실리안 레몬', note_desc: '시실리안 레몬의 상쾌한 향.', note_img: '/images/sicilian_lemon.jpg', parent_note_id: 1 },
  
    // 플로랄 하위그룹 노트들 (parent_note_id: 2)
    { note_id: 201, note_nm: '장미', note_desc: '부드럽고 달콤한 장미 향.', note_img: '/images/rose.jpg', parent_note_id: 2 },
    { note_id: 202, note_nm: '라벤더', note_desc: '평온하고 우아한 라벤더 향.', note_img: '/images/lavender.jpg', parent_note_id: 2 },
    { note_id: 203, note_nm: '재스민', note_desc: '매혹적인 재스민 향.', note_img: '/images/jasmine.jpg', parent_note_id: 2 },
    { note_id: 204, note_nm: '릴리', note_desc: '순수하고 우아한 백합 향.', note_img: '/images/lily.jpg', parent_note_id: 2 },
    { note_id: 205, note_nm: '모란', note_desc: '부드러운 모란 꽃 향.', note_img: '/images/peony.jpg', parent_note_id: 2 },
    { note_id: 206, note_nm: '튤립', note_desc: '상큼하고 가벼운 튤립 향.', note_img: '/images/tulip.jpg', parent_note_id: 2 },
    { note_id: 207, note_nm: '아이리스', note_desc: '깊이 있고 우아한 아이리스 향.', note_img: '/images/iris.jpg', parent_note_id: 2 },
    { note_id: 208, note_nm: '가드니아', note_desc: '달콤하고 풍성한 가드니아 향.', note_img: '/images/gardenia.jpg', parent_note_id: 2 },
    { note_id: 209, note_nm: '히아신스', note_desc: '은은하고 부드러운 히아신스 향.', note_img: '/images/hyacinth.jpg', parent_note_id: 2 },
    { note_id: 210, note_nm: '히비스커스', note_desc: '이국적이고 화려한 히비스커스 향.', note_img: '/images/hibiscus.jpg', parent_note_id: 2 },
    { note_id: 211, note_nm: '매그놀리아', note_desc: '부드럽고 은은한 매그놀리아 향.', note_img: '/images/magnolia.jpg', parent_note_id: 2 },
    { note_id: 212, note_nm: '모란', note_desc: '상쾌하고 산뜻한 모란 향.', note_img: '/images/peony.jpg', parent_note_id: 2 },
    { note_id: 213, note_nm: '데이지', note_desc: '밝고 가벼운 데이지 향.', note_img: '/images/daisy.jpg', parent_note_id: 2 },
    { note_id: 214, note_nm: '제비꽃', note_desc: '부드럽고 향긋한 제비꽃 향.', note_img: '/images/violet.jpg', parent_note_id: 2 },
    { note_id: 215, note_nm: '프리지아', note_desc: '상쾌한 프리지아 향.', note_img: '/images/freesia.jpg', parent_note_id: 2 },
    { note_id: 216, note_nm: '포피', note_desc: '부드럽고 약간의 단맛이 느껴지는 포피 향.', note_img: '/images/poppy.jpg', parent_note_id: 2 },
    { note_id: 217, note_nm: '캐모마일', note_desc: '달콤하고 아로마틱한 캐모마일 향.', note_img: '/images/chamomile.jpg', parent_note_id: 2 },
    { note_id: 218, note_nm: '베르가못', note_desc: '시트러스 계열의 상쾌한 베르가못 향.', note_img: '/images/bergamot.jpg', parent_note_id: 2 },
    { note_id: 219, note_nm: '카멜리아', note_desc: '은은하고 고급스러운 카멜리아 향.', note_img: '/images/camellia.jpg', parent_note_id: 2 },
    { note_id: 220, note_nm: '카멜리아', note_desc: '은은하고 고급스러운 카멜리아 향.', note_img: '/images/camellia.jpg', parent_note_id: 2 },
  
    // 우디 하위그룹 노트들 (parent_note_id: 3)
    { note_id: 301, note_nm: '샌달우드', note_desc: '부드럽고 따뜻한 샌달우드 향.', note_img: '/images/sandalwood.jpg', parent_note_id: 3 },
    { note_id: 302, note_nm: '시더우드', note_desc: '깊고 묵직한 시더우드 향.', note_img: '/images/cedarwood.jpg', parent_note_id: 3 },
    { note_id: 303, note_nm: '파출리', note_desc: '이국적인 파출리 향.', note_img: '/images/patchouli.jpg', parent_note_id: 3 },
    { note_id: 304, note_nm: '오크모스', note_desc: '숲속의 향기 같은 오크모스.', note_img: '/images/oakmoss.jpg', parent_note_id: 3 },
    { note_id: 305, note_nm: '베티버', note_desc: '우디하면서 흙 내음이 나는 베티버 향.', note_img: '/images/vetiver.jpg', parent_note_id: 3 },
    { note_id: 306, note_nm: '티크우드', note_desc: '티크 나무의 고유한 향.', note_img: '/images/teakwood.jpg', parent_note_id: 3 },
    { note_id: 307, note_nm: '로즈우드', note_desc: '은은하고 부드러운 로즈우드 향.', note_img: '/images/rosewood.jpg', parent_note_id: 3 },
    { note_id: 308, note_nm: '유칼립투스', note_desc: '상쾌한 유칼립투스 향.', note_img: '/images/eucalyptus.jpg', parent_note_id: 3 },
    { note_id: 309, note_nm: '시카모어', note_desc: '부드럽고 상쾌한 시카모어 향.', note_img: '/images/sycamore.jpg', parent_note_id: 3 },
    { note_id: 310, note_nm: '아가우드', note_desc: '깊고 풍부한 아가우드 향.', note_img: '/images/agarwood.jpg', parent_note_id: 3 },
    { note_id: 311, note_nm: '가이악우드', note_desc: '강렬한 가이악우드 향.', note_img: '/images/guaiacwood.jpg', parent_note_id: 3 },
    { note_id: 312, note_nm: '캐시미어우드', note_desc: '부드러운 캐시미어우드 향.', note_img: '/images/cashmerewood.jpg', parent_note_id: 3 },
    { note_id: 313, note_nm: '엠버우드', note_desc: '따뜻한 엠버우드 향.', note_img: '/images/amberwood.jpg', parent_note_id: 3 },
    { note_id: 314, note_nm: '가죽', note_desc: '고급스러운 가죽 향.', note_img: '/images/leather.jpg', parent_note_id: 3 },
    { note_id: 315, note_nm: '유목', note_desc: '독특한 유목의 향.', note_img: '/images/driftwood.jpg', parent_note_id: 3 },
    { note_id: 316, note_nm: '흙내음', note_desc: '촉촉한 흙 내음.', note_img: '/images/earth.jpg', parent_note_id: 3 },
    { note_id: 317, note_nm: '솔잎', note_desc: '상쾌한 솔잎 향.', note_img: '/images/pine.jpg', parent_note_id: 3 },
    { note_id: 318, note_nm: '클로브우드', note_desc: '스파이시한 클로브우드 향.', note_img: '/images/clovewood.jpg', parent_note_id: 3 },
    { note_id: 319, note_nm: '라벤더 우드', note_desc: '부드럽고 은은한 라벤더 우드 향.', note_img: '/images/lavender_wood.jpg', parent_note_id: 3 },
    { note_id: 320, note_nm: '하드우드', note_desc: '강하고 묵직한 하드우드 향.', note_img: '/images/hardwood.jpg', parent_note_id: 3 },
  
    // 프루티 하위그룹 노트들 (parent_note_id: 4)
    { note_id: 401, note_nm: '복숭아', note_desc: '달콤하고 과즙이 풍부한 복숭아 향.', note_img: '/images/peach.jpg', parent_note_id: 4 },
    { note_id: 402, note_nm: '체리', note_desc: '달콤한 체리 향.', note_img: '/images/cherry.jpg', parent_note_id: 4 },
    { note_id: 403, note_nm: '블랙커런트', note_desc: '상쾌하고 약간 쌉싸름한 블랙커런트 향.', note_img: '/images/blackcurrant.jpg', parent_note_id: 4 },
    { note_id: 404, note_nm: '파인애플', note_desc: '열대 과일의 상큼한 파인애플 향.', note_img: '/images/pineapple.jpg', parent_note_id: 4 },
    { note_id: 405, note_nm: '망고', note_desc: '진한 열대 망고 향.', note_img: '/images/mango.jpg', parent_note_id: 4 },
    { note_id: 406, note_nm: '애플', note_desc: '달콤한 애플 향.', note_img: '/images/apple.jpg', parent_note_id: 4 },
    { note_id: 407, note_nm: '자두', note_desc: '신선하고 달콤한 자두 향.', note_img: '/images/plum.jpg', parent_note_id: 4 },
    { note_id: 408, note_nm: '베리 믹스', note_desc: '여러 종류의 베리 향.', note_img: '/images/berry_mix.jpg', parent_note_id: 4 },
    { note_id: 409, note_nm: '배', note_desc: '부드럽고 상큼한 배 향.', note_img: '/images/pear.jpg', parent_note_id: 4 },
    { note_id: 410, note_nm: '딸기', note_desc: '달콤한 딸기 향.', note_img: '/images/strawberry.jpg', parent_note_id: 4 },
    { note_id: 411, note_nm: '살구', note_desc: '상큼한 살구 향.', note_img: '/images/apricot.jpg', parent_note_id: 4 },
    { note_id: 412, note_nm: '무화과', note_desc: '독특한 무화과 향.', note_img: '/images/fig.jpg', parent_note_id: 4 },
    { note_id: 413, note_nm: '레드 커런트', note_desc: '상쾌한 레드 커런트 향.', note_img: '/images/redcurrant.jpg', parent_note_id: 4 },
    { note_id: 414, note_nm: '카시스', note_desc: '달콤한 카시스 향.', note_img: '/images/cassis.jpg', parent_note_id: 4 },
    { note_id: 415, note_nm: '멜론', note_desc: '상큼한 멜론 향.', note_img: '/images/melon.jpg', parent_note_id: 4 },
    { note_id: 416, note_nm: '수박', note_desc: '시원하고 상쾌한 수박 향.', note_img: '/images/watermelon.jpg', parent_note_id: 4 },
    { note_id: 417, note_nm: '그레이프', note_desc: '달콤한 포도 향.', note_img: '/images/grape.jpg', parent_note_id: 4 },
    { note_id: 418, note_nm: '코코넛', note_desc: '부드러운 코코넛 향.', note_img: '/images/coconut.jpg', parent_note_id: 4 },
    { note_id: 419, note_nm: '크랜베리', note_desc: '상큼한 크랜베리 향.', note_img: '/images/cranberry.jpg', parent_note_id: 4 },
    { note_id: 420, note_nm: '파파야', note_desc: '달콤한 파파야 향.', note_img: '/images/papaya.jpg', parent_note_id: 4 },
  
    // 머스크 하위그룹 노트들 (parent_note_id: 5)
    { note_id: 501, note_nm: '화이트 머스크', note_desc: '순수하고 은은한 머스크 향.', note_img: '/images/white_musk.jpg', parent_note_id: 5 },
    { note_id: 502, note_nm: '블랙 머스크', note_desc: '깊고 관능적인 블랙 머스크 향.', note_img: '/images/black_musk.jpg', parent_note_id: 5 },
    { note_id: 503, note_nm: '크리스탈 머스크', note_desc: '맑고 투명한 크리스탈 머스크 향.', note_img: '/images/crystal_musk.jpg', parent_note_id: 5 },
    { note_id: 504, note_nm: '러버 머스크', note_desc: '향긋한 고무 향이 가미된 머스크 향.', note_img: '/images/leather_musk.jpg', parent_note_id: 5 },
    { note_id: 505, note_nm: '머스크 플라워', note_desc: '은은하게 퍼지는 머스크 꽃 향.', note_img: '/images/musk_flower.jpg', parent_note_id: 5 },
    { note_id: 506, note_nm: '화이트 시스터 머스크', note_desc: '순수하고 부드러운 화이트 시스터 머스크 향.', note_img: '/images/white_sister_musk.jpg', parent_note_id: 5 },
    { note_id: 507, note_nm: '베이비 파우더 머스크', note_desc: '부드러운 베이비 파우더 향과 머스크 향의 조화.', note_img: '/images/baby_powder_musk.jpg', parent_note_id: 5 },
    { note_id: 508, note_nm: '퍼퓸 머스크', note_desc: '부드럽고 향긋한 향을 가진 퍼퓸 머스크 향.', note_img: '/images/perfume_musk.jpg', parent_note_id: 5 },
    { note_id: 509, note_nm: '미스틱 머스크', note_desc: '비밀스럽고 신비한 느낌의 머스크 향.', note_img: '/images/mystic_musk.jpg', parent_note_id: 5 },
    { note_id: 510, note_nm: '머스크 앰버', note_desc: '따뜻하고 깊이 있는 머스크와 앰버 향의 조화.', note_img: '/images/musk_amber.jpg', parent_note_id: 5 },
    { note_id: 511, note_nm: '화이트 머스크 시더', note_desc: '시더우드의 나무 향과 머스크가 결합된 향.', note_img: '/images/white_musk_cedar.jpg', parent_note_id: 5 },
    { note_id: 512, note_nm: '모스크 롤', note_desc: '부드럽고 여운이 남는 롤 향.', note_img: '/images/musk_roll.jpg', parent_note_id: 5 },
    { note_id: 513, note_nm: '패출리 머스크', note_desc: '패출리 향과 결합된 머스크 향.', note_img: '/images/patchouli_musk.jpg', parent_note_id: 5 },
    { note_id: 514, note_nm: '레드 머스크', note_desc: '감각적이고 관능적인 레드 머스크 향.', note_img: '/images/red_musk.jpg', parent_note_id: 5 },
    { note_id: 515, note_nm: '심플 머스크', note_desc: '간결하고 깨끗한 느낌의 심플 머스크 향.', note_img: '/images/simple_musk.jpg', parent_note_id: 5 },
    { note_id: 516, note_nm: '모던 머스크', note_desc: '모던하고 신선한 머스크 향.', note_img: '/images/modern_musk.jpg', parent_note_id: 5 },
    { note_id: 517, note_nm: '스위트 머스크', note_desc: '달콤하고 부드러운 스위트 머스크 향.', note_img: '/images/sweet_musk.jpg', parent_note_id: 5 },
    { note_id: 518, note_nm: '베이비 머스크', note_desc: '부드럽고 귀여운 베이비 머스크 향.', note_img: '/images/baby_musk.jpg', parent_note_id: 5 },
    { note_id: 519, note_nm: '자연 머스크', note_desc: '자연의 순수함을 느낄 수 있는 머스크 향.', note_img: '/images/natural_musk.jpg', parent_note_id: 5 },
    { note_id: 520, note_nm: '엘레강트 머스크', note_desc: '우아하고 고급스러운 엘레강트 머스크 향.', note_img: '/images/elegant_musk.jpg', parent_note_id: 5 },
  
  // 스파이시 하위그룹 노트들 (parent_note_id: 6)
    { note_id: 601, note_nm: '후추', note_desc: '매운 향과 톡 쏘는 느낌을 주는 후추 향.', note_img: '/images/pepper.jpg', parent_note_id: 6 },
    { note_id: 602, note_nm: '정향', note_desc: '강렬하고 따뜻한 정향의 향.', note_img: '/images/clove.jpg', parent_note_id: 6 },
    { note_id: 603, note_nm: '육두구', note_desc: '매콤하고 풍부한 향, 육두구.', note_img: '/images/nutmeg.jpg', parent_note_id: 6 },
    { note_id: 604, note_nm: '시나몬', note_desc: '달콤하면서도 강렬한 시나몬 향.', note_img: '/images/cinnamon.jpg', parent_note_id: 6 },
    { note_id: 605, note_nm: '카다몬', note_desc: '상쾌하면서도 매운 카다몬 향.', note_img: '/images/cardamom_spicy.jpg', parent_note_id: 6 },
    { note_id: 606, note_nm: '고추', note_desc: '강한 매운맛과 불꽃처럼 뜨거운 향.', note_img: '/images/chili.jpg', parent_note_id: 6 },
    { note_id: 607, note_nm: '생강', note_desc: '따뜻하고 매운 생강 향.', note_img: '/images/ginger.jpg', parent_note_id: 6 },
    { note_id: 608, note_nm: '타임', note_desc: '약간의 쓴맛과 매운 느낌을 주는 타임 향.', note_img: '/images/thyme.jpg', parent_note_id: 6 },
    { note_id: 609, note_nm: '홀리바질', note_desc: '강렬한 향신료 향을 지닌 홀리바질.', note_img: '/images/holy_basil.jpg', parent_note_id: 6 },
    { note_id: 610, note_nm: '로즈마리', note_desc: '상쾌하고 매운 로즈마리 향.', note_img: '/images/rosemary.jpg', parent_note_id: 6 },
    { note_id: 611, note_nm: '베이 리프', note_desc: '상쾌하고 향긋한 베이 리프 향.', note_img: '/images/bay_leaf.jpg', parent_note_id: 6 },
    { note_id: 612, note_nm: '머스타드', note_desc: '강렬한 맛과 매운 향을 지닌 머스타드 향.', note_img: '/images/mustard.jpg', parent_note_id: 6 },
    { note_id: 613, note_nm: '바질', note_desc: '매운 향과 신선한 느낌을 주는 바질 향.', note_img: '/images/basil_spicy.jpg', parent_note_id: 6 },
    { note_id: 614, note_nm: '카이엔 페퍼', note_desc: '강하고 매운 카이엔 페퍼 향.', note_img: '/images/cayenne_pepper.jpg', parent_note_id: 6 },
    { note_id: 615, note_nm: '가람 마살라', note_desc: '인도 향신료인 가람 마살라 향.', note_img: '/images/garam_masala.jpg', parent_note_id: 6 },
    { note_id: 616, note_nm: '스모키 페퍼', note_desc: '매운 향과 함께 스모키한 향을 지닌 스모키 페퍼.', note_img: '/images/smoky_pepper.jpg', parent_note_id: 6 },
    { note_id: 617, note_nm: '크럼블드 페퍼', note_desc: '강렬한 향을 지닌 크럼블드 페퍼.', note_img: '/images/crumpled_pepper.jpg', parent_note_id: 6 },
    { note_id: 618, note_nm: '갈릭', note_desc: '강하고 매운 향을 지닌 마늘 향.', note_img: '/images/garlic.jpg', parent_note_id: 6 },
    { note_id: 619, note_nm: '티머', note_desc: '매운 향을 지닌 티머 향.', note_img: '/images/tamarind.jpg', parent_note_id: 6 },
    { note_id: 620, note_nm: '스위트 페퍼민트', note_desc: '상쾌하면서도 매운 스위트 페퍼민트 향.', note_img: '/images/sweet_peppermint.jpg', parent_note_id: 6 },
  
  // 오리엔탈 하위그룹 노트들 (parent_note_id: 7)
    { note_id: 701, note_nm: '바닐라', note_desc: '따뜻하고 달콤한 바닐라 향.', note_img: '/images/vanilla.jpg', parent_note_id: 7 },
    { note_id: 702, note_nm: '앰버', note_desc: '따뜻하고 깊이 있는 앰버 향.', note_img: '/images/amber.jpg', parent_note_id: 7 },
    { note_id: 703, note_nm: '미르', note_desc: '이국적이고 신비한 미르 향.', note_img: '/images/myrrh.jpg', parent_note_id: 7 },
    { note_id: 704, note_nm: '사프란', note_desc: '향긋하고 풍부한 사프란 향.', note_img: '/images/saffron.jpg', parent_note_id: 7 },
    { note_id: 705, note_nm: '오리엔탈 플로랄', note_desc: '오리엔탈과 플로랄 향이 결합된 조화로운 향.', note_img: '/images/oriental_floral.jpg', parent_note_id: 7 },
    { note_id: 706, note_nm: '탈크', note_desc: '부드럽고 온화한 향, 고요함을 선사하는 탈크 향.', note_img: '/images/talc.jpg', parent_note_id: 7 },
    { note_id: 707, note_nm: '무스크', note_desc: '강렬하고 따뜻한 머스크 향.', note_img: '/images/musk_oriental.jpg', parent_note_id: 7 },
    { note_id: 708, note_nm: '로즈', note_desc: '부드럽고 여성스러운 장미 향.', note_img: '/images/rose_oriental.jpg', parent_note_id: 7 },
    { note_id: 709, note_nm: '가드니아', note_desc: '상쾌하고 우아한 가드니아 향.', note_img: '/images/gardenia.jpg', parent_note_id: 7 },
    { note_id: 710, note_nm: '바르바드', note_desc: '따뜻하고 우아한 바르바드 향.', note_img: '/images/barbados.jpg', parent_note_id: 7 },
    { note_id: 711, note_nm: '카다몬', note_desc: '신선하고 따뜻한 카다몬 향.', note_img: '/images/cardamom.jpg', parent_note_id: 7 },
    { note_id: 712, note_nm: '패출리', note_desc: '나무와 흙의 깊이 있는 향, 패출리.', note_img: '/images/patchouli_oriental.jpg', parent_note_id: 7 },
    { note_id: 713, note_nm: '시더우드', note_desc: '따뜻하고 상쾌한 시더우드 향.', note_img: '/images/cedarwood.jpg', parent_note_id: 7 },
    { note_id: 714, note_nm: '스파이스', note_desc: '매운 향의 스파이시 향.', note_img: '/images/spices_oriental.jpg', parent_note_id: 7 },
    { note_id: 715, note_nm: '베르가못', note_desc: '상쾌하고 시트러스한 향.', note_img: '/images/bergamot_oriental.jpg', parent_note_id: 7 },
    { note_id: 716, note_nm: '카카오', note_desc: '달콤하고 강렬한 카카오 향.', note_img: '/images/cocoa.jpg', parent_note_id: 7 },
    { note_id: 717, note_nm: '피넛', note_desc: '고소하고 따뜻한 피넛 향.', note_img: '/images/peanut.jpg', parent_note_id: 7 },
    { note_id: 718, note_nm: '레더', note_desc: '고급스럽고 따뜻한 가죽 향.', note_img: '/images/leather_oriental.jpg', parent_note_id: 7 },
    { note_id: 719, note_nm: '자스민', note_desc: '이국적이고 우아한 자스민 향.', note_img: '/images/jasmine_oriental.jpg', parent_note_id: 7 },
    { note_id: 720, note_nm: '오리엔탈 나무', note_desc: '따뜻하고 깊이 있는 나무 향.', note_img: '/images/oriental_wood.jpg', parent_note_id: 7 },
  
  // 아쿠아틱 하위그룹 노트들 (parent_note_id: 8)
    { note_id: 801, note_nm: '오션', note_desc: '바다와 바람을 연상시키는 시원한 향.', note_img: '/images/ocean.jpg', parent_note_id: 8 },
    { note_id: 802, note_nm: '바다', note_desc: '심해의 시원하고 맑은 느낌의 향.', note_img: '/images/sea.jpg', parent_note_id: 8 },
    { note_id: 803, note_nm: '수영장', note_desc: '수영장에서 느낄 수 있는 신선한 물의 향.', note_img: '/images/swimming_pool.jpg', parent_note_id: 8 },
    { note_id: 804, note_nm: '해양', note_desc: '짭짤하고 깨끗한 해양의 향기.', note_img: '/images/marine.jpg', parent_note_id: 8 },
    { note_id: 805, note_nm: '비', note_desc: '비가 내린 후의 상쾌하고 맑은 공기 향.', note_img: '/images/rain.jpg', parent_note_id: 8 },
    { note_id: 806, note_nm: '아쿠아', note_desc: '신선하고 깨끗한 물에서 나는 시원한 향.', note_img: '/images/aqua.jpg', parent_note_id: 8 },
    { note_id: 807, note_nm: '바람', note_desc: '산들바람이 불 때의 상쾌한 물기 있는 향.', note_img: '/images/wind.jpg', parent_note_id: 8 },
    { note_id: 808, note_nm: '상쾌한 공기', note_desc: '맑고 깨끗한 공기에서 느껴지는 신선한 향.', note_img: '/images/fresh_air.jpg', parent_note_id: 8 },
    { note_id: 809, note_nm: '소금', note_desc: '짠맛과 함께 바다를 연상시키는 소금 향.', note_img: '/images/salt.jpg', parent_note_id: 8 },
    { note_id: 810, note_nm: '프레시', note_desc: '신선하고 상큼한 느낌을 주는 향.', note_img: '/images/fresh.jpg', parent_note_id: 8 },
    { note_id: 811, note_nm: '풀밭', note_desc: '초록색 풀밭과 이슬에 젖은 풀의 향.', note_img: '/images/grass.jpg', parent_note_id: 8 },
    { note_id: 812, note_nm: '습기', note_desc: '살짝 젖어 있는 공기에서 나는 습한 향기.', note_img: '/images/moisture.jpg', parent_note_id: 8 },
    { note_id: 813, note_nm: '폭포', note_desc: '물방울이 떨어지는 소리와 함께 시원한 물의 향.', note_img: '/images/waterfall.jpg', parent_note_id: 8 },
    { note_id: 814, note_nm: '수면', note_desc: '조용한 물 위에서 반사되는 맑고 고요한 느낌의 향.', note_img: '/images/surface_water.jpg', parent_note_id: 8 },
    { note_id: 815, note_nm: '호수', note_desc: '고요한 호수에서 나는 신선하고 깨끗한 물 향.', note_img: '/images/lake.jpg', parent_note_id: 8 },
    { note_id: 816, note_nm: '차가운 물', note_desc: '차가운 물에서 나는 시원하고 맑은 향.', note_img: '/images/cold_water.jpg', parent_note_id: 8 },
    { note_id: 817, note_nm: '해변', note_desc: '해변에서 불어오는 바람과 함께 나는 해양 향.', note_img: '/images/beach.jpg', parent_note_id: 8 },
    { note_id: 818, note_nm: '이슬', note_desc: '아침 이슬이 맺힌 풀밭의 상쾌한 향.', note_img: '/images/dew.jpg', parent_note_id: 8 },
    { note_id: 819, note_nm: '빙하', note_desc: '차갑고 신선한 빙하의 향.', note_img: '/images/glacier.jpg', parent_note_id: 8 },
    { note_id: 820, note_nm: '빙수', note_desc: '차가운 얼음과 물로 만든 상쾌한 향.', note_img: '/images/shaved_ice.jpg', parent_note_id: 8 },
  
  // 그린 하위그룹 노트들 (parent_note_id: 9)
    { note_id: 901, note_nm: '풀밭', note_desc: '초록색 풀밭에서 느낄 수 있는 신선하고 상쾌한 풀향.', note_img: '/images/grass.jpg', parent_note_id: 9 },
    { note_id: 902, note_nm: '초록잎', note_desc: '갓 자란 초록잎에서 나오는 싱그럽고 풋풋한 향.', note_img: '/images/green_leaf.jpg', parent_note_id: 9 },
    { note_id: 903, note_nm: '허브', note_desc: '타임, 민트, 바질 등 허브에서 유래한 신선하고 강한 향.', note_img: '/images/herbs.jpg', parent_note_id: 9 },
    { note_id: 904, note_nm: '숲', note_desc: '진한 나무향과 함께 신선하고 청량한 풀밭 향이 나는 숲의 향.', note_img: '/images/forest.jpg', parent_note_id: 9 },
    { note_id: 905, note_nm: '소나무', note_desc: '청량하고 시원한 소나무 숲에서 나는 풀냄새가 느껴지는 향.', note_img: '/images/pine.jpg', parent_note_id: 9 },
    { note_id: 906, note_nm: '시가풀', note_desc: '시가풀로 만들어낸 그린 향, 약간의 풀 향기가 섞인 시원한 향.', note_img: '/images/sedge.jpg', parent_note_id: 9 },
    { note_id: 907, note_nm: '녹차', note_desc: '상쾌하고 고요한 자연을 연상시키는 차 향.', note_img: '/images/green_tea.jpg', parent_note_id: 9 },
    { note_id: 908, note_nm: '초록숲', note_desc: '초록색의 숲과 풀들이 어우러져 조화를 이루는 향.', note_img: '/images/green_forest.jpg', parent_note_id: 9 },
    { note_id: 909, note_nm: '박하', note_desc: '상쾌하고 시원한 박하의 향, 가벼운 풀 향이 섞여 있습니다.', note_img: '/images/mint.jpg', parent_note_id: 9 },
    { note_id: 910, note_nm: '향긋한 풀', note_desc: '갓 잘린 풀에서 나는 싱그럽고 향긋한 향.', note_img: '/images/fresh_grass.jpg', parent_note_id: 9 },
    { note_id: 911, note_nm: '비단풀', note_desc: '비단처럼 부드러운 풀향이 나는 향.', note_img: '/images/silk_grass.jpg', parent_note_id: 9 },
    { note_id: 912, note_nm: '이슬', note_desc: '이슬이 맺힌 풀잎에서 나는 상쾌하고 청량한 향.', note_img: '/images/dew_grass.jpg', parent_note_id: 9 },
    { note_id: 913, note_nm: '상록수', note_desc: '언제나 푸른 나무에서 나는 신선하고 청량한 향.', note_img: '/images/evergreen.jpg', parent_note_id: 9 },
    { note_id: 914, note_nm: '풀냄새', note_desc: '상쾌하고 자연적인 풀 향, 초록풀 향의 기본적인 느낌.', note_img: '/images/grass_smell.jpg', parent_note_id: 9 },
    { note_id: 915, note_nm: '차가운 잎', note_desc: '아침 이슬에 젖은 차가운 풀잎에서 나는 향.', note_img: '/images/cold_leaf.jpg', parent_note_id: 9 },
    { note_id: 916, note_nm: '보리', note_desc: '보리밭에서 나는 신선하고 자연적인 풀 향기.', note_img: '/images/barley.jpg', parent_note_id: 9 },
    { note_id: 917, note_nm: '오이', note_desc: '오이에서 나는 시원하고 풀향이 나는 향.', note_img: '/images/cucumber.jpg', parent_note_id: 9 },
    { note_id: 918, note_nm: '담배풀', note_desc: '담배풀에서 나는 진한 풀향이 나는 신선한 느낌.', note_img: '/images/tobacco_grass.jpg', parent_note_id: 9 },
    { note_id: 919, note_nm: '벚꽃', note_desc: '벚꽃 나무에서 나오는 풋풋하고 부드러운 향.', note_img: '/images/cherry_blossom.jpg', parent_note_id: 9 },
    { note_id: 920, note_nm: '청초한 풀', note_desc: '청초한 풀잎에서 느낄 수 있는 상쾌하고 청량한 향기.', note_img: '/images/clean_grass.jpg', parent_note_id: 9 },
  
    //  허벌 하위그룹 노트들 (parent_note_id: 10)
    { note_id: 1001, note_nm: '라벤더', note_desc: '상쾌하고 부드러운 향으로 스트레스를 풀어주는 효과가 있는 향.', note_img: '/images/lavender.jpg', parent_note_id: 10 },
    { note_id: 1002, note_nm: '바질', note_desc: '달콤하고 강한 향을 가진 허브, 요리에 많이 사용되는 향.', note_img: '/images/basil.jpg', parent_note_id: 10 },
    { note_id: 1003, note_nm: '세이지', note_desc: '약간 쓴 향이 있으며, 정신을 맑게 하고 안정감을 주는 향.', note_img: '/images/sage.jpg', parent_note_id: 10 },
    { note_id: 1004, note_nm: '로즈마리', note_desc: '신선하고 청량한 허브 향, 기억력 향상과 정신을 맑게 하는 효과가 있음.', note_img: '/images/rosemary.jpg', parent_note_id: 10 },
    { note_id: 1005, note_nm: '타임', note_desc: '매운 향과 강한 허브 향이 특징이며, 따뜻하고 안정감을 주는 향.', note_img: '/images/thyme.jpg', parent_note_id: 10 },
    { note_id: 1006, note_nm: '페퍼민트', note_desc: '상쾌하고 차가운 민트 향으로, 정신을 맑게 하고 활력을 불어넣는 향.', note_img: '/images/peppermint.jpg', parent_note_id: 10 },
    { note_id: 1007, note_nm: '캐모마일', note_desc: '부드럽고 따뜻한 향으로 편안함을 주며, 수면을 유도하는 효과가 있음.', note_img: '/images/chamomile.jpg', parent_note_id: 10 },
    { note_id: 1008, note_nm: '타라곤', note_desc: '달콤하고 약간 쓴 향이 있는 허브로, 안정감을 주는 향.', note_img: '/images/tarragon.jpg', parent_note_id: 10 },
    { note_id: 1009, note_nm: '레몬그라스', note_desc: '상큼하고 신선한 레몬향이 나는 허브로, 청량감과 활력을 주는 향.', note_img: '/images/lemongrass.jpg', parent_note_id: 10 },
    { note_id: 1010, note_nm: '에키네시아', note_desc: '자연적이고 신선한 향으로, 면역력 증진에 도움을 주는 향.', note_img: '/images/echinacea.jpg', parent_note_id: 10 },
    { note_id: 1011, note_nm: '마조람', note_desc: '달콤하고 우디한 향을 가진 허브로, 편안하고 온화한 느낌을 줍니다.', note_img: '/images/marjoram.jpg', parent_note_id: 10 },
    { note_id: 1012, note_nm: '라임', note_desc: '시큼한 향이 나는 라임은 상쾌하고 청량한 느낌을 주는 향.', note_img: '/images/lime.jpg', parent_note_id: 10 },
    { note_id: 1013, note_nm: '백리향', note_desc: '신선하고 풍성한 풀 향이 나는 허브로, 차분하고 깨끗한 느낌을 줍니다.', note_img: '/images/oregano.jpg', parent_note_id: 10 },
    { note_id: 1014, note_nm: '하베나', note_desc: '허브 향과 과일 향이 섞인 향으로, 신선하고 부드러운 느낌을 줍니다.', note_img: '/images/haven.jpg', parent_note_id: 10 },
    { note_id: 1015, note_nm: '계피', note_desc: '달콤하고 강한 향을 지닌 계피는 따뜻하고 향기로운 느낌을 줍니다.', note_img: '/images/cinnamon.jpg', parent_note_id: 10 },
    { note_id: 1016, note_nm: '아르니카', note_desc: '달콤하고 꽃향기가 나는 허브로, 진정 효과가 있는 향.', note_img: '/images/arnica.jpg', parent_note_id: 10 },
    { note_id: 1017, note_nm: '귤', note_desc: '상큼하고 달콤한 귤의 향, 기분 좋은 상쾌함을 줍니다.', note_img: '/images/tangerine.jpg', parent_note_id: 10 },
    { note_id: 1018, note_nm: '유칼립투스', note_desc: '강하고 청량한 향을 가진 유칼립투스는 호흡을 개운하게 하고 상쾌한 느낌을 줍니다.', note_img: '/images/eucalyptus.jpg', parent_note_id: 10 },
    { note_id: 1019, note_nm: '쟈스민', note_desc: '부드럽고 달콤한 향이 나는 꽃으로, 허브 향과 잘 어울리는 향.', note_img: '/images/jasmine.jpg', parent_note_id: 10 },
    { note_id: 1020, note_nm: '석류', note_desc: '석류에서 유래한 신선하고 상쾌한 향.', note_img: '/images/pomegranate.jpg', parent_note_id: 10 },
    
    // 푸제르 하위그룹 노트들 (parent_note_id: 11)
    { note_id: 1101, note_nm: '라벤더', note_desc: '상쾌하고 부드러운 향으로 스트레스를 풀어주는 효과가 있는 향.', note_img: '/images/lavender.jpg', parent_note_id: 11 },
    { note_id: 1102, note_nm: '이끼', note_desc: '땅속에서 자생하는 이끼에서 나는 깊고 따뜻한 향. 고요하고 차분한 분위기를 연출.', note_img: '/images/moss.jpg', parent_note_id: 11 },
    { note_id: 1103, note_nm: '쿠마린', note_desc: '달콤하고 풀내음이 나는 향으로, 푸제르 향수에서 중요한 역할을 하는 노트.', note_img: '/images/coumarin.jpg', parent_note_id: 11 },
    { note_id: 1104, note_nm: '통카빈', note_desc: '달콤하고 부드러운 향으로, 바닐라와 비슷한 특성을 가진 향조.', note_img: '/images/tonka.jpg', parent_note_id: 11 },
    { note_id: 1105, note_nm: '헤리베르', note_desc: '부드럽고 우디한 향, 고전적인 푸제르 향에서 잘 어울리는 고급스러운 향.', note_img: '/images/herbivert.jpg', parent_note_id: 11 },
    { note_id: 1106, note_nm: '시더우드', note_desc: '우디하고 따뜻한 향으로, 푸제르 계열에서 빈번하게 사용되는 노트.', note_img: '/images/cedarwood.jpg', parent_note_id: 11 },
    { note_id: 1107, note_nm: '베티버', note_desc: '뿌리와 토양에서 유래한 깊고 푸석한 향, 안정감을 주는 향조.', note_img: '/images/vetiver.jpg', parent_note_id: 11 },
    { note_id: 1108, note_nm: '파츌리', note_desc: '무겁고 풍성한 흙 내음이 나는 향, 푸제르 향수에서 흔히 발견되는 향조.', note_img: '/images/patchouli.jpg', parent_note_id: 11 },
    { note_id: 1109, note_nm: '페퍼', note_desc: '강렬하고 매운 향을 가진 향으로, 푸제르 계열에서 종종 사용됩니다.', note_img: '/images/pepper.jpg', parent_note_id: 11 },
    { note_id: 1110, note_nm: '앰버', note_desc: '따뜻하고 고요한 느낌을 주는 향, 복합적이고 우아한 특성을 가진 향.', note_img: '/images/amber.jpg', parent_note_id: 11 },
    { note_id: 1111, note_nm: '알데히드', note_desc: '고유의 시원하고 상큼한 향을 지닌 노트, 푸제르 향에서 풍부한 향기를 더함.', note_img: '/images/aldehyde.jpg', parent_note_id: 11 },
    { note_id: 1112, note_nm: '사향', note_desc: '동물적이고 강한 향을 가진 향조, 깊고 고급스러운 향수를 위해 사용됨.', note_img: '/images/musk.jpg', parent_note_id: 11 },
    { note_id: 1113, note_nm: '로즈', note_desc: '부드럽고 여성스러운 향으로, 푸제르 향에 우아함을 더해주는 역할을 합니다.', note_img: '/images/rose.jpg', parent_note_id: 11 },
    { note_id: 1114, note_nm: '자스민', note_desc: '부드럽고 달콤한 꽃향기, 고전적인 푸제르 향수에서 자주 사용됩니다.', note_img: '/images/jasmine.jpg', parent_note_id: 11 },
    { note_id: 1115, note_nm: '오크모스', note_desc: '이끼와 흙의 향을 지닌 오크모스, 푸제르 향수에서 고유의 깊이를 더하는 노트.', note_img: '/images/oakmoss.jpg', parent_note_id: 11 },
    { note_id: 1116, note_nm: '카시미르 우드', note_desc: '부드럽고 따뜻한 우디 향, 푸제르 계열에서 고급스러운 느낌을 더함.', note_img: '/images/cashmerewood.jpg', parent_note_id: 11 },
    { note_id: 1117, note_nm: '베르가못', note_desc: '상쾌하고 신선한 감귤 향으로 푸제르 향수에서 밝은 느낌을 줍니다.', note_img: '/images/bergamot.jpg', parent_note_id: 11 },
    { note_id: 1118, note_nm: '아이리스', note_desc: '상쾌하고 우아한 꽃향기, 푸제르 향수에 세련된 느낌을 더해주는 노트.', note_img: '/images/iris.jpg', parent_note_id: 11 },
    { note_id: 1119, note_nm: '시트러스', note_desc: '레몬, 오렌지 등의 상큼하고 밝은 향이 푸제르 향에 자연스럽게 어울립니다.', note_img: '/images/citrus.jpg', parent_note_id: 11 },
    { note_id: 1120, note_nm: '머스크', note_desc: '따뜻하고 부드러운 향으로 푸제르 향수에서 깊이를 더하는 노트.', note_img: '/images/musk.jpg', parent_note_id: 11 },
  
  // 고메 하위그룹 노트들 (parent_note_id: 12)
  { note_id: 1201, note_nm: '초콜릿', note_desc: '부드럽고 달콤한 초콜릿 향, 고메 계열에서 가장 인기 있는 향조.', note_img: '/images/chocolate.jpg', parent_note_id: 12 },
  { note_id: 1202, note_nm: '바닐라', note_desc: '달콤하고 부드러운 향, 고메 향수에서 아늑하고 따뜻한 느낌을 더합니다.', note_img: '/images/vanilla.jpg', parent_note_id: 12 },
  { note_id: 1203, note_nm: '커피', note_desc: '진하고 깊은 커피 향, 고메 계열에서 독특하고 진한 매력을 발산합니다.', note_img: '/images/coffee.jpg', parent_note_id: 12 },
  { note_id: 1204, note_nm: '카라멜', note_desc: '달콤하고 부드러운 카라멜 향, 고메 향수에서 달콤함을 더욱 강조합니다.', note_img: '/images/caramel.jpg', parent_note_id: 12 },
  { note_id: 1205, note_nm: '아몬드', note_desc: '부드럽고 고소한 아몬드 향, 고메 향수에서 고급스러운 느낌을 제공합니다.', note_img: '/images/almond.jpg', parent_note_id: 12 },
  { note_id: 1206, note_nm: '파프리카', note_desc: '매콤하면서도 달콤한 느낌을 주는 향, 고메 향수에서 감각적이고 독특한 특성을 추가합니다.', note_img: '/images/paprika.jpg', parent_note_id: 12 },
  { note_id: 1207, note_nm: '캐러멜', note_desc: '달콤하고 풍부한 캐러멜 향, 부드러운 느낌을 제공하며 고메 향수에서 자주 사용됩니다.', note_img: '/images/caramel.jpg', parent_note_id: 12 },
  { note_id: 1208, note_nm: '베이커리', note_desc: '갓 구운 빵이나 케이크에서 나는 달콤한 향, 고메 향수에서 아늑하고 따뜻한 느낌을 제공합니다.', note_img: '/images/bakery.jpg', parent_note_id: 12 },
  { note_id: 1209, note_nm: '프랄린', note_desc: '달콤하고 고소한 견과류의 맛, 고메 향수에서 달콤함과 풍미를 더합니다.', note_img: '/images/praline.jpg', parent_note_id: 12 },
  { note_id: 1210, note_nm: '허니', note_desc: '달콤하고 부드러운 꿀 향, 고메 향수에서 따뜻하고 풍부한 느낌을 줍니다.', note_img: '/images/honey.jpg', parent_note_id: 12 },
  { note_id: 1211, note_nm: '모카', note_desc: '커피와 초콜릿이 결합된 향, 고메 향수에서 진하고 깊은 매력을 더해줍니다.', note_img: '/images/mocha.jpg', parent_note_id: 12 },
  { note_id: 1212, note_nm: '토ffee', note_desc: '달콤한 토피의 향, 고메 향수에서 편안하고 달콤한 느낌을 더합니다.', note_img: '/images/toffee.jpg', parent_note_id: 12 },
  { note_id: 1213, note_nm: '파인애플', note_desc: '상큼하고 달콤한 파인애플 향, 고메 향수에서 상쾌하고 달콤한 분위기를 더합니다.', note_img: '/images/pineapple.jpg', parent_note_id: 12 },
  { note_id: 1214, note_nm: '버터', note_desc: '부드럽고 달콤한 버터 향, 고메 향수에서 풍부하고 따뜻한 느낌을 제공합니다.', note_img: '/images/butter.jpg', parent_note_id: 12 },
  { note_id: 1215, note_nm: '복숭아', note_desc: '달콤하고 신선한 복숭아 향, 고메 향수에서 상큼하고 여성스러운 매력을 더합니다.', note_img: '/images/peach.jpg', parent_note_id: 12 },
  { note_id: 1216, note_nm: '블루베리', note_desc: '달콤하고 상큼한 블루베리 향, 고메 향수에서 상쾌하고 달콤한 느낌을 제공합니다.', note_img: '/images/blueberry.jpg', parent_note_id: 12 },
  { note_id: 1217, note_nm: '딸기', note_desc: '달콤하고 상큼한 딸기 향, 고메 향수에서 여름의 느낌을 더합니다.', note_img: '/images/strawberry.jpg', parent_note_id: 12 },
  { note_id: 1218, note_nm: '레몬', note_desc: '상큼하고 달콤한 레몬 향, 고메 향수에서 청량감과 달콤함을 동시에 제공합니다.', note_img: '/images/lemon.jpg', parent_note_id: 12 },
  { note_id: 1219, note_nm: '라임', note_desc: '상큼하고 신선한 라임 향, 고메 향수에서 상쾌함과 달콤함을 더합니다.', note_img: '/images/lime.jpg', parent_note_id: 12 },
  { note_id: 1220, note_nm: '바닐라', note_desc: '달콤하고 부드러운 바닐라 향, 고메 향수에서 따뜻하고 감미로운 느낌을 제공합니다.', note_img: '/images/vanilla.jpg', parent_note_id: 12 }
  ];


  // 서버에서 노트 리스트 불러오기
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('http://gachon-adore.duckdns.org:8081/user/perfume/note/list');
        if (response.data && response.data.length > 0) {
          setNotes(response.data);

          // parent_note_id가 -1인 노트만 필터링하여 대분류로 저장
          const mainNotes = response.data.filter(note => note.parent_note_id === -1);
          setMainCategories(mainNotes);

          // 첫 번째 대분류 노트를 기본 선택값으로 설정
          if (mainNotes.length > 0) {
            setSelectedCategory(mainNotes[0].note_nm);
            setCategoryDescription(mainNotes[0].note_desc); // 설명 설정
          }
        } else {
          // 노트 데이터가 비어 있는 경우 더미 데이터 사용
          setNotes(dummyNotes);
          setMainCategories(dummyNotes.filter(note => note.parent_note_id === -1));
          setSelectedCategory(dummyNotes[0].note_nm); // 기본 선택값 설정
          setCategoryDescription(dummyNotes[0].note_desc); // 설명 설정
        }
      } catch (error) {
        console.error('노트 데이터를 불러오는 중 오류 발생:', error);
        // 오류 발생 시 더미 데이터 사용
        setNotes(dummyNotes);
        setMainCategories(dummyNotes.filter(note => note.parent_note_id === -1));
        setSelectedCategory(dummyNotes[0].note_nm); // 기본 선택값 설정
        setCategoryDescription(dummyNotes[0].note_desc); // 설명 설정
      }
    };

    fetchNotes();
  }, []);

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setSelectedCategory(selected);

    // 선택한 대분류 노트의 설명을 업데이트
    const category = mainCategories.find(category => category.note_nm === selected);
    setCategoryDescription(category ? category.note_desc : '설명이 없습니다.');
  };

  const openModal = (note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedNote(null);
    setIsModalOpen(false);
  };

  return (
    <div className="note-recommendation-container">
      <NoteSidebar />
      <div className="note-list">
        <div className="note-list-header">
          <h1>전체 노트 보기</h1>
          <select
            className="note-list-category-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            {mainCategories.map((category) => (
              <option key={category.note_id} value={category.note_nm}>
                {category.note_nm}
              </option>
            ))}
          </select>
        </div>
        <div className="note-list-category-info">
          <h2>
            {selectedCategory} <span className="note-list-category-description"></span>
          </h2>
          <p>
            {categoryDescription} {/* 선택된 대분류 노트의 설명 */}
          </p>
        </div>
        <div className="note-list-grid">
          {notes
            .filter((note) => note.parent_note_id === mainCategories.find(category => category.note_nm === selectedCategory)?.note_id)
            .map((note) => (
            <NoteItem 
              key={note.note_id} 
              note={{
                id: note.note_id,
                name: note.note_nm,
                description: note.note_desc,
                imageUrl: note.note_img
              }} 
              onClick={() => openModal(note)} 
            />
          ))}
        </div>
        {isModalOpen && selectedNote && (
          <NoteDetailModal 
            note={{
              id: selectedNote.note_id,
              name: selectedNote.note_nm,
              description: selectedNote.note_desc,
              imageUrl: selectedNote.note_img
            }} 
            onClose={closeModal} 
          />
        )}
      </div>
    </div>
  );
};

export default NoteList;