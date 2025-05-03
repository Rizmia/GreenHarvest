import React, { useEffect, useState } from "react";
import axios from "axios";

export default function WeeklySummary() {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    from: "",
    to: ""
  });

  const [expenses, setExpenses] = useState([]);
  const [highestSpender, setHighestSpender] = useState("");
  const [lowestSpender, setLowestSpender] = useState("");

  useEffect(() => {
    // Fetch weekly summary
    axios
      .get("http://localhost:5000/api/expenses/summary/weekly")
      .then((res) => setSummary(res.data))
      .catch((err) => console.error(err));

    // Fetch full expenses (filter weekly on frontend)
    axios
      .get("http://localhost:5000/api/expenses")
      .then((res) => {
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 6);

        // Filter expenses only within the last 7 days
        const weeklyExpenses = res.data.filter(exp => {
          const expDate = new Date(exp.date);
          return expDate >= sevenDaysAgo && expDate <= today;
        });

        setExpenses(weeklyExpenses);

        // Find highest and lowest spender
        const grouped = {};

        weeklyExpenses.forEach(exp => {
          if (!grouped[exp.expenseName]) {
            grouped[exp.expenseName] = 0;
          }
          grouped[exp.expenseName] += exp.amount;
        });

        const sortedUsers = Object.keys(grouped).sort((a, b) => grouped[b] - grouped[a]);

        setHighestSpender(sortedUsers[0] || "N/A");
        setLowestSpender(sortedUsers[sortedUsers.length - 1] || "N/A");
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📅 Weekly Summary</h2>
      <p style={styles.sub}>
        From: <strong>{summary.from}</strong>  |  To: <strong>{summary.to}</strong>
      </p>

      <div style={styles.card}>
        <p><strong>Total Expenses (7 days):</strong> Rs. {summary.totalExpenses}</p>
      </div>

      {/* 🧑 Weekly Spend Analysis */}
      <div style={styles.spenders}>
        <p><strong>Highest Spender:</strong> {highestSpender}</p>
        <p><strong>Lowest Spender:</strong> {lowestSpender}</p>
      </div>

      {/* 📋 Weekly Expenses Table */}
      <div style={styles.tableWrapper}>
        <h3 style={styles.tableTitle}>Expenses List (This Week)</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Amount (Rs)</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Payment</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length > 0 ? (
              expenses.map((exp, index) => (
                <tr key={index}>
                  <td style={styles.td}>{exp.expenseName}</td>
                  <td style={styles.td}>{exp.category}</td>
                  <td style={styles.td}>Rs. {exp.amount.toFixed(2)}</td>
                  <td style={styles.td}>{new Date(exp.date).toLocaleDateString()}</td>
                  <td style={styles.td}>{exp.paymentMethod}</td>
                  <td style={styles.td}>{exp.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={styles.td} colSpan="6">No expenses recorded this week.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "24px", fontFamily: "Segoe UI, sans-serif", backgroundColor: "#f4f6f8", minHeight: "100vh" },
  title: { fontSize: "28px", marginBottom: "12px", color: "#2f855a", textAlign: "center" },
  sub: { fontSize: "0.95rem", color: "#333", textAlign: "center", marginBottom: "24px" },
  card: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    maxWidth: "400px",
    margin: "0 auto",
    marginBottom: "24px"
  },
  spenders: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    maxWidth: "400px",
    margin: "0 auto",
    marginBottom: "24px",
    textAlign: "center"
  },
  tableWrapper: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    marginTop: "30px",
    overflowX: "auto"
  },
  tableTitle: {
    fontSize: "22px",
    marginBottom: "16px",
    textAlign: "center",
    color: "#2c3e50"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "15px"
  },
  th: {
    backgroundColor: "#2980b9",
    color: "white",
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "center"
  },
  td: {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "center",
    backgroundColor: "#f9f9f9"
  }
};
