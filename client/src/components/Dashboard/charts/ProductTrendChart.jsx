// src/components/Dashboard/ProductTrendChart.js
import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProductTrendChart = ({ data }) => {
  // Prepare chart data
  const chartData = {
    labels: [...new Set(data.map((entry) => entry.date))], // Get unique dates
    datasets: []
  };

  // Group data by productId and prepare datasets
  const products = [...new Set(data.map((entry) => entry.productId))];
  products.forEach((productId) => {
    const productData = data.filter((entry) => entry.productId === productId);
    chartData.datasets.push({
      label: `Product ${productId}`,
      data: chartData.labels.map((date) => {
        const productOnDate = productData.find((entry) => entry.date === date);
        return productOnDate ? productOnDate.totalQuantitySold : 0;
      }),
      backgroundColor: "rgba(75, 192, 192, 0.5)",
    });
  });

  return (
    <div>
      <Bar data={chartData} options={{ responsive: true }} />
    </div>
  );
};

export default ProductTrendChart;