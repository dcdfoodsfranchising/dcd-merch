import { Suspense, lazy } from "react";
import SkeletonCard from "../components/Dashboard/SkeletonCard";

const LazyPieChart = lazy(() => import("../components/Dashboard/OrderStatusPieChart"));
const LazyLineChart = lazy(() => import("../components/Dashboard/HourlySalesChart"));
const LazyBarChart = lazy(() => import("../components/Dashboard/DailySalesChart"));
const LazyCustomerTrendChart = lazy(() => import("../components/Dashboard/DailyCustomerTrend"));
const LazyProductTrendChart = lazy(() => import("../components/Dashboard/ProductTrendChart"));

const DashboardCharts = ({ type, data }) => {
  const chartMap = {
    "order-status": LazyPieChart,
    "hourly-sales": LazyLineChart,
    "daily-sales": LazyBarChart,
    "customer-trend": LazyCustomerTrendChart,
    "product-trend": LazyProductTrendChart,
  };

  const ChartComponent = chartMap[type];

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mt-6">
      <Suspense fallback={<SkeletonCard height={300} />}>
        {ChartComponent ? <ChartComponent data={data} /> : <p>Invalid chart type</p>}
      </Suspense>
    </div>
  );
};

export default DashboardCharts;