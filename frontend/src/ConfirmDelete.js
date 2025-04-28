import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import bgImage from "./images/1.jpeg";

const ConfirmDelete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { expenseId } = location.state || {};

  const handleConfirmDelete = async () => {
    if (expenseId) {
      try {
        await axios.delete(`http://localhost:5000/api/expenses/${expenseId}`);
        // Navigate back to ViewExpense with the deletedExpenseId
        navigate("/view-expense", { state: { deletedExpenseId: expenseId } });
      } catch (error) {
        console.error("Error deleting expense:", error.response?.data || error.message);
      }
    }
  };

  const handleCancel = () => {
    navigate("/view-expense"); // Just go back without deletion
  };

  return (
    <div style={styles.container}>
      <div style={styles.confirmationBox}>
        <h3>Are you sure you want to delete this expense?</h3>
        <div style={styles.buttonContainer}>
          <button onClick={handleConfirmDelete} style={styles.confirmButton}>Yes</button>
          <button onClick={handleCancel} style={styles.cancelButton}>No</button>
        </div>
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
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  confirmationBox: {
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "20px",
  },
  confirmButton: {
    padding: "10px 20px",
    backgroundColor: "#DC3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ConfirmDelete;




