import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "./images/1.jpeg";

const AddExpense = () => {
  const [expense, setExpense] = useState({
    expenseName: "",
    category: "Fertilizers",
    amount: "",
    date: "",
    paymentMethod: "Cash",
    status: "Paid",
    description: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/expenses", expense);
      alert("Expense added successfully!");

      // Get previous expenses from localStorage
      const storedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
      
      // Add the new expense to the list
      const updatedExpenses = [...storedExpenses, response.data.expense];

      // Save updated expenses in localStorage
      localStorage.setItem("expenses", JSON.stringify(updatedExpenses));

      // Navigate to view expenses with the updated list
      navigate("/view-expense");

      // Reset form fields
      setExpense({
        expenseName: "",
        category: "Fertilizers",
        amount: "",
        date: "",
        paymentMethod: "Cash",
        status: "Paid",
        description: "",
      });
    } catch (error) {
      alert("Failed to add expense: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={styles.heading}>Add Expense</h2>
        <form style={styles.form} onSubmit={handleSubmit}>
          <input type="text" name="expenseName" placeholder="Expense Name" value={expense.expenseName} onChange={handleChange} required style={styles.input} />
          <select name="category" value={expense.category} onChange={handleChange} style={styles.input}>
            <option value="Fertilizers">Fertilizers</option>
            <option value="Labor">Labor</option>
            <option value="Transport">Transport</option>
            <option value="Other">Other</option>
          </select>
          <input type="number" name="amount" placeholder="Amount" value={expense.amount} onChange={handleChange} required style={styles.input} />
          <input type="date" name="date" value={expense.date} onChange={handleChange} required style={styles.input} />
          <select name="paymentMethod" value={expense.paymentMethod} onChange={handleChange} style={styles.input}>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Other">Other</option>
          </select>
          <select name="status" value={expense.status} onChange={handleChange} style={styles.input}>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
          <textarea name="description" placeholder="Description" value={expense.description} onChange={handleChange} style={styles.textarea}></textarea>
          <button type="submit" style={styles.button}>Add Expense</button>
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
  formBox: {
    padding: "24px",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#2f855a",
    textAlign: "center",
    marginBottom: "16px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    border: "1px solid #ccc",
    padding: "10px",
    borderRadius: "6px",
    width: "100%",
    fontSize: "16px",
    outline: "none",
    transition: "0.3s",
  },
  textarea: {
    border: "1px solid #ccc",
    padding: "10px",
    borderRadius: "6px",
    width: "100%",
    fontSize: "16px",
    outline: "none",
    minHeight: "80px",
    transition: "0.3s",
  },
  button: {
    backgroundColor: "#2f855a",
    color: "white",
    padding: "12px",
    borderRadius: "6px",
    fontSize: "18px",
    textAlign: "center",
    cursor: "pointer",
    border: "none",
    transition: "0.3s",
  },
};




export default AddExpense;
