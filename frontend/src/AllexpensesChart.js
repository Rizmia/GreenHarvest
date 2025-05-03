import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function Summary() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/expenses")
      .then((res) => {
        setExpenses(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Group expenses by category
  const groupByCategory = () => {
    const grouped = {};
    expenses.forEach(exp => {
      if (!grouped[exp.category]) {
        grouped[exp.category] = 0;
      }
      grouped[exp.category] += exp.amount;
    });
    return grouped;
  };

  const categoryData = groupByCategory();
  const labels = Object.keys(categoryData);
  const amounts = Object.values(categoryData);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Expenses (Rs)",
        data: amounts,
        backgroundColor: [
          "#4CAF50", "#FF6384", "#36A2EB", "#FFCE56", "#8E44AD", "#e67e22", "#2ecc71"
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 Category Wise Expense Summary</h2>

      <div style={styles.charts}>
        {/* Pie Chart */}
        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Pie Chart</h3>
          <Pie data={chartData} />
        </div>

        {/* Bar Chart */}
        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Bar Chart</h3>
          <Bar data={chartData} options={{ responsive: true }} />
        </div>

        {/* Doughnut Chart */}
        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Doughnut Chart</h3>
          <Doughnut data={chartData} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh"
  },
  title: {
    fontSize: "28px",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: "30px"
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
