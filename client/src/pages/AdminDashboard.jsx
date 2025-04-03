import { useState, useEffect, Suspense, lazy } from "react";
import SkeletonCard from "../components/Dashboard/SkeletonCard";
import DashboardCard from "../components/Dashboard/DashboardCard";

// Lazy-load chart components
const LazyChart = lazy(() => import("../components/Dashboard/ChartComponent"));
const LazyLineChart = lazy(() => import("../components/Dashboard/HourlySalesChart"));
const LazyBarChart = lazy(() => import("../components/Dashboard/DailySalesChart"));
const LazyPieChart = lazy(() => import("../components/Dashboard/OrderStatusPieChart"));
const LazyCustomerTrendChart = lazy(() => import("../components/Dashboard/CustomerTrendChart"));
const LazyProductTrendChart = lazy(() => import("../components/Dashboard/ProductTrendChart"));

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filterType, setFilterType] = useState("daily");

  // Retrieve the selected date from localStorage if available
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
        console.error("Error fetching dashboard data:", err);
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
    localStorage.setItem("selectedDate", newDate); // Save to localStorage
  };

  return (
    <div className="p-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map((i) => <SkeletonCard key={i} />)
        ) : dashboardData ? (
          <>
            <DashboardCard title="Total Sales" value={`₱${dashboardData.totalSales?.toLocaleString() || "0"}`} />
            <DashboardCard title="Total Orders" value={dashboardData.totalOrders || "0"} />
            <DashboardCard title="Total Customers" value={dashboardData.totalCustomers || "0"} />
          </>
        ) : (
          <p className="text-red-500">Failed to load dashboard data.</p>
        )}
      </div>

      {/* Customer Trend Chart */}
      <div className="mt-6 bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3">Customer Order Trend (Daily)</h2>
        <Suspense fallback={<SkeletonCard height={300} />}>
          <LazyCustomerTrendChart data={calculateCustomerTrend()} />
        </Suspense>
      </div>

      {/* Product Trend Chart */}
      <div className="mt-6 bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3">Product Sales Trend (Daily)</h2>
        <Suspense fallback={<SkeletonCard height={300} />}>
          <LazyProductTrendChart data={calculateProductTrend()} />
        </Suspense>
      </div>

      {/* Other charts */}
      <div className="mt-6 bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3">Order Summary</h2>
        <Suspense fallback={<SkeletonCard height={300} />}>
          <LazyChart data={dashboardData?.orderSummary || []} />
        </Suspense>
      </div>

      {filterType === "daily" && (
        <div className="mt-6 bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Sales & Orders Per Hour</h2>
          <Suspense fallback={<SkeletonCard height={300} />}>
            <LazyLineChart data={dashboardData?.hourlySales || []} />
          </Suspense>
        </div>
      )}

      {filterType === "monthly" && (
        <div className="mt-6 bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Daily Sales Trend</h2>
          <Suspense fallback={<SkeletonCard height={300} />}>
            <LazyBarChart data={dashboardData?.dailySales || []} />
          </Suspense>
        </div>
      )}

      <div className="mt-6 bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3">Order Status Breakdown</h2>
        <Suspense fallback={<SkeletonCard height={300} />}>
          <LazyPieChart data={dashboardData?.orderSummary || []} />
        </Suspense>
      </div>
    </div>
  );
}
