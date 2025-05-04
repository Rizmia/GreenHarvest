import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Pie, Bar, Line, Doughnut, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  ScatterController,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import './Visualization.css';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  ScatterController,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
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

  // State for customizable chart
  const [chartType, setChartType] = useState('Pie'); // Default chart type
  const [xField, setXField] = useState('crop_name'); // Default X-axis field
  const [yField, setYField] = useState('crop_quantity'); // Default Y-axis/value field
  const [legendField, setLegendField] = useState('soil_type'); // Default legend field

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

  // Chart options for consistent rendering
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom', // Place legend below the chart
      },
    },
  };

  // Original Charts
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

  // Customizable Chart Logic
  const allFields = [
    '_id',
    'crop_name',
    'crop_quantity',
    'soil_type',
    'planting_date',
    'harvest_time',
    'Fertilizer_Type',
    'Fertilizer_quantity',
    'Water_Requirement',
    'Expected_Yield',
    'Weather_Conditions',
    ...Array.from(new Set(crops.flatMap((crop) => Object.keys(crop.customFields || {})))),
  ];

  const numericFields = [
    'crop_quantity',
    'Fertilizer_quantity',
    'Water_Requirement',
    'Expected_Yield',
  ];

  // Prepare data for the customizable chart
  const getCustomChartData = () => {
    let labels = [];
    let datasetData = [];
    let datasets = [];

    if (chartType === 'Pie' || chartType === 'Doughnut') {
      const counts = crops.reduce((acc, crop) => {
        const key = crop[xField] || 'Unknown';
        acc[key] = (acc[key] || 0) + (Number(crop[yField]) || 0);
        return acc;
      }, {});
      labels = Object.keys(counts);
      datasetData = Object.values(counts);
      datasets = [
        {
          data: datasetData,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        },
      ];
    } else if (chartType === 'Bar' || chartType === 'Line' || chartType === 'Area') {
      labels = crops.map((crop) => crop[xField] || 'Unknown');
      datasets = [
        {
          label: yField,
          data: crops.map((crop) => Number(crop[yField]) || 0),
          backgroundColor: chartType === 'Bar' ? '#36A2EB' : undefined,
          borderColor: chartType !== 'Bar' ? '#FF6384' : undefined,
          fill: chartType === 'Area',
        },
      ];
    } else if (chartType === 'Scatter') {
      datasetData = crops.map((crop) => ({
        x: Number(crop[xField]) || 0,
        y: Number(crop[yField]) || 0,
      }));
      datasets = [
        {
          label: `${xField} vs ${yField}`,
          data: datasetData,
          backgroundColor: '#FF6384',
        },
      ];
    } else if (chartType === 'Waterfall') {
      labels = crops.map((crop) => crop[xField] || 'Unknown');
      datasetData = crops.map((crop) => Number(crop[yField]) || 0);
      datasets = [
        {
          label: yField,
          data: datasetData,
          backgroundColor: datasetData.map((value) => (value >= 0 ? '#36A2EB' : '#FF6384')),
        },
      ];
    }

    return {
      labels,
      datasets,
    };
  };

  const customChartData = getCustomChartData();

  const renderCustomChart = () => {
    switch (chartType) {
      case 'Pie':
        return <Pie data={customChartData} options={chartOptions} />;
      case 'Bar':
        return <Bar data={customChartData} options={chartOptions} />;
      case 'Doughnut':
        return <Doughnut data={customChartData} options={chartOptions} />;
      case 'Scatter':
        return <Scatter data={customChartData} options={chartOptions} />;
      case 'Line':
        return <Line data={customChartData} options={chartOptions} />;
      case 'Area':
        return <Line data={customChartData} options={chartOptions} />;
      case 'Waterfall':
        return <Bar data={customChartData} options={chartOptions} />;
      default:
        return null;
    }
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
        <>
          {/* Original Charts */}
          <div className="charts-container">
            <div className="chart">
              <h2>Crop Distribution</h2>
              <Pie data={pieData} options={chartOptions} />
            </div>
            <div className="chart">
              <h2>Expected Yield by Crop</h2>
              <Bar data={barData} options={chartOptions} />
            </div>
            <div className="chart">
              <h2>Planting Timeline</h2>
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>

          {/* Customizable Chart Section */}
          <div className="custom-chart-section">
            <h2>Custom Chart</h2>
            <div className="custom-chart-controls">
              <div className="control-group">
                <label>Chart Type:</label>
                <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
                  <option value="Pie">Pie</option>
                  <option value="Bar">Bar</option>
                  <option value="Doughnut">Doughnut</option>
                  <option value="Scatter">Scatter</option>
                  <option value="Line">Line</option>
                  <option value="Area">Area</option>
                  <option value="Waterfall">Waterfall</option>
                </select>
              </div>
              <div className="control-group">
                <label>X-Axis / Category:</label>
                <select value={xField} onChange={(e) => setXField(e.target.value)}>
                  {allFields.map((field) => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </select>
              </div>
              <div className="control-group">
                <label>Y-Axis / Value:</label>
                <select value={yField} onChange={(e) => setYField(e.target.value)}>
                  {numericFields.map((field) => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </select>
              </div>
              {(chartType === 'Pie' || chartType === 'Doughnut') && (
                <div className="control-group">
                  <label>Legend:</label>
                  <select value={legendField} onChange={(e) => setLegendField(e.target.value)}>
                    {allFields.map((field) => (
                      <option key={field} value={field}>
                        {field}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="chart">
              {renderCustomChart()}
            </div>
          </div>
        </>
      ) : (
        <p className="no-records">No crop data available for visualization.</p>
      )}
    </div>
  );
}

export default Visualization;