import { Suspense } from "react";
import SkeletonCard from "./SkeletonCard";

export default function DashboardChartSection({ title, children }) {
  return (
    <div className="mt-6 bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <Suspense fallback={<SkeletonCard height={300} />}>
        {children}
      </Suspense>
    </div>
  );
}