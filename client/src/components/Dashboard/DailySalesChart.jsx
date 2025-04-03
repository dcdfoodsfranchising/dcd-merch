import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function DailySalesChart({ data = [] }) {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">Loading daily sales data...</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" label={{ value: "Day of the Month", position: "insideBottom", offset: -5 }} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="totalSales" fill="#4CAF50" name="Sales (₱)" />
      </BarChart>
    </ResponsiveContainer>
  );
}
