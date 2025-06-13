import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const SalesTrendsChart = ({ salesData }) => {
  const [dailySales, setDailySales] = useState([]);
  const [productSales, setProductSales] = useState([]);

  useEffect(() => {
    if (!salesData || salesData.length === 0) return;

    // Aggregate sales per day
    const dailyCount = salesData.reduce((acc, sale) => {
      const date = sale.date.split("T")[0]; // Extract YYYY-MM-DD
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Convert to array for the chart
    const dailyTrend = Object.entries(dailyCount).map(([date, count]) => ({ date, count }));

    // Aggregate sales per product
    const productCount = salesData.reduce((acc, sale) => {
      acc[sale.productName] = (acc[sale.productName] || 0) + 1;
      return acc;
    }, {});

    const productTrend = Object.entries(productCount).map(([product, count]) => ({ product, count }));

    setDailySales(dailyTrend);
    setProductSales(productTrend);
  }, [salesData]);

  // Line Chart for Daily Sales
  const dailySalesChartData = {
    labels: dailySales.map((entry) => entry.date),
    datasets: [
      {
        label: "Daily Sales",
        data: dailySales.map((entry) => entry.count),
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.1)",
      },
    ],
  };

  // Bar Chart for Product Sales
  const productSalesChartData = {
    labels: productSales.map((entry) => entry.product),
    datasets: [
      {
        label: "Product Sales",
        data: productSales.map((entry) => entry.count),
        backgroundColor: "green",
      },
    ],
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "20px" }}>
      <div style={{ width: "45%", minWidth: "300px" }}>
        <h3>Daily Customer Trend</h3>
        {dailySales.length > 0 ? <Line data={dailySalesChartData} /> : <p>No customer data available.</p>}
      </div>

      <div style={{ width: "45%", minWidth: "300px" }}>
        <h3>Product Sales Trend</h3>
        {productSales.length > 0 ? <Bar data={productSalesChartData} /> : <p>No product sales data available.</p>}
      </div>
    </div>
  );
};

export default SalesTrendsChart;