import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function OrderStatusPieChart({ data }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    console.log("Received Data:", data); // ✅ Debugging
  
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log("Data is empty or undefined!");
      return;
    }
  
    // Ensure all statuses exist, even if count is 0
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
          backgroundColor: ["#FFA500", "#4CAF50", "#FF6347", "#3498DB"], // Orange, Green, Red, Blue
          hoverOffset: 4,
        },
      ],
    });
  }, [data]);
  

  if (!chartData) return <p>Loading...</p>;

  return (
    <div style={{ width: "300px", height: "300px", margin: "auto" }}>
      <Pie data={chartData} />
    </div>
  );
}
