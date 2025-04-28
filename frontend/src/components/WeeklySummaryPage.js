import React from "react";
import WeeklyExpenseChart from "../components/WeeklyExpenseChart";
import bgImage from "../images/2.jpeg";


const WeeklySummaryPage = () => {
  return (
    <div
      className="weekly-summary-page"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="summary-content"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "2rem",
          borderRadius: "15px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          textAlign: "center",
          width: "90%",
          maxWidth: "800px",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            marginBottom: "1.5rem",
            color: "#333",
          }}
        >
          Weekly Financial Summary
        </h1>
        <WeeklyExpenseChart />
      </div>
    </div>
  );
};

export default WeeklySummaryPage;

