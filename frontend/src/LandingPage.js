// src/pages/landing.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const avatarUrl = 'https://i.pravatar.cc/100?img=5'; // placeholder user image
  const promoImage = 'https://images.unsplash.com/photo-1620200423727-8127f75d7f53?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; // left-side picture


  return (
    <>
      <style>{`
        /* Page reset */
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body, html, #root {
          height: 100%;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: linear-gradient(90deg, #2e8b57 0%, #3cb371 100%);
          color: #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header .title {
          font-size: 1.75rem;
          font-weight: 600;
        }
        .header .user-avatar {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #fff;
        }
        .header .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .header .user-avatar::after {
          content: '';
          position: absolute;
          bottom: 4px; right: 4px;
          width: 12px; height: 12px;
          background: #4caf50;
          border: 2px solid #fff;
          border-radius: 50%;
        }

        .main {
          padding: 2rem;
          background: #f8fafc;
          height: calc(100% - 72px);
        }
        .content {
          display: flex;
          align-items: center;
          gap: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }
        .image-container {
          flex: 1;
        }
        .image-container img {
          width: 100%;
          border-radius: 8px;
          object-fit: cover;
        }
        .grid-container {
          flex: 1;
        }

        /* keep .card CSS as before */
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }
        .card {
          background: #fff;
          padding: 1.5rem;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 12px rgba(0,0,0,0.1);
        }
        .card h2 {
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
          color: #2e8b57;
        }
        .card p {
          font-size: 0.9rem;
          color: #555;
        }
      `}</style>

      <header className="header">
        <div className="title">EXPENSES Dashboard</div>
        <div className="user-avatar">
          <img src={avatarUrl} alt="User Avatar" />
        </div>
      </header>

      <main className="main">
        <div className="content">
          {/* Left-side promotional image */}
          <div className="image-container">
            <img src={promoImage} alt="Agriculture overview" />
          </div>

          {/* Right-side buttons/cards */}
          <div className="grid-container">
            <div className="grid">
              <div
                className="card"
                onClick={() => navigate('/add-expense')}
              >
                <h2>Add Expenses</h2>
                <p>Log new agricultural costs</p>
              </div>

              <div
                className="card"
                onClick={() => navigate('/view-expense')}
              >
                <h2>All Users' Expenses</h2>
                <p>See spending across the team</p>
              </div>

              <div
                className="card"
                onClick={() => navigate('/reports')}
              >
                <h2>Income Summary</h2>
                <p>View overall revenue vs. costs</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
