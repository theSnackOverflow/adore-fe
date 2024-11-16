import React from 'react';
import { useInView } from 'react-intersection-observer';
import './PerfumeList.css';
import PerfumeItem from './PerfumeItem';
import PerfumeDetailModal from './PerfumeDetailModal';


const PerfumeItemWithAnimation = ({ perfume, onClick }) => {
  const [ref, inView] = useInView({
    threshold: 0.1, // 10% 이상 보일 때 트리거
    triggerOnce: true, // 한 번만 실행
  });

  return (
    <div
      ref={ref}
      className={`perfume-item ${inView ? 'fade-in' : 'hidden'}`} // 애니메이션 클래스 추가
      onClick={onClick}
    >
      <span><PerfumeItem
              key={perfume.id}
              perfume={perfume}
            /></span>
    </div>
  );
};

export default PerfumeItemWithAnimation;
