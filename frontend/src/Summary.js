import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";

export default function Summary() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mode, setMode] = useState("all"); // all, highest, lowest

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/expenses")
      .then((res) => {
        setExpenses(res.data);
        setFilteredExpenses(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    let filtered = [...expenses];

    if (searchTerm.trim()) {
      filtered = filtered.filter((exp) =>
        exp.expenseName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (mode === "highest" || mode === "lowest") {
      const grouped = {};

      filtered.forEach((exp) => {
        if (!grouped[exp.expenseName]) {
          grouped[exp.expenseName] = 0;
        }
        grouped[exp.expenseName] += exp.amount;
      });

      const sortedNames = Object.keys(grouped).sort(
        (a, b) => grouped[b] - grouped[a]
      );
      const targetName =
        mode === "highest"
          ? sortedNames[0]
          : sortedNames[sortedNames.length - 1];

      filtered = filtered.filter((exp) => exp.expenseName === targetName);
    }

    setFilteredExpenses(filtered);
  }, [expenses, searchTerm, mode]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Expense Report", 14, 20);

    const tableColumn = [
      "Name",
      "Category",
      "Amount",
      "Date",
      "Payment",
      "Status",
    ];
    const tableRows = filteredExpenses.map((exp) => [
      exp.expenseName,
      exp.category,
      `Rs. ${exp.amount.toFixed(2)}`,
      new Date(exp.date).toLocaleDateString(),
      exp.paymentMethod,
      exp.status,
    ]);

    autoTable(doc,{
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save("Expense_Report.pdf");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 Expense Records</h2>

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        <div style={styles.buttonGroup}>
          <button style={styles.smallButton} onClick={() => setMode("all")}>
            All
          </button>
          <button
            style={styles.smallButton}
            onClick={() => setMode("highest")}
          >
            Highest Spender
          </button>
          <button style={styles.smallButton} onClick={() => setMode("lowest")}>
            Lowest Spender
          </button>
          <button style={styles.downloadButton} onClick={downloadPDF}>
            📥 Download PDF
          </button>
        </div>
      </div>

      <div style={styles.tableWrapper}>
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
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((exp, index) => (
                <tr key={index}>
                  <td style={styles.td}>{exp.expenseName}</td>
                  <td style={styles.td}>{exp.category}</td>
                  <td style={styles.td}>Rs. {exp.amount.toFixed(2)}</td>
                  <td style={styles.td}>
                    {new Date(exp.date).toLocaleDateString()}
                  </td>
                  <td style={styles.td}>{exp.paymentMethod}</td>
                  <td style={styles.td}>{exp.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={styles.td} colSpan="6">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
  },
  title: {
    fontSize: "28px",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: "30px",
  },
  searchContainer: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  searchInput: {
    padding: "10px",
    width: "300px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  smallButton: {
    backgroundColor: "#3498db",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background 0.3s",
  },
  downloadButton: {
    backgroundColor: "#27ae60",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background 0.3s",
  },
  tableWrapper: {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    overflowX: "auto",
    marginTop: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "16px",
  },
  th: {
    backgroundColor: "#2980b9",
    color: "#fff",
    padding: "12px",
    border: "1px solid #e0e0e0",
    textAlign: "center",
  },
  td: {
    padding: "12px",
    border: "1px solid #e0e0e0",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
  },
};
