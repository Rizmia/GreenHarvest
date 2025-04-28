import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import bgImage from "./images/1.jpeg";

const ViewExpense = () => {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Fetch expenses from the backend
    const fetchExpenses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/expenses");
        let updatedExpenses = response.data;

        // If there's an updated expense from EditExpense, update the list
        if (location.state?.updatedExpense) {
          updatedExpenses = updatedExpenses.map((exp) =>
            exp._id === location.state.updatedExpense._id ? location.state.updatedExpense : exp
          );
        }

        // If deletedExpenseId is passed, remove the deleted expense from the list
        if (location.state?.deletedExpenseId) {
          updatedExpenses = updatedExpenses.filter(
            (exp) => exp._id !== location.state.deletedExpenseId
          );
        }

        setExpenses(updatedExpenses);
        localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, [location.state]); // Dependency on location.state for detecting updates

  const handleDelete = (id) => {
    // Navigate to ConfirmDelete page with the expense ID
    navigate("/confirm-delete", { state: { expenseId: id } });
  };

  const handleEdit = (expense) => {
    navigate("/edit-expense", { state: { expense } });
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.heading}>Expense List</h2>
        {expenses.length > 0 ? (
          <ul style={styles.expenseList}>
            {expenses.map((expense, index) => (
              <li key={index} style={styles.expenseItem}>
                <p><strong>Name:</strong> {expense.expenseName}</p>
                <p><strong>Category:</strong> {expense.category}</p>
                <p><strong>Amount:</strong> Rs. {expense.amount}</p>
                <p><strong>Date:</strong> {expense.date}</p>
                <p><strong>Payment Method:</strong> {expense.paymentMethod}</p>
                <p><strong>Status:</strong> {expense.status}</p>
                <p><strong>Description:</strong> {expense.description || "No description"}</p>
                <button style={styles.editButton} onClick={() => handleEdit(expense)}>Edit</button>
                <button style={styles.deleteButton} onClick={() => handleDelete(expense._id)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No expenses added yet.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f4f4f4",
    backgroundImage: `url(${bgImage})`,
  },
  box: {
    padding: "24px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "500px",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#2f855a",
    textAlign: "center",
    marginBottom: "16px",
  },
  expenseList: {
    listStyleType: "none",
    padding: 0,
  },
  expenseItem: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    marginBottom: "10px",
  },
  editButton: {
    backgroundColor: "blue",
    color: "white",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "5px",
  },
  deleteButton: {
    backgroundColor: "red",
    color: "white",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ViewExpense;
















