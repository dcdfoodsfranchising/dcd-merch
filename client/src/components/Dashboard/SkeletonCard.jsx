export default function SkeletonCard({ height = 100 }) {
    return (
      <div className="bg-gray-200 animate-pulse rounded-lg p-4" style={{ height }}>
        <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-400 rounded w-full"></div>
      </div>
    );
  }
  