import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import bgImage from "./images/1.jpeg";

const EditExpense = () => {
  const [expense, setExpense] = useState({
    expenseName: "",
    amount: "",
    category: "",
    date: "",
    paymentMethod: "",
    status: "",
    description: "",
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.expense) {
      setExpense(location.state.expense);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense({ ...expense, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Update expense in localStorage
    const storedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const updatedExpenses = storedExpenses.map((exp) =>
      exp._id === expense._id ? expense : exp
    );

    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));

    // Navigate back to View Expenses and trigger state update
    navigate("/view-expense", { state: { updatedExpense: expense, refresh: true } });
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h3 style={styles.title}>Edit Expense</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          {Object.keys(expense).map((key) => (
            key !== "_id" && (
              <label key={key} style={styles.label}>
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}: 
                {key === "description" ? (
                  <textarea
                    name={key}
                    value={expense[key]}
                    onChange={handleChange}
                    style={styles.textarea}
                  />
                ) : (
                  <input
                    type={key === "amount" ? "number" : key === "date" ? "date" : "text"}
                    name={key}
                    value={expense[key]}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                )}
              </label>
            )
          ))}
          <button type="submit" style={styles.button}>Save Changes</button>
        </form>
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
  formContainer: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    width: "420px",
    textAlign: "center",
  },
  title: {
    color: "green",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    fontWeight: "bold",
    color: "#555",
  },
  input: {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
    transition: "0.3s",
  },
  button: {
    marginTop: "15px",
    background: "linear-gradient(135deg, #28a745, #218838)",
    color: "black",
    padding: "12px 20px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s",
  },
};

export default EditExpense;






