import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const WeeklyExpenseChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/expenses/summary/weekly/chart")
      .then(res => {
        const labels = res.data.map(entry => entry._id);
        const incomeData = res.data.map(entry => entry.totalIncome);
        const expenseData = res.data.map(entry => entry.totalExpense);

        setChartData({
          labels,
          datasets: [
            {
              label: "Income",
              data: incomeData,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
            {
              label: "Expense",
              data: expenseData,
              backgroundColor: "rgba(255, 99, 132, 0.6)",
            }
          ]
        });
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ width: "80%", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Weekly Income vs Expense</h2>
      {chartData ? <Bar data={chartData} /> : <p>Loading chart...</p>}
    </div>
  );
};

export default WeeklyExpenseChart;
