import React from "react";
import { Route, Routes } from "react-router";
import './App.css';
import IncomeHome from "./Components/IncomeHome/IncomeHome";
import AddLocalIncome from "./Components/Add Local Income/AddLocalIncome";
import LocalIncomes from "./Components/Local Income Details/LocalIncomes";
import UpdateLocalIncome from "./Components/UpdateLocalIncome/UpdateLocalIncome";
import AddExportIncome from "./Components/Add Export Income/AddExportIncome";
import ExportIncomes from "./Components/Export Income Details/ExportIncomes";
import AboutUs from "./Components/About Us/AboutUs";
import UpdateExportIncome from "./Components/UpdateExportIncome/UpdateExportIncome";
import MonthlyRevenueChart from "./Components/MonthlyChart/MonthlyRevenueChart";
import ExportMonthlyChart from "./Components/ExportMonthlyChart/ExportMonthlyChart";

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<IncomeHome />} />
        <Route path="/mainincomehome" element={<IncomeHome />} />
        <Route path="/addlocalincome" element={<AddLocalIncome />} />
        <Route path="/localincomedetails" element={<LocalIncomes />} />
        <Route path="/localincomedetails/:id" element={<UpdateLocalIncome />} />
        <Route path="/addexportincome" element={<AddExportIncome />} />
        <Route path="/exportincomedetails" element={<ExportIncomes />} />
        <Route path="/exportincomedetails/:id" element={<UpdateExportIncome />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/monthly-revenue" element={<MonthlyRevenueChart />} />
        <Route path="/monthly-export-revenue" element={<ExportMonthlyChart />} />
      </Routes>
    </div>
  );
}

export default App;



