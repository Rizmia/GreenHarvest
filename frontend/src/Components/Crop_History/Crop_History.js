import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Crops from '../Crops/Crops';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './Crop_History.css';

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

function Crop_History() {
  const [crops, setCrops] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showDownloadModal, setShowDownloadModal] = useState(false);
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
          setFilteredCrops(data.crops || []);
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCrops(crops);
      return;
    }

    const queries = searchQuery.split(',').map((q) => q.trim().toLowerCase()).filter((q) => q);
    const filtered = crops.filter((crop) =>
      queries.some((query) =>
        Object.values({ ...crop, ...crop.customFields }).some((value) =>
          String(value).toLowerCase().includes(query)
        )
      )
    );
    setFilteredCrops(filtered);
  }, [searchQuery, crops]);

  // Sorting functionality
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedCrops = [...filteredCrops].sort((a, b) => {
      const aValue = a[key] || a.customFields?.[key] || '';
      const bValue = b[key] || b.customFields?.[key] || '';
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredCrops(sortedCrops);
  };

  const handleDelete = (id) => {
    setCrops((prevCrops) => prevCrops.filter((crop) => crop._id !== id));
    setFilteredCrops((prevCrops) => prevCrops.filter((crop) => crop._id !== id));
  };

  // Download functionality
  const handleDownloadExcel = () => {
    const worksheetData = filteredCrops.map((crop, index) => ({
      ID: index + 1,
      'Crop Name': crop.crop_name,
      'Crop Quantity': crop.crop_quantity,
      'Soil Type': crop.soil_type,
      'Planting Date': crop.planting_date,
      'Harvest Time': crop.harvest_time,
      'Fertilizer Type': crop.Fertilizer_Type,
      'Fertilizer Quantity': crop.Fertilizer_quantity,
      'Water Requirement': crop.Water_Requirement,
      'Expected Yield': crop.Expected_Yield,
      'Weather Conditions': crop.Weather_Conditions,
      ...crop.customFields,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Crop History');
    XLSX.writeFile(workbook, 'Crop_History.xlsx');
    setShowDownloadModal(false);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Crop History', 14, 10);
    autoTable(doc, {
      head: [['ID', 'Crop Name', 'Crop Quantity', 'Soil Type', 'Planting Date', 'Harvest Time', 'Fertilizer Type', 'Fertilizer Quantity', 'Water Requirement', 'Expected Yield', 'Weather Conditions', ...allCustomFields.map((field) => field.replace(/_/g, ' '))]],
      body: filteredCrops.map((crop, index) => [
        index + 1,
        crop.crop_name,
        crop.crop_quantity,
        crop.soil_type,
        crop.planting_date,
        crop.harvest_time,
        crop.Fertilizer_Type,
        crop.Fertilizer_quantity,
        crop.Water_Requirement,
        crop.Expected_Yield,
        crop.Weather_Conditions,
        ...allCustomFields.map((field) => crop.customFields?.[field] || ''),
      ]),
    });
    doc.save('Crop_History.pdf');
    setShowDownloadModal(false);
  };

  const allCustomFields = Array.from(
    new Set(crops.flatMap((crop) => Object.keys(crop.customFields || {})))
  );

  return (
    <div className="crop-history-container">
      <Link to="/" className="back-btn">
        <button>Back</button>
      </Link>
      <Link to="/Visualization" className="visualization-btn">
        <button>View Visualizations</button>
      </Link>
      <h1>Crop History</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search crops (e.g., wheat, sandy, 2023-01-01)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
      <Link to="/Crop_Add" className="add-btn">
        <button>ADD CROP DETAILS</button>
      </Link>
      <button className="download-btn" onClick={() => setShowDownloadModal(true)}>
        Download
      </button>
      {showDownloadModal && (
        <div className="download-modal">
          <div className="download-modal-content">
            <h3>Select Download Format</h3>
            <button onClick={handleDownloadExcel}>Download as Excel</button>
            <button onClick={handleDownloadPDF}>Download as PDF</button>
            <button onClick={() => setShowDownloadModal(false)}>Cancel</button>
          </div>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p className="loading">Loading crops...</p>
      ) : filteredCrops.length > 0 ? (
        <table className="crop-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('_id')}>ID</th>
              <th onClick={() => handleSort('crop_name')}>Crop Name</th>
              <th onClick={() => handleSort('crop_quantity')}>Crop Quantity</th>
              <th onClick={() => handleSort('soil_type')}>Soil Type</th>
              <th onClick={() => handleSort('planting_date')}>Planting Date</th>
              <th onClick={() => handleSort('harvest_time')}>Harvest Time</th>
              <th onClick={() => handleSort('Fertilizer_Type')}>Fertilizer Type</th>
              <th onClick={() => handleSort('Fertilizer_quantity')}>Fertilizer Quantity</th>
              <th onClick={() => handleSort('Water_Requirement')}>Water Requirement</th>
              <th onClick={() => handleSort('Expected_Yield')}>Expected Yield</th>
              <th onClick={() => handleSort('Weather_Conditions')}>Weather Conditions</th>
              {allCustomFields.map((field) => (
                <th key={field} onClick={() => handleSort(field)}>
                  {field.replace(/_/g, ' ')}
                </th>
              ))}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCrops.map((crop) => (
              <Crops
                key={crop._id}
                user={crop}
                onDelete={handleDelete}
                customFields={allCustomFields}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-records">No crop records found.</p>
      )}
    </div>
  );
}

export default Crop_History;