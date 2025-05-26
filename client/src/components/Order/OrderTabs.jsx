import React from "react";

const TABS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const OrderTabs = ({ activeTab, setActiveTab }) => (
  <div className="flex gap-0 mb-6 border-b border-gray-200 bg-white rounded-t-lg overflow-hidden">
    {TABS.map((tab) => (
      <button
        key={tab.value}
        className={`flex-1 px-4 py-2 text-sm font-semibold transition border-none bg-transparent relative
          ${activeTab === tab.value ? "text-red-600" : "text-black"}
        `}
        style={{
          borderBottom: activeTab === tab.value ? "3px solid #dc2626" : "3px solid transparent",
          background: "none",
          outline: "none",
        }}
        onClick={() => setActiveTab(tab.value)}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default OrderTabs;