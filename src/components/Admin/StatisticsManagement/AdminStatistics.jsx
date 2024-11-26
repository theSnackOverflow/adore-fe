import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../lib/axiosInstance';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import './AdminStatistics.css';

// Chart.js 구성 요소 등록
ChartJS.register(...registerables);

const AdminStatistics = () => {
  const [connectedUsersData, setConnectedUsersData] = useState([]); // 접속 사용자 데이터
  const [newUsersData, setNewUsersData] = useState([]); // 신규 사용자 데이터
  const [inactiveUsersData, setInactiveUsersData] = useState([]); // 미접속 사용자 데이터
  const [recommendUsersData, setRecommendUsersData] = useState([]); // 추천 기능 사용자 데이터
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState(7); // 기본 기간: 7일

  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchStatistics = async () => {
    try {
      const today = new Date();
      const endDate = getFormattedDate(today);
      const startDate = getFormattedDate(new Date(today.setDate(today.getDate() - period + 1)));
  
      console.log(`Period: ${period}일, StartDate: ${startDate}, EndDate: ${endDate}`);
  
      // 기간 내의 모든 날짜 생성
      const generateDateRange = (start, end) => {
        const dateArray = [];
        let currentDate = new Date(start);
        const lastDate = new Date(end);
        while (currentDate <= lastDate) {
          dateArray.push(getFormattedDate(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return dateArray;
      };
  
      const dateRange = generateDateRange(startDate, endDate);
  
      // 데이터 채우기 함수
      const fillMissingDates = (data) => {
        const dataMap = data.reduce((acc, item) => {
          acc[item.date] = item.count;
          return acc;
        }, {});
        return dateRange.map((date) => ({
          date,
          count: dataMap[date] || 0, // 데이터가 없으면 count를 0으로 설정
        }));
      };
  
      // 접속 사용자 데이터
      const connectedResponse = await axiosInstance.get('/api/admin/statics/activeUser', {
        params: { startDate, endDate },
      });
      console.log('Connected Users Response:', connectedResponse.data);
      const connectedData = connectedResponse.data.dateCountDtoList || [];
      setConnectedUsersData(fillMissingDates(connectedData));
  
      // 신규 사용자 데이터
      const newUsersResponse = await axiosInstance.get('/api/admin/statics/newUser', {
        params: { startDate, endDate },
      });
      console.log('New Users Response:', newUsersResponse.data);
      const newUsersData = newUsersResponse.data.dateCountDtoList || [];
      setNewUsersData(fillMissingDates(newUsersData));
  
      // 미접속 사용자 데이터
      const inactiveUsersResponse = await axiosInstance.get('/api/admin/statics/inactiveMembers', {
        params: { startDate, endDate },
      });
      console.log('Inactive Users Response:', inactiveUsersResponse.data);
      const inactiveUsersData = inactiveUsersResponse.data.dateCountDtoList || [];
      setInactiveUsersData(fillMissingDates(inactiveUsersData));
  
      // 추천 기능 이용자 데이터
      const recommendUsersResponse = await axiosInstance.get('/api/admin/statics/recommendUser', {
        params: { startDate, endDate },
      });
      console.log('Recommend Users Response:', recommendUsersResponse.data);
      const recommendUsersData = recommendUsersResponse.data.dateCountDtoList || [];
      setRecommendUsersData(fillMissingDates(recommendUsersData));
  
      setError(null); // 오류 초기화
    } catch (error) {
      if (error.response) {
        setError(`서버 오류: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        setError('서버 응답이 없습니다. 네트워크 상태를 확인하세요.');
      } else {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      }
      console.error('Error details:', error);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [period]);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  const createChartData = (data, label) => {
    const labels = period === 1 ? ['', data[0]?.date || '', ''] : data.map((item) => item.date);
    return {
      labels,
      datasets: [
        {
          label,
          data: period === 1 ? [0, data[0]?.count || 0, 0] : data.map((item) => item.count),
          fill: false,
          borderColor: '#007bff',
          tension: 0.3,
        },
      ],
    };
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          autoSkip: false, 
          maxRotation: period === 30 ? 45 : 0,
          minRotation: period === 30 ? 45 : 0,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: (value) => (Number.isInteger(value) ? value : null),
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  return (
    <div className="admin-statistics">
      <h1>DashBoard</h1>
      {error && <p className="error">{error}</p>}

      <div className="period-buttons">
        <button onClick={() => handlePeriodChange(1)} className={period === 1 ? 'active' : ''}>
          1일
        </button>
        <button onClick={() => handlePeriodChange(7)} className={period === 7 ? 'active' : ''}>
          7일
        </button>
        <button onClick={() => handlePeriodChange(30)} className={period === 30 ? 'active' : ''}>
          30일
        </button>
      </div>

      <div className="statistics-section">
        {/* 접속 사용자 통계 */}
        <div className="statistics-card">
          <h2>접속 사용자 통계</h2>
          <div className="chart-container">
            <Line
              data={createChartData(connectedUsersData, '접속 사용자')}
              options={chartOptions}
            />
          </div>
        </div>

        {/* 신규 사용자 통계 */}
        <div className="statistics-card">
          <h2>신규 사용자 통계</h2>
          <div className="chart-container">
            <Line
              data={createChartData(newUsersData, '신규 사용자')}
              options={chartOptions}
            />
          </div>
        </div>

        {/* 미접속 사용자 통계 */}
        <div className="statistics-card">
          <h2>미접속 사용자 통계</h2>
          <div className="chart-container">
            <Line
              data={createChartData(inactiveUsersData, '미접속 사용자')}
              options={chartOptions}
            />
          </div>
        </div>

        {/* 추천 기능 이용자 통계 */}
        <div className="statistics-card">
          <h2>추천 기능 이용자 통계</h2>
          <div className="chart-container">
            <Line
              data={createChartData(recommendUsersData, '추천 기능 이용자')}
              options={chartOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;