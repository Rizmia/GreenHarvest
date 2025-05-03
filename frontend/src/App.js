import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import AddExpense from "./AddExpense";
import ViewExpense from "./ViewExpense";
import EditExpense from "./EditExpense";
import Home from "./Home";
import LandingPage from "./LandingPage";
import ConfirmDelete from "./ConfirmDelete";
import WeeklySummaryPage from "./components/WeeklySummaryPage"; // ✅ FIXED
import Summary from "./Summary";
import WeeklySummary from "./WeeklySummary";
import WeeklyChart from "./WeeklyChart";
import AllexpensesChart from "./AllexpensesChart";


import ReportsPage from "./ReportsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/add-expense" element={<AddExpense />} />
        <Route path="/view-expense" element={<ViewExpense />} />
        <Route path="/edit-expense" element={<EditExpense />} />
        <Route path="/confirm-delete" element={<ConfirmDelete />} />
        <Route path="/weekly-summary" element={<WeeklySummaryPage />} />

        <Route path="/summary" element={<Summary />} />
        <Route path="/summary/weekly" element={<WeeklySummary />} />
        <Route path="/summary/weekly/chart" element={<WeeklyChart />} />
        <Route path="/summary/all/chart" element={<AllexpensesChart />} />
        
        
      </Routes>
    </Router>
  );
}

export default App;


