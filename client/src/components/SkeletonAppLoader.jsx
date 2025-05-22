import React from "react";

export default function SkeletonAppLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-pulse flex flex-col items-center space-y-4">
        <div className="w-32 h-32 bg-gray-200 rounded-full mb-4" />
        <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-64 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-56 bg-gray-200 rounded" />
      </div>
    </div>
  );
}