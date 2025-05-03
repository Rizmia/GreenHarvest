import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './Visualization.css';

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const URL = 'http://localhost:5000/CropR';

const fetchHandler = async (token) => {
  try {
    const res = await axios.get(URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      return { error: 'Session expired. Please log in again.' };
    }
    return { crops: [] };
  }
};

function Visualization() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');
    fetchHandler(token)
      .then((data) => {
        if (data.error) {
          setError(data.error);
          navigate('/Login');
        } else {
          setCrops(data.crops || []);
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  // Pie Chart: Crop Distribution by Name
  const cropNameCounts = crops.reduce((acc, crop) => {
    acc[crop.crop_name] = (acc[crop.crop_name] || 0) + 1;
    return acc;
  }, {});
  const pieData = {
    labels: Object.keys(cropNameCounts),
    datasets: [
      {
        data: Object.values(cropNameCounts),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  // Bar Chart: Expected Yield by Crop
  const barData = {
    labels: crops.map((crop) => crop.crop_name),
    datasets: [
      {
        label: 'Expected Yield',
        data: crops.map((crop) => crop.Expected_Yield),
        backgroundColor: '#36A2EB',
      },
    ],
  };

  // Line Chart: Planting Dates Over Time
  const plantingDates = crops
    .map((crop) => ({
      date: new Date(crop.planting_date),
      crop_name: crop.crop_name,
    }))
    .sort((a, b) => a.date - b.date);
  const lineData = {
    labels: plantingDates.map((item) => item.date.toLocaleDateString()),
    datasets: [
      {
        label: 'Crops Planted',
        data: plantingDates.map((_, index) => index + 1),
        borderColor: '#FF6384',
        fill: false,
      },
    ],
  };

  return (
    <div className="visualization-container">
      <Link to="/Crop_History" className="back-btn">
        <button>Back to Crop History</button>
      </Link>
      <h1>Crop Visualizations</h1>
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p className="loading">Loading visualizations...</p>
      ) : crops.length > 0 ? (
        <div className="charts-container">
          <div className="chart">
            <h2>Crop Distribution</h2>
            <Pie data={pieData} />
          </div>
          <div className="chart">
            <h2>Expected Yield by Crop</h2>
            <Bar data={barData} />
          </div>
          <div className="chart">
            <h2>Planting Timeline</h2>
            <Line data={lineData} />
          </div>
        </div>
      ) : (
        <p className="no-records">No crop data available for visualization.</p>
      )}
    </div>
  );
}

export default Visualization;