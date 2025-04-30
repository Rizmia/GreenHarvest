/*import React from 'react';
import { useNavigate } from 'react-router';
import './IncomeHome.css'; // CSS styles

function IncomeHome() {
  const navigate = useNavigate();

  const goToAddIncome = () => {
    navigate('/addlocalincome');
  };

  const goToViewDetails = () => {
    navigate('/localincomedetails');
  };

  const goToAddExportIncome = () => {
    navigate('/addexportincome');
  };

  const goToViewExportDetails = () => {
    navigate('/exportincomedetails');
  };

  const goToAboutUs = () => {
    navigate('/aboutus');
  };

  return (
    <div className="incomeHomeContainer">
      <h1>Track, Manage, and Grow Your Income with Ease!</h1>

      <div className="incomeHomeButtonGroup">
        <button className="incomeHomeBtn incomeHomeAddBtn" onClick={goToAddIncome}>
          + Add Local Income
        </button>

        <button className="incomeHomeBtn incomeHomeViewBtn" onClick={goToViewDetails}>
          📋 View Income Details
        </button>

        <button className="incomeHomeBtn incomeHomeAddBtn" onClick={goToAddExportIncome}>
          + Add Export Income
        </button>

        <button className="incomeHomeBtn incomeHomeViewBtn" onClick={goToViewExportDetails}>
          📋 View Export Income Details
        </button>

        <button className="incomeHomeAboutUsBtn" onClick={goToAboutUs}>
          About Us
        </button>
      </div>
    </div>
  );
}

export default IncomeHome;*/


/*import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './IncomeHome.css';

function IncomeHome() {
  const navigate = useNavigate();

  const goToAddIncome = () => {
    navigate('/addlocalincome');
  };

  const goToViewDetails = () => {
    navigate('/localincomedetails');
  };

  const goToAddExportIncome = () => {
    navigate('/addexportincome');
  };

  const goToViewExportDetails = () => {
    navigate('/exportincomedetails');
  };

  const goToAboutUs = () => {
    navigate('/aboutus');
  };

  return (
    <div className="incomeHomeContainer">
      <h1>Track, Manage, and Grow Your Income with Ease!</h1>

      <div className="incomeHomeButtonGroup">
        <button className="incomeHomeBtn incomeHomeAddBtn" onClick={goToAddIncome}>
          + Add Local Income
        </button>

        <button className="incomeHomeBtn incomeHomeViewBtn" onClick={goToViewDetails}>
          📋 View Income Details
        </button>

        <button className="incomeHomeBtn incomeHomeAddBtn" onClick={goToAddExportIncome}>
          + Add Export Income
        </button>

        <button className="incomeHomeBtn incomeHomeViewBtn" onClick={goToViewExportDetails}>
          📋 View Export Income Details
        </button>

        <Link to="/monthly-revenue" className="incomeHomeBtn incomeHomeChartBtn">
          📊 Monthly Revenue Analysis
        </Link>

        <button className="incomeHomeAboutUsBtn" onClick={goToAboutUs}>
          About Us
        </button>
      </div>
    </div>
  );
}

export default IncomeHome;*/



import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './IncomeHome.css';

function IncomeHome() {
  const navigate = useNavigate();

  const goToAddIncome = () => {
    navigate('/addlocalincome');
  };

  const goToViewDetails = () => {
    navigate('/localincomedetails');
  };

  const goToAddExportIncome = () => {
    navigate('/addexportincome');
  };

  const goToViewExportDetails = () => {
    navigate('/exportincomedetails');
  };

  const goToAboutUs = () => {
    navigate('/aboutus');
  };

  return (
    <div className="incomeHomeContainer">
      <h1>Track, Manage, and Grow Your Income with Ease!</h1>

      <div className="incomeHomeButtonGroup">
        <button className="incomeHomeBtn incomeHomeAddBtn" onClick={goToAddIncome}>
          + Add Local Income
        </button>

        <button className="incomeHomeBtn incomeHomeViewBtn" onClick={goToViewDetails}>
          📋 View Income Details
        </button>

        <Link to="/monthly-revenue" className="incomeHomeBtn incomeHomeChartBtn">
          📊 Local Revenue Analysis
        </Link>

        <button className="incomeHomeBtn incomeHomeAddBtn" onClick={goToAddExportIncome}>
          + Add Export Income
        </button>

        <button className="incomeHomeBtn incomeHomeViewBtn" onClick={goToViewExportDetails}>
          📋 View Export Income Details
        </button>

        <Link to="/monthly-export-revenue" className="incomeHomeBtn incomeHomeExportChartBtn">
          🌍 Export Revenue Analysis
        </Link>

        <button className="incomeHomeAboutUsBtn" onClick={goToAboutUs}>
          About Us
        </button>
      </div>
    </div>
  );
}

export default IncomeHome;

