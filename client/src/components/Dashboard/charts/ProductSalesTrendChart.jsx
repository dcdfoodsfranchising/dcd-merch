import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ProductSalesTrendChart({ data }) {
  const labels = [...new Set(data.map((entry) => entry.date))];
  const products = [...new Set(data.map((entry) => entry.productId))];

  const datasets = products.map((productId, idx) => ({
    label: `Product ${productId}`,
    data: labels.map(
      (date) =>
        data.find((entry) => entry.date === date && entry.productId === productId)?.totalQuantitySold || 0
    ),
    backgroundColor: `hsl(${(idx * 60) % 360}, 70%, 60%)`,
  }));

  const chartData = { labels, datasets };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Product Sales Trend (Daily)</h2>
      <Bar data={chartData} options={{ responsive: true }} />
    </div>
  );
}