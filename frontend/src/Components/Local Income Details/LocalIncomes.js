import React, { useEffect, useState } from 'react';
import axios from "axios";
import LocalIncome from '../Local Income/LocalIncome';
import './LocalIncomes.css';
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:5000/localincome";

const fetchHandler = async () => {
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error);
    return [];
  }
};

function LocalIncomes() {
  const [localincomes, setLocalIncomes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHandler().then((data) => setLocalIncomes(data));
  }, []);

  return (
    <div className="localIncomes-page">
      <h1 className="localIncomes-title">Local Income Details Display Page</h1>

      <button className="localIncomes-backButton" onClick={() => navigate('/')}>
        Back to Home
      </button>

      {localincomes.length > 0 ? (
        <div className="localIncomes-tableContainer">
          <table className="localIncomes-incomeTable">
            <thead>
              <tr>
                <th className="localIncomes-colId">ID</th>
                <th>Product Name</th>
                <th>Quantity Sold</th>
                <th>Price Per Unit</th>
                <th>Buyer Name</th>
                <th>Payment Method</th>
                <th>Date of Sale</th>
                <th className="localIncomes-colDescription">Description</th>
                <th>Total Revenue</th>
                <th className="localIncomes-colActions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {localincomes.map((localincome, i) => (
                <LocalIncome key={i} localincome={localincome} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="localIncomes-noData">No local income data available.</p>
      )}
    </div>
  );
}

export default LocalIncomes;




