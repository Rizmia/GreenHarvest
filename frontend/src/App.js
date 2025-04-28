import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import AddExpense from "./AddExpense";
import ViewExpense from "./ViewExpense";
import EditExpense from "./EditExpense";
import Home from "./Home";
import ConfirmDelete from "./ConfirmDelete";
import WeeklySummaryPage from "./components/WeeklySummaryPage"; // ✅ FIXED

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-expense" element={<AddExpense />} />
        <Route path="/view-expense" element={<ViewExpense />} />
        <Route path="/edit-expense" element={<EditExpense />} />
        <Route path="/confirm-delete" element={<ConfirmDelete />} />
        <Route path="/weekly-summary" element={<WeeklySummaryPage />} />
      </Routes>
    </Router>
  );
}

export default App;


