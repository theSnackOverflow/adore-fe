import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

      // 접속 사용자 데이터
      const connectedResponse = await axios.get('/api/admin/statics/activeUser', {
        params: { startDate, endDate },
      });

      // 신규 사용자 데이터
      const newUsersResponse = await axios.get('/api/admin/statics/newUser', {
        params: { startDate, endDate },
      });

      // 미접속 사용자 데이터
      const inactiveUsersResponse = await axios.get('/api/admin/statics/inactiveMembers', {
        params: { startDate, endDate },
      });

      // 추천 기능 이용자 데이터
      const recommendUsersResponse = await axios.get('/api/admin/statics/recommendUser', {
        params: { startDate, endDate },
      });

      setConnectedUsersData([
        { date: startDate, count: connectedResponse.data.count || 0 },
        { date: endDate, count: connectedResponse.data.count || 0 },
      ]);

      setNewUsersData([
        { date: startDate, count: newUsersResponse.data.count || 0 },
        { date: endDate, count: newUsersResponse.data.count || 0 },
      ]);

      setInactiveUsersData([
        { date: startDate, count: inactiveUsersResponse.data.count || 0 },
        { date: endDate, count: inactiveUsersResponse.data.count || 0 },
      ]);

      setRecommendUsersData([
        { date: startDate, count: recommendUsersResponse.data.count || 0 },
        { date: endDate, count: recommendUsersResponse.data.count || 0 },
      ]);

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

  const createChartData = (data, label) => ({
    labels: data.map((item) => item.date),
    datasets: [
      {
        label,
        data: data.map((item) => item.count),
        fill: false,
        borderColor: '#007bff',
        tension: 0.3,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 0,
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