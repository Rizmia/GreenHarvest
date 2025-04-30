import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, 
         CategoryScale, 
         LinearScale, 
         BarElement, 
         Title, 
         Tooltip, 
         Legend } from 'chart.js';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './MonthlyRevenueChart.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyRevenueChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMonthlyRevenue = async () => {
      try {
        const response = await axios.get('http://localhost:5000/localincome/monthly/revenue');
        const monthlyData = response.data;

        if (monthlyData.length > 0) {
          const labels = monthlyData.map(item => 
            `${getMonthName(item.month)} ${item.year}`
          );
          const data = monthlyData.map(item => item.total);

          setChartData({
            labels: labels,
            datasets: [
              {
                label: 'Monthly Revenue (Rs.)',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
              }
            ]
          });
        } else {
          setError("No revenue data available");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching monthly revenue:", error);
        setError("Failed to load revenue data");
        setLoading(false);
      }
    };

    fetchMonthlyRevenue();
  }, []);

  const getMonthName = (monthNumber) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber - 1];
  };

  return (
    <div className="monthly-revenue-container">
      <div className="chart-header">
        <h2>Monthly Revenue Analysis</h2>
        <Link to="/localincomedetails" className="back-button">
          Back to Income Details
        </Link>
      </div>
      
      {loading ? (
        <div className="loading-message">Loading data...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="chart-wrapper">
          <div className="chart-container">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Monthly Revenue Trends'
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Revenue (Rs.)'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Month'
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyRevenueChart;