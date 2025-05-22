import DashboardCard from "./DashboardCard";
import SkeletonCard from "./SkeletonCard";

export default function DashboardSummarySection({ loading, dashboardData }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
      </div>
    );
  }
  if (!dashboardData) {
    return <p className="text-red-500">Failed to load dashboard data.</p>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DashboardCard title="Total Sales" value={`₱${dashboardData.totalSales?.toLocaleString() || "0"}`} />
      <DashboardCard title="Total Orders" value={dashboardData.totalOrders || "0"} />
      <DashboardCard title="Total Customers" value={dashboardData.totalCustomers || "0"} />
    </div>
  );
}