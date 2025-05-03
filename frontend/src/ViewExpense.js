// src/pages/ViewExpense.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import bgImage from "./images/1.jpeg";

const ViewExpense = () => {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/expenses");
        let updated = response.data;

        if (location.state?.updatedExpense) {
          updated = updated.map(exp =>
            exp._id === location.state.updatedExpense._id
              ? location.state.updatedExpense
              : exp
          );
        }
        if (location.state?.deletedExpenseId) {
          updated = updated.filter(exp => exp._id !== location.state.deletedExpenseId);
        }
        setExpenses(updated);
        localStorage.setItem("expenses", JSON.stringify(updated));
      } catch (err) {
        console.error("Error fetching expenses:", err);
      }
    };

    fetchExpenses();
  }, [location.state]);

  const handleDelete = id =>
    navigate("/confirm-delete", { state: { expenseId: id } });
  const handleEdit = expense =>
    navigate("/edit-expense", { state: { expense } });

  return (
    <div style={styles.container}>
      {/* blurred background */}
      <div style={styles.bgImage} />

      <div style={styles.box}>
        {/* title above table */}
        <h2 style={styles.title}>Expense List</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Payment</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(exp => (
              <tr key={exp._id} style={styles.tr}>
                <td style={styles.td}>{exp.expenseName}</td>
                <td style={styles.td}>{exp.category}</td>
                <td style={styles.td}>Rs. {exp.amount}</td>
                <td style={styles.td}>{exp.date}</td>
                <td style={styles.td}>{exp.paymentMethod}</td>
                <td style={styles.td}>{exp.status}</td>
                <td style={styles.td}>
                 {exp.description
                    ? exp.description
                    : "No description"}
               </td>
                <td style={styles.td}>
                  <button
                    style={styles.editButton}
                    onClick={() => handleEdit(exp)}
                  >
                    Edit
                  </button>
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDelete(exp._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    overflow: "hidden",
  },
  bgImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "blur(8px)",
    zIndex: -1,
  },
  box: {
    position: "relative",
    padding: "24px",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    width: "90%",
    maxWidth: "1000px",
  },
  title: {
    marginBottom: "16px",
    fontSize: "28px",
    fontWeight: "600",
    color: "#2f855a",
    textAlign: "center",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    borderBottom: "2px solid #ccc",
    textAlign: "left",
    padding: "8px",
    fontSize: "0.95rem",
    color: "#333",
  },
  tr: {
    transition: "background 0.2s",
  },
  td: {
    borderBottom: "1px solid #e2e8f0",
    padding: "8px",
    fontSize: "1.1rem",
    color: "#444",
    verticalAlign: "middle",
  },
  editButton: {
    backgroundColor: "#3182ce",
    color: "#fff",
    width: "80px",
    padding: "6px 0",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "0.85rem",
    marginRight: "8px",
  },
  deleteButton: {
    backgroundColor: "#e53e3e",
    color: "#fff",
    width: "80px",
    padding: "6px 0",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
};

export default ViewExpense;
