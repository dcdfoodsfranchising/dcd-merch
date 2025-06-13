import { useState, useEffect } from "react";
import CustomerOrderTrendChart from "../components/Dashboard/charts/CustomerOrderTrendChart";
import ProductSalesTrendChart from "../components/Dashboard/charts/ProductSalesTrendChart";
import OrderSummaryChart from "../components/Dashboard/charts/OrderSummaryChart";
import OrderStatusPieChart from "../components/Dashboard/charts/OrderStatusPieChart";
import DashboardSummarySection from "../components/Dashboard/DashboardSummarySection";
import SkeletonCard from "../components/Dashboard/SkeletonCard";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("daily");
  const storedDate = localStorage.getItem("selectedDate");
  const [selectedDate, setSelectedDate] = useState(storedDate || new Date().toISOString().split("T")[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      setError("");
      let filterQuery = `filterType=${filterType}`;
      if (filterType === "daily") {
        filterQuery += `&date=${selectedDate}`;
      } else if (filterType === "monthly") {
        const [year, month] = selectedMonth.split("-");
        filterQuery += `&year=${year}&month=${parseInt(month)}`;
      } else {
        filterQuery += `&year=${selectedYear}`;
      }
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/dashboard/summary?${filterQuery}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        if (!response.ok) throw new Error("Failed to fetch dashboard data.");
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [filterType, selectedDate, selectedMonth, selectedYear]);

  // Calculate Customer Trend (Number of Users Who Ordered Each Day)
  const calculateCustomerTrend = () => {
    const orders = dashboardData?.orders || [];
    const customerTrend = {};
    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
      if (!customerTrend[orderDate]) customerTrend[orderDate] = new Set();
      customerTrend[orderDate].add(order.userId);
    });
    return Object.keys(customerTrend).map((date) => ({
      date,
      userCount: customerTrend[date].size,
    }));
  };

  // Calculate Product Trend (Number of Products Sold Each Day)
  const calculateProductTrend = () => {
    const orders = dashboardData?.orders || [];
    const productTrend = {};
    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
      order.items.forEach((item) => {
        const productId = item.productId;
        const quantitySold = item.quantity;
        if (!productTrend[orderDate]) productTrend[orderDate] = {};
        if (!productTrend[orderDate][productId]) productTrend[orderDate][productId] = 0;
        productTrend[orderDate][productId] += quantitySold;
      });
    });
    // Format data for chart
    const productTrendData = [];
    Object.keys(productTrend).forEach((date) => {
      Object.keys(productTrend[date]).forEach((productId) => {
        productTrendData.push({
          date,
          productId,
          totalQuantitySold: productTrend[date][productId],
        });
      });
    });
    return productTrendData;
  };

  // Update selected date in localStorage when it changes
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    localStorage.setItem("selectedDate", newDate);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex flex-wrap gap-4 items-center mt-4 md:mt-0">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border p-2 rounded-lg shadow-md hover:bg-gray-100"
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          {filterType === "daily" && (
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="border p-2 rounded-lg shadow-md hover:bg-gray-100"
            />
          )}
          {filterType === "monthly" && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border p-2 rounded-lg shadow-md hover:bg-gray-100"
            />
          )}
          {filterType === "yearly" && (
            <input
              type="number"
              min="2000"
              max={new Date().getFullYear()}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border p-2 rounded-lg shadow-md hover:bg-gray-100 w-24 text-center"
            />
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <DashboardSummarySection loading={loading} dashboardData={dashboardData} />

      <CustomerOrderTrendChart data={calculateCustomerTrend()} />
      <ProductSalesTrendChart data={calculateProductTrend()} />
      <OrderSummaryChart data={dashboardData?.orderSummary || []} />
      <OrderStatusPieChart data={dashboardData?.orderSummary || []} />

      {/* ...other charts/tables as needed... */}
    </div>
  );
}