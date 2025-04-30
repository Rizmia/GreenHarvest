import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ExportMonthlyChart.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ExportMonthlyChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchMonthlyRevenue = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get('http://localhost:5000/exportincome/monthly/revenue');
        console.log("API Response:", response);
        
        if (!response.data) {
          throw new Error("No data received from server");
        }

        const monthlyData = response.data;
        console.log("Monthly Data:", monthlyData);

        if (!Array.isArray(monthlyData) || monthlyData.length === 0) {
          setError("No export revenue data available. Please add some export records.");
          return;
        }

        const labels = monthlyData.map(item => 
          `${getMonthName(item.month)} ${item.year}`
        );
        const data = monthlyData.map(item => item.total);

        console.log("Chart Labels:", labels);
        console.log("Chart Data:", data);

        setChartData({
          labels: labels,
          datasets: [{
            label: 'Monthly Export Revenue (Rs.)',
            data: data,
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
          }]
        });
      } catch (error) {
        console.error("Error details:", error);
        
        let errorMessage = "Failed to load export revenue data";
        if (error.response) {
          errorMessage = error.response.data.message || 
                       error.response.data.error || 
                       errorMessage;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyRevenue();
  }, [retryCount]);

  const getMonthName = (monthNumber) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber - 1];
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  return (
    <div className="export-monthly-container">
      <div className="chart-header">
        <h2>Monthly Export Revenue Analysis</h2>
        <Link to="/exportincomedetails" className="back-button">
          Back to Export Income Details
        </Link>
      </div>
      
      {loading ? (
        <div className="loading-message">
          <div className="spinner"></div>
          Loading export revenue data...
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={handleRetry} className="retry-button">
            Retry
          </button>
          <div className="debug-info">
            <p>If this persists, please check:</p>
            <ul>
              <li>Backend server is running</li>
              <li>You have export income records</li>
              <li>Records have valid dates and revenue values</li>
              <li>Check browser console for more details</li>
            </ul>
          </div>
        </div>
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
                    text: 'Monthly Export Revenue Trends'
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `Rs. ${context.raw.toLocaleString()}`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Revenue (Rs.)'
                    },
                    ticks: {
                      callback: function(value) {
                        return 'Rs. ' + value.toLocaleString();
                      }
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
          <div className="chart-footer">
            <p>Showing data for {chartData.labels?.length || 0} months</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportMonthlyChart;