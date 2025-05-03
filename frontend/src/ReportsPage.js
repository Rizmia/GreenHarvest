// src/pages/ReportsPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ReportsPage() {
  const navigate = useNavigate();
  const reportImageUrl = "https://images.pexels.com/photos/162870/rye-cereals-wheat-nature-162870.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  return (
    <>
      <style>{`
        .reports-container {
          padding: 24px;
          max-width: 1000px;
          margin: 0 auto;
        }
        .reports-title {
          font-size: 2rem;
          color: #2f855a;
          text-align: center;
          margin-bottom: 24px;
        }
        .reports-wrapper {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
        }
        /* LEFT: buttons grid */
        .reports-grid {
          flex: 2;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }
        /* CARD with light-green border */
        .card {
          background: #fff;
          padding: 16px;
          border: 1px solidrgb(11, 15, 12);
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.05);
          text-align: center;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.1);
        }
        .card h2 {
          margin-bottom: 8px;
          font-size: 1.25rem;
          color: #2f855a;
        }
        .card p {
          font-size: 0.9rem;
          color: #555;
        }
        /* RIGHT: image */
        .image-container {
          flex: 4;
          min-width: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .image-container img {
          max-width: 100%;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
      `}</style>

      <div className="reports-container">
        <h1 className="reports-title">Reports Dashboard</h1>
        <div className="reports-wrapper">
          {/* Left: cards */}
          <div className="reports-grid">
            <div className="card" onClick={() => navigate("/summary")}>
              <h2>Overall Summary</h2>
              <p>View total  expenses List</p>
            </div>
            <div className="card" onClick={() => navigate("/summary/weekly")}>
              <h2>Weekly Summary</h2>
              <p>Last 7 days totals</p>
            </div>
            <div className="card" onClick={() => navigate("/summary/all/chart")}>
              <h2>OverallEspenses</h2>
              <p>Expenses chart and get disicission</p>
            </div>
            <div className="card" onClick={() => navigate("/summary/weekly/chart")}>
              <h2>Weekly Chart</h2>
              <p>This week expenses chart.</p>
            </div>
            
            
          </div>

          {/* Right: promotional image via URL */}
          <div className="image-container">
            <img src={reportImageUrl} alt="Analytics Overview" />
          </div>
        </div>
      </div>
    </>
  );
}
