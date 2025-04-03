export default function DashboardCard({ title, value, bgColor = "bg-white", textColor = "text-blue-600" }) {
    return (
      <div className={`${bgColor} shadow-md rounded-lg p-4 text-center`}>
        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
      </div>
    );
  }
  