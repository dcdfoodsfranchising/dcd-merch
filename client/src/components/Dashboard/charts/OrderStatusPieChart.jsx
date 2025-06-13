import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function OrderStatusPieChart({ data }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return;
    const statusCounts = { Pending: 0, Completed: 0, Canceled: 0, Shipped: 0 };
    data.forEach((order) => {
      if (statusCounts.hasOwnProperty(order._id)) {
        statusCounts[order._id] += order.count;
      }
    });
    setChartData({
      labels: Object.keys(statusCounts),
      datasets: [
        {
          data: Object.values(statusCounts),
          backgroundColor: ["#FFA500", "#4CAF50", "#FF6347", "#3498DB"],
          hoverOffset: 4,
        },
      ],
    });
  }, [data]);

  if (!chartData) return <p>Loading...</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex justify-center">
      <div style={{ width: "300px", height: "300px" }}>
        <Pie data={chartData} />
      </div>
    </div>
  );
}