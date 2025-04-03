import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function HourlySalesChart({ data = [] }) {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">Loading hourly sales data...</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" label={{ value: "Hour", position: "insideBottom", offset: -5 }} />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="totalSales" stroke="#4CAF50" name="Sales (₱)" />
        <Line type="monotone" dataKey="totalOrders" stroke="#FF5733" name="Orders" />
      </LineChart>
    </ResponsiveContainer>
  );
}
