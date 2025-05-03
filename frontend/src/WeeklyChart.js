import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function WeeklyChart() {
  const [expenses, setExpenses] = useState([]);
  const [viewMode, setViewMode] = useState("category"); // category or user

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/expenses")
      .then((res) => {
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 6);

        const weeklyExpenses = res.data.filter(exp => {
          const expDate = new Date(exp.date);
          return expDate >= sevenDaysAgo && expDate <= today;
        });

        setExpenses(weeklyExpenses);
      })
      .catch((err) => console.error(err));
  }, []);

  // Prepare chart data
  const groupData = (key) => {
    const grouped = {};
    expenses.forEach(exp => {
      const groupKey = exp[key];
      if (!grouped[groupKey]) grouped[groupKey] = 0;
      grouped[groupKey] += exp.amount;
    });

    return {
      labels: Object.keys(grouped),
      datasets: [
        {
          label: "Expenses (Rs)",
          data: Object.values(grouped),
          backgroundColor: [
            "#4CAF50", "#FF6384", "#36A2EB", "#FFCE56", "#8E44AD", "#e67e22", "#2ecc71"
          ],
          borderColor: "#fff",
          borderWidth: 1
        }
      ]
    };
  };

  const data = viewMode === "category" ? groupData("category") : groupData("expenseName");

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 Weekly Expenses Visualization</h2>

      {/* 🧭 View Mode Switcher */}
      <div style={styles.buttonGroup}>
        <button
          style={viewMode === "category" ? styles.activeButton : styles.button}
          onClick={() => setViewMode("category")}
        >
          View by Expense Category
        </button>
        <button
          style={viewMode === "user" ? styles.activeButton : styles.button}
          onClick={() => setViewMode("user")}
        >
          View by Expense Name
        </button>
      </div>

      {/* 📊 Charts */}
      <div style={styles.charts}>
        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Pie Chart</h3>
          <Pie data={data} />
        </div>
        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Bar Chart</h3>
          <Bar data={data} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "24px", backgroundColor: "#f4f6f8", minHeight: "100vh", fontFamily: "Segoe UI, sans-serif" },
  title: { fontSize: "28px", marginBottom: "20px", color: "#2c3e50", textAlign: "center" },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "30px",
    flexWrap: "wrap"
  },
  button: {
    backgroundColor: "#3498db",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background 0.3s"
  },
  activeButton: {
    backgroundColor: "#2ecc71",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background 0.3s"
  },
  charts: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    flexWrap: "wrap"
  },
  chartBox: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "400px"
  },
  chartTitle: {
    fontSize: "20px",
    marginBottom: "16px",
    textAlign: "center",
    color: "#34495e"
  }
};
