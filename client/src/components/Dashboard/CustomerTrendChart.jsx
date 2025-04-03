// src/components/Dashboard/CustomerTrendChart.js
import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CustomerTrendChart = ({ data }) => {
  // Prepare chart data
  const chartData = {
    labels: data.map((entry) => entry.date),
    datasets: [
      {
        label: "Unique Users",
        data: data.map((entry) => entry.userCount),
        borderColor: "#4bc0c0",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div>
      <Line data={chartData} options={{ responsive: true }} />
    </div>
  );
};

export default CustomerTrendChart;
