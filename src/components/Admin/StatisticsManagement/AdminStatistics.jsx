// src/components/Admin/StatisticsManagement/AdminStatistics.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import './AdminStatistics.css';

// Chart.js 구성 요소를 등록합니다.
ChartJS.register(...registerables);

const AdminStatistics = () => {
  const [activeUsersData, setActiveUsersData] = useState([]);
  const [inactiveUsersData, setInactiveUsersData] = useState([]);
  const [newUsersData, setNewUsersData] = useState([]);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState(1);

  const fetchStatistics = async () => {
    try {
      const startDate = '2024-11-01';
      const endDate = '2024-11-30';

      const activeResponse = await axios.get('http://gachon-adore.duckdns.org:8083/admin/statics/activeUser', {
        params: { startDate, endDate, period }
      });
      const inactiveResponse = await axios.get('http://gachon-adore.duckdns.org:8083/admin/statics/inactiveMembers', {
        params: { startDate, endDate, period }
      });
      const newResponse = await axios.get('http://gachon-adore.duckdns.org:8083/admin/statics/newUser', {
        params: { startDate, endDate, period }
      });

      setActiveUsersData(activeResponse.data.dailyCounts);
      setInactiveUsersData(inactiveResponse.data.dailyCounts);
      setNewUsersData(newResponse.data.dailyCounts);
      setError(null);
    } catch (error) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [period]);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  const createChartData = (data, label) => ({
    labels: data.map((_, index) => `Day ${index + 1}`),
    datasets: [
      {
        label,
        data: data.map(item => item.count),
        fill: false,
        borderColor: '#007bff',
        tension: 0.1,
      },
    ],
  });

  return (
    <div className="admin-statistics">
      <h1>관리자 통계 페이지</h1>
      {error && <p className="error">{error}</p>}

      <div className="period-buttons">
        <button onClick={() => handlePeriodChange(1)} className={period === 1 ? 'active' : ''}>1일</button>
        <button onClick={() => handlePeriodChange(7)} className={period === 7 ? 'active' : ''}>7일</button>
        <button onClick={() => handlePeriodChange(30)} className={period === 30 ? 'active' : ''}>30일</button>
      </div>

      <div className="statistics-section">
        <div className="statistics-card">
          <h2>활성 사용자 통계</h2>
          <Line data={createChartData(activeUsersData, '활성 사용자')} />
        </div>

        <div className="statistics-card">
          <h2>미접속 사용자 통계</h2>
          <Line data={createChartData(inactiveUsersData, '미접속 사용자')} />
        </div>

        <div className="statistics-card">
          <h2>신규 사용자 통계</h2>
          <Line data={createChartData(newUsersData, '신규 사용자')} />
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;