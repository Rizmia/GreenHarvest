import React, { useEffect, useState } from 'react';
import axios from "axios";
import ExportIncome from '../Export Income/ExportIncome';
import './ExportIncomes.css';
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:5000/exportincome";

const fetchHandler = async () => {
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error);
    return [];
  }
};

function ExportIncomes() {
  const [exportincomes, setExportIncomes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHandler().then((data) => setExportIncomes(data));
  }, []);

  return (
    <div className="exportDetails-page">
      <h1 className="exportDetails-heading">Export Income Details Display Page</h1>

      <button className="exportDetails-back-button" onClick={() => navigate('/')}>
        Back to Home
      </button>

      {exportincomes.length > 0 ? (
        <div className="exportDetails-table-container">
          <table className="exportDetails-income-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Quantity Exported</th>
                <th>Exported Price</th>
                <th>Destination Country</th>
                <th>Exported Company</th>
                <th>Shipping_Custom Cost</th>
                <th>Date Of Exported</th>
                <th>Total Export Revenue</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exportincomes.map((exportincome, i) => (
                <ExportIncome key={i} exportincome={exportincome} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="exportDetails-no-data">No export income data available.</p>
      )}
    </div>
  );
}

export default ExportIncomes;




