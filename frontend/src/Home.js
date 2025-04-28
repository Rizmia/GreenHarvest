import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from "./images/1.jpeg";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';

const Home = () => {
  const navigate = useNavigate();

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [weeklyIncome, setWeeklyIncome] = useState(0);
  const [weeklyExpenses, setWeeklyExpenses] = useState(0);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const resTotal = await fetch('http://localhost:5000/api/balance/');
        const totalData = await resTotal.json();
        setTotalIncome(totalData.totalIncome);
        setTotalExpenses(totalData.totalExpenses);

        const resWeekly = await fetch('http://localhost:5000/api/expenses/summary/weekly');
        const weeklyData = await resWeekly.json();
        setWeeklyIncome(weeklyData.totalIncome);
        setWeeklyExpenses(weeklyData.totalExpenses);
      } catch (error) {
        console.error('Error fetching summaries:', error);
      }
    };

    fetchSummary();
  }, []);

  const remainingBalance = totalIncome - totalExpenses;
  const weeklyBalance = weeklyIncome - weeklyExpenses;

  const handleAddExpense = () => {
    navigate('/add-expense');
  };

  const generateReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Agriculture Expense Report", 14, 20);

    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Time: ${new Date().toLocaleTimeString()}`, 14, 36);

    autoTable(doc, {
      startY: 50,
      head: [["Category", "Amount (Rs.)"]],
      body: [
        ["Total Income", totalIncome],
        ["Total Expenses", totalExpenses],
        ["Remaining Balance", remainingBalance],
        ["Weekly Income", weeklyIncome],
        ["Weekly Expenses", weeklyExpenses],
        ["Weekly Balance", weeklyBalance]
      ],
      theme: "grid",
      headStyles: { fillColor: [76, 175, 80] },
    });

    doc.save("Expense_Report.pdf");
  };

  return (
    <div style={styles.wrapper}>
      <style>
        {`
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
          }

          .content-container {
            background-color: rgba(255, 255, 255, 0.9);
            padding: 40px;
            border-radius: 12px;
            max-width: 1000px;
            width: 90%;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
          }

          .home-header {
            text-align: center;
            margin-bottom: 30px;
          }

          .home-header h1 {
            color: green;
            font-weight: bold;
          }

          .expense-summary h2 {
            color: green;
            font-weight: bold;
            margin-top: 40px;
            margin-bottom: 15px;
          }

          .summary-cards {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
          }

          .card {
            background-color: #e8f5e9;
            border-radius: 10px;
            padding: 20px;
            width: 200px;
            text-align: center;
            margin: 10px;
          }

          .income-card {
            border-left: 5px solid #4caf50;
          }

          .expense-card {
            border-left: 5px solid #f44336;
          }

          .balance-card {
            border-left: 5px solid #ff9800;
          }

          .add-expense-button {
            display: block;
            margin: 20px auto 0 auto;
            padding: 10px 20px;
            font-size: 16px;
            font-weight: bold;
            background-color: #4caf50;
            color: black;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .add-expense-button:hover {
            background-color: #388e3c;
          }
        `}
      </style>

      <div className="content-container">
        <header className="home-header">
          <h1>🌾 Agriculture Expense Tracker</h1>
          <p>Manage your farm expenses efficiently!</p>
        </header>

        <section className="expense-summary">
          <h2>📊 Total Expense Summary</h2>
          <div className="summary-cards">
            <div className="card income-card">
              <h3>Total Income</h3>
              <p>Rs. {totalIncome}</p>
            </div>
            <div className="card expense-card">
              <h3>Total Expenses</h3>
              <p>Rs. {totalExpenses}</p>
            </div>
            <div className="card balance-card">
              <h3>Remaining Balance</h3>
              <p>Rs. {remainingBalance}</p>
            </div>
          </div>
        </section>

        <section className="expense-summary">
          <h2>🗓️ Weekly Expense Summary</h2>
          <div className="summary-cards">
            <div className="card income-card">
              <h3>Weekly Income</h3>
              <p>Rs. {weeklyIncome}</p>
            </div>
            <div className="card expense-card">
              <h3>Weekly Expenses</h3>
              <p>Rs. {weeklyExpenses}</p>
            </div>
            <div className="card balance-card">
              <h3>Weekly Balance</h3>
              <p>Rs. {weeklyBalance}</p>
            </div>
          </div>
        </section>

        <button className="add-expense-button" onClick={handleAddExpense}>
          Add Expense
        </button>

        <button className="add-expense-button" onClick={generateReport}>
          Download Report
        </button>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: "100vh",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "50px 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
};

export default Home;



